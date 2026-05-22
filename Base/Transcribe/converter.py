import pymupdf4llm
from pathlib import Path

pdfs = list(Path(".").glob("*.pdf"))
print(f"{len(pdfs)} PDFs encontrados.")

for pdf in pdfs:
    print(f"Convertendo: {pdf.name}...")
    try:
        md = pymupdf4llm.to_markdown(str(pdf))
        Path(f"{pdf.stem}.md").write_text(md, encoding="utf-8")
        print(f"OK: {pdf.stem}.md criado")
    except Exception as e:
        print(f"ERRO em {pdf.name}: {e}")

print("Pronto!")