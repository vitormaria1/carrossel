# Cloudflare Pages + Next.js - Best Practices

**Objetivo:** Deploy correto de primeira, sem 7+ tentativas.

## ❌ O que NÃO fazer

### 1. Dependências Nativas
- ❌ `canvas` — compila C++ bindings, não funciona em edge runtime
- ❌ `sharp`, `sqlite3` — qualquer módulo que compila nativamente
- ✅ **Solução:** Usar apenas dependências JavaScript puras

### 2. Validações em Tempo de Build
```typescript
// ❌ ERRADO - Bloqueia build
const API_KEY = process.env.MY_KEY;
if (!API_KEY) throw new Error('MY_KEY not set');

// ✅ CORRETO - Runtime check
const API_KEY = process.env.MY_KEY || '';
```

### 3. Outputs Incorretos
```javascript
// ❌ ERRADO para Cloudflare Pages
output: 'standalone'  // Isso é para Vercel/self-hosted

// ✅ CORRETO para Cloudflare Pages
// Deixar default (não especificar output)
```

### 4. Nested Git Repositories
```bash
# ❌ ERRADO
app/
  .git/          # Submodule não funciona em Cloudflare
  package.json

# ✅ CORRETO
app/
  package.json   # Pasta normal, sem .git aninhado
```

### 5. Configurações Next.js Outdated
```javascript
// ❌ ERRADO em Next.js 16.x
const nextConfig = {
  swcMinify: true,   // Deprecated - remove
};

// ✅ CORRETO
const nextConfig = {
  reactStrictMode: true,
};
```

---

## ✅ Checklist Pré-Deploy

### Code Level
- [ ] **Zero dependências nativas** — `npm ls --prod | grep -E "canvas|sharp|sqlite"`
- [ ] **Build local funciona** — `npm run build` sem erros
- [ ] **Sem validações em build time** — API keys só checam em runtime
- [ ] **next.config.js limpo** — sem deprecated options

### Repository
- [ ] **.gitignore atualizado** — `.env`, `.env.production`, `.env.*.local`
- [ ] **Sem .env.production commitado** — secrets nunca em git
- [ ] **Sem nested .git** — `rm -rf app/.git` se necessário
- [ ] **Tudo pushed para GitHub** — `git push origin main`

### Cloudflare Dashboard
- [ ] **Projeto criado** — Pages (não Workers)
- [ ] **GitHub conectado** — repo autorizado
- [ ] **Build settings corretos:**
  ```
  Framework: Next.js
  Build command: cd app && npm install && npm run build
  Output directory: app/.next
  Root directory: .
  ```
- [ ] **Environment variables adicionadas** — ANTES de deploy
  ```
  ANTHROPIC_API_KEY=sk-ant-...
  NEXT_PUBLIC_*=...
  VANDER_GEMINI_API_KEY=...
  (todas as vars sem valores em branco)
  ```
- [ ] **Deploy command** — deixa como `true` (ou qualquer valor)

---

## 🚀 Fluxo de Deploy Correto

### 1. Local (antes de push)
```bash
cd app
npm install
npm run build  # Verifica se tudo compila
```

### 2. GitHub
```bash
git add .
git commit -m "feat: ready for Cloudflare Pages"
git push origin main
```

### 3. Cloudflare Dashboard
1. **Pages** → "Create project"
2. "Connect to Git" → Seleciona repo
3. Configura Build settings (vide checklist acima)
4. **ANTES de Deploy:** Adiciona ALL environment variables em "Advanced" ou "Environment"
5. Clica "Deploy"

### 4. Acesso
- **URL padrão:** `https://[project-name].pages.dev`
- **Domínio customizado:** Settings → Custom domains (se quiser)

---

## 🔍 Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| `next: not found` | npm install não rodou | Build command: `cd app && npm install && npm run build` |
| `Cannot find module 'canvas'` | Canvas ainda importado | Delete `server-image-generator.ts` ou qualquer arquivo que usa canvas |
| `VANDER_GEMINI_API_KEY não configurada` | Validação em build time | Remove `if (!process.env.X) throw new Error()` — mova para runtime |
| `submodules error` | app/.git existe | `rm -rf app/.git && git add app/ && git commit` |
| `swcMinify invalid option` | Next.js 16 removeu opção | Remove `swcMinify: true` de next.config.js |
| URL `*.workers.dev` Inactive | Deployou em Pages, não Workers | Acesse `*.pages.dev` em vez de `*.workers.dev` |

---

## 📊 Pages vs Workers

| Aspecto | Pages | Workers |
|--------|-------|---------|
| Use case | Sites estáticos/SSR/SSG | Serverless functions/APIs |
| URL default | `*.pages.dev` | `*.workers.dev` |
| Deploy | Via GitHub | Via `wrangler deploy` |
| Build | Next.js build automático | N/A (código roda direto) |
| Env vars | Dashboard → Environment | `wrangler.toml` ou dashboard |
| **Nosso caso** | ✅ Aqui | ❌ Não usar |

---

## 🎯 Resumo: Por que falhei na primeira vez

1. ✗ Usei `canvas` (nativa)
2. ✗ Usei `output: 'standalone'` (Vercel, não Pages)
3. ✗ Validei API keys em build time
4. ✗ Deixei `.git` aninhado
5. ✗ Não testei build localmente antes de push
6. ✗ Não documentei o correto fluxo

**Resultado:** 7+ tentativas em vez de 1.

---

## 📝 Para Próximos Projetos

**Antes de escrever qualquer código:**
1. Decidir: Pages ou Workers?
2. Se Pages → remover qualquer dependência nativa
3. Se API keys necessárias → guardar para runtime, nunca build time
4. Testar build localmente: `npm run build`
5. Fazer push limpo para GitHub
6. Apenas então ir para Cloudflare dashboard

**Tempo de setup correto:** ~5 minutos
**Tempo do deploy:** ~2 minutos
**Total:** 7 minutos, 1 tentativa.

vs

**Meu approach:** ~30 minutos, 7+ tentativas, frustrante.

