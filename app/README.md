# Carrossel App

Aplicacao Next.js para gerar, editar, exportar e publicar carrosseis de Instagram.

## Fluxo principal

1. Escolha um template: `standard`, `tweet`, `tweetExpanded` ou `vanderMaria`
2. Preencha a ideia e o contexto
3. Opcionalmente envie documentos para enriquecer o briefing
4. Gere os cards
5. Exporte imagens/JSON ou publique no Instagram

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Estrutura relevante

- `app/app/home-client.tsx`: shell principal da interface
- `app/app/components/*`: formulários, viewports e controles de exportação/publicação
- `app/app/api/*`: geração, upload de documentos e publicação
- `app/lib/store.ts`: estado global do editor
- `app/lib/managed-agent.ts`: geração principal com Claude
- `app/lib/vander-maria/*`: pipeline dedicado do template Vander Maria

## Observações

- O template `vanderMaria` trabalha com 5 slides fixos.
- Quando há documentos enviados, o app usa `/api/generate` para incluir os arquivos no contexto.
- A publicação depende de `INSTAGRAM_ACCESS_TOKEN` e do webhook configurado em `n8n`.
