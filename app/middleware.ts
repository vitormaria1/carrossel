import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, isAuthenticatedSession } from './lib/auth';

const PUBLIC_API_PATHS = ['/api/auth/login', '/api/auth/logout'];

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/assets/') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthed = isAuthenticatedSession(session);

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  if (PUBLIC_API_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname === '/login') {
    if (isAuthed) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthed) {
    const url = new URL('/login', request.url);
    if (pathname !== '/') {
      url.searchParams.set('next', `${pathname}${search}`);
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
