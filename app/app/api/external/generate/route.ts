import { NextRequest, NextResponse } from 'next/server';
import { assertExternalApiAuthorized } from '@/lib/external-api';
import { generateCarouselWithAgent, generateCarouselFallback } from '@/lib/managed-agent';
import {
  IDEOLOGICO_DETALHADO_ICP,
  IDEOLOGICO_DETALHADO_INSTRUCTIONS,
  getDesignColors,
  type CarouselType,
} from '@/lib/davi-narrative';

interface GenerateRequest {
  idea: string;
  totalCards: number;
  carouselType?: CarouselType | 'auto';
  carouselTemplate?: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
  caption?: string;
}

interface GeneratedSlide {
  id: string;
  text: string;
  headline?: string;
  cta?: string;
  colors: {
    bg: string;
    text: string;
    accent: string;
  };
  carouselType: CarouselType;
  cardIndex: number;
  totalCards: number;
  imageType: 'html';
  order: number;
}

function resolveCarouselType(value?: CarouselType | 'auto'): CarouselType {
  if (value && value !== 'auto') return value;
  return 'ideologico_detalhado';
}

function buildCaption(idea: string, caption?: string): string {
  const trimmed = caption?.trim();
  if (trimmed) return trimmed;
  return `Confira este carrossel sobre ${idea.slice(0, 80).trim()}.`;
}

export async function POST(request: NextRequest) {
  try {
    assertExternalApiAuthorized(request);

    const body = (await request.json()) as GenerateRequest;
    const idea = body.idea?.trim();
    const totalCards = Number(body.totalCards);
    const carouselType = resolveCarouselType(body.carouselType);
    const carouselTemplate = body.carouselTemplate || 'tweet';

    if (!idea) {
      return NextResponse.json({ error: 'idea é obrigatório' }, { status: 400 });
    }

    if (!Number.isFinite(totalCards) || totalCards < 1 || totalCards > 10) {
      return NextResponse.json(
        { error: 'totalCards deve estar entre 1 e 10' },
        { status: 400 }
      );
    }

    let cards;
    try {
      cards = await generateCarouselWithAgent({
        idea,
        totalCards,
        carouselType,
      });
    } catch (error) {
      console.error('Agent falhou, usando fallback:', error);
      cards = await generateCarouselFallback(idea, totalCards);
    }

    const colors = getDesignColors(carouselType);
    const enrichedCards: GeneratedSlide[] = cards.map((card, idx) => ({
      id: `generated-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 10)}`,
      ...card,
      colors: {
        bg: colors.bg,
        text: colors.text,
        accent: colors.accent,
      },
      carouselType,
      cardIndex: idx,
      totalCards,
      imageType: 'html',
      order: idx,
    }));

    return NextResponse.json({
      success: true,
      cards: enrichedCards,
      caption: buildCaption(idea, body.caption),
      carouselTemplate,
      carouselType,
      totalCards,
      generatedAt: new Date().toISOString(),
      prompt: {
        fixed: [
          'Generate carrossel using ideologico_detalhado as fixed mode',
          IDEOLOGICO_DETALHADO_ICP,
          IDEOLOGICO_DETALHADO_INSTRUCTIONS,
        ],
      },
      publishEndpoint: '/api/external/publish',
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'UnauthorizedError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const message = error instanceof Error ? error.message : 'Falha ao gerar carrossel externamente';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
