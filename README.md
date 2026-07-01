# Carrossel App

Aplicacao para criar, editar, exportar, publicar e agendar carrosseis de Instagram.

O produto ativo deste repositorio e um app em Next.js localizado em [app](./app). Os arquivos Python na raiz sao legado e nao representam o fluxo principal atual.

## Estrutura

- `app/`: aplicacao principal em Next.js
- `app/app/home-client.tsx`: shell principal da interface
- `app/app/api/*`: geracao, upload, publicacao e agendamento
- `app/lib/*`: estado global, integracoes e servicos
- `.github/workflows/process-scheduled-posts.yml`: processamento de agendamentos

## Inicio rapido

1. Instale as dependencias:

```bash
cd app
npm install
```

2. Configure as variaveis locais em `app/.env.local`.

Variaveis principais:

- `ANTHROPIC_API_KEY`: geracao de copy
- `INSTAGRAM_ACCESS_TOKEN`: token da conta do Instagram
- `INSTAGRAM_BUSINESS_ACCOUNT_ID`: conta profissional usada na publicacao
- `N8N_WEBHOOK_URL`: webhook para hospedar as imagens publicas
- `BLOB_READ_WRITE_TOKEN`: necessario para agendamentos
- `VANDER_GEMINI_API_KEY`: necessario para o template `vanderMaria`

3. Rode o app:

```bash
cd app
npm run dev
```

4. Abra no navegador:

```txt
http://localhost:3000
```

## Fluxo principal

1. Fazer login
2. Escolher um template: `standard`, `tweet`, `tweetExpanded` ou `vanderMaria`
3. Preencher ideia e contexto
4. Opcionalmente enviar documentos para enriquecer o briefing
5. Gerar os cards
6. Editar, exportar, publicar agora ou agendar

## Observacoes

- O template `vanderMaria` trabalha com 5 slides fixos.
- Quando ha documentos enviados, o app usa `/api/generate` para incluir os arquivos no contexto.
- Sem `ANTHROPIC_API_KEY`, parte da geracao cai em fallback/mock.
- A publicacao depende do token do Instagram e do webhook do `n8n`.
- O agendamento salva posts no Vercel Blob e pode ser processado pelo workflow do GitHub Actions.

## Documentacao adicional

- [app/README.md](./app/README.md): detalhes da aplicacao Next.js
- [DEPLOY.md](./DEPLOY.md): observacoes de deploy
