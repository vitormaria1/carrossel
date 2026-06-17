import { del, list, put } from '@vercel/blob';

export interface ScheduledCarouselSlide {
  id: string;
  text: string;
  headline?: string;
  cta?: string;
  caption?: string;
  imageUrl?: string;
  imageType: 'html' | 'ai' | 'stock';
  colors: { bg: string; text: string; accent?: string };
  order: number;
  carouselTemplate?: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
}

export type ScheduledPostStatus = 'scheduled' | 'publishing' | 'published' | 'failed';

export interface ScheduledPost {
  id: string;
  instagramAccountId: string;
  slides: ScheduledCarouselSlide[];
  caption: string;
  carouselTemplate: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
  imageUrls: string[];
  scheduledFor: string;
  status: ScheduledPostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  postId?: string;
  url?: string;
  error?: string;
}

const SCHEDULED_POSTS_PREFIX = 'scheduled-posts';

function scheduleKey(id: string) {
  return `${SCHEDULED_POSTS_PREFIX}/${id}.json`;
}

export function assertBlobConfigured() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      'Vercel Blob não configurado. Adicione a variável BLOB_READ_WRITE_TOKEN nas Environment Variables do projeto.'
    );
  }
}

export function createScheduledPostId() {
  return `schedule_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
}

export function isDueScheduledPost(post: ScheduledPost, now = new Date()) {
  return post.status === 'scheduled' && new Date(post.scheduledFor).getTime() <= now.getTime();
}

export async function saveScheduledPost(post: ScheduledPost) {
  assertBlobConfigured();
  await put(scheduleKey(post.id), JSON.stringify(post), {
    access: 'public',
    contentType: 'application/json',
  });
}

export async function loadScheduledPost(id: string): Promise<ScheduledPost | null> {
  assertBlobConfigured();
  const result = await list({ prefix: `${SCHEDULED_POSTS_PREFIX}/` });
  const blob = result.blobs.find((entry) => entry.pathname === scheduleKey(id));

  if (!blob) return null;

  const response = await fetch(blob.url);
  if (!response.ok) return null;

  return (await response.json()) as ScheduledPost;
}

export async function updateScheduledPost(post: ScheduledPost) {
  post.updatedAt = new Date().toISOString();
  await saveScheduledPost(post);
}

export async function deleteScheduledPost(id: string) {
  assertBlobConfigured();
  const result = await list({ prefix: `${SCHEDULED_POSTS_PREFIX}/` });
  const blob = result.blobs.find((entry) => entry.pathname === scheduleKey(id));
  if (blob) {
    await del(blob.url);
  }
}

export async function listScheduledPosts() {
  assertBlobConfigured();
  const result = await list({ prefix: `${SCHEDULED_POSTS_PREFIX}/` });
  const posts = await Promise.all(
    result.blobs.map(async (blob) => {
      const response = await fetch(blob.url);
      if (!response.ok) return null;
      return (await response.json()) as ScheduledPost;
    })
  );

  return posts.filter((post): post is ScheduledPost => Boolean(post));
}
