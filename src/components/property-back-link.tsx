/**
 * PropertyBackLink — small "← Back to {Brand Name}" link rendered above
 * the page title on every property sub-page (welcome-house-rules,
 * user-instructions, critical-info, ask).
 *
 * Brand name resolution:
 *  1. Upstream SOT identity.yaml::display_name (e.g. "Snowbird", "SkyCrest")
 *  2. Fallback to data/properties.ts::name first segment (split on " — ")
 *  3. Final fallback to a humanised slug ("25-dublin" → "25 Dublin")
 *
 * Localisation:
 *  - EN: "← Back to <Brand>"
 *  - ZH: "← 返回 <Brand>"
 *  - JA: "← <Brand> に戻る"
 *
 * Server component — reads the SOT YAML at build/render time.
 */

import { loadIdentity } from '@/lib/sot';
import { getProperty } from '@/data/properties';
import type { Lang } from '@/lib/sot';

const BACK_PREFIX: Record<Lang, (brand: string) => string> = {
  en: (brand) => `← Back to ${brand}`,
  zh: (brand) => `← 返回 ${brand}`,
  ja: (brand) => `← ${brand} に戻る`,
};

function humaniseSlug(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function resolveBrand(slug: string, lang: Lang): string {
  // 1. SOT identity.yaml display_name (preferred)
  try {
    const identity = loadIdentity(slug, lang);
    const dn = identity?.display_name?.trim();
    if (dn && !dn.startsWith('TODO')) return dn;
  } catch {
    // Fall through
  }
  // 2. data/properties.ts::name first segment
  const property = getProperty(slug);
  if (property?.name) {
    const first = property.name.split(' — ')[0]?.trim();
    if (first) return first;
  }
  // 3. Humanised slug
  return humaniseSlug(slug);
}

export function PropertyBackLink({
  slug,
  lang = 'en',
}: {
  slug: string;
  lang?: Lang;
}) {
  const brand = resolveBrand(slug, lang);
  const localePrefix = lang === 'en' ? '' : `/${lang}`;
  const href = `/docs${localePrefix}/properties/${slug}`;
  return (
    <p
      style={{
        margin: '0 0 1.25rem 0',
        fontFamily: 'var(--snow-font-mono)',
        fontSize: '12px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--snow-ink-3)',
        fontWeight: 500,
      }}
    >
      <a
        href={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
          borderBottom: '1px solid transparent',
          transition: 'border-color 150ms ease, color 150ms ease',
        }}
        className="snow-back-link"
      >
        {BACK_PREFIX[lang](brand)}
      </a>
    </p>
  );
}
