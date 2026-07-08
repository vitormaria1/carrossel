import { NextRequest, NextResponse } from 'next/server';
import { assertExternalApiAuthorized } from '@/lib/external-api';
import { renderCardToBase64Server, type ServerCarouselTemplate } from '@/lib/server-card-render';
import { sendImageToN8nWebhook } from '@/lib/n8n-webhook';

interface RenderUploadCardRequest {
  card: {
    cardIndex?: number;
    headline?: string;
    text: string;
    cta?: string;
    colors: { bg: string; text: string; accent?: string };
    imageUrl?: string;
  };
  renderTemplate?: ServerCarouselTemplate;
}

export async function POST(request: NextRequest) {
  try {
    assertExternalApiAuthorized(request);

    const body = (await request.json()) as RenderUploadCardRequest;

    if (!body.card?.text) {
      return NextResponse.json({ error: 'card é obrigatório' }, { status: 400 });
    }

    const renderTemplate = body.renderTemplate || 'tweet';
    const base64 = await renderCardToBase64Server(body.card, renderTemplate);
    const url = await sendImageToN8nWebhook(
      base64,
      body.card.cardIndex ?? 0,
      body.card.headline || 'Card'
    );

    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof Error && error.name === 'UnauthorizedError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const message = error instanceof Error ? error.message : 'Falha ao renderizar e enviar card';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
