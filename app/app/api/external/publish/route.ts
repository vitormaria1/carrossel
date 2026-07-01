import { NextRequest, NextResponse } from 'next/server';
import { assertExternalApiAuthorized } from '@/lib/external-api';
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
  slides: ExternalPublishSlide[];
  caption: string;
  carouselTemplate?: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
  imageUrls?: string[];
  base64Images?: string[];
}

export async function POST(request: NextRequest) {
  try {
    assertExternalApiAuthorized(request);

    const body = (await request.json()) as ExternalPublishRequest;

    if (!body.slides?.length) {
      return NextResponse.json({ error: 'slides é obrigatório' }, { status: 400 });
    }

    const hasImageUrls = Array.isArray(body.imageUrls) && body.imageUrls.length > 0;
    const hasBase64Images = Array.isArray(body.base64Images) && body.base64Images.length > 0;

    if (!hasImageUrls && !hasBase64Images) {
      return NextResponse.json(
        { error: 'Forneça imageUrls ou base64Images para publicação externa' },
        { status: 400 }
      );
    }

    let imageUrls = body.imageUrls || [];

    if (hasBase64Images) {
      if (body.base64Images!.length !== body.slides.length) {
        return NextResponse.json(
          { error: 'base64Images deve ter a mesma quantidade de slides' },
          { status: 400 }
        );
      }

      imageUrls = await uploadBase64Images(
        body.base64Images!,
        body.slides.map((slide) => slide.headline)
      );
    }

    if (imageUrls.length !== body.slides.length) {
      return NextResponse.json(
        { error: 'imageUrls deve ter a mesma quantidade de slides' },
        { status: 400 }
      );
    }

    const published = await publishCarouselWithUrls({
      slides: body.slides,
      caption: body.caption || '',
      imageUrls,
      carouselTemplate: body.carouselTemplate,
      instagramAccountId: body.instagramAccountId,
    });

    return NextResponse.json({
      success: true,
      postId: published.postId,
      url: published.url,
      imageUrls,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'UnauthorizedError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const message = error instanceof Error ? error.message : 'Falha ao publicar externamente';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
