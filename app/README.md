# Carrossel App

Aplicacao Next.js para gerar, editar, exportar e publicar carrosseis de Instagram.

## Fluxo principal

1. Escolha um template: `standard`, `tweet`, `tweetExpanded` ou `vanderMaria`
2. Preencha a ideia e o contexto
3. Opcionalmente envie documentos para enriquecer o briefing
4. Gere os cards
5. Edite e exporte os cards
6. Publique agora

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Estrutura relevante

- `app/app/home-client.tsx`: shell principal da interface
- `app/app/components/*`: formulários, viewports e controles de exportação/publicação
- `app/app/api/*`: geracao, upload de documentos, publicacao e gatilhos externos
- `app/lib/store.ts`: estado global do editor
- `app/lib/managed-agent.ts`: geração principal com Claude
- `app/lib/vander-maria/*`: pipeline dedicado do template Vander Maria

## Observações

- O template `vanderMaria` trabalha com 5 slides fixos.
- Quando há documentos enviados, o app usa `/api/generate` para incluir os arquivos no contexto.
- A publicacao depende de `INSTAGRAM_ACCESS_TOKEN` e do webhook configurado em `n8n`.
- No estado atual do codigo, a implementacao ativa usa uma conta principal por meio de `INSTAGRAM_ACCESS_TOKEN`, com label opcional via `INSTAGRAM_ACCOUNT_LABEL`.
- O template `vanderMaria` tambem depende de `VANDER_GEMINI_API_KEY`.
- Gatilhos externos podem usar `POST /api/external/publish` com `Authorization: Bearer <N8N_TRIGGER_SECRET>` ou header `x-api-key`.

## Configuração necessária

1. Configure `INSTAGRAM_ACCESS_TOKEN` e `INSTAGRAM_BUSINESS_ACCOUNT_ID` nas variaveis do projeto.
2. Configure `N8N_WEBHOOK_URL` para o upload das imagens publicas antes da publicacao.
3. Configure `N8N_TRIGGER_SECRET` se quiser disparar publicacoes externamente via n8n.
4. Configure `VANDER_GEMINI_API_KEY` se for usar o template `vanderMaria`.
