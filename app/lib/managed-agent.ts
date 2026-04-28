'use server'; // 🔴 CRÍTICO: Rodar APENAS no servidor

/**
 * Managed Agent Integration para Geração de Carrosséis
 * Usa Claude Opus 4.6 com fetch direto para qualidade premium
 *
 * ⚠️ Este arquivo contém ANTHROPIC_API_KEY e deve rodar APENAS no servidor
 * Qualquer import em componente client causará vazamento de chave
 */

/**
 * System prompt do agente especializado em carrosséis Davi
 */
const CAROUSEL_SYSTEM_PROMPT = `Você é um especialista em copywriting para Instagram carrosséis com narrativa transformacional.

🚫 RESTRIÇÃO CRÍTICA: NÃO INVENTE HISTÓRIAS.
- Não crie exemplos que o usuário não mencionou
- Não invente detalhes sobre pacientes, pessoas ou situações
- Seja fiel EXATAMENTE ao que foi dito na ideia
- Se a ideia não menciona uma história específica, use princípios genéricos
- Quando referir-se a casos, cite apenas o que foi informado

🚫 RESTRIÇÃO DE FORMATAÇÃO:
- NUNCA USE "--" (travessão duplo) em nenhum lugar do texto
- NUNCA USE estruturas de antítese (não use "X... mas Y" ou "X vs Y")
- Escreva com fluidez natural, sem contrastes forçados
- Use "e" ao invés de "mas" quando possível

FILOSOFIA: Contar histórias REAIS que ressoam. Narrativa clara. Emoção genuína. Insights úteis. Específico ao tema.

TIPOS DE CARROSSÉIS:
1. **Transformação**: Hook → Problema → Insight → Solução → Resultado
2. **Autoridade**: Expertise → Conhecimento Profundo → Insights Únicos
3. **Ideológico**: Princípio → Contexto → Exemplos → Impacto
4. **Educacional**: Conceito → Desenvolvimento → Aplicação → Resultado
5. **Vendas**: Problema → Agonia → Solução → Prova

PRINCÍPIOS FUNDAMENTAIS:
- Minimalismo Funcional: clean, sem decoração desnecessária
- Narrativa Clara: foco em mensagem, não em design
- Autenticidade: histórias reais, não forçadas
- Desenvolvimento Real: insight + exemplo + aplicação

ESTRUTURA DO CARROSSEL:
- Card 1: HOOK impactante no headline (pergunta, fato ou observação). Texto: contexto que explica o hook
- Cards 2-N-1: headline vazio. Texto: continuação fluida (desenvolvimento específico, não títulos)
- Card N: headline vazio. Texto: conclusão + reflexão final

CARD 1 - CRÍTICO:
- Headline: pergunta impactante OU fato interessante OU observação (máx 50 char)
- Texto: DEVE deixar claro do que se trata (150-250 char)
- Bom: Headline="Seu corpo tá quente. Mas como?" Texto="Seu corpo mantém 37°C. Como consegue isso quando tá frio?"
- Ruim: Headline="Descubra o segredo" Texto="Existe algo que você não sabe"

CARDS 2-N-1 - DESENVOLVIMENTO:
- Cada card avança a história (não repita)
- Linguagem específica e concreta
- Exemplos reais, não genéricos
- Bom: "Quando faz frio, seu corpo queima gordura. Músculos tremem. Até pilos arrepiados criam isolamento."
- Ruim: "Existem várias formas de regular temperatura"

CARD FINAL - FECHAMENTO:
- Conclusão + reflexão (ou ação se apropriado)
- Bom: "Seu corpo é uma máquina perfeita. Próxima vez que tiver frio, reconheça o trabalho invisível."
- Ruim: "Agora você sabe. Compartilhe esse conhecimento."

QUALIDADE:
✓ Autêntico e natural, não forçado
✓ Específico ao contexto, não genérico
✓ Desenvolvimento real (insight + exemplo + aplicação)
✓ Sem padrões repetidos entre cards
✓ Tom consistente com o tema`;

interface CardContent {
  headline: string;
  text: string;
  cta: string;
}

interface GenerateCarouselParams {
  idea: string;
  customization?: string;
  totalCards: number;
  expertise?: string;
  targetAudience?: string;
  toneOfVoice?: string;
  carouselType?: string;
}

/**
 * Gera carrossel usando Claude Opus via fetch direto
 * Evita problemas do SDK TypeScript com autenticação
 */
