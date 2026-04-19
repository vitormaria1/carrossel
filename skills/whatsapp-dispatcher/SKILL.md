---
name: whatsapp-dispatcher
version: 1.0.0
description: Dispara mensagens WhatsApp personalizadas para leads de clínicas médicas a partir de uma planilha Google Sheets
---

# WhatsApp Dispatcher

Lê leads de uma planilha Google Sheets (gerada pelo google-maps-prospector), valida os números via UAZAPI, faz scraping dos sites com Jina.ai, gera mensagens personalizadas com Gemini 2.5 Flash e dispara via WhatsApp. Marca o status de cada disparo na planilha.

## Trigger Phrases

- "disparar whatsapp"
- "enviar mensagens para leads"
- "disparar mensagens da planilha"
- "enviar whatsapp para clínicas"
- "disparar para os leads"
- "mandar mensagem whatsapp"
- "disparar campanha whatsapp"

## Pré-requisitos

### Variáveis de ambiente (.env)
```
UAZAPI_BASE_URL=https://xpirinhav2.uazapi.com
UAZAPI_TOKEN=seu_token_aqui
GEMINI_API_KEY=sua_chave_gemini
JINA_API_KEY=sua_chave_jina
```

### Token Google Sheets
OAuth2 do MCP em: `~/.google_workspace_mcp/credentials/xpiria.ai@gmail.com.json`

### Dependências Python
```bash
pip3 install requests python-dotenv
```

## Uso

### Execução padrão (10 leads)
```bash
python3 dispatcher.py --sheet-id "ID_DA_PLANILHA"
```

### Dry run (gera mensagens sem enviar)
```bash
python3 dispatcher.py --sheet-id "ID_DA_PLANILHA" --dry-run
```

### Limitar quantidade de envios
```bash
python3 dispatcher.py --sheet-id "ID_DA_PLANILHA" --max-sends 5
```

## Fluxo de Execução

1. Lê a planilha (primeira aba) — colunas padrão do prospector
2. Filtra leads com `Website` preenchido e `WhatsApp Status` vazio
3. Para cada lead:
   - Normaliza e valida o número via UAZAPI `/chat/check`
   - Faz scraping do site via Jina.ai Reader
   - Gera mensagem personalizada via Gemini 2.5 Flash
   - Envia via UAZAPI `/send/text`
   - Aguarda 10 segundos entre envios
   - Atualiza a planilha com status, mensagem e data

## Colunas adicionadas na planilha

| Coluna | Valores possíveis |
|--------|-------------------|
| WhatsApp Status | Enviado / Número inválido / Telefone inválido / Erro envio / Dry run |
| Mensagem Enviada | Texto da mensagem gerada |
| Data Envio | Timestamp do processamento |

## Instruções para Claude

Quando o usuário quiser disparar mensagens WhatsApp para leads:

1. Solicitar o ID da planilha Google Sheets (ou URL)
2. Perguntar se quer fazer dry-run primeiro (recomendado)
3. Instalar dependências:
   ```bash
   pip3 install requests python-dotenv
   ```
4. Executar o script:
   ```bash
   cd "/Users/pedrohtmallet/Claude Skills"
   python3 .claude/skills/whatsapp-dispatcher/scripts/dispatcher.py \
     --sheet-id "SHEET_ID" \
     --dry-run
   ```
5. Após confirmação do dry-run, executar sem `--dry-run`
6. Reportar ao usuário: quantos enviados, quantos inválidos, link da planilha
