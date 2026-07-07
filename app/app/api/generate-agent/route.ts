import { NextRequest, NextResponse } from "next/server";
import {
  generateCarouselWithAgent,
  generateCarouselFallback,
} from "@/lib/managed-agent";
import { getDesignColors, type CarouselType } from "@/lib/davi-narrative";

interface GenerateRequest {
  idea: string;
  customization?: string;
  totalCards?: number;
  expertise?: string;
  yearsExperience?: number;
  mainAchievement?: string;
  productName?: string;
  targetAudience?: string;
  toneOfVoice?: string;
  objective?: string;
  carouselType?: CarouselType | 'auto';
  carouselTemplate?: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateRequest;
    const idea = body.idea?.trim();
    const totalCards = body.totalCards ?? 6;
    const carouselType: CarouselType | 'auto' = body.carouselType && body.carouselType !== 'auto'
      ? body.carouselType
      : 'ideologico_detalhado';
    const carouselTemplate = body.carouselTemplate || 'standard';

    // Validação básica
    if (!idea) {
      return NextResponse.json({ error: 'idea é obrigatório' }, { status: 400 });
    }

    console.log(`📐 Template selecionado: ${carouselTemplate}`);

    // Chamar o agent para gerar copy de qualidade
    let cards;
    try {
      cards = await generateCarouselWithAgent({
        idea,
        customization: body.customization,
        totalCards,
        carouselType,
      });
    } catch (agentError) {
      console.error("Agent falhou, usando fallback:", agentError);
      // Se o agent falhar, usar fallback mas com qualidade aceitável
      cards = await generateCarouselFallback(idea, totalCards);
    }

    // Determinar tipo de carrossel e cores
    const detectedCarouselType: CarouselType = carouselType !== 'auto'
      ? carouselType
      : detectCarouselTypeFromIdea(idea);
    const colors = getDesignColors(detectedCarouselType);

    // Enriquecer cards com metadados de design
    const enrichedCards = cards.map((card, idx) => ({
      ...card,
      colors: {
        bg: colors.bg,
        text: colors.text,
        accent: colors.accent,
      },
      carouselType: detectedCarouselType,
      cardIndex: idx,
      totalCards,
    }));

    return NextResponse.json({
      cards: enrichedCards,
      carouselTemplate,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Generate agent error:", error);

    // 🟡 NÃO expor detalhes do erro em produção
    let message = "Erro ao gerar carrossel";
    if (process.env.NODE_ENV === 'development' && error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Detecta tipo de carrossel baseado na ideia
 */
function detectCarouselTypeFromIdea(idea: string) {
  const lower = idea.toLowerCase();

  if (/mudar|transfor|mude|vira|ficou|consegui|alcançar|jornada|resultado/i.test(lower)) {
    return "transformacao";
  }
  if (/aprendi|descobri|sistema|método|framework|estratégia|anos de|experiência|expert/i.test(lower)) {
    return "autoridade";
  }
  if (/acredito|verdade|mindset|filosofia|princípio|valor|essência|autenticidade/i.test(lower)) {
    return "ideologico";
  }
  if (/aprenda|entenda|conceito|como|técnica|passo|guia|tutorial|saiba/i.test(lower)) {
    return "educacional";
  }
  if (/problema|solução|preço|investir|oferta|limitado|agora|rápido/i.test(lower)) {
    return "vendas";
  }

  return "transformacao";
}
