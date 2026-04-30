'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * EN ↔ 中文 toggle. Pilot scope: only knows about /properties/<slug>/* and
 * /docs/properties/<slug>/* routes. Maps:
 *   /docs/properties/7-suburb         ↔ /zh/properties/7-suburb
 *   /docs/properties/7-suburb/ask     ↔ /zh/properties/7-suburb/ask
 *   /zh/properties/7-suburb/...       ↔ /docs/properties/7-suburb/...
 *
 * Routes outside this map fall back to the locale root (/docs or /zh).
 */
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
  if (path.startsWith('/docs/properties/')) {
    return path.replace('/docs/properties/', '/zh/properties/');
  }
  return '/zh';
}

function toEnglish(path: string): string {
  if (path.startsWith('/zh/properties/')) {
    return path.replace('/zh/properties/', '/docs/properties/');
  }
  return '/docs';
}
