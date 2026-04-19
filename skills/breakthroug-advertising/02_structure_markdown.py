"""
02_structure_markdown.py
Estrutura o Breakthrough Advertising (BR) em markdown por capítulo.

Estratégia final (baseada em inspeção do raw_text.txt):
- Capítulos 1, 2, 4, 6-14: têm número sozinho numa linha antes do título
- Capítulos 3 e 5: começam diretamente com trecho do título (sem número isolado)
- Cabeçalhos de página correntes (ruído): "42 TÍTULO EM MAIÚSCULAS" na mesma linha
- Solução: âncoras fixas extraídas do sumário + busca direta no texto
"""

import re
from pathlib import Path

RAW_PATH = Path(__file__).parent / "raw_text.txt"
OUTPUT_DIR = Path(__file__).parent / "markdown"

# Âncoras: fragmento único que aparece APENAS no início real do capítulo
# (verificado na inspeção do raw_text.txt)
CHAPTERS = [
    ("Prefácio",
        r"Bem-vindo ao mais procurado"),
    ("1 — Desejo de Massa: A Força que Faz Trabalho Publicitário",
        r"^1\s*\nDESEJO DE MASSA"),
    ("2 — Estado de Consciência do Seu Prospecto",
        r"^2\s*\nO ESTADO DA SUA PERSPECTIVA"),
    ("3 — A Sofisticação do Seu Mercado",
        r"A SOFISTICAÇÃO DA\s*\nSEU MERCADO"),
    ("4 — 38 Formas de Reforçar o Seu Título",
        r"^4\s*\nSEU TÍTULO"),
    ("5 — Resumo: A Arte do Planejamento Criativo",
        r"RESUMO: A ARTE DE\s*\nPLANEJAMENTO CRIATIVO"),
    ("6 — Dentro da Mente do Seu Prospecto",
        r"^6\s*\nDENTRO DE SUA PERSPECTIVA"),
    ("7 — A Primeira Técnica: Intensificação",
        r"^7\s*\nA PRIMEIRA TÉCNICA"),
    ("8 — A Segunda Técnica: Identificação",
        r"^8\s*\nA SEGUNDA TÉCNICA"),
    ("9 — A Terceira Técnica: Ritmo",
        r"^9\s*\nA TERCEIRA TÉCNICA"),
    ("10 — A Quarta Técnica: Redefinição",
        r"^10\s*\nA QUARTA TÉCNICA"),
    ("11 — A Quinta Técnica: Mecanização",
        r"^11\s*\nA QUINTA TÉCNICA"),
    ("12 — A Sexta Técnica: Concentração",
        r"^12\s*\nA SEXTA TÉCNICA"),
    ("13 — A Sétima Técnica: Camuflagem",
        r"^13\s*\nO SÉTIMO"),
    ("14 — Os Toques Finais",
        r"^14\s*\nOS TOQUE FINAIS"),
    ("Epílogo",
        r"^EPÍLOGO|^EPTLOGUE"),
]

# ── Limpeza ───────────────────────────────────────────────────────────────────

NOISE_RE = re.compile(
    r"=== PÁGINA \d+ ===\n?"
    r"|03/04/2020 Sem título\n?"
    r"|https?://\S+\n?"
    r"|^\s*Página \d+\s*\n"
    r"|^Page \d+\s*\n"
    r"|^ ?\d{1,3}/228\s*\n",   # rodapés "N/228" ou " N/228"
    re.MULTILINE
)

# Cabeçalhos de página correntes: número isolado (>14) + título em maiúsculas
PAGE_HEADER_RE = re.compile(
    r"^\d{2,3}[ \t]+[A-ZÁÉÍÓÚÀÃÕÇ][A-ZÁÉÍÓÚÀÃÕÇ ,:\-–—.]{8,}\n",
    re.MULTILINE
)

