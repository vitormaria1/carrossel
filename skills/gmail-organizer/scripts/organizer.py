#!/usr/bin/env python3
"""
Gmail Organizer
===============
Organiza a caixa de entrada do Gmail criando etiquetas por categoria e
aplicando-as automaticamente nos emails usando a Gmail API.

Uso:
    python3 organizer.py
    python3 organizer.py --dry-run
    python3 organizer.py --max-per-category 20
    python3 organizer.py --verbose

Pré-requisitos:
    pip3 install requests python-dotenv
    Token OAuth2 do MCP em ~/.google_workspace_mcp/credentials/xpiria.ai@gmail.com.json
"""

import argparse
import json
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv()

# ── Configuração ──────────────────────────────────────────────────────────────

GMAIL_USER = "xpiria.ai@gmail.com"
MCP_TOKEN_PATH = Path.home() / ".google_workspace_mcp" / "credentials" / f"{GMAIL_USER}.json"
GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me"

LABELS = [
    "Organizar/Marketing",
    "Organizar/Financeiro",
    "Organizar/Contabilidade",
    "Organizar/Faturas",
    "Organizar/Responder",
    "Organizar/Urgente",
    "Organizar/Vencendo",
]

RULES = [
    {
        "label": "Organizar/Marketing",
        "query": "from:(freepik OR iclinic OR heygen OR replit OR openai OR linkedin OR skool OR wordpress OR hostgator) in:inbox -subject:(billing OR budget OR vencimento)",
    },
    {
        "label": "Organizar/Financeiro",
        "query": "(billing OR budget OR cobrança OR payment OR recibo OR extrato) in:inbox",
    },
    {
        "label": "Organizar/Contabilidade",
        "query": "(nota fiscal OR nfe OR cnpj OR contabilidade OR balancete OR dre) in:inbox",
    },
    {
        "label": "Organizar/Faturas",
        "query": "from:(ticto OR naoresponda@ticto) in:inbox",
    },
    {
        "label": "Organizar/Urgente",
        "query": "(from:github (security OR alert OR token) OR (100% budget) OR (alerta crítico)) in:inbox",
    },
    {
        "label": "Organizar/Vencendo",
        "query": "(vencimento OR expir OR renovação OR renewal OR prazo OR faltam) in:inbox",
    },
    {
        "label": "Organizar/Responder",
        "query": "is:unread has:nouserlabels older_than:3d in:inbox",
    },
]

# ── Autenticação ──────────────────────────────────────────────────────────────

def refresh_token(creds):
    """Faz refresh do access token usando o refresh_token."""
    r = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "client_id": creds["client_id"],
            "client_secret": creds["client_secret"],
            "refresh_token": creds["refresh_token"],
            "grant_type": "refresh_token",
        },
        timeout=15,
    )
    r.raise_for_status()
    new_token = r.json()["access_token"]

    # Atualiza o arquivo de credenciais com o novo token
    creds["token"] = new_token
    with open(MCP_TOKEN_PATH, "w") as f:
        json.dump(creds, f, indent=2)

    return new_token


def get_token():
    if not MCP_TOKEN_PATH.exists():
        print(f"[ERRO] Token não encontrado em {MCP_TOKEN_PATH}")
        print("       Certifique-se que o MCP google-workspace está autenticado.")
        sys.exit(1)

    with open(MCP_TOKEN_PATH) as f:
        creds = json.load(f)

    token = creds.get("token")
    if not token:
        print("[ERRO] Campo 'token' não encontrado nas credenciais.")
        sys.exit(1)

    # Verifica expiração e faz refresh se necessário
    from datetime import datetime, timezone
    expiry_str = creds.get("expiry", "")
    if expiry_str and creds.get("refresh_token"):
        try:
            # Normaliza para aware datetime
            expiry_str_norm = expiry_str if expiry_str.endswith("Z") or "+" in expiry_str else expiry_str + "+00:00"
            expiry = datetime.fromisoformat(expiry_str_norm)
            now = datetime.now(timezone.utc)
            if expiry <= now:
                print("[Auth] Token expirado — fazendo refresh...")
                token = refresh_token(creds)
                print("[Auth] Token atualizado.")
        except Exception as e:
            print(f"[Auth] Aviso: não foi possível verificar expiração ({e})")

    return token


