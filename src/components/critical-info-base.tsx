/**
 * Shared "Critical Info" boilerplate — emergency numbers, services directory,
 * fire safety procedures. Identical across all 13 active properties.
 *
 * Content lives at `data/sot/_shared/critical-info-base.md` (canonical EN)
 * with translation overlays at `data/sot/_shared/<lang>/critical-info-base.md`.
 * Update the markdown when council/QLDC numbers change — they ripple to all
 * 13 property pages.
 *
 * Per-property additions go AFTER this component in each property's MDX:
 *
 *   <CriticalInfoBase />
 *   <PropertyHazards slug="..." />
 *   <QueenstownEssentials />
 */

import ReactMarkdown from 'react-markdown';
import { loadShared, type Lang } from '@/lib/sot';
import { mdxLinkComponents } from '@/lib/mdx-link';

interface Props {
  lang?: Lang;
}

export function CriticalInfoBase({ lang = 'en' }: Props) {
  const body = loadShared('critical-info-base', lang);
  return <ReactMarkdown components={mdxLinkComponents}>{body}</ReactMarkdown>;
}
