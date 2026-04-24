// go.bcampx.com/<slug> redirector. Looks up the slug in the short-links map,
// builds the destination (appending the docs access key where appropriate),
// and 302-redirects. Unknown slugs return 404 — no default landing.
//
// Activated on the go.bcampx.com host via a host-conditional rewrite in
// next.config.mjs (go.bcampx.com/:slug → /s/:slug internally).
//
// Click tracking: each hit is recorded after the response is sent via
// `after()` so the redirect is never blocked. See src/lib/click-tracking.ts.

import { NextResponse, after, type NextRequest } from 'next/server';
import { SHORT_LINKS, resolveShortLink } from '@/lib/short-links';
import { recordClick } from '@/lib/click-tracking';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const entry = SHORT_LINKS[slug];
  if (!entry) {
    return new NextResponse(null, { status: 404 });
  }

  after(() => recordClick(slug, request));

  const destination = resolveShortLink(entry, process.env.DOCS_ACCESS_KEY);
  return NextResponse.redirect(destination, 302);
}
