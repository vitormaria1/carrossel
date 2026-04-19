# 🎡 Carrossel App - Gerador de Carrosséis Instagram

Aplicação para criação de carrosséis de alta conversão para Instagram, modelada na inteligência narrativa, design visual e posicionamento do @soudaviribas.

## 🚀 Início Rápido

### 1. Instalar dependências
```bash
pip3 install -r requirements-carousel.txt
```

### 2. Configurar API Key
```bash
# Crie um arquivo .env na raiz do projeto
echo "ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui" > .env
```

### 3. Iniciar aplicação web
```bash
python3 app_web.py
```

### 4. Abrir no navegador
```
http://localhost:5000
```

---

## 📋 Como Usar

1. **Preencha os campos:**
   - Tópico/Oferta (obrigatório)
   - Público-alvo (obrigatório)
   - Tom (opcional - casual, profissional, urgente, motivacional, autêntico)
   - Tipo de Carrossel (opcional - transformação, autoridade, ideológico, educacional, vendas)
   - Contexto Adicional (opcional)

2. **Clique em "✨ Gerar Carrossel"**
   - Claude IA gera o carrossel completo

3. **Refine se necessário:**
   - Digite feedback (ex: "Adicione mais urgência")
   - Clique em "Refinar"

4. **Baixe:**
   - Clique em "💾 Baixar"
   - Arquivo .md é salvo no computador

---

## 📚 Arquivos Principais

- `app_web.py` - Aplicação web (Flask)
- `carousel_copy_generator.py` - Gerador de carrosséis (Core)
- `carousel_agent_managed.py` - Modo Managed Agents (avançado)
- `templates/index.html` - Interface web
- `requirements-carousel.txt` - Dependências Python
- `.env` - Configuração (API Key)

---

## 📐 5 Tipos de Carrosséis

1. **Transformação** (5-7 slides) - Hook → Problema → Solução → Resultado → CTA
2. **Autoridade** (3-5 slides) - Expertise → Conhecimento → Convite → CTA
3. **Ideológico** (6-8 slides) - Manifesto → Princípios → Exemplos → Comunidade → CTA
4. **Educacional** (5-7 slides) - Conceito → Desenvolvimento → Aplicação → Resultado
5. **Vendas** (5-6 slides) - Problema → Agonia → Solução → Prova → CTA

---

## ✨ Princípios @soudaviribas

- ✓ Minimalismo Funcional
- ✓ Acessibilidade 100%
- ✓ Narrativa Clara
- ✓ Transformação como Promessa
- ✓ Autoridade + Ação

---

## 🛠 Stack

- **Backend:** Flask + Python 3.9+
- **IA:** Claude API (Anthropic SDK)
- **Frontend:** HTML + CSS + JavaScript
- **Otimização:** Prompt Caching (90% economia em refinamentos)

---

## 📞 Suporte

Para problemas com a API Key:
1. Verifique se está em https://console.anthropic.com
2. Confirme status "Active" (verde)
3. Verifique saldo de créditos
4. Crie uma nova chave se necessário

---

**Pronto para começar? Abra http://localhost:5000** 🚀
