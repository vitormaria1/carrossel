---
name: gmail-organizer
description: >
  Organiza a caixa de entrada do Gmail criando etiquetas inteligentes por categoria
  (Marketing, Financeiro, Faturas, Urgente, Vencendo, Responder, Contabilidade) e
  aplicando-as automaticamente nos emails. Use quando o usuário quiser organizar
  o Gmail, classificar emails, etiquetar a inbox ou limpar a caixa de entrada.
version: 1.0.0
---

# Gmail Organizer

Organiza automaticamente a caixa de entrada do Gmail criando etiquetas por categoria e
aplicando-as nos emails usando a Gmail API diretamente.

## Trigger Phrases

- "organizar gmail"
- "classificar emails"
- "etiquetar inbox"
- "limpar caixa de entrada"
- "organizar caixa de entrada"
- "criar etiquetas no gmail"
- "categorizar emails"

## Pré-requisitos

- [ ] Token OAuth2 do MCP em `~/.google_workspace_mcp/credentials/xpiria.ai@gmail.com.json` (já configurado)
- [ ] Python 3 instalado
- [ ] Dependências: `pip3 install requests python-dotenv`

## Etiquetas Criadas

| Etiqueta | Critério |
|---|---|
| `Organizar/Marketing` | Newsletters, promoções, anúncios de produtos |
| `Organizar/Financeiro` | Billing, budget, cobranças, pagamentos |
| `Organizar/Contabilidade` | Notas fiscais, relatórios, CNPJ |
| `Organizar/Faturas` | Recibos de venda (Ticto), faturas emitidas/recebidas |
| `Organizar/Responder` | Emails não lidos sem etiqueta, com mais de 3 dias |
| `Organizar/Urgente` | Alertas de segurança, budget 100%, notificações críticas |
| `Organizar/Vencendo` | Renovações, domínios vencendo, prazos próximos |

## Fluxo de Execução

### Passo 1 — Instalar dependências (se necessário)
```bash
pip3 install requests python-dotenv
```

### Passo 2 — Executar o script
```bash
cd "/Users/pedrohtmallet/Claude Skills"

# Dry run (visualizar sem aplicar)
python3 .claude/skills/gmail-organizer/scripts/organizer.py --dry-run

# Execução padrão (até 50 emails por categoria)
python3 .claude/skills/gmail-organizer/scripts/organizer.py

# Limitar emails por categoria
python3 .claude/skills/gmail-organizer/scripts/organizer.py --max-per-category 20

# Verbose (mostrar detalhes de cada email)
python3 .claude/skills/gmail-organizer/scripts/organizer.py --verbose
```

### Passo 3 — Reportar resultado
Mostrar ao usuário o resumo: quantos emails foram etiquetados por categoria.

## Instruções para Claude

Quando o usuário pedir para organizar o Gmail:

1. Perguntar se quer fazer **dry-run** primeiro para visualizar
2. Instalar dependências se necessário
3. Executar o script com os parâmetros adequados
4. Reportar o resumo final com contagens por categoria
5. Alertar sobre emails críticos encontrados (Urgente, Vencendo)

Para operações pontuais (etiquetar 1-2 emails específicos), use o MCP `mcp__gmail__*` diretamente.
Para organização em massa (10+ emails), use este script.

## Resolução de Problemas

| Erro | Solução |
|---|---|
| `Token não encontrado` | Verificar se MCP google-workspace está autenticado: `~/.google_workspace_mcp/credentials/xpiria.ai@gmail.com.json` |
| `401 Unauthorized` | Token expirado — reconectar MCP no Claude ou usar `mcp__gmail__` para forçar refresh |
| `403 Forbidden` | Token sem escopo Gmail — usar MCP diretamente para operações Gmail |
| `ModuleNotFoundError` | Rodar `pip3 install requests python-dotenv` |
