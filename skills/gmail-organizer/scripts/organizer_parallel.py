#!/usr/bin/env python3
"""
Gmail Organizer — Paralelo
===========================
Versão paralelizada do Gmail Organizer. Processa todas as categorias
simultaneamente usando ThreadPoolExecutor, reduzindo drasticamente o
tempo total em comparação com a versão sequencial.

Uso:
    python3 organizer_parallel.py
    python3 organizer_parallel.py --dry-run
    python3 organizer_parallel.py --max-per-category 20
    python3 organizer_parallel.py --workers 10
    python3 organizer_parallel.py --verbose

Pré-requisitos:
    pip3 install requests python-dotenv
    Token OAuth2 do MCP em ~/.google_workspace_mcp/credentials/xpiria.ai@gmail.com.json
"""

import argparse
import json
import sys
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
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

# Lock para prints thread-safe
_print_lock = threading.Lock()

def tprint(*args, **kwargs):
    """Print thread-safe."""
    with _print_lock:
        print(*args, **kwargs)


# ── Autenticação ──────────────────────────────────────────────────────────────

def refresh_token(creds):
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
    creds["token"] = new_token
    with open(MCP_TOKEN_PATH, "w") as f:
        json.dump(creds, f, indent=2)
    return new_token


def get_token():
    if not MCP_TOKEN_PATH.exists():
        print(f"[ERRO] Token não encontrado em {MCP_TOKEN_PATH}")
        sys.exit(1)

    with open(MCP_TOKEN_PATH) as f:
        creds = json.load(f)

    token = creds.get("token")
    if not token:
        print("[ERRO] Campo 'token' não encontrado nas credenciais.")
        sys.exit(1)

    from datetime import datetime, timezone
    expiry_str = creds.get("expiry", "")
    if expiry_str and creds.get("refresh_token"):
        try:
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
    existing = get_existing_labels(token)
    label_ids = {}
    for name in LABELS:
        if name in existing:
            label_ids[name] = existing[name]
        else:
            if dry_run:
                label_ids[name] = f"dry_{name}"
            else:
                result = gmail_post(token, "/labels", {
                    "name": name,
                    "labelListVisibility": "labelShow",
                    "messageListVisibility": "show",
                })
                label_ids[name] = result["id"]
                tprint(f"  [+] Etiqueta criada: {name}")
    return label_ids


# ── Worker: processa UMA categoria ───────────────────────────────────────────

def process_category(token, rule, label_id, max_per_category, dry_run, verbose):
    """
    Executa busca + rotulagem para uma categoria.
    Retorna dict com resultado e tempo gasto.
    """
    label_name = rule["label"]
    query = rule["query"]
    t0 = time.perf_counter()
    errors = []

    try:
        params = {"q": query, "maxResults": min(max_per_category, 500)}
        data = gmail_get(token, "/messages", params=params)
        message_ids = [m["id"] for m in data.get("messages", [])]
        count = len(message_ids)

        tprint(f"  [{label_name.split('/')[-1]}] {count} emails encontrados")

        for mid in message_ids:
            if dry_run:
                if verbose:
                    tprint(f"    [DRY] Aplicaria etiqueta em {mid}")
            else:
                try:
                    gmail_post(token, f"/messages/{mid}/modify", {"addLabelIds": [label_id]})
                    if verbose:
                        tprint(f"    [OK] Etiquetado: {mid}")
                except Exception as e:
                    errors.append(str(e))

    except Exception as e:
        tprint(f"  [ERRO] {label_name}: {e}")
        return {"label": label_name, "count": 0, "duration_s": time.perf_counter() - t0, "errors": [str(e)]}

    duration = time.perf_counter() - t0
    return {
        "label": label_name,
        "count": count,
        "duration_s": duration,
        "errors": errors,
    }


# ── Relatório ─────────────────────────────────────────────────────────────────

