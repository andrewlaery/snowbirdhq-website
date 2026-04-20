// Soft access gate for the docs portal. A single shared DOCS_ACCESS_KEY
// protects /docs/properties/* and /docs/queenstown-insights. /docs/internal
// and /docs/owner-docs are hard-404'd regardless of key — they only come back
// online when a full per-role auth scheme is restored.
//
// Gating is only enforced on the docs.snowbirdhq.com subdomain. Requests to
// the main marketing site (snowbirdhq.com) pass through untouched even where
// the matcher overlaps (e.g. /properties/:path*), so the marketing pages
// remain public.
//
// This replaces the previous Supabase + per-property JWT middleware while
// that stack is rebuilt. See docs/AUTHORING.md for the access-control story.
import { NextResponse, type NextRequest } from 'next/server';

const BLOCKED_PREFIXES = ['/docs/internal', '/docs/owner-docs'];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const isDocsSubdomain = host.startsWith('docs.');

  // Only the docs subdomain is gated. Main-domain matcher hits (e.g.
  // snowbirdhq.com/properties for the marketing listing) fall through.
  if (!isDocsSubdomain) return NextResponse.next();

  const normalisedPath = !pathname.startsWith('/docs') ? `/docs${pathname}` : pathname;

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

  // No valid access — redirect to the friendly /access page rather than
  // returning a bare 404. The rewrite exception in next.config.mjs routes
  // /access directly to src/app/access/page.tsx on both hosts.
  const accessUrl = request.nextUrl.clone();
  accessUrl.pathname = '/access';
  accessUrl.search = '';
  return NextResponse.redirect(accessUrl);
}

export const config = {
  matcher: [
    '/docs/:path+',
    '/properties/:path*',
    '/owner-docs/:path*',
    '/internal/:path*',
  ],
};
