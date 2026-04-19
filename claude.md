# 🎯 Carrossel App - Instagram Content Creator

Aplicação para criação de carrosséis de alta conversão para Instagram, modelada na inteligência narrativa, design visual e posicionamento do @soudaviribas (Davi Ribas).

**Base:** Claude Skills Workspace - Centraliza skills de produtividade reutilizáveis em qualquer projeto.

## 📋 Estrutura

```
/skills
├── marketing/          # Skills de marketing e copywriting
├── technical/          # Skills técnicas e de desenvolvimento
├── automation/         # Skills de automação
├── analytics/          # Skills de análise de dados
├── design/             # Skills de design
└── [skill-name]/
    ├── SKILL.md        # Documentação da skill
    └── scripts/        # Scripts Python, JS, etc (opcional)
```

## 🎯 Princípios

- **Reutilização**: Cada skill é independente e funciona em qualquer contexto
- **Documentação**: Toda skill tem SKILL.md explicando propósito, uso e exemplos
- **Organização**: Skills agrupadas por categoria para fácil localização
- **Modularidade**: Scripts e referências separadas da documentação

## 🎯 Objetivo do Projeto

**Missão:** Criar uma plataforma que permite qualquer usuário gerar carrosséis de Instagram com a mesma inteligência narrativa, design visual e posicionamento do @soudaviribas.

**Usuários-alvo:**
- Content creators (pessoal brands)
- Agências de marketing
- Empreendedores (e-commerce)
- Influencers
- Qualquer pessoa querendo escalar presença no Instagram

**Diferencial:** Templates e frameworks baseados na análise de um dos maiores criadores de conteúdo do Brasil

**Análise de Referência:** [DAVI_ANALYSIS.md](DAVI_ANALYSIS.md)

---

## 📐 Design Principles (Baseado no Davi)

1. **Minimalismo Funcional** - Clean, sem decoração desnecessária
2. **Acessibilidade 100%** - Alt-text, alto contraste, fonts legíveis
3. **Narrativa Clara** - Foco em mensagem, não em design
4. **Transformação como promessa** - Templates centrados em jornada
5. **Autoridade + Ação** - Combinar expertise com call-to-action

---

## 🎬 Tipos de Carrosséis Suportados

Baseado na análise do @soudaviribas:

### 1. **Carrossel de Transformação** (5-7 slides)
- Hook → Problema → Solução → Resultado → CTA

### 2. **Carrossel de Autoridade** (3-5 slides)
- Expertise → Conhecimento → Convite → CTA

### 3. **Carrossel Ideológico** (6-8 slides)
- Manifesto → Princípios → Exemplos → Comunidade → CTA

### 4. **Carrossel Educacional**
- Conceito → Desenvolvimento → Aplicação → Resultado

### 5. **Carrossel de Vendas**
- Problema → Agonia → Solução → Prova → CTA

---

## 🔄 Como Usar

### Análise Automática de Skills

Sempre que você solicitar uma atividade ou iniciar um projeto, **analisarei automaticamente qual skill aplicável existe** e a utilizarei sem precisar ser solicitado explicitamente. Não é necessário especificar qual skill usar — identificarei e aplicarei a mais apropriada para sua tarefa.

### Invocar uma skill em qualquer projeto

```bash
# No projeto onde você quer usar a skill, referencie-a:
# Claude Code vai encontrar automaticamente em ~/Desktop/Claude Skills/skills
/skill-name
```

### Criar uma nova skill

#### 1. Estrutura de Pastas

```
skills/
└── [categoria]/
    └── [skill-name]/
        ├── SKILL.md                 # ⭐ Documentação obrigatória
        ├── scripts/                 # (opcional) Scripts Python, JS, etc
        │   ├── script1.py
        │   └── script2.py
        └── references/              # (opcional) Materiais de referência
            ├── guide.md
            └── examples.json
```

**Categorias disponíveis:**
- `marketing/` — Copywriting, ads, funnels, sales
- `technical/` — Frontend, backend, dev tools
- `automation/` — Scraping, APIs, integrações
- `design/` — UI/UX, design systems, CRO
- `tools/` — Utilities diversas
- `knowledge/` — Conteúdo e guias

#### 2. Template SKILL.md

Veja [SKILL_TEMPLATE.md](SKILL_TEMPLATE.md) para estrutura completa.

**Frontmatter obrigatório:**
```yaml
---
name: skill-name
description: "One-line description of what this skill does"
allowed-tools: Read Write Glob Bash
metadata:
  author: your-name
  version: "1.0"
  category: "marketing|technical|automation|design|tools|knowledge"
  tags: ["tag1", "tag2"]
---
```

**Seções principais:**
1. **When to Use This Skill** — use cases e anti-patterns
2. **Core Principle** — uma frase que resume a essência
3. **Phase 1: Brief/Input** — o que você precisa do usuário
4. **Phase 2: Planning** — abordagem e estrutura
5. **Phase 3: Execution** — processo detalhado com templates/formulas
6. **Phase 4: Polish** — checklist de qualidade e variações
7. **Example** — caso de uso concreto
8. **Anti-Patterns** — erros comuns
9. **Recovery** — como lidar com cenários difíceis

#### 3. Exemplo Mínimo

```
/skills/marketing/my-new-skill/
├── SKILL.md
```

#### 4. Exemplo Completo

```
/skills/automation/email-analyzer/
├── SKILL.md
├── scripts/
│   ├── analyze_email.py
│   └── utils.py
└── references/
    ├── email-providers.md
    └── templates.json
```

#### 5. Checklist para Nova Skill

- [ ] Crie a pasta em `/skills/[categoria]/[skill-name]`
- [ ] Copie estrutura de [SKILL_TEMPLATE.md](SKILL_TEMPLATE.md)
- [ ] Preencha frontmatter (name, description, category, tags)
- [ ] Defina "When to Use" com 3+ use cases
- [ ] Documente "Core Principle" (1 frase)
- [ ] Crie 4 fases: Brief → Planning → Execution → Polish
- [ ] Adicione exemplo concreto (input → output)
- [ ] Liste anti-patterns e recovery scenarios
- [ ] Se tiver scripts, coloque em `/scripts`
- [ ] Se tiver referências, coloque em `/references`
- [ ] Atualize [SKILLS_INDEX.md](SKILLS_INDEX.md) com a nova skill

## 📂 Categorias Atuais

- **marketing/** - Copywriting, ads, landing pages, newsletters
- **technical/** - Frontend, backend, development tools
- **automation/** - Scraping, Gmail, WhatsApp, API integration
- **design/** - UI/UX, design systems, CRO
- **tools/** - Misc ferramentas e utilities
- **knowledge/** - Conteúdo e guias (e.g., Breakthrough Advertising)

## ⚙️ Configuração

Este workspace está configurado para funcionar com Claude Code. Skills podem ser:
- Acessadas via `/[skill-name]` em qualquer projeto
- Combinadas para workflows complexos
- Expandidas com novas skills conforme necessário

## 🔗 Links Rápidos

- Todas as skills em: `/skills`
- Veja cada `SKILL.md` para documentação específica
