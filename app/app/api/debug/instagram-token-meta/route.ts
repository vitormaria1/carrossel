import { NextResponse } from 'next/server';

const GRAPH_API = 'https://graph.facebook.com/v20.0';

function normalizeAccessToken(token: string): string {
  return token
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/^Bearer\s+/i, '')
    .replace(/\s+/g, '');
}

export async function GET() {
  const inputToken = normalizeAccessToken(process.env.INSTAGRAM_ACCESS_TOKEN || '');
  const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID?.trim() || '';
  const appSecret = process.env.INSTAGRAM_APP_SECRET?.trim() || '';

  if (!inputToken) {
    return NextResponse.json({ error: 'INSTAGRAM_ACCESS_TOKEN ausente' }, { status: 500 });
  }

  if (!appId || !appSecret) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_INSTAGRAM_APP_ID ou INSTAGRAM_APP_SECRET ausente' },
      { status: 500 }
    );
  }

  const appAccessToken = `${appId}|${appSecret}`;
  const url = new URL(`${GRAPH_API}/debug_token`);
  url.searchParams.set('input_token', inputToken);
  url.searchParams.set('access_token', appAccessToken);

  const response = await fetch(url.toString());
  const body = await response.text();

  return NextResponse.json({
    ok: response.ok,
    status: response.status,
    body,
    accessTokenMeta: {
      length: inputToken.length,
      startsWithIG: inputToken.startsWith('IG'),
      startsWithEAAG: inputToken.startsWith('EAAG'),
    },
  });
}
