# Carrossel App

Aplicacao Next.js para gerar, editar, exportar, publicar e agendar carrosseis de Instagram.

## Fluxo principal

1. Escolha um template: `standard`, `tweet`, `tweetExpanded` ou `vanderMaria`
2. Preencha a ideia e o contexto
3. Opcionalmente envie documentos para enriquecer o briefing
4. Gere os cards
5. Edite e exporte os cards
6. Publique agora ou agende

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Estrutura relevante

- `app/app/home-client.tsx`: shell principal da interface
- `app/app/components/*`: formulários, viewports e controles de exportação/publicação
- `app/app/api/*`: geracao, upload de documentos, publicacao e agendamento
- `app/lib/store.ts`: estado global do editor
- `app/lib/managed-agent.ts`: geração principal com Claude
- `app/lib/vander-maria/*`: pipeline dedicado do template Vander Maria

## Observações

- O template `vanderMaria` trabalha com 5 slides fixos.
- Quando há documentos enviados, o app usa `/api/generate` para incluir os arquivos no contexto.
- A publicacao depende de `INSTAGRAM_ACCESS_TOKEN` e do webhook configurado em `n8n`.
- O agendamento salva os posts no Vercel Blob usando `BLOB_READ_WRITE_TOKEN`.
- O disparo do agendamento não depende da Vercel Cron: o repositório já inclui um workflow do GitHub Actions em `.github/workflows/process-scheduled-posts.yml`.
- No estado atual do codigo, a implementacao ativa usa uma conta principal por meio de `INSTAGRAM_ACCESS_TOKEN`, com label opcional via `INSTAGRAM_ACCOUNT_LABEL`.
- O template `vanderMaria` tambem depende de `VANDER_GEMINI_API_KEY`.

## Configuração necessária

1. No projeto da Vercel, confirme que o Blob está criado e adicione `BLOB_READ_WRITE_TOKEN` em `Settings > Environment Variables` se ele não tiver sido criado automaticamente.
2. Configure `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_BUSINESS_ACCOUNT_ID` e `CRON_SECRET` nas variaveis do projeto na Vercel.
3. No GitHub, crie os secrets `APP_URL` e `CRON_SECRET` para o workflow agendado.
4. Se quiser testar manualmente o processador, rode o workflow `Process scheduled posts` na aba Actions.
5. Configure `N8N_WEBHOOK_URL` para o upload das imagens publicas antes da publicacao.
6. Configure `VANDER_GEMINI_API_KEY` se for usar o template `vanderMaria`.