def print_report(results, wall_time, dry_run):
    total_emails = sum(r["count"] for r in results)
    estimated_sequential = sum(r["duration_s"] for r in results)
    speedup = estimated_sequential / wall_time if wall_time > 0 else 1.0

    w = 52
    print()
    print("╔" + "═" * w + "╗")
    title = "Gmail Organizer — Relatório Final"
    if dry_run:
        title = "Gmail Organizer — DRY RUN"
    print("║" + title.center(w) + "║")
    print("╠" + "═" * 22 + "╦" + "═" * 8 + "╦" + "═" * (w - 31) + "╣")
    print("║" + " Categoria".ljust(22) + "║" + " Emails".ljust(8) + "║" + " Tempo".ljust(w - 31) + "║")
    print("╠" + "═" * 22 + "╬" + "═" * 8 + "╬" + "═" * (w - 31) + "╣")

    for r in sorted(results, key=lambda x: x["label"]):
        cat = r["label"].replace("Organizar/", "")
        count_str = str(r["count"]).rjust(4)
        dur_str = f"{r['duration_s']:.1f}s"
        err_str = f" ⚠ {len(r['errors'])} erros" if r["errors"] else ""
        print(f"║ {cat:<21}║ {count_str}   ║ {dur_str:<{w - 32}}{err_str}║")

    print("╠" + "═" * 22 + "╩" + "═" * 8 + "╩" + "═" * (w - 31) + "╣")

    line1 = f" TOTAL PARALELO:   {total_emails} emails em {wall_time:.1f}s"
    line2 = f" EST. SEQUENCIAL:  ~{estimated_sequential:.1f}s"
    line3 = f" SPEEDUP:          {speedup:.1f}x mais rápido  🚀"
    if dry_run:
        line3 = f" (modo dry-run — nenhuma alteração aplicada)"

    print("║" + line1.ljust(w) + "║")
    print("║" + line2.ljust(w) + "║")
    print("║" + line3.ljust(w) + "║")
    print("╚" + "═" * w + "╝")
    print()


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Gmail Organizer Paralelo")
    parser.add_argument("--dry-run", action="store_true", help="Visualiza sem aplicar alterações")
    parser.add_argument("--max-per-category", type=int, default=50, metavar="N",
                        help="Máximo de emails por categoria (padrão: 50)")
    parser.add_argument("--workers", type=int, default=10, metavar="N",
                        help="Número de workers paralelos (padrão: 10)")
    parser.add_argument("--verbose", action="store_true", help="Mostra detalhes de cada email")
    args = parser.parse_args()

    print("\n╔══════════════════════════════════════╗")
    print("║     Gmail Organizer — PARALELO       ║")
    print("╚══════════════════════════════════════╝")
    if args.dry_run:
        print(">>> MODO DRY RUN — nenhuma alteração será feita <<<")
    print(f"  Workers paralelos: {args.workers}")
    print(f"  Categorias:        {len(RULES)}")
    print(f"  Máx por categoria: {args.max_per_category}")
    print()

    # 1. Autenticar (uma vez, thread-safe pois só lê)
    print("[1/3] Autenticando...")
    token = get_token()
    print("      OK\n")

    # 2. Garantir etiquetas (uma vez, sequencial)
    print("[2/3] Verificando etiquetas...")
    label_ids = ensure_labels(token, dry_run=args.dry_run)
    print(f"      {len(label_ids)} etiquetas prontas\n")

    # 3. Processar TODAS as categorias em PARALELO
    print(f"[3/3] Processando {len(RULES)} categorias em paralelo...")
    wall_start = time.perf_counter()

    results = []
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(
                process_category,
                token,
                rule,
                label_ids.get(rule["label"], ""),
                args.max_per_category,
                args.dry_run,
                args.verbose,
            ): rule["label"]
            for rule in RULES
        }
        for future in as_completed(futures):
            result = future.result()
            results.append(result)

    wall_time = time.perf_counter() - wall_start

    print_report(results, wall_time, args.dry_run)


if __name__ == "__main__":
    main()
