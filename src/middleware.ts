// Soft access gate for the docs portal. A single shared DOCS_ACCESS_KEY
// protects /docs/properties/* and /docs/queenstown-insights. /docs/internal
// and /docs/owner-docs are hard-404'd regardless of key — they only come back
// online when a full per-role auth scheme is restored.
//
// This replaces the previous Supabase + per-property JWT middleware while
// that stack is rebuilt. See docs/AUTHORING.md for the access-control story.
import { NextResponse, type NextRequest } from 'next/server';

const BLOCKED_PREFIXES = ['/docs/internal', '/docs/owner-docs'];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const isDocsSubdomain = host.startsWith('docs.');
  const normalisedPath =
    isDocsSubdomain && !pathname.startsWith('/docs') ? `/docs${pathname}` : pathname;

  if (
    BLOCKED_PREFIXES.some((p) => normalisedPath === p || normalisedPath.startsWith(`${p}/`))
  ) {
    return new NextResponse(null, { status: 404 });
  }

  const key = process.env.DOCS_ACCESS_KEY;
  // Fail-open if the env var is missing so a misconfiguration doesn't lock
  // everyone out of the portal.
  if (!key) return NextResponse.next();

  const queryKey = searchParams.get('access');
  if (queryKey === key) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete('access');
    const res = NextResponse.redirect(clean);
    res.cookies.set('docs_access', key, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  }

  if (request.cookies.get('docs_access')?.value === key) {
    return NextResponse.next();
  }

  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: [
    '/docs/:path+',
    '/properties/:path*',
    '/owner-docs/:path*',
    '/internal/:path*',
  ],
};
