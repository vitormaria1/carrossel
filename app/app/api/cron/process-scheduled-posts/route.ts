import { NextRequest, NextResponse } from 'next/server';
import {
  isDueScheduledPost,
  listScheduledPosts,
  updateScheduledPost,
} from '@/lib/scheduled-posts';
import { publishCarouselWithUrls } from '@/lib/instagram-publish';

export async function GET(request: NextRequest) {
  try {
    const expectedSecret = process.env.CRON_SECRET;
    if (!expectedSecret) {
      return NextResponse.json(
        { error: 'CRON_SECRET não configurado no deploy da Vercel' },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization ausente' }, { status: 401 });
    }

    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scheduledPosts = await listScheduledPosts();
    const duePosts = scheduledPosts.filter((post) => isDueScheduledPost(post));

    const results = [];

    for (const post of duePosts) {
      try {
        post.status = 'publishing';
        await updateScheduledPost(post);

        const published = await publishCarouselWithUrls({
          slides: post.slides,
          caption: post.caption,
          imageUrls: post.imageUrls,
          carouselTemplate: post.carouselTemplate,
          instagramAccountId: post.instagramAccountId,
        });

        post.status = 'published';
        post.publishedAt = new Date().toISOString();
        post.postId = published.postId;
        post.url = published.url;
        post.error = undefined;
        await updateScheduledPost(post);

        results.push({ id: post.id, status: 'published', url: published.url });
      } catch (error) {
        post.status = 'failed';
        post.error = error instanceof Error ? error.message : 'Erro desconhecido';
        await updateScheduledPost(post);
        results.push({ id: post.id, status: 'failed', error: post.error });
      }
    }

    return NextResponse.json({
      success: true,
      processed: duePosts.length,
      results,
    });
  } catch (error) {
    console.error('Cron processing error:', error);
    const message = error instanceof Error ? error.message : 'Cron failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
