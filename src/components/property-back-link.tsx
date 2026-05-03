/**
 * PropertyBackLink — small "house" icon button rendered inline with the
 * page title on every property sub-page. Click navigates back to the
 * property landing page (/docs/<locale-prefix>properties/<slug>).
 *
 * Designed to be subtle (muted ink-3 colour, ~20px icon) but discoverable
 * (deep-teal hover, descriptive aria-label per locale).
 *
 * Brand name resolution (used only for the aria-label / tooltip, not
 * rendered visually):
 *  1. Upstream SOT identity.yaml::display_name (e.g. "Snowbird")
 *  2. Fallback to data/properties.ts::name first segment (split on " — ")
 *  3. Final fallback to humanised slug ("25-dublin" → "25 Dublin")
 *
 * Localised aria-label / title:
 *  - EN: "Back to <Brand>"
 *  - ZH: "返回 <Brand>"
 *  - JA: "<Brand> に戻る"
 */

import { loadIdentity } from '@/lib/sot';
import { getProperty } from '@/data/properties';
import type { Lang } from '@/lib/sot';

const BACK_LABEL: Record<Lang, (brand: string) => string> = {
  en: (brand) => `Back to ${brand}`,
  zh: (brand) => `返回 ${brand}`,
  ja: (brand) => `${brand} に戻る`,
};

function humaniseSlug(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function resolveBrand(slug: string, lang: Lang): string {
  try {
    const identity = loadIdentity(slug, lang);
    const dn = identity?.display_name?.trim();
    if (dn && !dn.startsWith('TODO')) return dn;
  } catch {
    // Fall through
  }
  const property = getProperty(slug);
  if (property?.name) {
    const first = property.name.split(' — ')[0]?.trim();
    if (first) return first;
  }
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
  const label = BACK_LABEL[lang](brand);
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className="snow-home-icon"
    >
      {/* Lucide-style house icon, 20px, currentColor */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 9.5L12 2l9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z" />
      </svg>
    </a>
  );
}