def gmail_get(token, path, params=None):
    r = requests.get(
        f"{GMAIL_API}{path}",
        headers={"Authorization": f"Bearer {token}"},
        params=params,
        timeout=15,
    )
    if r.status_code == 401:
        print("[ERRO] Token expirado ou sem permissão para Gmail.")
        print("       Use o MCP gmail diretamente ou re-autentique o MCP google-workspace.")
        sys.exit(1)
    r.raise_for_status()
    return r.json()


def gmail_post(token, path, body):
    r = requests.post(
        f"{GMAIL_API}{path}",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=body,
        timeout=15,
    )
    r.raise_for_status()
    return r.json()


# ── Etiquetas ─────────────────────────────────────────────────────────────────

def get_existing_labels(token):
    data = gmail_get(token, "/labels")
    return {lbl["name"]: lbl["id"] for lbl in data.get("labels", [])}


def ensure_labels(token, dry_run=False):
    """Cria etiquetas que ainda não existem. Retorna dict name->id."""
    existing = get_existing_labels(token)
    label_ids = {}

    for name in LABELS:
        if name in existing:
            label_ids[name] = existing[name]
            print(f"  [OK] Etiqueta já existe: {name}")
        else:
            if dry_run:
                print(f"  [DRY] Criaria etiqueta: {name}")
                label_ids[name] = f"dry_{name}"
            else:
                result = gmail_post(token, "/labels", {
                    "name": name,
                    "labelListVisibility": "labelShow",
                    "messageListVisibility": "show",
                })
                label_ids[name] = result["id"]
                print(f"  [+] Etiqueta criada: {name} (id={result['id']})")

    return label_ids


# ── Busca e Classificação ─────────────────────────────────────────────────────

def search_emails(token, query, max_results=50):
    params = {"q": query, "maxResults": min(max_results, 500)}
    data = gmail_get(token, "/messages", params=params)
    return [m["id"] for m in data.get("messages", [])]


def apply_label(token, message_id, label_id, dry_run=False, verbose=False):
    if dry_run:
        if verbose:
            print(f"    [DRY] Aplicaria etiqueta {label_id} em {message_id}")
        return

    gmail_post(token, f"/messages/{message_id}/modify", {
        "addLabelIds": [label_id],
    })
    if verbose:
        print(f"    [OK] Etiquetado: {message_id}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Organiza Gmail com etiquetas inteligentes")
    parser.add_argument("--dry-run", action="store_true", help="Visualiza sem aplicar alterações")
    parser.add_argument("--max-per-category", type=int, default=50, metavar="N",
                        help="Máximo de emails por categoria (padrão: 50)")
    parser.add_argument("--verbose", action="store_true", help="Mostra detalhes de cada email")
    args = parser.parse_args()

    print("\n=== Gmail Organizer ===")
    if args.dry_run:
        print(">>> MODO DRY RUN — nenhuma alteração será feita <<<\n")

    # 1. Autenticar
    print("[Auth] Lendo token OAuth2...")
    token = get_token()
    print("[Auth] OK\n")

    # 2. Criar etiquetas
    print("[Etiquetas] Verificando/criando etiquetas...")
    label_ids = ensure_labels(token, dry_run=args.dry_run)
    print()

    # 3. Processar regras
    summary = {}

    for rule in RULES:
        label_name = rule["label"]
        query = rule["query"]
        label_id = label_ids.get(label_name, "")

        print(f"[{label_name}] Buscando emails...")
        if args.verbose:
            print(f"  Query: {query}")

        message_ids = search_emails(token, query, max_results=args.max_per_category)
        count = len(message_ids)
        print(f"  Encontrados: {count} emails")

        for mid in message_ids:
            apply_label(token, mid, label_id, dry_run=args.dry_run, verbose=args.verbose)

        summary[label_name] = count
        print()

    # 4. Resumo
    print("=" * 40)
    print("RESUMO")
    print("=" * 40)
    total = 0
    for label, count in summary.items():
        status = "DRY" if args.dry_run else "OK"
        print(f"  [{status}] {label:<30} {count:>4} emails")
        total += count
    print("-" * 40)
    print(f"  Total: {total} emails processados")
    if args.dry_run:
        print("\n  (Rode sem --dry-run para aplicar as alterações)")
    print()


if __name__ == "__main__":
    main()
