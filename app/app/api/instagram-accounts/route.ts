import { NextResponse } from 'next/server';
import { getInstagramAccountSummaries } from '@/lib/instagram-accounts';

export async function GET() {
  try {
    const accounts = getInstagramAccountSummaries();
    return NextResponse.json({ accounts });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao carregar contas';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
