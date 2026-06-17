import { NextRequest, NextResponse } from 'next/server';
import { sendImageToN8nWebhook } from '@/lib/n8n-webhook';
import { publishCarouselWithUrls } from '@/lib/instagram-publish';

function addCORSHeaders(response: NextResponse): NextResponse {
  const origin = process.env.NODE_ENV === 'development' ? '*' : 'http://localhost:3000';

  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}

export async function OPTIONS() {
  return addCORSHeaders(new NextResponse(null, { status: 200 }));
}

interface CarouselSlide {
  id: string;
  text: string;
  headline: string;
  cta?: string;
  colors?: { bg: string; text: string };
  caption?: string;
}

interface PublishRequest {
  instagramAccountId?: string;
  slides: CarouselSlide[];
  caption: string;
  carouselTemplate?: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
  imageUrls?: string[];
  base64Images?: string[];
}

interface PublishFormRequest {
  slides?: string;
  caption?: string;
  carouselTemplate?: string;
  instagramAccountId?: string;
}

interface EnrichedSlide extends CarouselSlide {
  colors?: { bg: string; text: string; accent?: string };
  carouselType?: string;
  cardIndex?: number;
  totalCards?: number;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: PublishRequest;
    let uploadedImages: File[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const slidesRaw = formData.get('slides')?.toString() || '[]';
      const formPayload: PublishFormRequest = {
        slides: slidesRaw,
        caption: formData.get('caption')?.toString(),
        carouselTemplate: formData.get('carouselTemplate')?.toString(),
        instagramAccountId: formData.get('instagramAccountId')?.toString(),
      };

      let parsedSlides: CarouselSlide[] = [];
      try {
        parsedSlides = JSON.parse(formPayload.slides || '[]');
      } catch {
        return NextResponse.json({ error: 'Payload de slides inválido' }, { status: 400 });
      }

      body = {
        instagramAccountId: formPayload.instagramAccountId,
        slides: parsedSlides,
        caption: formPayload.caption || '',
        carouselTemplate: formPayload.carouselTemplate as PublishRequest['carouselTemplate'],
      };

      uploadedImages = formData
        .getAll('images')
        .filter((item): item is File => item instanceof File);
    } else {
      body = (await request.json()) as PublishRequest;
    }

    if (!body.slides || body.slides.length === 0) {
      return NextResponse.json({ error: 'Nenhum slide fornecido' }, { status: 400 });
    }

    if (body.slides.length > 10) {
      return NextResponse.json({ error: 'Máximo de 10 slides por carrossel' }, { status: 400 });
    }

    let base64Images = body.base64Images || [];
    const imageUrls = body.imageUrls || [];

    if (imageUrls.length > 0 && imageUrls.length === body.slides.length) {
      base64Images = [];
    }

    if (uploadedImages.length > 0) {
      base64Images = await Promise.all(
        uploadedImages.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          return buffer.toString('base64');
        })
      );
    }

    if (imageUrls.length === 0 && (!base64Images || base64Images.length !== body.slides.length)) {
      return NextResponse.json(
        { error: 'Imagens não fornecidas ou quantidade incorreta' },
        { status: 400 }
      );
    }

    const template = body.carouselTemplate || 'standard';
    const publicImageUrls: string[] = [];

    for (let i = 0; i < body.slides.length; i++) {
      if (imageUrls.length > 0) {
        publicImageUrls.push(imageUrls[i]);
        continue;
      }

      const slide = body.slides[i] as EnrichedSlide;
      const base64 = base64Images[i];
      const publicImageUrl = await sendImageToN8nWebhook(base64, i, slide.headline || 'Card');
      publicImageUrls.push(publicImageUrl);
    }

    const published = await publishCarouselWithUrls({
      slides: body.slides,
      caption: body.caption || '',
      imageUrls: publicImageUrls,
      carouselTemplate: template,
      instagramAccountId: body.instagramAccountId,
    });

    return addCORSHeaders(
      NextResponse.json({
        success: true,
        postId: published.postId,
        url: published.url,
        message: 'Carrossel publicado com sucesso!',
      })
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao publicar';
    const details = process.env.NODE_ENV === 'development' ? error?.toString() : undefined;

    return addCORSHeaders(
      NextResponse.json(
        {
          error: errorMessage,
          details,
        },
        { status: 500 }
      )
    );
  }
}
