import { NextRequest, NextResponse } from 'next/server';
import {
  createScheduledPostId,
  saveScheduledPost,
  type ScheduledCarouselSlide,
  type ScheduledPost,
} from '@/lib/scheduled-posts';

interface SchedulePublishRequest {
  slides: ScheduledCarouselSlide[];
  caption: string;
  carouselTemplate?: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
  imageUrls: string[];
  scheduledFor: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SchedulePublishRequest;
    const scheduledAt = new Date(body.scheduledFor);

    if (!body.slides?.length) {
      return NextResponse.json({ error: 'Nenhum slide fornecido' }, { status: 400 });
    }

    if (!body.imageUrls?.length || body.imageUrls.length !== body.slides.length) {
      return NextResponse.json({ error: 'Imagens inválidas para agendamento' }, { status: 400 });
    }

    if (Number.isNaN(scheduledAt.getTime())) {
      return NextResponse.json({ error: 'Data de agendamento inválida' }, { status: 400 });
    }

    if (scheduledAt.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: 'Escolha uma data e hora futura para agendar' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const id = createScheduledPostId();
    const scheduledPost: ScheduledPost = {
      id,
      slides: body.slides,
      caption: body.caption,
      carouselTemplate: body.carouselTemplate || 'standard',
      imageUrls: body.imageUrls,
      scheduledFor: scheduledAt.toISOString(),
      status: 'scheduled',
      createdAt: now,
      updatedAt: now,
    };

    await saveScheduledPost(scheduledPost);

    return NextResponse.json({
      success: true,
      scheduledPost,
      message: 'Publicação agendada com sucesso',
    });
  } catch (error) {
    console.error('Schedule publish error:', error);
    const message = error instanceof Error ? error.message : 'Erro ao agendar publicação';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
