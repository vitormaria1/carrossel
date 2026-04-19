#!/usr/bin/env python3
"""
WhatsApp Dispatcher
===================
Lê leads de uma planilha Google Sheets, valida o número via UAZAPI,
faz scraping do site via Jina.ai, gera mensagem personalizada com Gemini 2.5 Flash
e dispara via WhatsApp. Marca o status na planilha.

Uso:
    python3 dispatcher.py --sheet-id "SHEET_ID"
    python3 dispatcher.py --sheet-id "SHEET_ID" --max-sends 5
    python3 dispatcher.py --sheet-id "SHEET_ID" --dry-run

Pré-requisitos:
    pip3 install requests python-dotenv

    UAZAPI_BASE_URL, UAZAPI_TOKEN, GEMINI_API_KEY, JINA_API_KEY em .env
    Token OAuth2 do MCP em ~/.google_workspace_mcp/credentials/xpiria.ai@gmail.com.json
"""

import argparse
import json
import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path

import requests
from dotenv import load_dotenv

# Carrega .env do diretório do script e também do workspace
_script_dir = Path(__file__).parent
for _env_path in [_script_dir / ".env", _script_dir.parent.parent.parent.parent / ".env"]:
    if _env_path.exists():
        load_dotenv(_env_path)
        break

# ── Configuração ──────────────────────────────────────────────────────────────

MCP_TOKEN_PATH = Path.home() / ".google_workspace_mcp" / "credentials" / "xpiria.ai@gmail.com.json"
SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets"

UAZAPI_BASE_URL = os.getenv("UAZAPI_BASE_URL", "").rstrip("/")
UAZAPI_TOKEN    = os.getenv("UAZAPI_TOKEN", "")
GEMINI_API_KEY  = os.getenv("GEMINI_API_KEY", "")
JINA_API_KEY    = os.getenv("JINA_API_KEY", "")

# Colunas padrão do prospector
PROSPECTOR_COLS = ["Nr", "Nome", "Categoria", "Endereço", "Telefone", "Website", "Rating", "Reviews", "Horário"]
# Novas colunas de controle
STATUS_COL     = "WhatsApp Status"
MSG_COL        = "Mensagem Enviada"
DATE_COL       = "Data Envio"


# ── Google Sheets Auth ────────────────────────────────────────────────────────

def get_sheets_token() -> str:
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


def sheets_request(token: str, method: str, path: str, **kwargs):
    """Faz uma requisição autenticada à Sheets API."""
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    url = f"{SHEETS_API_BASE}{path}"
    resp = getattr(requests, method)(url, headers=headers, **kwargs)
    resp.raise_for_status()
    return resp.json() if resp.content else {}


# ── Planilha: leitura e escrita ───────────────────────────────────────────────

def read_sheet(token: str, sheet_id: str) -> tuple[list[str], list[list[str]], str]:
    """
    Lê a primeira aba da planilha.
    Retorna (headers, rows, tab_name).
    """
    meta = sheets_request(token, "get", f"/{sheet_id}")
    tab_name = meta["sheets"][0]["properties"]["title"]

    data = sheets_request(token, "get", f"/{sheet_id}/values/'{tab_name}'!A:Z")
    values = data.get("values", [])

    if not values:
        return [], [], tab_name

    headers = values[0]
    rows = values[1:]
    return headers, rows, tab_name


def ensure_control_columns(token: str, sheet_id: str, headers: list[str], tab_name: str) -> list[str]:
    """
    Adiciona as colunas de controle à planilha se ainda não existirem.
    Retorna os headers atualizados.
    """
    new_cols = []
    for col in [STATUS_COL, MSG_COL, DATE_COL]:
        if col not in headers:
            new_cols.append(col)

    if not new_cols:
        return headers

    # Determina a coluna onde os novos headers começam (após os existentes)
    start_col_index = len(headers)
    start_col_letter = col_letter(start_col_index)
    end_col_letter   = col_letter(start_col_index + len(new_cols) - 1)

    sheets_request(
        token, "put",
        f"/{sheet_id}/values/'{tab_name}'!{start_col_letter}1:{end_col_letter}1",
        params={"valueInputOption": "RAW"},
        json={"values": [new_cols]},
    )
    print(f"[Sheets] Colunas adicionadas: {new_cols}")
    return headers + new_cols


