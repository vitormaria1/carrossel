#!/usr/bin/env python3
"""
Carousel Copy Generator - Managed Agent Version
Stateful agent with session persistence, perfect for multi-step workflows
Requires: anthropic >= 0.92.0
"""

import anthropic
import os
from typing import Optional

def setup_environment():
    """ONE-TIME SETUP — Run once, save the IDs to .env or config"""
    client = anthropic.Anthropic(
        api_key=os.environ.get("ANTHROPIC_API_KEY"),
        base_url="https://api.anthropic.com"
    )

    print("🔧 Setting up Managed Agent infrastructure...\n")

    # 1. Create environment
    print("📦 Creating environment...")
    environment = client.beta.environments.create(
        name="carousel_generation",
        config={
            "type": "cloud",
            "networking": {"type": "unrestricted"},
        },
    )
    print(f"✅ Environment: {environment.id}\n")

    # 2. Create agent with carousel expertise
    print("🤖 Creating Carousel Copy Agent...")

    carousel_system = """
Você é um especialista em copywriting para Instagram carrosséis,
modelado na inteligência narrativa e design do @soudaviribas.

Sua missão: Gerar carrosséis de alta conversão transformando
tópicos em jornadas narrativas compelentes.

TIPOS DE CARROSSÉIS:
1. **Transformação** (5-7): Hook → Problema → Solução → Resultado → CTA
2. **Autoridade** (3-5): Expertise → Conhecimento → Convite → CTA
3. **Ideológico** (6-8): Manifesto → Princípios → Exemplos → Comunidade → CTA
4. **Educacional** (5-7): Conceito → Desenvolvimento → Aplicação → Resultado
5. **Vendas** (5-6): Problema → Agonia → Solução → Prova → CTA

PRINCÍPIOS DAVI:
- Minimalismo Funcional: Clean, sem decoração
- Acessibilidade 100%: Alto contraste, fonts legíveis
- Narrativa Clara: Mensagem > design
- Transformação como promessa: Jornada visual
- Autoridade + Ação: Expertise + CTA forte

WORKFLOW:
1. Analise público-alvo e contexto
2. Selecione tipo ideal de carrossel
3. Gere copy slide-por-slide
4. Refine iterativamente até perfeição
"""

    agent = client.beta.agents.create(
        name="Carousel Copy Generator",
        model="claude-opus-4-6",
        system=carousel_system,
        tools=[
            {"type": "agent_toolset_20260401", "default_config": {"enabled": True}}
        ],
    )
    print(f"✅ Agent: {agent.id}")
    print(f"   Version: {agent.version}\n")

    print("💾 Save these IDs to your environment:")
    print(f"   CAROUSEL_ENV_ID={environment.id}")
    print(f"   CAROUSEL_AGENT_ID={agent.id}")
    print()

    return {
        "environment_id": environment.id,
        "agent_id": agent.id,
        "agent_version": agent.version,
    }


