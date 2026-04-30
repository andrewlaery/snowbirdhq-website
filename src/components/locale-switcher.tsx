'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * EN ↔ 中文 toggle. Pilot scope: only knows about property routes.
 *
 * The docs.snowbirdhq.com subdomain rewrites /:path → /docs/:path server-side,
 * so usePathname() returns either the un-prefixed form (most common on the
 * docs subdomain) or the /docs-prefixed form (rare, main domain). Both are
 * handled.
 *
 * EN routes:  /properties/<slug>/...           or  /docs/properties/<slug>/...
 * ZH routes:  /zh/properties/<slug>/...        or  /docs/zh/properties/<slug>/...
 *
 * Pilot scope: only 7-suburb has a translation. Other slugs fall back to the
 * locale-default property listing.
 */
// Slugs that have a ZH translation under content/docs/zh/properties/<slug>/.
// Add a slug here whenever scaffold-zh-property.mjs runs for a new property,
// so the locale-switcher pill links straight to the property's ZH page
// instead of bouncing the user to the ZH locale root.
//
// (Could be derived from filesystem at build time and inlined as a generated
// constant — deferred until adding/removing entries here becomes friction.)
const PILOT_SLUGS = new Set(['7-suburb', '25-dublin']);

export function LocaleSwitcher() {
  const pathname = usePathname() ?? '/';
  const isZh = isZhPath(pathname);
  const targetHref = isZh ? toEnglish(pathname) : toChinese(pathname);
  const otherLabel = isZh ? 'EN' : '中文';
  const currentLabel = isZh ? '中文' : 'EN';

  return (
    <div
      className="not-prose"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
        fontFamily: 'var(--snow-font-mono)',
        fontSize: '12px',
        letterSpacing: '0.08em',
        background: 'var(--snow-paper)',
        border: '1px solid var(--snow-line)',
        borderRadius: '999px',
        padding: '4px 10px',
      }}
    >
      <span style={{ color: 'var(--snow-ink-3)' }}>{currentLabel}</span>
      <span style={{ color: 'var(--snow-line)' }}>·</span>
      <Link
        href={targetHref}
        style={{
          color: 'var(--snow-accent)',
          textDecoration: 'none',
        }}
      >
        {otherLabel}
      </Link>
    </div>
  );
}

function isZhPath(path: string): boolean {
  return (
    path === '/zh' ||
    path.startsWith('/zh/') ||
    path === '/docs/zh' ||
    path.startsWith('/docs/zh/')
  );
}

function toChinese(path: string): string {
  // Strip any /docs prefix and check for /properties/<slug>/...
  const stripped = path.replace(/^\/docs/, '');
  const m = stripped.match(/^\/properties\/([^/]+)(\/.*)?$/);
  if (m && PILOT_SLUGS.has(m[1])) {
    return `/docs/zh/properties/${m[1]}${m[2] ?? ''}`;
  }
  return '/docs/zh';
}

function toEnglish(path: string): string {
  // Match either /zh/properties/<slug>/... or /docs/zh/properties/<slug>/...
  const m = path.match(/^(?:\/docs)?\/zh\/properties\/([^/]+)(\/.*)?$/);
  if (m) {
    // Plain /properties/... — works on both docs subdomain (rewrite handles it)
    // and the main domain.
    return `/properties/${m[1]}${m[2] ?? ''}`;
  }
  return '/properties';
}
