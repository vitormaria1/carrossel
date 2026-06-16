import { NextRequest, NextResponse } from 'next/server';
import { sendImageToN8nWebhook } from '@/lib/n8n-webhook';

interface UploadImageRequest {
  base64: string;
  cardIndex: number;
  cardHeadline?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UploadImageRequest;

    if (!body.base64) {
      return NextResponse.json({ error: 'base64 é obrigatório' }, { status: 400 });
    }

    const url = await sendImageToN8nWebhook(
      body.base64,
      body.cardIndex ?? 0,
      body.cardHeadline || 'Card'
    );

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload image error:', error);
    const message = error instanceof Error ? error.message : 'Falha ao enviar imagem';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
