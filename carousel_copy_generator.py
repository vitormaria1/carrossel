#!/usr/bin/env python3
"""
Carousel Copy Generator Agent
Generates high-conversion Instagram carousel copy based on @soudaviribas frameworks
Uses prompt caching for efficient multi-turn refinement
"""

import anthropic
import os
from typing import Optional
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Davi Ribas Carousel Frameworks (cached context)
CAROUSEL_FRAMEWORKS = """
# 5 Tipos de Carrosséis Baseado em @soudaviribas

## 1. Carrossel de Transformação (5-7 slides)
- **Hook**: Promessa de transformação
- **Problema**: Situação atual indesejável
- **Solução**: Método/abordagem
- **Resultado**: Transformação alcançada
- **CTA**: Convite à ação

## 2. Carrossel de Autoridade (3-5 slides)
- **Expertise**: Credencial estabelecida
- **Conhecimento**: Insights únicos
- **Convite**: Participação na comunidade
- **CTA**: Próximo passo

## 3. Carrossel Ideológico (6-8 slides)
- **Manifesto**: Declaração de princípios
- **Princípios**: 2-3 pilares fundamentais
- **Exemplos**: Aplicações práticas
- **Comunidade**: Senso de pertencimento
- **CTA**: Junte-se ao movimento

## 4. Carrossel Educacional (5-7 slides)
- **Conceito**: Termo/ideia central
- **Desenvolvimento**: Contexto e profundidade
- **Aplicação**: Como usar no dia a dia
- **Resultado**: Benefício direto
- **CTA**: Domine este conceito

## 5. Carrossel de Vendas (5-6 slides)
- **Problema**: Dor aguda
- **Agonia**: Amplificação do sofrimento
- **Solução**: Método/produto
- **Prova**: Resultados e depoimentos
- **CTA**: Compre agora / Converse comigo

# Princípios de Design (Baseado no Davi)
1. **Minimalismo Funcional** - Clean, sem decoração desnecessária
2. **Acessibilidade 100%** - Alt-text, alto contraste, fonts legíveis
3. **Narrativa Clara** - Foco em mensagem, não em design
4. **Transformação como promessa** - Templates centrados em jornada
5. **Autoridade + Ação** - Combinar expertise com call-to-action
"""

DAVI_ANALYSIS_SUMMARY = """
# Análise de @soudaviribas
- 163k seguidores, conteúdo altamente engajante
- Estilo: Minimalista, direto ao ponto
- Foco: Transformação pessoal, autoridade, ideologia
- Copywriting: Inteligência narrativa com urgência implícita
- Design: Branco limpo, textos grandes e legíveis
- Call-to-action: Sempre presente, sutilmente persuasivo
"""

def create_carousel_agent():
    """Initialize the Anthropic client"""
    return anthropic.Anthropic(
        api_key=os.environ.get("ANTHROPIC_API_KEY"),
        base_url="https://api.anthropic.com"
    )

def analyze_and_generate_carousel(
    topic: str,
    target_audience: str,
    user_tone: Optional[str] = None,
    preferred_type: Optional[str] = None,
    additional_context: Optional[str] = None
) -> str:
    """
    Generate carousel copy with audience analysis and type selection

    Args:
        topic: Main topic/offer for the carousel
        target_audience: Description of target audience
        user_tone: Optional tone preference (e.g., "casual", "professional", "urgent")
        preferred_type: Optional preferred carousel type
        additional_context: Optional additional requirements
    """
    client = anthropic.Anthropic(
        api_key=os.environ.get("ANTHROPIC_API_KEY"),
        base_url="https://api.anthropic.com"
    )

    # Build the conversation
    messages = [
        {
            "role": "user",
            "content": f"""
Gere um carrossel Instagram de alta conversão com base na metodologia @soudaviribas.

**Contexto:**
- Tópico/Oferta: {topic}
- Público-alvo: {target_audience}
{f"- Tom desejado: {user_tone}" if user_tone else ""}
{f"- Tipo preferido: {preferred_type}" if preferred_type else "- Analisar e sugerir melhor tipo"}
{f"- Contexto adicional: {additional_context}" if additional_context else ""}

**Etapas:**
1. Analise brevemente o público-alvo e a melhor estratégia
2. Selecione ou confirme o tipo de carrossel ideal
3. Gere o copy completo slide-por-slide
4. Garanta: minimalismo, narrativa clara, CTA forte

Comece com análise, depois apresente o carrossel estruturado.
"""
        }
    ]

    # Make request with prompt caching
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2048,
        system=[
            {
                "type": "text",
                "text": "Você é um especialista em copywriting para Instagram carrosséis, modelado na inteligência narrativa e design do @soudaviribas. Seu objetivo é gerar copies de alta conversão que transformam visualizações em engajamento e ação.",
                "cache_control": {"type": "ephemeral"}
            },
            {
                "type": "text",
                "text": CAROUSEL_FRAMEWORKS,
                "cache_control": {"type": "ephemeral"}
            },
            {
                "type": "text",
                "text": DAVI_ANALYSIS_SUMMARY,
                "cache_control": {"type": "ephemeral"}
            }
        ],
        messages=messages
    )

    return response.content[0].text


