// Two-tier soft access gate for docs.snowbirdhq.com.
//
// Tier A — property-scoped (`docs_property` cookie): set by the Short.io
//   handshake (?access=<DOCS_ACCESS_KEY> on a /docs/properties/{slug} URL).
//   Grants access to /properties/{that-slug}/* and /queenstown-insights only.
//
// Tier B — portal (`docs_portal` cookie): set by the password form on
//   /access (POST to /api/access-unlock). Grants access to the full portal —
//   / (home), /properties (listing), and every /properties/{slug}/*.
//
// Both cookies are HMAC-signed with DOCS_COOKIE_SECRET so guests can't spoof
// slugs. /docs/internal/* and /docs/owner-docs/* are hard-404'd regardless of
// cookie. /access itself is always reachable.
//
// Gating is only enforced on the docs.snowbirdhq.com subdomain; requests to
// the main marketing site (snowbirdhq.com) fall through so /properties and
// friends stay public.
import { NextResponse, type NextRequest } from 'next/server';
import { signCookie, verifyCookie } from '@/lib/auth/docs-cookie';

const BLOCKED_PREFIXES = ['/docs/internal', '/docs/owner-docs'];

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 365, // 1 year
};

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const isDocsSubdomain = host.startsWith('docs.');
  if (!isDocsSubdomain) return NextResponse.next();

  const normalisedPath = !pathname.startsWith('/docs') ? `/docs${pathname}` : pathname;

  // Hard 404 — no path leakage for internal/owner docs.
  if (
    BLOCKED_PREFIXES.some((p) => normalisedPath === p || normalisedPath.startsWith(`${p}/`))
  ) {
    return new NextResponse(null, { status: 404 });
  }

  // The friendly gate page is always reachable.
  if (normalisedPath === '/docs/access' || normalisedPath.startsWith('/docs/access/')) {
    return NextResponse.next();
  }

  const cookieSecret = process.env.DOCS_COOKIE_SECRET;
  // Fail-open if the signing secret is missing so a misconfigured project
  // doesn't lock everyone out of the portal.
  if (!cookieSecret) return NextResponse.next();

  const accessKey = process.env.DOCS_ACCESS_KEY;

  // Short.io handshake: ?access=<DOCS_ACCESS_KEY> on a property URL sets the
  // property-scoped cookie for the slug in the path.
  const queryKey = searchParams.get('access');
  if (queryKey && accessKey && queryKey === accessKey) {
    const slugMatch = normalisedPath.match(/^\/docs\/properties\/([^/]+)/);
    if (slugMatch) {
      const slug = slugMatch[1];
      const cookieValue = await signCookie(slug, cookieSecret);
      const clean = request.nextUrl.clone();
      clean.searchParams.delete('access');
      const res = NextResponse.redirect(clean);
      res.cookies.set('docs_property', cookieValue, {
        ...COOKIE_OPTS,
        secure: process.env.NODE_ENV === 'production',
      });
      return res;
    }
  }

  // Verify cookies (async, but cheap).
  const portalCookie = request.cookies.get('docs_portal')?.value;
  const portalOk =
    !!portalCookie && (await verifyCookie(portalCookie, cookieSecret)) === '1';

  const propertyCookie = request.cookies.get('docs_property')?.value;
  const propertySlug = propertyCookie
    ? await verifyCookie(propertyCookie, cookieSecret)
    : null;

  // Portal-tier paths: docs home and the properties listing.
  const isPortalTier =
    normalisedPath === '/docs' ||
    normalisedPath === '/docs/' ||
    normalisedPath === '/docs/properties' ||
    normalisedPath === '/docs/properties/';
  if (isPortalTier) {
    if (portalOk) return NextResponse.next();
    return redirectToAccess(request, normalisedPath);
  }

  // Property-tier paths: /properties/{slug}/... — need matching slug or portal.
  const slugMatch = normalisedPath.match(/^\/docs\/properties\/([^/]+)(?:\/|$)/);
  if (slugMatch) {
    const requested = slugMatch[1];
    if (portalOk) return NextResponse.next();
    if (propertySlug && propertySlug === requested) return NextResponse.next();
    return redirectToAccess(request, normalisedPath);
  }

  // Queenstown Insights: shared area — reachable with either cookie.
  const isQueenstown =
    normalisedPath === '/docs/queenstown-insights' ||
    normalisedPath.startsWith('/docs/queenstown-insights/');
  if (isQueenstown) {
    if (portalOk || propertySlug) return NextResponse.next();
    return redirectToAccess(request, normalisedPath);
  }

  // Any other gated path (shouldn't normally land here) — require portal.
  if (portalOk) return NextResponse.next();
  return redirectToAccess(request, normalisedPath);
}

function redirectToAccess(request: NextRequest, normalisedPath: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = '/access';
  url.search = '';
  // Strip the /docs prefix for the public-facing "from" value so the post-
  // password redirect lands on the clean URL the user originally typed.
  const from = normalisedPath.replace(/^\/docs/, '') || '/';
  if (from !== '/access') {
    url.searchParams.set('from', from);
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/',
    '/docs/:path+',
    '/properties/:path*',
    '/queenstown-insights',
    '/queenstown-insights/:path*',
    '/owner-docs/:path*',
    '/internal/:path*',
  ],
};
