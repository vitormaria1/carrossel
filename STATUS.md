# Status do Projeto - Carrossel App

## Estado Atual

O produto ativo do repositório e o app Next.js em `app/`.
O fluxo Python legado na raiz existe como referencia historica, mas nao representa mais a operacao principal.

## Modulos Ativos

- `Consultorio`: area principal para criar, editar, exportar e publicar carrosseis.
- `Financeiro`: modulo integrado para caixa, recorrencias, reservas e historico financeiro.
- `Login`: protecao de acesso via cookie de sessao.

## O Que Esta Funcionando

- Geracao de carrosseis com `standard`, `tweet`, `tweetExpanded` e `vanderMaria`.
- Geração via `/api/generate` e `/api/generate-agent`.
- Upload de documentos para enriquecer briefing.
- Publicacao de carrosseis via Instagram e webhook de imagens publicas.
- Area financeira com pagina consolidada em `/financeiro` e detalhamento por area em `/financeiro/[area]`.

## Dependencias Importantes

- `ANTHROPIC_API_KEY` para geracao principal.
- `DATABASE_URL` para ativar o modulo Financeiro.
- `INSTAGRAM_ACCESS_TOKEN` e `INSTAGRAM_BUSINESS_ACCOUNT_ID` para publicacao.
- `N8N_WEBHOOK_URL` para hospedar imagens publicas antes da publicacao.

## Estrutura Relevante

```txt
carrossel/
├── app/                    # Aplicacao principal em Next.js
│   ├── app/                # Rotas, paginas e componentes
│   ├── lib/                # Estado, integracoes e servicos
│   └── public/             # Assets estaticos
├── skills/                 # Biblioteca de skills reutilizaveis
├── README.md               # Visao geral do projeto
├── app/README.md           # Documentacao da aplicacao
└── DAVI_ANALYSIS.md        # Referencia de narrativa e posicionamento
```

## Proximos Passos Sugeridos

1. Expandir o modulo Financeiro com mais areas e operacoes.
2. Refinar o fluxo de publicacao e agendamento.
3. Unificar a documentacao antiga com o estado atual do app.
