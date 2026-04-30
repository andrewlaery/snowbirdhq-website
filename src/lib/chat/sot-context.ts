import { promises as fs } from 'node:fs';
import path from 'node:path';

// Vendored copy of `_shared/properties/<slug>/`. Refreshed by
// `scripts/sync-sot.mjs` (also runs as a `prebuild` hook).
const SOT_ROOT = path.join(process.cwd(), 'data', 'sot', 'properties');

export type Lang = 'en' | 'zh';

export interface PropertySot {
  slug: string;
  title: string;
  body: string;
  lang: Lang;
}

// Key: `${slug}:${lang}` — translated SOT lives in `<slug>/<lang>/`.
const cache = new Map<string, PropertySot | null>();

function extractDisplayName(identityYaml: string): string {
  const match = identityYaml.match(/^display_name:\s*(.+?)\s*$/m);
  if (!match) return '';
  return match[1].replace(/^["']|["']$/g, '').trim();
}

function stripYamlComments(raw: string): string {
  return raw
    .split('\n')
    .filter((line) => !/^\s*#/.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripFrontmatter(raw: string): string {
  const match = raw.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/);
  return (match ? match[1] : raw).trim();
}

// `policies.yaml` is intentionally NOT loaded — it holds master access codes
// (front-door master, garage, alarm) that must never reach the chat model.
const SOURCES: ReadonlyArray<{
  file: string;
  heading: string;
  strip: (raw: string) => string;
}> = [
  { file: 'identity.yaml', heading: 'Identity', strip: stripYamlComments },
  { file: 'facts.yaml', heading: 'Facts', strip: stripYamlComments },
  { file: 'guest_copy.md', heading: 'Guest guide', strip: stripFrontmatter },
];

export async function loadPropertySot(
  slug: string,
  lang: Lang = 'en',
): Promise<PropertySot | null> {
  const cacheKey = `${slug}:${lang}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;

  const dir =
    lang === 'en' ? path.join(SOT_ROOT, slug) : path.join(SOT_ROOT, slug, lang);
  try {
    await fs.access(dir);
  } catch {
    cache.set(cacheKey, null);
    return null;
  }

  const parts: string[] = [];
  let title = '';

  for (const { file, heading, strip } of SOURCES) {
    try {
      const raw = await fs.readFile(path.join(dir, file), 'utf8');
      if (file === 'identity.yaml' && !title) title = extractDisplayName(raw);
      const cleaned = strip(raw);
      if (cleaned) parts.push(`## ${heading} (${file})\n\n${cleaned}`);
    } catch {
      // Missing file — skip; not all properties have every file yet.
    }
  }

  if (parts.length === 0) {
    cache.set(cacheKey, null);
    return null;
  }

  const sot: PropertySot = {
    slug,
    title: title || slug,
    body: parts.join('\n\n---\n\n'),
    lang,
  };
  cache.set(cacheKey, sot);
  return sot;
}
