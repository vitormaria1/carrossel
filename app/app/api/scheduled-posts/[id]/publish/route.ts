import { NextRequest, NextResponse } from 'next/server';
import { loadScheduledPost, updateScheduledPost } from '@/lib/scheduled-posts';
import { publishCarouselWithUrls } from '@/lib/instagram-publish';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await Promise.resolve(context.params);

    if (!id) {
      return NextResponse.json({ error: 'ID do agendamento ausente' }, { status: 400 });
    }

    const scheduledPost = await loadScheduledPost(id);

    if (!scheduledPost) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    if (scheduledPost.status === 'publishing') {
      return NextResponse.json(
        { error: 'Este agendamento já está em processo de publicação' },
        { status: 409 }
      );
    }

    if (scheduledPost.status === 'published') {
      return NextResponse.json(
        {
          success: true,
          postId: scheduledPost.postId,
          url: scheduledPost.url,
          message: 'Esse agendamento já foi publicado',
          scheduledPost,
        },
        { status: 200 }
      );
    }

    scheduledPost.status = 'publishing';
    await updateScheduledPost(scheduledPost);

    try {
      const published = await publishCarouselWithUrls({
        slides: scheduledPost.slides,
        caption: scheduledPost.caption,
        imageUrls: scheduledPost.imageUrls,
        carouselTemplate: scheduledPost.carouselTemplate,
        instagramAccountId: scheduledPost.instagramAccountId,
      });

      scheduledPost.status = 'published';
      scheduledPost.publishedAt = new Date().toISOString();
      scheduledPost.postId = published.postId;
      scheduledPost.url = published.url;
      scheduledPost.error = undefined;
      await updateScheduledPost(scheduledPost);

      return NextResponse.json({
        success: true,
        postId: published.postId,
        url: published.url,
        scheduledPost,
        message: 'Agendamento publicado manualmente com sucesso',
      });
    } catch (publishError) {
      scheduledPost.status = 'failed';
      scheduledPost.error = publishError instanceof Error ? publishError.message : 'Erro ao publicar agendamento';
      await updateScheduledPost(scheduledPost);
      throw publishError;
    }
  } catch (error) {
    console.error('Manual publish error:', error);

    const message = error instanceof Error ? error.message : 'Erro ao publicar agendamento';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
