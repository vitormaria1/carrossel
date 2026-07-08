import { NextRequest, NextResponse } from 'next/server';
import { assertExternalApiAuthorized } from '@/lib/external-api';
import {
  renderCardToBase64Server,
  type ServerCarouselTemplate,
} from '@/lib/server-card-render';
import { publishCarouselWithUrls } from '@/lib/instagram-publish';
import { uploadBase64Images } from '@/lib/publish-images';
import { sendImageToN8nWebhook } from '@/lib/n8n-webhook';

interface ExternalPublishSlide {
  id: string;
  text: string;
  headline?: string;
  cta?: string;
  caption?: string;
  colors?: { bg: string; text: string; accent?: string };
  cardIndex?: number;
  totalCards?: number;
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
  cards: ExternalPublishSlide[],
  renderTemplate: ServerCarouselTemplate
): Promise<string[]> {
  const urls: string[] = [];

  for (const [index, card] of cards.entries()) {
    const base64 = await renderCardToBase64Server(
      {
        ...card,
        colors: card.colors || { bg: '#FFFFFF', text: '#0C1014', accent: '#405DE6' },
      },
      renderTemplate
    );
    const url = await sendImageToN8nWebhook(
      base64,
      card.cardIndex ?? index,
      card.headline || 'Card'
    );

    urls.push(url);
  }

  return urls;
}

export async function POST(request: NextRequest) {
  try {
    assertExternalApiAuthorized(request);

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
        imageUrls = await renderAndUploadCards(body.cards!, renderTemplate);
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
