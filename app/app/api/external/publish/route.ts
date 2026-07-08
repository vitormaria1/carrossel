import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { assertExternalApiAuthorized } from '@/lib/external-api';
import { type ServerCarouselTemplate } from '@/lib/server-card-render';
import { publishCarouselWithUrls } from '@/lib/instagram-publish';
import { uploadBase64Images } from '@/lib/publish-images';

interface ExternalPublishSlide {
  id: string;
  text: string;
  headline?: string;
  cta?: string;
  caption?: string;
  colors?: { bg: string; text: string; accent?: string };
}

interface ExternalPublishRequest {
  instagramAccountId?: string;
  slides?: ExternalPublishSlide[];
  cards?: ExternalPublishSlide[];
  caption: string;
  carouselTemplate?: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
  renderTemplate?: ServerCarouselTemplate;
  imageUrls?: string[];
  base64Images?: string[];
}

async function renderAndUploadCards(
  requestUrl: string,
  authorization: string,
  cards: ExternalPublishSlide[],
  renderTemplate: ServerCarouselTemplate
): Promise<string[]> {
  const { env } = getCloudflareContext();
  const worker = env.WORKER_SELF_REFERENCE;

  if (!worker?.fetch) {
    throw new Error(
      'WORKER_SELF_REFERENCE não está configurado. Essa rota depende do binding de serviço para renderizar os cards.'
    );
  }

  const urls: string[] = [];

  for (const [index, card] of cards.entries()) {
    const targetUrl = new URL('/api/external/render-upload-card', requestUrl).toString();
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization,
      },
      body: JSON.stringify({ card, renderTemplate }),
    } as const;

    let response: Response;
    try {
      response = await worker.fetch(targetUrl, init);
    } catch (error) {
      console.warn(`worker.fetch falhou para render-upload-card, usando fetch direto:`, error);
      response = await fetch(targetUrl, init);
    }

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : { error: await response.text() };

    if (!response.ok) {
      throw new Error(String((data as { error?: string }).error || `Falha ao renderizar card ${index + 1}`));
    }

    if (!data?.url) {
      throw new Error(`render-upload-card não retornou URL para o card ${index + 1}`);
    }

    urls.push(data.url);
  }

  return urls;
}

export async function POST(request: NextRequest) {
  try {
    assertExternalApiAuthorized(request);
    const { ctx } = getCloudflareContext();

    const body = (await request.json()) as ExternalPublishRequest;
    const slides = body.slides || body.cards || [];

    if (!slides.length) {
      return NextResponse.json({ error: 'slides ou cards é obrigatório' }, { status: 400 });
    }

    const hasImageUrls = Array.isArray(body.imageUrls) && body.imageUrls.length > 0;
    const hasBase64Images = Array.isArray(body.base64Images) && body.base64Images.length > 0;
    const hasCards = Array.isArray(body.cards) && body.cards.length > 0;

    if (!hasImageUrls && !hasBase64Images && !hasCards) {
      return NextResponse.json(
        { error: 'Forneça imageUrls, base64Images ou cards para publicação externa' },
        { status: 400 }
      );
    }

    const shouldQueueInProduction = process.env.NODE_ENV === 'production' && (hasBase64Images || hasCards);
    const jobId = `pub-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const runPublishJob = async () => {
      let imageUrls = body.imageUrls || [];

      if (hasBase64Images) {
        if (body.base64Images!.length !== slides.length) {
          throw new Error('base64Images deve ter a mesma quantidade de slides');
        }

        imageUrls = await uploadBase64Images(
          body.base64Images!,
          slides.map((slide) => slide.headline)
        );
      } else if (hasCards) {
        const renderTemplate = body.renderTemplate || 'tweet';
        imageUrls = await renderAndUploadCards(
          request.url,
          request.headers.get('authorization') || '',
          body.cards!,
          renderTemplate
        );
      }

      if (imageUrls.length !== slides.length) {
        throw new Error('imageUrls deve ter a mesma quantidade de slides');
      }

      const published = await publishCarouselWithUrls({
        slides,
        caption: body.caption || '',
        imageUrls,
        carouselTemplate: body.carouselTemplate,
        instagramAccountId: body.instagramAccountId,
      });

      return {
        success: true,
        postId: published.postId,
        url: published.url,
        imageUrls,
      };
    };

    if (shouldQueueInProduction) {
      ctx.waitUntil(
        runPublishJob().catch((error) => {
          console.error(`[${jobId}] publish falhou:`, error);
        })
      );

      return NextResponse.json(
        {
          success: true,
          queued: true,
          jobId,
          message: 'Publicação recebida e processamento iniciado.',
        },
        { status: 202 }
      );
    }

    const result = await runPublishJob();
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'UnauthorizedError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const message = error instanceof Error ? error.message : 'Falha ao publicar externamente';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