def refine_carousel(
    initial_copy: str,
    feedback: str,
    client: Optional[anthropic.Anthropic] = None
) -> str:
    """
    Refine carousel copy based on feedback
    Reuses cached framework context for efficiency

    Args:
        initial_copy: The initially generated carousel copy
        feedback: Refinement feedback/request
        client: Optional Anthropic client (creates new if not provided)
    """
    if client is None:
        client = anthropic.Anthropic(
            api_key=os.environ.get("ANTHROPIC_API_KEY"),
            base_url="https://api.anthropic.com"
        )

    messages = [
        {
            "role": "user",
            "content": f"Carrossel inicial:\n\n{initial_copy}"
        },
        {
            "role": "assistant",
            "content": "Entendi! Analisei o carrossel. Estou pronto para refinamentos."
        },
        {
            "role": "user",
            "content": f"Refine com base neste feedback:\n{feedback}"
        }
    ]

    # Request reuses the cached system context from initial generation
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2048,
        system=[
            {
                "type": "text",
                "text": "Você é um especialista em copywriting para Instagram carrosséis, modelado na inteligência narrativa e design do @soudaviribas. Seu objetivo é gerar copies de alta conversão.",
                "cache_control": {"type": "ephemeral"}
            },
            {
                "type": "text",
                "text": CAROUSEL_FRAMEWORKS,
                "cache_control": {"type": "ephemeral"}
            },
            {
                "type": "text",
                "text": DAVI_ANALYSIS_SUMMARY,
                "cache_control": {"type": "ephemeral"}
            }
        ],
        messages=messages
    )

    return response.content[0].text


def main():
    """Interactive carousel copy generator"""
    print("=" * 60)
    print("🎡 CAROUSEL COPY GENERATOR")
    print("Baseado em @soudaviribas | Powered by Claude + Prompt Caching")
    print("=" * 60)
    print()

    # Gather initial inputs
    print("📝 Vamos criar um carrossel de alta conversão!\n")

    topic = input("1. Qual é o tópico/oferta? ").strip()
    if not topic:
        print("❌ Tópico é obrigatório.")
        return

    audience = input("2. Descreva seu público-alvo: ").strip()
    if not audience:
        print("❌ Público-alvo é obrigatório.")
        return

    tone = input("3. Tom desejado (casual/profissional/urgente/motivacional)? [Enter para auto]: ").strip() or None

    carousel_type = input("4. Tipo de carrossel? (transformação/autoridade/ideológico/educacional/vendas) [Enter para auto]: ").strip() or None

    additional = input("5. Algo mais a mencionar? [Enter para pular]: ").strip() or None

    print("\n⏳ Gerando carrossel com análise de público...\n")

    # Generate initial carousel
    initial_copy = analyze_and_generate_carousel(
        topic=topic,
        target_audience=audience,
        user_tone=tone,
        preferred_type=carousel_type,
        additional_context=additional
    )

    print(initial_copy)
    print("\n" + "=" * 60)

    # Iterative refinement loop
    client = create_carousel_agent()
    while True:
        print("\n💡 Opções:")
        print("1. Refinar o carrossel")
        print("2. Salvar e sair")
        print("3. Começar novo")

        choice = input("\nEscolha (1-3): ").strip()

        if choice == "1":
            feedback = input("\nQual é o feedback/refinamento? ").strip()
            if feedback:
                print("\n⏳ Refinando com prompt caching...\n")
                refined = refine_carousel(initial_copy, feedback, client)
                print(refined)
                initial_copy = refined
                print("\n" + "=" * 60)

        elif choice == "2":
            filename = f"carousel_{topic[:20].replace(' ', '_')}.md"
            with open(filename, "w", encoding="utf-8") as f:
                f.write(f"# Carrossel: {topic}\n\n")
                f.write(f"**Público:** {audience}\n\n")
                f.write(initial_copy)
            print(f"\n✅ Carrossel salvo em: {filename}")
            break

        elif choice == "3":
            main()
            break

        else:
            print("❌ Opção inválida.")


if __name__ == "__main__":
    main()
