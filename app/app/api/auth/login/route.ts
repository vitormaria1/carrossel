import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, isValidCredentials } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { username?: string; password?: string }
      | null;

    const username = body?.username?.trim() || '';
    const password = body?.password || '';

    if (!isValidCredentials(username, password)) {
      return NextResponse.json(
        { error: 'Usuário ou senha inválidos.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: 'authenticated',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível autenticar.' },
      { status: 500 }
    );
  }
}
