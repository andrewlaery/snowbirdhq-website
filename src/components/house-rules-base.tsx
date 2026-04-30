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
}

export function HouseRulesBase({ lang = 'en' }: Props) {
  const body = loadShared('house-rules-base', lang);
  return <ReactMarkdown components={mdxLinkComponents}>{body}</ReactMarkdown>;
}
