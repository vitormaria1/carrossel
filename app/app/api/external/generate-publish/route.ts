import { NextRequest, NextResponse } from 'next/server';
import { assertExternalApiAuthorized } from '@/lib/external-api';
import { type CarouselType } from '@/lib/davi-narrative';
import type { ServerCarouselTemplate } from '@/lib/server-card-render';

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

function resolveRenderTemplate(
  value?: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria'
): ServerCarouselTemplate {
  if (value === 'standard') return 'standard';
  if (value === 'tweetExpanded') return 'tweetExpanded';
  return 'tweet';
}

async function postJsonFromSelf<T>(
  worker: { fetch: typeof fetch },
  path: string,
  requestUrl: string,
  payload: unknown,
  authorization: string
): Promise<T> {
  const targetUrl = new URL(path, requestUrl).toString();
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization,
    },
    body: JSON.stringify(payload),
  } as const;

  let response: Response;
  try {
    response = await worker.fetch(targetUrl, init);
  } catch (error) {
    console.warn(`worker.fetch falhou para ${path}, usando fetch direto:`, error);
    response = await fetch(targetUrl, init);
  }

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

    const body = (await request.json()) as GeneratePublishRequest;
    const idea = body.idea?.trim();
    const totalCards = Number(body.totalCards);
    const carouselType = resolveCarouselType(body.carouselType);
    const carouselTemplate = body.carouselTemplate || 'tweet';
    const renderTemplate = resolveRenderTemplate(carouselTemplate);

    if (!idea) {
      return NextResponse.json({ error: 'idea é obrigatório' }, { status: 400 });
    }

    if (!Number.isFinite(totalCards) || totalCards < 1 || totalCards > 10) {
      return NextResponse.json(
        { error: 'totalCards deve estar entre 1 e 10' },
        { status: 400 }
      );
    }

    const generated = await postJsonFromSelf<{
      success: boolean;
      cards: Array<Record<string, unknown>>;
      caption: string;
      carouselTemplate: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
      carouselType: CarouselType;
    }>(
      { fetch },
      '/api/external/generate',
      request.url,
      {
        idea,
        totalCards,
        carouselType,
        carouselTemplate,
        caption: body.caption,
      },
      request.headers.get('authorization') || ''
    );

    const published = await postJsonFromSelf<{
      success: boolean;
      postId: string;
      url: string;
      imageUrls: string[];
    }>(
      { fetch },
      '/api/external/publish',
      request.url,
      {
        cards: generated.cards,
        caption: generated.caption,
        carouselTemplate: generated.carouselTemplate,
        renderTemplate,
        instagramAccountId: body.instagramAccountId,
      },
      request.headers.get('authorization') || ''
    );

    return NextResponse.json({
      success: true,
      postId: published.postId,
      url: published.url,
      cards: generated.cards,
      imageUrls: published.imageUrls,
      carouselTemplate: generated.carouselTemplate,
      renderTemplate,
      carouselType: generated.carouselType,
      generatedAt: new Date().toISOString(),
      publishEndpoint: '/api/external/publish',
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'UnauthorizedError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const message = error instanceof Error ? error.message : 'Falha ao gerar e publicar';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
