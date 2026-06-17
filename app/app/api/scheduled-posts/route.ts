import { NextResponse } from 'next/server';
import { listScheduledPosts } from '@/lib/scheduled-posts';

export async function GET() {
  try {
    const scheduledPosts = await listScheduledPosts();
    scheduledPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ scheduledPosts });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao carregar agendamentos';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
