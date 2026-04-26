/**
 * Renders the Welcome + neighbourhood narrative for a property by reading
 * `_shared/properties/<slug>/guest_copy.md` (via the vendored copy in
 * `data/sot/properties/<slug>/`). Keeps the compendium welcome and the
 * AI guest-reply context drawing from one source.
 *
 * Body is rendered through react-markdown — full Markdown support
 * (lists, links, headings, bold/italic, code, blockquotes, etc.).
 */

import ReactMarkdown from 'react-markdown';

import { loadProse } from '@/lib/sot';

interface PropertyWelcomeProps {
  slug: string;
  /** Section headings to render, in order. Defaults to the standard set. */
  sections?: string[];
}

const DEFAULT_SECTIONS = ['Welcome', 'The Home & Neighbourhood'];

export function PropertyWelcome({
  slug,
  sections = DEFAULT_SECTIONS,
}: PropertyWelcomeProps) {
  const prose = loadProse(slug, 'guest_copy');
  if (!prose) return null;

  return (
    <>
      {sections.map((heading) => {
        const body = prose.sections[heading];
        if (!body) return null;
        return (
          <section key={heading}>
            <h2>{heading}</h2>
            <ReactMarkdown>{body}</ReactMarkdown>
          </section>
        );
      })}
    </>
  );
}
