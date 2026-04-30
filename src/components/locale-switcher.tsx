'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * EN ↔ 中文 toggle. Pilot scope: only knows about property routes.
 *
 * The docs.snowbirdhq.com subdomain rewrites /:path → /docs/:path server-side,
 * but the browser address bar shows the un-prefixed form. So usePathname()
 * returns either:
 *   - /properties/7-suburb               (docs subdomain, EN)
 *   - /docs/properties/7-suburb          (main domain, EN — rare)
 *   - /zh/properties/7-suburb            (either domain, ZH)
 *
 * Pilot scope: only 7-suburb has a translation. Other slugs fall back to the
 * locale root.
 */
const PILOT_SLUGS = new Set(['7-suburb']);

export function LocaleSwitcher() {
  const pathname = usePathname() ?? '/';
  const isZh = pathname.startsWith('/zh/') || pathname === '/zh';
  const targetHref = isZh ? toEnglish(pathname) : toChinese(pathname);
  const otherLabel = isZh ? 'EN' : '中文';
  const currentLabel = isZh ? '中文' : 'EN';

  return (
    <div
      className="not-prose flex items-center gap-1"
      style={{
        fontFamily: 'var(--snow-font-mono)',
        fontSize: '12px',
        letterSpacing: '0.08em',
      }}
    >
      <span style={{ color: 'var(--snow-ink-3)' }}>{currentLabel}</span>
      <span style={{ color: 'var(--snow-line)' }}>·</span>
      <Link
        href={targetHref}
        style={{
          color: 'var(--snow-accent)',
          textDecoration: 'none',
          padding: '2px 6px',
        }}
      >
        {otherLabel}
      </Link>
    </div>
  );
}

function toChinese(path: string): string {
  // Strip any /docs prefix and check for /properties/<slug>/...
  const stripped = path.replace(/^\/docs/, '');
  const m = stripped.match(/^\/properties\/([^/]+)(\/.*)?$/);
  if (m && PILOT_SLUGS.has(m[1])) {
    return `/zh/properties/${m[1]}${m[2] ?? ''}`;
  }
  return '/zh';
}

function toEnglish(path: string): string {
  const m = path.match(/^\/zh\/properties\/([^/]+)(\/.*)?$/);
  if (m) {
    // Plain /properties/... — works on both docs subdomain (rewrite handles it)
    // and the main domain (where it'd hit the marketing route, but that's a
    // separate page; ZH-only properties aren't promoted to the marketing site
    // anyway, so the docs subdomain is the realistic source).
    return `/properties/${m[1]}${m[2] ?? ''}`;
  }
  return '/properties';
}
