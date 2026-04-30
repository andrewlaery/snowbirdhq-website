/**
 * Queenstown-area essentials — insects, power, ATMs, groceries, transport.
 * Identical across all 13 active SnowbirdHQ properties (and probably any
 * other Queenstown rental). One source for council/airline/grocery numbers
 * that change occasionally.
 *
 * Content lives at `data/sot/_shared/queenstown-essentials.md` (canonical EN)
 * with translation overlays at `data/sot/_shared/<lang>/queenstown-essentials.md`.
 */

import ReactMarkdown from 'react-markdown';
import { loadShared, type Lang } from '@/lib/sot';
import { mdxLinkComponents } from '@/lib/mdx-link';

interface Props {
  lang?: Lang;
}

export function QueenstownEssentials({ lang = 'en' }: Props) {
  const body = loadShared('queenstown-essentials', lang);
  return <ReactMarkdown components={mdxLinkComponents}>{body}</ReactMarkdown>;
}
