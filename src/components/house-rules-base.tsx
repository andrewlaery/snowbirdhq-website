/**
 * Shared "House Rules" boilerplate — quiet hours, smoking, pets, parties,
 * registered-guest policy, child safety, security cameras notice, damages
 * clause, acceptance. Identical (or near-identical) across all 13 active
 * properties.
 *
 * Content lives at `data/sot/_shared/house-rules-base.md` (canonical EN)
 * with translation overlays at `data/sot/_shared/<lang>/house-rules-base.md`.
 * Edit the markdown there — the rendered output ripples to every property.
 *
 * Property-specific deltas go AFTER this component in each property's MDX:
 *
 *   <HouseRulesBase />
 *   <PropertyHouseRulesDeltas slug="..." />
 */

import ReactMarkdown from 'react-markdown';
import { loadShared, type Lang } from '@/lib/sot';
import { mdxLinkComponents } from '@/lib/mdx-link';

interface Props {
  lang?: Lang;
  /**
   * Property slug. When provided, `{slug}` tokens in the shared markdown
   * are substituted with this value — so universal rules can include
   * per-property links like `/docs/properties/{slug}/user-instructions`.
   * Falls back to a generic non-linked phrase when omitted.
   */
  slug?: string;
}

export function HouseRulesBase({ lang = 'en', slug }: Props) {
  let body = loadShared('house-rules-base', lang);
  if (slug) {
    body = body.split('{slug}').join(slug);
  }
  return <ReactMarkdown components={mdxLinkComponents}>{body}</ReactMarkdown>;
}
