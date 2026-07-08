import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { assertExternalApiAuthorized } from '@/lib/external-api';
import { generateCarouselWithAgent, generateCarouselFallback } from '@/lib/managed-agent';
import {
  IDEOLOGICO_DETALHADO_ICP,
  IDEOLOGICO_DETALHADO_INSTRUCTIONS,
  getDesignColors,
  type CarouselType,
} from '@/lib/davi-narrative';
import type { ServerCarouselTemplate } from '@/lib/server-card-render';

interface GeneratePublishRequest {
  idea: string;
  totalCards: number;
  carouselType?: CarouselType | 'auto';
  carouselTemplate?: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
  instagramAccountId?: string;
  caption?: string;
}

interface GeneratedPublishSlide {
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

interface RenderUploadResponse {
  url: string;
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

async function postJsonFromSelf<T>(
  worker: { fetch: typeof fetch },
  path: string,
  requestUrl: string,
  payload: unknown,
  authorization: string
): Promise<T> {
  const response = await worker.fetch(
    new Request(new URL(path, requestUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization,
      },
      body: JSON.stringify(payload),
    })
  );

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : { error: await response.text() };

  if (!response.ok) {
    throw new Error(String((data as { error?: string }).error || `Falha em ${path}`));
  }

  return data as T;
}

export async function POST(request: NextRequest) {
  try {
    assertExternalApiAuthorized(request);
    const { env } = getCloudflareContext();
    const worker = env.WORKER_SELF_REFERENCE;

    if (!worker?.fetch) {
      return NextResponse.json(
        {
          error:
            'WORKER_SELF_REFERENCE não está configurado. Essa rota depende do binding de serviço para dividir a execução.',
        },
        { status: 500 }
      );
    }

    const authorization = request.headers.get('authorization') || '';

    const body = (await request.json()) as GeneratePublishRequest;
    const idea = body.idea?.trim();
    const totalCards = Number(body.totalCards);
    const carouselType = resolveCarouselType(body.carouselType);
    const carouselTemplate: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria' =
      body.carouselTemplate || 'tweet';
    const renderTemplate: ServerCarouselTemplate =
      carouselTemplate === 'standard'
        ? 'standard'
        : carouselTemplate === 'tweetExpanded'
          ? 'tweetExpanded'
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
    const enrichedCards: GeneratedPublishSlide[] = cards.map((card, idx) => ({
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

    const imageUrls: string[] = [];

    for (const card of enrichedCards) {
      const uploadResult = await postJsonFromSelf<RenderUploadResponse>(
        worker,
        '/api/external/render-upload-card',
        request.url,
        {
          card,
          renderTemplate,
        },
        authorization
      );

      imageUrls.push(uploadResult.url);
    }

    const published = await postJsonFromSelf<{ success: boolean; postId: string; url: string }>(
      worker,
      '/api/publish-instagram',
      request.url,
      {
        instagramAccountId: body.instagramAccountId,
        slides: enrichedCards,
        caption: buildCaption(idea, body.caption),
        carouselTemplate,
        imageUrls,
      },
      authorization
    );

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
