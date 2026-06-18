import { NextResponse } from 'next/server';

function normalizeAccessToken(token: string): string {
  return token.trim().replace(/^['"]|['"]$/g, '');
}

export async function GET() {
  const accessToken = normalizeAccessToken(process.env.INSTAGRAM_ACCESS_TOKEN || '');
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim() || '';

  return NextResponse.json({
    hasAccessToken: Boolean(accessToken),
    accessTokenLength: accessToken.length,
    accessTokenHasWhitespace: /\s/.test(accessToken),
    accessTokenStartsWithIG: accessToken.startsWith('IG'),
    hasBusinessAccountId: Boolean(businessAccountId),
    businessAccountIdLength: businessAccountId.length,
  });
}