def clean_text(text: str) -> str:
    text = NOISE_RE.sub("", text)
    text = PAGE_HEADER_RE.sub("", text)
    text = re.sub(r"-\n([a-záéíóúàãõçA-ZÁÉÍÓÚÀÃÕÇ])", r"\1", text)
    text = re.sub(r" {2,}", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

# ── Localização de âncoras ────────────────────────────────────────────────────

def find_anchors(text: str) -> list[tuple[int, str]]:
    """
    Para cada capítulo, encontra a ÚLTIMA ocorrência da âncora no texto
    (a primeira costuma estar no sumário).
    """
    found = []
    for title, pattern in CHAPTERS:
        matches = list(re.finditer(pattern, text, re.MULTILINE | re.IGNORECASE))
        if not matches:
            print(f"  [AVISO] âncora não encontrada: {title!r}")
            continue
        # Usa a última ocorrência (ignora sumário no início)
        m = matches[-1]
        found.append((m.start(), title))
        print(f"  ✓ pos {m.start():>7}  {title}")

    found.sort(key=lambda x: x[0])
    # Remove duplicatas (PARTE 2 e cap 6 têm âncora igual)
    deduped = []
    seen_pos = set()
    for pos, title in found:
        if pos not in seen_pos:
            deduped.append((pos, title))
            seen_pos.add(pos)
    return deduped

# ── Split e Markdown ──────────────────────────────────────────────────────────

def split_sections(text: str, anchors: list[tuple[int, str]]) -> list[dict]:
    sections = []
    for idx, (pos, title) in enumerate(anchors):
        end = anchors[idx + 1][0] if idx + 1 < len(anchors) else len(text)
        body = text[pos:end].strip()
        # Remove a própria âncora (número sozinho / título repetido) do início do body
        body = re.sub(r"^\d{1,2}\s*\n", "", body)
        sections.append({"title": title, "body": body})
    return sections

def to_markdown(section: dict) -> str:
    lines = section["body"].split("\n")
    md = [f"# {section['title']}\n"]
    # Conta linhas não-vazias para pular subtítulos no cabeçalho do capítulo
    non_empty_seen = 0
    for line in lines:
        line = line.rstrip()
        if not line:
            md.append("")
            continue
        non_empty_seen += 1
        stripped = line.strip()
        # Converte em H2 apenas após as primeiras 3 linhas não-vazias
        # (evita converter o subtítulo do próprio capítulo)
        if (non_empty_seen > 3
                and stripped.isupper()
                and 4 < len(stripped) < 90
                and not re.match(r"^\d", stripped)):
            md.append(f"\n## {stripped.title()}\n")
        else:
            md.append(line)
    return "\n".join(md)

def slug(title: str) -> str:
    s = re.sub(r"[^\w\s\-]", "", title.lower())
    s = re.sub(r"[\s_—]+", "-", s.strip())
    return s[:70].rstrip("-")

def build_index(sections: list[dict], filenames: list[str]) -> str:
    lines = [
        "# Breakthrough Advertising — Índice\n",
        "> **Eugene Schwartz** | Referência de copywriting para landing pages\n",
        "> Tradução BR\n",
    ]
    for sec, fname in zip(sections, filenames):
        lines.append(f"- [{sec['title']}]({fname})")
    return "\n".join(lines)

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if not RAW_PATH.exists():
        print(f"ERRO: {RAW_PATH} não encontrado. Rode 01_extract_raw.py primeiro.")
        return

    OUTPUT_DIR.mkdir(exist_ok=True)
    for f in OUTPUT_DIR.glob("*.md"):
        f.unlink()

    raw = RAW_PATH.read_text(encoding="utf-8")
    cleaned = clean_text(raw)

    print("Localizando âncoras de capítulo...\n")
    anchors = find_anchors(cleaned)
    print(f"\n{len(anchors)} seções encontradas.\n")

    sections = split_sections(cleaned, anchors)

    filenames = []
    for i, sec in enumerate(sections, start=1):
        fname = f"{i:02d}-{slug(sec['title'])}.md"
        filenames.append(fname)
        (OUTPUT_DIR / fname).write_text(to_markdown(sec), encoding="utf-8")
        print(f"  [{i:02d}] {sec['title'][:65]}  ({len(sec['body']):,} chars)")

    (OUTPUT_DIR / "index.md").write_text(build_index(sections, filenames), encoding="utf-8")
    print(f"\nÍndice → {OUTPUT_DIR / 'index.md'}")
    print(f"Total: {len(filenames) + 1} arquivos")

if __name__ == "__main__":
    main()
