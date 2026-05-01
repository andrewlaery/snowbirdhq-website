/**
 * Renders an appliance manual section by model slug. The body of each
 * appliance lives at `data/sot/_appliances/<model>.md` (canonical EN) with
 * translation overlays at `data/sot/_appliances/<lang>/<model>.md`. Properties
 * declare which appliances they have via `facts.yaml::appliances:` (a list of
 * model slugs); their MDX pages can either render <AppliancePage model="..."
 * lang="..."> per appliance, or list them via <ApplianceSet slug="..."
 * lang="..."> which fans out automatically.
 *
 * Adding a new appliance = one new markdown file in `data/sot/_appliances/`.
 * No code changes needed — the loader resolves it by slug.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import ReactMarkdown from 'react-markdown';

import { loadFacts, type Lang } from '@/lib/sot';
import { mdxLinkComponents } from '@/lib/mdx-link';

const APPLIANCES_ROOT = join(process.cwd(), 'data', 'sot', '_appliances');

function loadApplianceBody(model: string, lang: Lang): string | null {
  const localePath = lang === 'en' ? null : join(APPLIANCES_ROOT, lang, `${model}.md`);
  const enPath = join(APPLIANCES_ROOT, `${model}.md`);
  const path = localePath && existsSync(localePath) ? localePath : enPath;
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf-8');
}

function stripFrontMatter(text: string): string {
  if (!text.startsWith('---')) return text;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return text;
  return text.slice(end + 4).replace(/^\n+/, '');
}

const MISSING_LABEL = {
  en: 'Missing appliance',
  zh: '缺少电器说明',
  ja: '家電情報が見つかりません',
} as const;

const APPLIANCES_HEADING = {
  en: 'Appliances',
  zh: '电器',
  ja: '家電製品',
} as const;

interface ApplianceProps {
  model: string;
  lang?: Lang;
}

export function AppliancePage({ model, lang = 'en' }: ApplianceProps) {
  const raw = loadApplianceBody(model, lang);
  if (raw == null) {
    return (
      <div className="not-prose rounded border border-red-300 bg-red-50 p-4 text-sm">
        <strong>{MISSING_LABEL[lang]}:</strong> <code>{model}</code>. Add{' '}
        <code>data/sot/_appliances/{model}.md</code>.
      </div>
    );
  }
  const body = stripFrontMatter(raw);
  return <ReactMarkdown components={mdxLinkComponents}>{body}</ReactMarkdown>;
}

/**
 * Render every appliance declared in this property's facts.yaml. The
 * "Appliances" H2 is rendered here (not in the MDX shell) so it only
 * appears when there's actually content underneath — properties with
 * `appliances: []` get nothing instead of a dead heading.
 */
export function ApplianceSet({ slug, lang = 'en' }: { slug: string; lang?: Lang }) {
  const facts = loadFacts(slug, lang);
  const models = facts.appliances ?? [];
  if (models.length === 0) return null;
  return (
    <>
      <h2 id="appliances">{APPLIANCES_HEADING[lang]}</h2>
      {models.map((m) => (
        <AppliancePage key={m} model={m} lang={lang} />
      ))}
    </>
  );
}
