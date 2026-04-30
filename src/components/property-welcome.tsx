/**
 * Renders the Welcome narrative for a property by reading
 * `data/sot/properties/<slug>/[<lang>/]guest_copy.md` and slicing out the
 * top-level "Welcome" section. Keeps the compendium welcome and the AI
 * guest-reply context drawing from the same source.
 *
 * The section heading varies by locale; the loader looks for the right
 * heading per locale. Body is rendered through react-markdown.
 */

import ReactMarkdown from 'react-markdown';

import { loadProse, type Lang } from '@/lib/sot';
import { mdxLinkComponents } from '@/lib/mdx-link';

interface PropertyWelcomeProps {
  slug: string;
  lang?: Lang;
}

const WELCOME_HEADING: Record<Lang, string> = {
  en: 'Welcome',
  zh: '欢迎光临',
};

export function PropertyWelcome({ slug, lang = 'en' }: PropertyWelcomeProps) {
  const prose = loadProse(slug, 'guest_copy', lang);
  if (!prose) return null;

  const heading = WELCOME_HEADING[lang];
  const body = prose.sections[heading];
  if (!body) return null;

  return (
    <section>
      <h2>{heading}</h2>
      <ReactMarkdown components={mdxLinkComponents}>{body}</ReactMarkdown>
    </section>
  );
}
