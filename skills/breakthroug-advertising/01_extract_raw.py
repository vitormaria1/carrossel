"""
01_extract_raw.py
Extrai o texto bruto do PDF página a página e salva em raw_text.txt
"""

import pdfplumber
from pathlib import Path

PDF_PATH = Path(__file__).parent / "Eugene Schwartz - Breakthrough Advertising BR.pdf"
OUTPUT_PATH = Path(__file__).parent / "raw_text.txt"

def extract(pdf_path: Path, output_path: Path):
    pages_text = []
    with pdfplumber.open(pdf_path) as pdf:
        total = len(pdf.pages)
        print(f"Total de páginas: {total}")
        for i, page in enumerate(pdf.pages, start=1):
            text = page.extract_text(x_tolerance=2, y_tolerance=3) or ""
            pages_text.append(f"=== PÁGINA {i} ===\n{text}\n")
            if i % 20 == 0:
                print(f"  Extraídas {i}/{total} páginas...")

    output_path.write_text("\n".join(pages_text), encoding="utf-8")
    print(f"\nTexto bruto salvo em: {output_path}")
    print(f"Tamanho: {output_path.stat().st_size / 1024:.1f} KB")

if __name__ == "__main__":
    extract(PDF_PATH, OUTPUT_PATH)
