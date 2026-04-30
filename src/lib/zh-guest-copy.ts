import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Pilot helper: read translated guest_copy.md (data/sot/properties/<slug>/zh/)
 * and return the body slice under a given H1 heading.
 *
 * The shared `loadProse` extractor in @/lib/sot only matches H2 (`## `), but
 * the guest_copy.md SOT uses H1 for top-level sections. For the ZH pilot we
 * extract by H1 here without touching the EN extractor.
 *
 * Returns null if file or section is missing.
 */
export function loadGuestCopySection(slug: string, h1Heading: string): string | null {
  const path = join(process.cwd(), 'data', 'sot', 'properties', slug, 'zh', 'guest_copy.md');
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, 'utf8');
  const body = stripFrontMatter(raw);
  return sliceH1(body, h1Heading);
}

export function loadGuestCopySections(slug: string, headings: string[]): string {
  return headings
    .map((h) => loadGuestCopySection(slug, h))
    .filter((s): s is string => Boolean(s))
    .join('\n\n');
}

function stripFrontMatter(text: string): string {
  if (!text.startsWith('---')) return text;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return text;
  return text.slice(end + 4).replace(/^\n+/, '');
}

function sliceH1(body: string, heading: string): string | null {
  const lines = body.split('\n');
  const target = `# ${heading}`;
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === target) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return null;
  let end = lines.length;
  for (let j = start; j < lines.length; j++) {
    if (/^# (?!# )/.test(lines[j])) {
      end = j;
      break;
    }
  }
  return lines.slice(start, end).join('\n').trim();
}
