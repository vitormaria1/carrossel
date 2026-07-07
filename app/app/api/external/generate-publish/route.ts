import { NextRequest, NextResponse } from 'next/server';
import { assertExternalApiAuthorized } from '@/lib/external-api';
import { generateCarouselWithAgent, generateCarouselFallback } from '@/lib/managed-agent';
import {
  IDEOLOGICO_DETALHADO_ICP,
  IDEOLOGICO_DETALHADO_INSTRUCTIONS,
  getDesignColors,
  type CarouselType,
} from '@/lib/davi-narrative';
import { renderCardToBase64Server, type ServerCarouselTemplate } from '@/lib/server-card-render';
import { uploadBase64Images } from '@/lib/publish-images';
import { publishCarouselWithUrls } from '@/lib/instagram-publish';

interface GeneratePublishRequest {
  idea: string;
  totalCards: number;
  carouselType?: CarouselType | 'auto';
  carouselTemplate?: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
  instagramAccountId?: string;
  caption?: string;
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

    const body = (await request.json()) as GeneratePublishRequest;
    const idea = body.idea?.trim();
    const totalCards = Number(body.totalCards);
    const carouselType = resolveCarouselType(body.carouselType);
    const carouselTemplate: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria' =
      body.carouselTemplate || 'tweet';
    const renderTemplate: ServerCarouselTemplate =
      carouselTemplate === 'standard'
        ? 'standard'
        : 'tweet';

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
    const enrichedCards = cards.map((card, idx) => ({
      ...card,
      colors: {
        bg: colors.bg,
        text: colors.text,
        accent: colors.accent,
      },
      carouselType,
      cardIndex: idx,
      totalCards,
    }));

    const base64Images = await Promise.all(
      enrichedCards.map((card) => renderCardToBase64Server(card, renderTemplate))
    );

    const imageUrls = await uploadBase64Images(
      base64Images,
      enrichedCards.map((card) => card.headline)
    );

    const published = await publishCarouselWithUrls({
      slides: enrichedCards,
      caption: buildCaption(idea, body.caption),
      imageUrls,
      carouselTemplate,
      instagramAccountId: body.instagramAccountId,
    });

    return NextResponse.json({
      success: true,
      postId: published.postId,
      url: published.url,
      cards: enrichedCards,
      imageUrls,
      carouselTemplate,
      renderTemplate,
      carouselType,
      generatedAt: new Date().toISOString(),
      prompt: {
        fixed: [
          'Generate carrossel using ideologico_detalhado as fixed mode',
          IDEOLOGICO_DETALHADO_ICP,
          IDEOLOGICO_DETALHADO_INSTRUCTIONS,
        ],
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'UnauthorizedError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const message = error instanceof Error ? error.message : 'Falha ao gerar e publicar';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
