# 📱 Setup de Publicação no Instagram

Sistema completo para publicar carrosséis gerados automaticamente no Instagram.

## ✅ Status Atual

- ✅ **Frontend**: Botão "Publicar no Instagram" implementado
- ✅ **Backend API**: `/api/publish-instagram` criada
- ✅ **App ID**: `1706992586953954`
- ⏳ **Access Token**: Precisa ser válido e renovado
- ✅ **Business Account ID**: `17841400772660262`

## 🚀 O que foi Implementado

### 1. **Componente PublishButton** (`app/components/PublishButton.tsx`)
- Botão "📱 Publicar no Instagram" na sidebar
- Estados: idle, publishing, success, error
- Link direto para o post após publicação

### 2. **API de Publicação** (`app/api/publish-instagram/route.ts`)
- Recebe carrossel com até 10 slides
- Faz upload cada imagem para Instagram
- Cria container do carrossel
- Publica automaticamente
- Retorna URL do post

### 3. **Fluxo Completo**

```
┌─────────────────────┐
│  Gera Carrossel     │
│   (10 slides)       │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ Clica "Publicar"    │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ API Upload each     │
│ slide image         │
│ (1080x1350)         │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ Cria Carousel       │
│ Container           │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ Publica no          │
│ Instagram           │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ ✅ Sucesso! Link    │
│ para post           │
└─────────────────────┘
```

## 🔐 Configuração Necessária

### Token do Instagram Inválido?

O token fornecido pode estar expirado. Para gerar um novo:

1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Vá para seu app (ID: `1706992586953954`)
3. Tools → Graph API Explorer
4. Selecione sua página do Instagram
5. Generate Access Token com permissões:
   - `instagram_business_content_publish`
   - `instagram_business_basic`
   - `pages_read_engagement`

6. Copie o token e atualize em `app/.env.local`:

```env
INSTAGRAM_ACCESS_TOKEN=novo_token_aqui
```

### Variáveis de Ambiente

```env
# Em app/.env.local
NEXT_PUBLIC_INSTAGRAM_APP_ID=1706992586953954
INSTAGRAM_APP_SECRET=9d48162772ceb91656f56bb81b748fd0
INSTAGRAM_ACCESS_TOKEN=IGAAYQgC7HlO... # ← Renove este
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841400772660262
```

## 🎨 Como Funciona

### Upload de Imagens
- Cada slide é convertido em imagem 1080x1350px
- Imagens são hospedadas temporariamente via URL pública
- Instagram API faz download e valida

### Limitações
- **Máximo 10 slides** por carrossel (limitação Instagram)
- **Máximo 50 posts por 24h** (rate limit)
- Imagens precisam estar em URL **pública**
- Conta deve ser **Business Account** (não pessoal)

## 🧪 Teste Manual

```bash
cd app
npm run dev
```

1. Acesse `http://localhost:3000`
2. Preencha a ideia: "Como criar conteúdo viral no Instagram"
3. Clique em "Gerar Carrossel" (aguarde ~30s)
4. Clique em "📱 Publicar no Instagram"
5. Aguarde resposta (3-10s)
6. ✅ Se sucesso: link para o post aparece

## 🐛 Troubleshooting

### Erro: "Falha ao fazer upload da imagem"
**Causa**: Access Token inválido ou expirado
**Solução**: Gere novo token conforme instruções acima

### Erro: "Credenciais não configuradas"
**Causa**: `INSTAGRAM_ACCESS_TOKEN` ou `INSTAGRAM_BUSINESS_ACCOUNT_ID` vazios
**Solução**: Preenchaas variáveis em `.env.local`

### Erro: "Máximo de 10 slides"
**Causa**: Carrossel tem mais de 10 slides
**Solução**: Reduzir número de slides (slider em 3-20)

## 📊 Próximos Passos Opcionais

### 1. Renderização Customizada de Imagens
Atualmente usa placeholder. Para melhorar:
- Usar Puppeteer para renderizar HTML → PNG
- Integrar Canva API
- Cloudinary para processamento

### 2. Preview de Imagens
Mostrar como as imagens vão aparecer antes de publicar

### 3. Schedule de Posts
Publicar em horário específico (requer token adicional)

### 4. Analytics
Rastrear clicks, saves, shares do carrossel publicado

## 🔗 Recursos

- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing)
- [Error Codes](https://developers.facebook.com/docs/instagram-api/reference/error-codes)
- [Meta Developer Dashboard](https://developers.facebook.com)