def update_row(token: str, sheet_id: str, tab_name: str, row_index: int,
               headers: list[str], updates: dict):
    """
    Atualiza campos específicos em uma linha da planilha (row_index é 0-based, excluindo header).
    updates = {"WhatsApp Status": "Enviado", ...}
    """
    # row_index 0 = segunda linha (linha 2 no Sheets)
    sheet_row = row_index + 2

    requests_batch = []
    for col_name, value in updates.items():
        if col_name in headers:
            col_idx = headers.index(col_name)
            cell = f"{col_letter(col_idx)}{sheet_row}"
            requests_batch.append({
                "range": f"'{tab_name}'!{cell}",
                "values": [[str(value)]],
            })

    if requests_batch:
        sheets_request(
            token, "post",
            f"/{sheet_id}/values:batchUpdate",
            json={"valueInputOption": "RAW", "data": requests_batch},
        )


def col_letter(index: int) -> str:
    """Converte índice 0-based para letra de coluna (0→A, 25→Z, 26→AA)."""
    result = ""
    index += 1
    while index:
        index, rem = divmod(index - 1, 26)
        result = chr(65 + rem) + result
    return result


# ── Normalização de telefone ──────────────────────────────────────────────────

def normalize_phone(phone: str) -> str:
    """
    Normaliza número de telefone para formato internacional sem + e sem formatação.
    Lida com células do Sheets que podem vir como número (sem zeros à esquerda)
    ou texto com formatação (parênteses, traços, espaços).

    Ex: "(11) 98765-4321" → "5511987654321"
        "11987654321"     → "5511987654321"
        "55991626042"     → "5555991626042"  (DDD 55 + número)
    """
    if not phone:
        return ""

    # Converte para string caso venha como número do Sheets
    phone_str = str(phone).strip()

    # Remove tudo que não é dígito
    digits = re.sub(r"\D", "", phone_str)

    if not digits:
        return ""

    # Se já tem o DDI 55 + DDD (2) + número (8 ou 9) = 12 ou 13 dígitos
    if digits.startswith("55") and len(digits) >= 12:
        return digits

    # Se tem DDD (2 dígitos) + número (8 ou 9 dígitos) = 10 ou 11 dígitos
    if 10 <= len(digits) <= 11:
        return "55" + digits

    # Número sem DDD (8 ou 9 dígitos) — não é possível inferir DDD, retorna vazio
    return ""


# ── UAZAPI: validação e envio ─────────────────────────────────────────────────

def uazapi_headers() -> dict:
    return {
        "token": UAZAPI_TOKEN,
        "Accept": "application/json",
        "Content-Type": "application/json",
    }


