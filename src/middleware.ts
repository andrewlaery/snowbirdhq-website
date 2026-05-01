// Two-tier soft access gate for docs.snowbirdhq.com.
//
// Tier A — property-scoped (`docs_property` cookie): set by the Short.io
//   handshake (?access=<DOCS_ACCESS_KEY> on a property URL — EN or ZH).
//   Grants access to /properties/{that-slug}/* (in any locale) and
//   /queenstown-insights only.
//
// Tier B — portal (`docs_portal` cookie): set by the password form on
//   /access (POST to /api/access-unlock). Grants access to the full portal —
//   / (home), /properties (listing), and every /properties/{slug}/*.
//
// Both cookies are HMAC-signed with DOCS_COOKIE_SECRET so guests can't spoof
// slugs. /docs/internal/* and /docs/owner-docs/* (and their /docs/<lang>/
// equivalents) are hard-404'd regardless of cookie. /access is always
// reachable.
//
// Locale-tolerant path matching: the docs subtree contains EN at /docs/...
// and ZH at /docs/zh/.... All gate-relevant matchers strip an optional
// /<lang>/ segment up front so the same logic covers both locales.
//
// Gating is only enforced on the docs.snowbirdhq.com subdomain; requests to
// the main marketing site (snowbirdhq.com) fall through so /properties and
// friends stay public.
import { NextResponse, after, type NextRequest } from 'next/server';
import { signCookie, verifyCookie } from '@/lib/auth/docs-cookie';
import { recordDocsPageView } from '@/lib/click-tracking';

// Locales the gate recognises as URL-prefix segments. Mirrors the languages
// shipped under content/docs and src/app/docs/<lang>/. Adding a locale to
// this set extends the gate to that locale's URLs without further code.
const LOCALES = new Set(['zh']);

// Block both un-prefixed and per-locale variants — /docs/zh/internal must
// 404 the same as /docs/internal.
const BLOCKED_PATHS = ['/internal', '/owner-docs'];

// Carve-outs from BLOCKED_PATHS — specific paths reachable with the portal
// cookie (not the property cookie). EN-only today; not yet duplicated under
// /docs/zh/internal/* because the dashboard is not localised.
const INTERNAL_PORTAL_PATHS = ['/internal/link-stats'];

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 365, // 1 year
};

/**
 * Strip a leading /docs prefix and any locale segment from a path.
 * Returns the locale (or null for the default) and the remainder.
 *
 * Examples:
 *   /docs/properties/7-suburb         → { locale: null, rest: '/properties/7-suburb' }
 *   /docs/zh/properties/7-suburb      → { locale: 'zh',  rest: '/properties/7-suburb' }
 *   /docs/internal/link-stats         → { locale: null, rest: '/internal/link-stats' }
 *   /docs/zh/owner-docs/foo           → { locale: 'zh',  rest: '/owner-docs/foo' }
 */
function decomposeDocsPath(path: string): { locale: string | null; rest: string } {
  const noDocs = path.startsWith('/docs') ? path.slice(5) : path;
  const segments = noDocs.split('/').filter(Boolean);
  if (segments.length > 0 && LOCALES.has(segments[0])) {
    return { locale: segments[0], rest: '/' + segments.slice(1).join('/') };
  }
  return { locale: null, rest: noDocs || '/' };
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const isDocsSubdomain = host.startsWith('docs.');

  // Always propagate x-pathname so RootLayout can set <html lang> per
  // locale, regardless of subdomain or whether the docs gate fires.
  if (!isDocsSubdomain) {
    const r = NextResponse.next();
    r.headers.set('x-pathname', pathname);
    return r;
  }

  // Fire-and-forget pageview record for any docs.* request that we let
  // through. Asset/API/auth paths are filtered inside recordDocsPageView().
  const allow = () => {
    after(() => recordDocsPageView(pathname, request));
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
  };

  const normalisedPath = !pathname.startsWith('/docs') ? `/docs${pathname}` : pathname;
  const { locale, rest } = decomposeDocsPath(normalisedPath);

  // Locale-aware portal-tier carve-out — currently EN only.
  const isInternalPortal = INTERNAL_PORTAL_PATHS.some(
    (p) => rest === p || rest.startsWith(`${p}/`),
  );

  // Hard 404 — no path leakage for internal/owner docs (except carve-outs
  // above). Applies to both /docs/internal and /docs/zh/internal etc.
  if (
    !isInternalPortal &&
    BLOCKED_PATHS.some((p) => rest === p || rest.startsWith(`${p}/`))
  ) {
    return new NextResponse(null, { status: 404 });
  }

  // The friendly gate page is always reachable.
  if (normalisedPath === '/docs/access' || normalisedPath.startsWith('/docs/access/')) {
    return allow();
  }

  const cookieSecret = process.env.DOCS_COOKIE_SECRET;
  // Fail-open if the signing secret is missing so a misconfigured project
  // doesn't lock everyone out of the portal.
  if (!cookieSecret) return allow();

  const accessKey = process.env.DOCS_ACCESS_KEY;

  // Short.io handshake: ?access=<DOCS_ACCESS_KEY> on a property URL sets the
  // property-scoped cookie for the slug in the path. Locale-tolerant — the
  // handshake works on /docs/properties/<slug> and /docs/zh/properties/<slug>
  // alike.
  const queryKey = searchParams.get('access');
  if (queryKey && accessKey && queryKey === accessKey) {
    const slugMatch = rest.match(/^\/properties\/([^/]+)/);
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

  // Internal portal paths (e.g. /docs/internal/link-stats): portal cookie only.
  if (isInternalPortal) {
    if (portalOk) return allow();
    return redirectToAccess(request, normalisedPath);
  }

  // Root `/docs` (any locale): portal users go to /properties; anonymous to /access.
  if (rest === '/' || rest === '') {
    if (portalOk) {
      const to = request.nextUrl.clone();
      to.pathname = locale ? `/${locale}/properties` : '/properties';
      to.search = '';
      return NextResponse.redirect(to);
    }
    return redirectToAccess(request, normalisedPath);
  }

  // Portal-tier: /properties listing in any locale.
  if (rest === '/properties' || rest === '/properties/') {
    if (portalOk) return allow();
    return redirectToAccess(request, normalisedPath);
  }

  // Property-tier paths: /properties/{slug}/... in any locale — need matching
  // slug or portal.
  const slugMatch = rest.match(/^\/properties\/([^/]+)(?:\/|$)/);
  if (slugMatch) {
    const requested = slugMatch[1];
    if (portalOk) return allow();
    if (propertySlug && propertySlug === requested) return allow();
    return redirectToAccess(request, normalisedPath);
  }

  // Queenstown Insights: shared area — reachable with either cookie.
  // Currently EN-only (no /docs/zh/queenstown-insights MDX); leave the rest
  // path matcher locale-agnostic so a future ZH version inherits this.
  const isQueenstown =
    rest === '/queenstown-insights' || rest.startsWith('/queenstown-insights/');
  if (isQueenstown) {
    if (portalOk || propertySlug) return allow();
    return redirectToAccess(request, normalisedPath);
  }

  // Any other gated path (shouldn't normally land here) — require portal.
  if (portalOk) return allow();
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
    '/zh/:path*',
    '/queenstown-insights',
    '/queenstown-insights/:path*',
    '/owner-docs/:path*',
    '/internal/:path*',
  ],
};
