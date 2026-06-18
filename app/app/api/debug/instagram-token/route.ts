import { NextResponse } from 'next/server';

const GRAPH_API = 'https://graph.facebook.com/v20.0';
const INSTAGRAM_API = 'https://graph.instagram.com/v20.0';

function normalizeAccessToken(token: string): string {
  return token.trim().replace(/^['"]|['"]$/g, '');
}

async function readBody(response: Response): Promise<string> {
  const text = await response.text();
  return text || '';
}

export async function GET() {
  const accessToken = normalizeAccessToken(process.env.INSTAGRAM_ACCESS_TOKEN || '');
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim() || '';

  if (!accessToken) {
    return NextResponse.json({ error: 'INSTAGRAM_ACCESS_TOKEN ausente' }, { status: 500 });
  }

  const meResponse = await fetch(
    `${GRAPH_API}/me?fields=id,username&access_token=${encodeURIComponent(accessToken)}`
  );
  const meBody = await readBody(meResponse);

  const instagramMeResponse = await fetch(
    `${INSTAGRAM_API}/me?fields=id,username&access_token=${encodeURIComponent(accessToken)}`
  );
  const instagramMeBody = await readBody(instagramMeResponse);

  let businessResponseStatus: number | null = null;
  let businessBody = '';

  if (businessAccountId) {
    const businessResponse = await fetch(
      `${GRAPH_API}/${businessAccountId}?fields=id,username,ig_id&access_token=${encodeURIComponent(accessToken)}`
    );
    businessResponseStatus = businessResponse.status;
    businessBody = await readBody(businessResponse);
  }

  return NextResponse.json({
    me: {
      ok: meResponse.ok,
      status: meResponse.status,
      body: meBody,
    },
    instagramMe: {
      ok: instagramMeResponse.ok,
      status: instagramMeResponse.status,
      body: instagramMeBody,
    },
    business: businessAccountId
      ? {
          ok: businessResponseStatus ? businessResponseStatus >= 200 && businessResponseStatus < 300 : false,
          status: businessResponseStatus,
          body: businessBody,
        }
      : null,
  });
}
