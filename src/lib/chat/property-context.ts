import { promises as fs } from 'node:fs';
import path from 'node:path';

const DOCS_DIR = path.join(process.cwd(), 'content', 'docs', 'properties');
const FILES = [
  { file: 'index.mdx', section: 'Landing page' },
  { file: 'welcome-house-rules.mdx', section: 'Welcome & House Rules' },
  { file: 'user-instructions.mdx', section: 'User Instructions' },
  { file: 'critical-info.mdx', section: 'Critical Information' },
] as const;

const cache = new Map<string, PropertyContext | null>();

export interface PropertyContext {
  slug: string;
  title: string;
  body: string;
}

function stripFrontmatter(raw: string): { title: string; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { title: '', body: raw.trim() };
  const titleLine = match[1].split('\n').find((l) => l.startsWith('title:'));
  const title = titleLine?.replace(/^title:\s*/, '').replace(/^["']|["']$/g, '') ?? '';
  return { title, body: match[2].trim() };
}

export async function loadPropertyDocs(slug: string): Promise<PropertyContext | null> {
  if (cache.has(slug)) return cache.get(slug) ?? null;

  const dir = path.join(DOCS_DIR, slug);
  try {
    await fs.access(dir);
  } catch {
    cache.set(slug, null);
    return null;
  }

  const parts: string[] = [];
  let title = '';

  for (const { file, section } of FILES) {
    const fullPath = path.join(dir, file);
    try {
      const raw = await fs.readFile(fullPath, 'utf8');
      const { title: parsedTitle, body } = stripFrontmatter(raw);
      if (file === 'index.mdx' && parsedTitle) title = parsedTitle;
      parts.push(`# ${section}\n\n${body}`);
    } catch {
      // Missing file — skip. Property may not have all 4 yet.
    }
  }

  if (parts.length === 0) {
    cache.set(slug, null);
    return null;
  }

  const context: PropertyContext = {
    slug,
    title: title || slug,
    body: parts.join('\n\n---\n\n'),
  };
  cache.set(slug, context);
  return context;
}