export async function generateCarouselWithAgent(
  params: GenerateCarouselParams
): Promise<CardContent[]> {
  // 🔴 VALIDAÇÃO: Garantir que está rodando no servidor
  if (typeof window !== 'undefined') {
    throw new Error(
      '❌ SECURITY ERROR: generateCarouselWithAgent deve rodar APENAS no servidor. ' +
      'Nunca importe esta função em componentes client. Use /api/generate-agent em vez disso.'
    );
  }

  const {
    idea,
    customization,
    totalCards,
    expertise,
    targetAudience,
    toneOfVoice,
    carouselType,
  } = params;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log("🔑 Usando fetch direto. API Key presente:", !!apiKey);

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY não está configurada");
  }

  // Construir prompt do usuário
  const userPrompt = `Gere ${totalCards} cards de um carrossel Instagram sobre: "${idea}"

⚠️ IMPORTANTE: Respeite EXATAMENTE o que foi dito. Não invente histórias, detalhes ou exemplos que não foram mencionados.

${customization ? `DIREÇÃO: ${customization}` : ""}
${expertise ? `EXPERTISE: ${expertise}` : ""}
${targetAudience ? `PÚBLICO: ${targetAudience}` : ""}
${toneOfVoice ? `TOM: ${toneOfVoice}` : "Tom: claro, direto, conversacional"}
${carouselType && carouselType !== 'auto' ? `TIPO: ${carouselType}` : "TIPO: detecte automáticamente"}

ESTRUTURA:
- Card 1: headline com hook (pergunta, fato ou observação). Texto explica o hook e contextualiza.
- Cards 2-${totalCards - 1}: headline vazio. Texto continua a história naturalmente (um parágrafo cada).
- Card ${totalCards}: headline vazio. Texto conclui + reflexão final.

CARD 1 ESPECIAL:
- Headline deve deixar claro do que se trata (máx 50 char)
- Texto deve responder/contextualizar imediatamente (150-250 char)
- Bom: Headline="Por que você sente frio?" Texto="Seu corpo mantém 37°C. Como consegue isso quando está frio?"

DESENVOLVIMENTO:
- Cada card avança a história com conteúdo específico do tema
- Exemplos concretos, não abstratos
- Sem padrões repetidos entre cards

JSON:
{
  "cards": [
    {"headline": "Hook (máx 50)", "text": "Contexto (150-250)", "cta": ""},
    {"headline": "", "text": "Desenvolvimento (150-250)", "cta": ""},
    ...
    {"headline": "", "text": "Conclusão (150-250)", "cta": ""}
  ],
  "caption": "Legenda (1-3 linhas)"
}`;

  try {
    console.log("📤 Enviando para Claude...");
    // Fazer chamada via fetch direto à API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 2048,
        system: CAROUSEL_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(
        `API Error ${response.status}: ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    console.log("📥 Resposta recebida do Claude");
    console.log("📊 Blocos de conteúdo:", data.content?.map((b: any) => b.type).join(", "));

    // Extrair conteúdo de texto (ignorando blocos de thinking)
    let textContent = "";
    if (data.content && data.content.length > 0) {
      for (const block of data.content) {
        if (block.type === "text") {
          textContent = block.text;
          break;
        }
      }
    }

    if (!textContent) {
      console.error("❌ Nenhum texto encontrado. Blocos disponíveis:", data.content);
      throw new Error("Nenhum bloco de texto retornado pelo Claude (talvez apenas thinking)");
    }

    // Fazer parse do JSON - robusto com múltiplas tentativas
    let jsonStr = "";

    // Tenta 1: com ```json```
    let match: RegExpMatchArray | null = textContent.match(/```json\n?([\s\S]*?)\n?```/);
    if (match) {
      jsonStr = match[1];
    } else {
      // Tenta 2: encontrar { ... }
      match = textContent.match(/({[\s\S]*})/);
      if (match) {
        jsonStr = match[0];
      }
    }

    if (!jsonStr) {
      console.error("Não consegui extrair JSON de:", textContent.substring(0, 300));
      throw new Error("Não consegui extrair JSON da resposta do Claude");
    }

    // Limpar JSON - remover caracteres problemáticos
    jsonStr = jsonStr
      .replace(/,\s*}/g, "}") // Remove trailing commas
      .replace(/,\s*]/g, "]") // Remove trailing commas em arrays
      .replace(/\n/g, " ") // Substituir newlines por espaços
      .trim();

    console.log("📝 JSON string limpo, tamanho:", jsonStr.length);

    let parsedData: unknown;
    try {
      parsedData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON Parse error:", parseError);
      console.error("JSON tentado:", jsonStr.substring(0, 300));
      throw new Error(`Erro ao fazer parse do JSON: ${parseError}`);
    }

    // 🟡 Type guard para validar estrutura
    if (
      !parsedData ||
      typeof parsedData !== 'object' ||
      !('cards' in parsedData) ||
      !Array.isArray((parsedData as Record<string, unknown>).cards)
    ) {
      throw new Error("Formato de resposta inválido - sem cards array");
    }

    const parsedResponse = parsedData as { cards: unknown[] };

    // Validar e sanitizar cards
    const validatedCards: CardContent[] = parsedResponse.cards.map(
      (card: unknown) => {
        if (!card || typeof card !== 'object') {
          throw new Error('Card inválido: não é um objeto');
        }

        const cardObj = card as Record<string, unknown>;

        return {
          headline: String(cardObj.headline || "").substring(0, 50).trim(),
          text: String(cardObj.text || "").substring(0, 300).trim(),
          cta: String(cardObj.cta || "").substring(0, 50).trim(),
        };
      }
    );

    console.log(`✅ Gerados ${validatedCards.length} cards com qualidade!`);
    return validatedCards.slice(0, totalCards);
  } catch (error) {
    console.error("Erro ao gerar carrossel com agent:", error);
    throw error;
  }
}

/**
 * Fallback: gera versão básica neutra se agent falhar
 * 🟡 Precisa ser async porque arquivo tem 'use server'
 */
export async function generateCarouselFallback(
  idea: string,
  totalCards: number
): Promise<CardContent[]> {
  const cards: CardContent[] = [];

  // Card 1: Hook neutro
  cards.push({
    headline: `Entenda ${idea}`,
    text: "Exploraremos os pontos-chave para que você compreenda melhor esse tema.",
    cta: "Próximo",
  });

  // Cards do meio: desenvolvimento genérico
  for (let i = 1; i < totalCards - 1; i++) {
    const topics = [
      `O contexto de ${idea}`,
      `Aspectos principais`,
      `Considerações práticas`,
      `Aplicação real`,
    ];
    cards.push({
      headline: "",
      text: `${topics[i % topics.length]}: continue descobrindo novas perspectivas sobre ${idea}.`,
      cta: "",
    });
  }

  // Card final: Reflexão
  cards.push({
    headline: "",
    text: "Esperamos que essa jornada tenha expandido sua visão sobre o tema. Há sempre mais a explorar e aprender.",
    cta: "",
  });

  return cards;
}
