/**
 * Renders the Welcome + neighbourhood narrative for a property by reading
 * `_shared/properties/<slug>/guest_copy.md` (via the vendored copy in
 * `data/sot/properties/<slug>/`). Keeps the compendium welcome and the
 * AI guest-reply context drawing from one source.
 */

import { loadProse } from '@/lib/sot';

interface PropertyWelcomeProps {
  slug: string;
  /** Headings to render, in order. Defaults to the standard set. */
  sections?: string[];
}

const DEFAULT_SECTIONS = ['Welcome', 'The Home & Neighbourhood'];

export function PropertyWelcome({ slug, sections = DEFAULT_SECTIONS }: PropertyWelcomeProps) {
  const prose = loadProse(slug, 'guest_copy');
  if (!prose) return null;

  // The `## Welcome` section in guest_copy.md often contains a `### Dear Guest`
  // sub-heading. We render the section bodies as raw markdown via the
  // server-rendered MDX pipeline — but since we're inside MDX already, we
  // emit headings + paragraphs directly. Markdown nuance like bold/links is
  // preserved by passing through `dangerouslySetInnerHTML` after a tiny
  // markdown-to-HTML pass for inline elements.
  return (
    <>
      {sections.map((heading) => {
        const body = prose.sections[heading];
        if (!body) return null;
        return (
          <section key={heading}>
            <h2>{heading}</h2>
            <div
              // Tiny inline-markdown render — keeps **bold**, *italic*, and
              // `code`. Block-level elements stay as plain text since this is
              // server-rendered prose, not full MDX. For richer formatting,
              // move the section into a dedicated MDX file.
              dangerouslySetInnerHTML={{ __html: renderInline(body) }}
            />
          </section>
        );
      })}
    </>
  );
}

function renderInline(text: string): string {
  return text
    // Headings (### Sub) → <h3>
    .split('\n\n')
    .map((para) => {
      const trimmed = para.trim();
      if (!trimmed) return '';
      const h3 = /^###\s+(.+)$/m.exec(trimmed);
      if (h3) return `<h3>${escape(h3[1])}</h3>`;
      // Plain paragraph
      return `<p>${escape(trimmed)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/(?<!\*)\*(?!\*)([^*]+)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')}</p>`;
    })
    .join('\n');
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
