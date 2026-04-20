// go.bcampx.com/<slug> redirector. Looks up the slug in the short-links map,
// builds the destination (appending the docs access key where appropriate),
// and 302-redirects. Unknown slugs return 404 — no default landing.
//
// Activated on the go.bcampx.com host via a host-conditional rewrite in
// next.config.mjs (go.bcampx.com/:slug → /s/:slug internally).

import { NextResponse, type NextRequest } from 'next/server';
import { SHORT_LINKS, resolveShortLink } from '@/lib/short-links';

export const runtime = 'edge';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const entry = SHORT_LINKS[slug];
  if (!entry) {
    return new NextResponse(null, { status: 404 });
  }

  const destination = resolveShortLink(entry, process.env.DOCS_ACCESS_KEY);
  return NextResponse.redirect(destination, 302);
}
