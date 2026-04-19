#!/usr/bin/env python3
"""
Google Maps Prospector
======================
Busca negócios no Google Maps via SerpAPI e exporta os leads para Google Sheets.

Uso:
    python3 prospector.py --query "pizzarias em São Paulo" --sheet-id "SHEET_ID"
    python3 prospector.py --query "dentistas em MG" --sheet-id "SHEET_ID" --max-results 25

Pré-requisitos:
    pip3 install requests python-dotenv

    SERPAPI_KEY configurada como variável de ambiente ou em arquivo .env
    Token OAuth2 do MCP em ~/.google_workspace_mcp/credentials/xpiria.ai@gmail.com.json
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests
from dotenv import load_dotenv  # noqa: F401 (carrega .env automaticamente)

load_dotenv()

# ── Configuração ──────────────────────────────────────────────────────────────

MCP_TOKEN_PATH = Path.home() / ".google_workspace_mcp" / "credentials" / "xpiria.ai@gmail.com.json"
SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets"

SERPAPI_URL = "https://serpapi.com/search"
MAX_PAGES = 3  # até 60 resultados por query


# ── Google Sheets Auth ────────────────────────────────────────────────────────

def get_sheets_token():
    """Lê o token OAuth2 do MCP (já autenticado)."""
    if not MCP_TOKEN_PATH.exists():
        print(f"\n[ERRO] Token MCP não encontrado em {MCP_TOKEN_PATH}")
        print("Verifique se o MCP google-workspace está configurado e autenticado.")
        sys.exit(1)

    with open(MCP_TOKEN_PATH) as f:
        creds = json.load(f)

    token = creds.get("token")
    if not token:
        print("[ERRO] Token inválido no arquivo de credenciais do MCP.")
        sys.exit(1)

    return token


def sheets_request(token, method, path, **kwargs):
    """Faz uma requisição autenticada à Sheets API."""
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    url = f"{SHEETS_API_BASE}{path}"
    resp = getattr(requests, method)(url, headers=headers, **kwargs)
    resp.raise_for_status()
    return resp.json() if resp.content else {}


# ── SerpAPI ───────────────────────────────────────────────────────────────────

def fetch_maps_leads(query: str, api_key: str, max_results: int = 60) -> list[dict]:
    """Busca leads no Google Maps via SerpAPI com paginação."""
    leads = []

    for page in range(MAX_PAGES):
        start = page * 20
        print(f"[SerpAPI] Buscando página {page + 1} (start={start})...")

        params = {
            "engine": "google_maps",
            "q": query,
            "type": "search",
            "hl": "pt",
            "gl": "br",
            "start": start,
            "api_key": api_key,
        }

        try:
            response = requests.get(SERPAPI_URL, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
        except requests.RequestException as e:
            print(f"[ERRO] Falha na requisição SerpAPI: {e}")
            break

        if "error" in data:
            print(f"[ERRO] SerpAPI retornou erro: {data['error']}")
            break

        results = data.get("local_results", [])
        if not results:
            print(f"[INFO] Sem mais resultados na página {page + 1}.")
            break

        for r in results:
            leads.append(parse_lead(r))
            if len(leads) >= max_results:
                break

        print(f"[OK] {len(results)} leads coletados (total: {len(leads)})")

        if len(leads) >= max_results:
            break

        # Respeitar rate limit
        if page < MAX_PAGES - 1 and results:
            time.sleep(1)

    return leads[:max_results]


def parse_lead(result: dict) -> dict:
    """Extrai os campos relevantes de um resultado SerpAPI."""
    hours_raw = result.get("hours", {})
    if isinstance(hours_raw, dict):
        hours_str = " | ".join(f"{k}: {v}" for k, v in list(hours_raw.items())[:3])
    else:
        hours_str = str(hours_raw) if hours_raw else ""

    return {
        "Nome": result.get("title", ""),
        "Categoria": result.get("type", ""),
        "Endereço": result.get("address", ""),
        "Telefone": result.get("phone", ""),
        "Website": result.get("website", ""),
        "Rating": result.get("rating", ""),
        "Reviews": result.get("reviews", ""),
        "Horário": hours_str,
    }


# ── Google Sheets Export ──────────────────────────────────────────────────────

COLUMNS = ["Nr", "Nome", "Categoria", "Endereço", "Telefone", "Website", "Rating", "Reviews", "Horário"]


def export_to_sheets(token: str, sheet_id: str, query: str, leads: list[dict]):
    """Cria aba e exporta os leads para o Google Sheets."""
    tab_name = f"Leads - {query[:40]}"

    # Verificar se a aba já existe ou renomear a primeira aba
    spreadsheet = sheets_request(token, "get", f"/{sheet_id}")
    existing_sheets = spreadsheet["sheets"]
    existing_titles = [s["properties"]["title"] for s in existing_sheets]

    if tab_name in existing_titles:
        sheets_request(token, "post", f"/{sheet_id}/values/'{tab_name}'!A:Z:clear")
        print(f"[Sheets] Aba '{tab_name}' limpa para reutilização.")
    elif len(existing_sheets) == 1:
        # Renomear a única aba existente em vez de criar uma nova
        first_sheet_id = existing_sheets[0]["properties"]["sheetId"]
        sheets_request(token, "post", f"/{sheet_id}:batchUpdate",
                       json={"requests": [{"updateSheetProperties": {
                           "properties": {"sheetId": first_sheet_id, "title": tab_name},
                           "fields": "title"
                       }}]})
        print(f"[Sheets] Aba renomeada para '{tab_name}'.")
    else:
        sheets_request(token, "post", f"/{sheet_id}:batchUpdate",
                       json={"requests": [{"addSheet": {"properties": {"title": tab_name}}}]})
        print(f"[Sheets] Aba '{tab_name}' criada.")

    # Preparar dados com coluna Nr (número de ordem)
    data_columns = COLUMNS[1:]  # todos exceto "Nr"
    rows = [COLUMNS]
    for i, lead in enumerate(leads, start=1):
        row = [str(i)] + [str(lead.get(col, "")) for col in data_columns]
        rows.append(row)

    # Escrever na planilha com RAW para evitar parse de +55 como fórmula
    sheets_request(token, "put",
                   f"/{sheet_id}/values/'{tab_name}'!A1",
                   params={"valueInputOption": "RAW"},
                   json={"values": rows})

    # Formatar cabeçalho e colunas
    try:
        sheet_meta = sheets_request(token, "get", f"/{sheet_id}")
        sheet_obj = next(s for s in sheet_meta["sheets"] if s["properties"]["title"] == tab_name)
        sheet_gid = sheet_obj["properties"]["sheetId"]
        num_cols = len(COLUMNS)

        sheets_request(token, "post", f"/{sheet_id}:batchUpdate", json={"requests": [
            {"repeatCell": {
                "range": {"sheetId": sheet_gid, "startRowIndex": 0, "endRowIndex": 1},
                "cell": {"userEnteredFormat": {
                    "backgroundColor": {"red": 0.22, "green": 0.22, "blue": 0.22},
                    "horizontalAlignment": "CENTER",
                    "verticalAlignment": "MIDDLE",
                    "textFormat": {"bold": True, "foregroundColor": {"red": 1, "green": 1, "blue": 1}, "fontSize": 10},
                    "wrapStrategy": "CLIP",
                }},
                "fields": "userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,textFormat,wrapStrategy)",
            }},
            {"updateDimensionProperties": {
                "range": {"sheetId": sheet_gid, "dimension": "ROWS", "startIndex": 0, "endIndex": 1},
                "properties": {"pixelSize": 36},
                "fields": "pixelSize",
            }},
            {"updateDimensionProperties": {
                "range": {"sheetId": sheet_gid, "dimension": "ROWS", "startIndex": 1, "endIndex": len(leads) + 1},
                "properties": {"pixelSize": 50},
                "fields": "pixelSize",
            }},
            {"updateSheetProperties": {
                "properties": {"sheetId": sheet_gid, "gridProperties": {"frozenRowCount": 1}},
                "fields": "gridProperties.frozenRowCount",
            }},
            {"autoResizeDimensions": {
                "dimensions": {"sheetId": sheet_gid, "dimension": "COLUMNS", "startIndex": 0, "endIndex": num_cols}
            }},
        ]})
        print("[OK] Formatação aplicada.")
    except Exception as e:
        print(f"[AVISO] Formatação falhou: {e}")

    url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/edit"
    print(f"\n[OK] {len(leads)} leads exportados com sucesso!")
    print(f"[Planilha] {url}")
    return url


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Prospecta clientes no Google Maps e exporta para Google Sheets"
    )
    parser.add_argument("--query", required=True, help='Busca no Maps (ex: "pizzarias em São Paulo")')
    parser.add_argument("--sheet-id", required=True, help="ID da planilha Google Sheets")
    parser.add_argument("--max-results", type=int, default=60, help="Número máximo de leads (padrão: 60)")
    args = parser.parse_args()

    api_key = os.getenv("SERPAPI_KEY")
    if not api_key:
        print("[ERRO] SERPAPI_KEY não encontrada.")
        print("Configure: export SERPAPI_KEY='sua_chave' (ou adicione em .env)")
        sys.exit(1)

    print(f"\n=== Google Maps Prospector ===")
    print(f"Query: {args.query}")
    print(f"Sheet ID: {args.sheet_id}")
    print(f"Max results: {args.max_results}")
    print()

    # 1. Coletar leads via SerpAPI
    leads = fetch_maps_leads(args.query, api_key, max_results=args.max_results)

    if not leads:
        print("[AVISO] Nenhum lead encontrado. Verifique a query e tente novamente.")
        sys.exit(0)

    # 2. Autenticar e exportar para Sheets
    print(f"\n[Sheets] Conectando ao Google Sheets...")
    token = get_sheets_token()

    try:
        export_to_sheets(token, args.sheet_id, args.query, leads)
    except requests.HTTPError as e:
        print(f"[ERRO] Google Sheets API: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