def check_whatsapp_number(phone_normalized: str) -> bool:
    """
    Verifica se um número está no WhatsApp via UAZAPI /chat/check.
    Retorna True se o número é válido.
    """
    url = f"{UAZAPI_BASE_URL}/chat/check"
    try:
        resp = requests.post(
            url,
            headers=uazapi_headers(),
            json={"numbers": [phone_normalized]},
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()

        # Resposta esperada: lista de objetos com campo "exists" ou similar
        # Tenta diferentes formatos de resposta conhecidos da UAZAPI
        # Resposta UAZAPI: [{"query": "...", "isInWhatsapp": true, "jid": "..."}]
        if isinstance(data, list) and data:
            item = data[0]
            return bool(item.get("isInWhatsapp", item.get("exists", item.get("onWhatsapp", False))))
        if isinstance(data, dict):
            results = data.get("results", data.get("data", []))
            if isinstance(results, list) and results:
                item = results[0]
                return bool(item.get("isInWhatsapp", item.get("exists", False)))
            return bool(data.get("isInWhatsapp", data.get("exists", False)))

        return False

    except requests.RequestException as e:
        print(f"  [AVISO] Falha ao verificar número: {e}")
        return False


def _send_single_chunk(phone_normalized: str, text: str) -> bool:
    """Envia um único chunk de texto via UAZAPI /send/text."""
    url = f"{UAZAPI_BASE_URL}/send/text"
    try:
        resp = requests.post(
            url,
            headers=uazapi_headers(),
            json={"number": phone_normalized, "text": text},
            timeout=20,
        )
        resp.raise_for_status()
        return True
    except requests.RequestException as e:
        print(f"  [ERRO] Falha ao enviar chunk: {e}")
        return False


def split_into_chunks(text: str) -> list[str]:
    """
    Divide a mensagem em chunks pelo separador \\n (uma linha por mensagem).
    O Gemini é instruído a separar as 3 partes com \\n simples.
    Linhas vazias são ignoradas.
    """
    # Split por qualquer combinação de \n (simples ou duplo)
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    return lines if lines else [text]


def send_whatsapp_text(phone_normalized: str, text: str) -> bool:
    """
    Envia mensagem fracionada em chunks via UAZAPI /send/text.
    Simula digitação humana com pausas entre os chunks.
    Retorna True se todos os chunks foram enviados com sucesso.
    """
    chunks = split_into_chunks(text)
    print(f"  Mensagem fracionada em {len(chunks)} parte(s).")

    for idx, chunk in enumerate(chunks, 1):
        print(f"  Enviando parte {idx}/{len(chunks)}...")
        success = _send_single_chunk(phone_normalized, chunk)
        if not success:
            return False

        # Pausa entre chunks para simular digitação humana (exceto no último)
        if idx < len(chunks):
            # Delay proporcional ao tamanho do próximo chunk (1–4 segundos)
            delay = min(4, max(1, len(chunks[idx]) // 80))
            print(f"  Aguardando {delay}s antes do próximo trecho...")
            time.sleep(delay)

    return True


# ── Jina.ai: scraping do site ─────────────────────────────────────────────────

def scrape_website(url: str) -> str:
    """
    Faz scraping do site via Jina.ai Reader API.
    Retorna texto Markdown com o conteúdo do site (primeiros 3000 chars).
    """
    jina_url = f"https://r.jina.ai/{url}"
    headers = {
        "Authorization": f"Bearer {JINA_API_KEY}",
        "Accept": "text/plain",
    }
    try:
        resp = requests.get(jina_url, headers=headers, timeout=20)
        resp.raise_for_status()
        content = resp.text.strip()
        return content[:3000]
    except requests.RequestException as e:
        print(f"  [AVISO] Jina.ai falhou para {url}: {e}")
        return ""


# ── Gemini 2.5 Flash: geração de mensagem ────────────────────────────────────

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

PROMPT_TEMPLATE = """Você é Pedro Mallet, especialista em Inteligência Artificial aplicada a clínicas médicas no Brasil. Você já implementou IA em clínicas e gerou resultados reais e mensuráveis.

Escreva uma mensagem de WhatsApp para a seguinte clínica:

Nome: {nome}
Categoria/Especialidade: {categoria}
Localização: {endereco}

Conteúdo do site da clínica:
---
{site_content}
---

FORMATO OBRIGATÓRIO — A mensagem deve ter EXATAMENTE 3 partes, separadas por \\n (uma quebra de linha simples entre cada parte):

Parte 1: Cumprimente pelo primeiro nome do médico ou nome curto da clínica (sem LTDA, ME, Dr., Dra.). Mencione algo ESPECÍFICO do site para mostrar que pesquisou. Termine com uma pergunta curta sobre potencial de crescimento com IA.

Parte 2: Cite 2 resultados reais e numéricos que já alcançou em clínicas similares (ex: "reduzi 40% das faltas", "adicionei R$18k no faturamento no 1º mês", "automatizei 80% dos agendamentos"). Conecte com a realidade desta clínica.

Parte 3: Convide para uma demonstração gratuita de 20 minutos ao vivo. Crie senso de escassez leve. Termine com uma pergunta de sim/não simples. Assine como: Pedro Mallet | IA para Clínicas

Regras absolutas:
- APENAS 3 linhas no output, uma por parte, separadas por \\n
- Máximo 2 emojis no total
- Sem asteriscos, sem colchetes, sem placeholders
- Tom humano, direto e consultivo
- Cada parte deve ser uma mensagem completa e coesa (50-120 palavras cada)"""


def generate_message(nome: str, categoria: str, endereco: str, site_content: str) -> str:
    """
    Gera mensagem personalizada via Gemini 2.5 Flash.
    """
    prompt = PROMPT_TEMPLATE.format(
        nome=nome,
        categoria=categoria,
        endereco=endereco,
        site_content=site_content if site_content else "Informações do site não disponíveis.",
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.8,
            "maxOutputTokens": 2048,
        },
    }

    try:
        resp = requests.post(
            GEMINI_URL,
            params={"key": GEMINI_API_KEY},
            json=payload,
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        candidate = data["candidates"][0]
        finish_reason = candidate.get("finishReason", "UNKNOWN")
        if finish_reason not in ("STOP", "END_OF_TURN"):
            print(f"  [AVISO] Gemini finishReason: {finish_reason} — resposta pode estar incompleta")
        return candidate["content"]["parts"][0]["text"].strip()
    except (requests.RequestException, KeyError, IndexError) as e:
        print(f"  [ERRO] Gemini falhou: {e}")
        return ""


# ── Main ──────────────────────────────────────────────────────────────────────

def validate_env():
    missing = []
    if not UAZAPI_BASE_URL:
        missing.append("UAZAPI_BASE_URL")
    if not UAZAPI_TOKEN:
        missing.append("UAZAPI_TOKEN")
    if not GEMINI_API_KEY:
        missing.append("GEMINI_API_KEY")
    if not JINA_API_KEY:
        missing.append("JINA_API_KEY")
    if missing:
        print(f"[ERRO] Variáveis de ambiente ausentes: {', '.join(missing)}")
        print("Configure-as em .env ou como variáveis de ambiente.")
        sys.exit(1)


def get_cell_value(row: list[str], headers: list[str], col_name: str) -> str:
    if col_name not in headers:
        return ""
    idx = headers.index(col_name)
    return row[idx].strip() if idx < len(row) else ""


def main():
    parser = argparse.ArgumentParser(
        description="Dispara mensagens WhatsApp personalizadas para leads de clínicas médicas"
    )
    parser.add_argument("--sheet-id", required=True, help="ID da planilha Google Sheets")
    parser.add_argument("--max-sends", type=int, default=10,
                        help="Número máximo de envios nesta execução (padrão: 10)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Gera as mensagens sem enviar (apenas visualização)")
    args = parser.parse_args()

    validate_env()

    print("\n=== WhatsApp Dispatcher ===")
    print(f"Sheet ID   : {args.sheet_id}")
    print(f"Max envios : {args.max_sends}")
    print(f"Dry run    : {'SIM (sem envios reais)' if args.dry_run else 'NÃO'}")
    print()

    # 1. Autenticar no Google Sheets
    print("[Sheets] Conectando...")
    token = get_sheets_token()

    # 2. Ler planilha
    headers, rows, tab_name = read_sheet(token, args.sheet_id)
    if not rows:
        print("[AVISO] Planilha vazia ou sem dados.")
        sys.exit(0)

    print(f"[Sheets] {len(rows)} linhas encontradas na aba '{tab_name}'.")

    # 3. Garantir colunas de controle
    headers = ensure_control_columns(token, args.sheet_id, headers, tab_name)

    # 4. Filtrar leads pendentes com website
    pending = []
    for i, row in enumerate(rows):
        website = get_cell_value(row, headers, "Website")
        status  = get_cell_value(row, headers, STATUS_COL)
        nome    = get_cell_value(row, headers, "Nome")

        if not website:
            continue  # sem website, pula
        if status in ("Enviado", "Número inválido", "Erro envio"):
            continue  # já processado

        pending.append((i, row))

    print(f"[Info] {len(pending)} leads pendentes com website.")

    if not pending:
        print("[OK] Nenhum lead pendente para processar.")
        sys.exit(0)

    # 5. Processar leads
    sent_count = 0
    now_str = datetime.now().strftime("%d/%m/%Y %H:%M")

    for i, row in pending:
        if sent_count >= args.max_sends:
            print(f"\n[Info] Limite de {args.max_sends} envios atingido.")
            break

        nome      = get_cell_value(row, headers, "Nome")
        categoria = get_cell_value(row, headers, "Categoria")
        endereco  = get_cell_value(row, headers, "Endereço")
        telefone  = get_cell_value(row, headers, "Telefone")
        website   = get_cell_value(row, headers, "Website")

        print(f"\n[{i+1}] {nome}")
        print(f"  Telefone : {telefone}")
        print(f"  Website  : {website}")

        # Normalizar telefone
        phone_norm = normalize_phone(telefone)
        if not phone_norm or len(phone_norm) < 12:
            print(f"  [SKIP] Telefone inválido: '{telefone}'")
            update_row(token, args.sheet_id, tab_name, i, headers, {
                STATUS_COL: "Telefone inválido",
                DATE_COL: now_str,
            })
            continue

        # Verificar se tem WhatsApp
        print(f"  Verificando WhatsApp ({phone_norm})...")
        if not check_whatsapp_number(phone_norm):
            print(f"  [SKIP] Número sem WhatsApp.")
            update_row(token, args.sheet_id, tab_name, i, headers, {
                STATUS_COL: "Número inválido",
                DATE_COL: now_str,
            })
            continue

        print(f"  [OK] Número válido no WhatsApp.")

        # Scraping do site
        print(f"  Fazendo scraping via Jina.ai...")
        site_content = scrape_website(website)
        if site_content:
            print(f"  [OK] {len(site_content)} chars extraídos do site.")
        else:
            print(f"  [AVISO] Scraping falhou, gerando mensagem genérica.")

        # Gerar mensagem (pausa para respeitar rate limit do Gemini Free: 15 req/min)
        time.sleep(5)
        print(f"  Gerando mensagem com Gemini 2.0 Flash...")
        message = generate_message(nome, categoria, endereco, site_content)
        if not message:
            print(f"  [ERRO] Falha ao gerar mensagem. Pulando.")
            update_row(token, args.sheet_id, tab_name, i, headers, {
                STATUS_COL: "Erro geração",
                DATE_COL: now_str,
            })
            continue

        print(f"\n  --- Mensagem ---\n{message}\n  ----------------")

        if args.dry_run:
            print(f"  [DRY RUN] Mensagem não enviada.")
            update_row(token, args.sheet_id, tab_name, i, headers, {
                STATUS_COL: "Dry run",
                MSG_COL: message,
                DATE_COL: now_str,
            })
        else:
            # Enviar via UAZAPI
            print(f"  Enviando via WhatsApp...")
            success = send_whatsapp_text(phone_norm, message)

            if success:
                print(f"  [OK] Mensagem enviada com sucesso!")
                update_row(token, args.sheet_id, tab_name, i, headers, {
                    STATUS_COL: "Enviado",
                    MSG_COL: message,
                    DATE_COL: now_str,
                })
                sent_count += 1
            else:
                update_row(token, args.sheet_id, tab_name, i, headers, {
                    STATUS_COL: "Erro envio",
                    MSG_COL: message,
                    DATE_COL: now_str,
                })

        # Rate limiting: pausa entre envios para evitar bloqueio no WhatsApp
        if not args.dry_run and sent_count < args.max_sends:
            print(f"  Aguardando 10s antes do próximo envio...")
            time.sleep(10)

    print(f"\n=== Concluído ===")
    if args.dry_run:
        print(f"Dry run finalizado. Verifique as mensagens geradas na planilha.")
    else:
        print(f"{sent_count} mensagens enviadas com sucesso.")
    print(f"Planilha: https://docs.google.com/spreadsheets/d/{args.sheet_id}/edit\n")


if __name__ == "__main__":
    main()
