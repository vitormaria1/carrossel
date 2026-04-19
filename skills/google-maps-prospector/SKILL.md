---
name: google-maps-prospector
description: >
  Searches Google Maps for businesses in a given city or neighborhood using SerpAPI,
  then exports the leads to a Google Sheets spreadsheet. Use when the user wants to
  prospect clients, collect leads, list companies from Google Maps, or map         competitors in a specific location.
version: 1.1.0
---

# Google Maps Prospector

Prospecta empresas no Google Maps via SerpAPI e exporta os leads para Google Sheets.

## Pré-requisitos

- [ ] `SERPAPI_KEY` configurada em `.env` (obter em serpapi.com)
- [ ] MCP `google-workspace` autenticado globalmente (já configurado — não requer ação)

## Fluxo de Execução

### Passo 1 — Coletar query
Extraia da mensagem do usuário:
- **Query**: tipo de negócio + localização (ex: `"pizzarias em Campinas SP"`)
- **Max results**: padrão `25` se não especificado

### Passo 2 — Obter Sheet ID
- Se o usuário forneceu um sheet-id ou URL → extraia o ID e pule para o Passo 3
- Caso contrário → crie a planilha automaticamente:
  ```
  mcp__google-workspace__create_spreadsheet
    user_google_email: xpiria.ai@gmail.com
    title: "Leads - <query>"
  ```
  Extraia o `ID` do resultado.

### Passo 3 — Instalar dependências (se necessário)
```bash
pip3 install requests python-dotenv
```

### Passo 4 — Executar o script
```bash
cd "/Users/pedrohtmallet/Claude Skills"
SERPAPI_KEY=$(grep SERPAPI_KEY .env | cut -d= -f2) \
python3 ".claude/skills/google-maps-prospector/scripts/prospector.py" \
  --query "<QUERY>" \
  --sheet-id "<SHEET_ID>" \
  --max-results <N>
```

> Sempre usar `python3` e caminho relativo a partir do diretório raiz do workspace.

### Passo 5 — Reportar resultado
Informe ao usuário:
- Quantos leads foram exportados
- URL direta da planilha

## Resolução de Problemas

| Erro | Solução |
|------|---------|
| `SERPAPI_KEY não encontrada` | Peça ao usuário para configurar a variável em `.env` |
| `Token MCP não encontrado` | Verificar `~/.google_workspace_mcp/credentials/` |
| Poucos resultados | SerpAPI pagina automaticamente — tente aumentar `--max-results` |
| Erro de quota SerpAPI | Verificar uso em serpapi.com/dashboard |
