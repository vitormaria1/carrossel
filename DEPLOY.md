# Deploy na Cloudflare Pages

## 🚀 Pré-requisitos
- Conta Cloudflare ativa
- Repositório GitHub conectado

## 📋 Checklist Pré-Deploy

- ✅ Variáveis de ambiente configuradas (.env.production)
- ✅ Build local funcionando: `npm run build`
- ✅ Testes passando
- ✅ next.config.js configurado para `output: standalone`

## 🔧 Passo 1: GitHub

```bash
# Commitar e fazer push
git add .
git commit -m "chore: prepare for Cloudflare Pages deployment"
git push origin main
```

## 🌐 Passo 2: Cloudflare Pages Dashboard

1. Acesse [dash.cloudflare.com/pages](https://dash.cloudflare.com/pages)
2. Clique em **"Create a project"**
3. Selecione **"Connect to Git"**
4. Autorize GitHub
5. Selecione o repositório: `carrossel`
6. Selecione branch: `main`

## ⚙️ Passo 3: Build Configuration

Na Cloudflare Pages, defina:

- **Framework preset**: Next.js
- **Build command**: `cd app && npm run build`
- **Build output directory**: `app/.next`
- **Root directory**: `.` (raiz do repo)

## 🔐 Passo 4: Environment Variables

No dashboard Cloudflare Pages → Settings → Environment:

```
ANTHROPIC_API_KEY=sk-ant-api03-...
NEXT_PUBLIC_INSTAGRAM_APP_ID=1706992586953954
INSTAGRAM_APP_SECRET=9d48162772ceb91656f56bb81b748fd0
INSTAGRAM_ACCESS_TOKEN=IGAAYQgC7HlOJBZA...
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841400772660262
N8N_WEBHOOK_URL=https://n8n.vitormaria.com.br/webhook/image
VANDER_GEMINI_API_KEY=AIzaSyCaRvVmfC5h8ZFcsAfuahW7WE-U0lIDYOw
```

⚠️ **IMPORTANTE**: 
- Copie os valores exatos de `.env.local`
- Não commita `.env.local` ou `.env.production` com valores reais
- Use o Cloudflare dashboard para secrets sensíveis

## ✅ Passo 5: Deploy

Após adicionar environment vars, clique **"Deploy site"**.

O Cloudflare automaticamente:
1. Faz checkout do código
2. Instala dependências
3. Executa `npm run build`
4. Faz upload para edge network global

## 📊 Monitoramento

Após deploy:
- Acesse `https://carrossel-vander-maria.pages.dev`
- Analytics em Cloudflare Dashboard
- Logs: Deployments → View details

## 🚨 Troubleshooting

**Build falha com erro de node_modules:**
```
Cloudflare Pages → Settings → Build & deployments
→ Build output directory: app/.next/standalone
```

**Variáveis de ambiente não reconhecidas:**
- Verifique nomes exatos em Environment variables
- Reinicie o deploy

**Canvas não funciona:**
- Canvas é client-side (browser), não precisa de compatibilidade servidor

## 🔄 Deploy Contínuo

Após primeira configuração:
- Cada push para `main` dispara deploy automático
- Histórico de deployments no dashboard
- Rollback disponível se necessário

---

**URL de produção**: `https://carrossel-vander-maria.pages.dev`