def run_carousel_session(
    topic: str,
    target_audience: str,
    env_id: str,
    agent_id: str,
    tone: Optional[str] = None,
    carousel_type: Optional[str] = None,
):
    """
    RUNTIME — Run on every invocation
    Creates a session and streams the carousel generation
    """
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    print(f"\n🎡 Generating carousel for: {topic}")
    print(f"📊 Audience: {target_audience}\n")

    # Build the prompt
    prompt = f"""
Gere um carrossel Instagram de alta conversão com os seguintes detalhes:

**TÓPICO:** {topic}

**PÚBLICO-ALVO:** {target_audience}
{f"**TOM:** {tone}" if tone else ""}
{f"**TIPO PREFERIDO:** {carousel_type}" if carousel_type else "**TIPO:** (você decide o melhor)"}

**ETAPAS:**
1. Analise o público e contexto (1 parágrafo)
2. Recomende/confirme tipo de carrossel
3. Gere copy completo slide-por-slide com:
   - Número do slide
   - Headline (máx 20 caracteres)
   - Copy principal (máx 150 caracteres)
   - CTA (se aplicável)
4. Resumo executivo: por que este carrossel vai converter

Foque em: narrativa clara, minimalismo, autoridade + ação.
"""

    # Create session (requires pre-created agent)
    session = client.beta.sessions.create(
        agent={"type": "agent", "id": agent_id},
        environment_id=env_id,
        title=f"Carousel: {topic[:40]}",
    )
    print(f"🔗 Session: {session.id}\n")

    # Stream events
    print("=" * 60)
    print("📝 CAROUSEL COPY\n")

    with client.beta.sessions.stream(session_id=session.id) as stream:
        # Send the message
        client.beta.sessions.events.send(
            session_id=session.id,
            events=[
                {
                    "type": "user.message",
                    "content": [{"type": "text", "text": prompt}],
                }
            ],
        )

        # Stream and display events
        for event in stream:
            if event.type == "agent.message":
                for block in event.content:
                    if block.type == "text":
                        print(block.text, end="", flush=True)

            elif event.type == "session.status_idle":
                print("\n\n" + "=" * 60)
                break

            elif event.type == "session.status_terminated":
                break

    print("\n✅ Carousel generated!\n")
    return session.id


def refine_carousel(session_id: str, feedback: str):
    """
    Refine an existing carousel within the same session
    Leverages session context and cache
    """
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    print(f"\n🔄 Refining carousel...\n")

    with client.beta.sessions.stream(session_id=session_id) as stream:
        client.beta.sessions.events.send(
            session_id=session_id,
            events=[
                {
                    "type": "user.message",
                    "content": [{"type": "text", "text": f"Refine com feedback:\n{feedback}"}],
                }
            ],
        )

        for event in stream:
            if event.type == "agent.message":
                for block in event.content:
                    if block.type == "text":
                        print(block.text, end="", flush=True)

            elif event.type == "session.status_idle":
                print("\n")
                break


def interactive_session():
    """Interactive carousel generation with refinements"""
    # Load or create agent/env
    env_id = os.environ.get("CAROUSEL_ENV_ID")
    agent_id = os.environ.get("CAROUSEL_AGENT_ID")

    if not env_id or not agent_id:
        print("⚠️  Agent/Environment IDs not found in environment.")
        print("Run setup first:\n")
        print("   python carousel_agent_managed.py --setup\n")
        setup_data = setup_environment()
        env_id = setup_data["environment_id"]
        agent_id = setup_data["agent_id"]

    print("=" * 60)
    print("🎡 CAROUSEL COPY GENERATOR - Managed Agent")
    print("=" * 60)
    print()

    # Get topic and audience
    topic = input("1. Qual é o tópico/oferta? ").strip()
    if not topic:
        print("❌ Required.")
        return

    audience = input("2. Público-alvo? ").strip()
    if not audience:
        print("❌ Required.")
        return

    tone = input("3. Tom? (casual/profissional/urgente) [Enter para auto]: ").strip() or None
    carousel_type = input("4. Tipo? (transformação/autoridade/ideológico/educacional/vendas) [Enter para auto]: ").strip() or None

    # Generate
    session_id = run_carousel_session(
        topic=topic,
        target_audience=audience,
        env_id=env_id,
        agent_id=agent_id,
        tone=tone,
        carousel_type=carousel_type,
    )

    # Refinement loop
    while True:
        choice = input("\n[1] Refinar | [2] Salvar | [3] Sair? ").strip()

        if choice == "1":
            feedback = input("Qual é o feedback? ").strip()
            if feedback:
                refine_carousel(session_id, feedback)

        elif choice == "2":
            filename = f"carousel_{topic[:20].replace(' ', '_')}.md"
            print(f"✅ Session saved: {session_id}")
            print(f"📁 Reference: {filename}")
            break

        elif choice == "3":
            break


if __name__ == "__main__":
    import sys

    if "--setup" in sys.argv:
        setup_environment()
    else:
        interactive_session()
