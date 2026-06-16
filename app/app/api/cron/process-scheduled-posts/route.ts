import { NextRequest, NextResponse } from 'next/server';
import {
  isDueScheduledPost,
  listScheduledPosts,
  updateScheduledPost,
} from '@/lib/scheduled-posts';
import { publishCarouselWithUrls } from '@/lib/instagram-publish';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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
