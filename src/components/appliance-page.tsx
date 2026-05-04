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

/** Read `category:` from the EN frontmatter (canonical) for a given appliance slug. */
function loadApplianceCategory(model: string): string {
  const enPath = join(APPLIANCES_ROOT, `${model}.md`);
  if (!existsSync(enPath)) return 'other';
  const text = readFileSync(enPath, 'utf-8');
  const match = text.match(/^category:\s*(\S+)/m);
  return match ? match[1].trim() : 'other';
}

function stripFrontMatter(text: string): string {
  if (!text.startsWith('---')) return text;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return text;
  return text.slice(end + 4).replace(/^\n+/, '');
}

/**
 * Shift every Markdown heading down by one level (H3 → H4 etc.). Called by
 * AppliancePage so that each appliance body sits under the H3 category
 * sub-heading rendered by ApplianceSet, with its own title rendered as H4.
 * Appliance bodies are authored with `### Title` which is the right level
 * when an appliance is rendered standalone via <AppliancePage> on its own
 * page; ApplianceSet's grouped layout demotes them automatically.
 */
function shiftHeadings(md: string): string {
  return md.replace(/^(#{1,5})(\s)/gm, '#$1$2');
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

/**
 * Order in which category groups render under the Appliances H2.
 *
 * Essentials-first order (2026-05-04): the things guests need to operate
 * the property comfortably (heating, cooking, laundry) before the
 * amenities (entertainment, wellness, outdoor) and background systems
 * (smart-home, other).
 *
 * `climate` is rendered as part of the `heating` bucket — heat pumps and
 * fans do both, so they live under a single "Heating & Climate" heading.
 * The category stays in this list as a frontmatter value but is collapsed
 * during render via CATEGORY_MERGE.
 */
const CATEGORY_ORDER = [
  'smart-home',
  'heating',
  'climate', // collapsed into heating during render
  'kitchen',
  'laundry',
  'tech',
  'wellness',
  'outdoor',
  'other',
] as const;

type Category = (typeof CATEGORY_ORDER)[number];

/** Categories that should render under another category's H3 (visual merge). */
const CATEGORY_MERGE: Partial<Record<Category, Category>> = {
  climate: 'heating',
};

const CATEGORY_LABEL: Record<Lang, Record<Category, string>> = {
  en: {
    tech: 'Wi-Fi & Entertainment',
    heating: 'Heating & Climate',
    climate: 'Heating & Climate',
    wellness: 'Wellness',
    kitchen: 'Kitchen',
    laundry: 'Laundry',
    outdoor: 'Outdoor & BBQ',
    'smart-home': 'Smart Home',
    other: 'Other',
  },
  zh: {
    tech: 'Wi-Fi 与影音',
    heating: '取暖与空调',
    climate: '取暖与空调',
    wellness: '休闲',
    kitchen: '厨房',
    laundry: '洗衣',
    outdoor: '户外与烧烤',
    'smart-home': '智能家居',
    other: '其他',
  },
  ja: {
    tech: 'Wi-Fi・AV機器',
    heating: '暖房・空調',
    climate: '暖房・空調',
    wellness: 'ウェルネス',
    kitchen: 'キッチン',
    laundry: 'ランドリー',
    outdoor: '屋外・BBQ',
    'smart-home': 'スマートホーム',
    other: 'その他',
  },
};

interface ApplianceProps {
  model: string;
  lang?: Lang;
}

export function AppliancePage({
  model,
  lang = 'en',
  shiftHeadingsBy = 0,
}: ApplianceProps & { shiftHeadingsBy?: number }) {
  const raw = loadApplianceBody(model, lang);
  if (raw == null) {
    return (
      <div className="not-prose rounded border border-red-300 bg-red-50 p-4 text-sm">
        <strong>{MISSING_LABEL[lang]}:</strong> <code>{model}</code>. Add{' '}
        <code>data/sot/_appliances/{model}.md</code>.
      </div>
    );
  }
  let body = stripFrontMatter(raw);
  for (let i = 0; i < shiftHeadingsBy; i++) {
    body = shiftHeadings(body);
  }
  return <ReactMarkdown components={mdxLinkComponents}>{body}</ReactMarkdown>;
}

/**
 * Render every appliance declared in this property's facts.yaml, grouped
 * by category sub-heading. The "Appliances" H2 is rendered here (not in
 * the MDX shell) so it only appears when there's actually content
 * underneath — properties with no appliance content (neither per-model
 * entries nor a usage_sections::appliances text-tip) get nothing instead
 * of a dead heading.
 *
 * Each appliance's category is read from its own `_appliances/<slug>.md`
 * frontmatter `category:` field (kitchen / heating / climate / laundry /
 * wellness / tech / outdoor / smart-home / other). Missing or unknown
 * categories fall back to `other`.
 *
 * If `facts.yaml::exceptions::usage_sections` contains an entry with
 * `category: appliances`, its body renders as plain markdown directly
 * under the H2 (above the per-model categories). This lets a property
 * surface property-wide notes (e.g. an isolation switch behind the oven)
 * without needing a per-model markdown file. PropertyUsageSections skips
 * the appliances category for the same reason — we own it here so the
 * H2/anchor stays single.
 */
export function ApplianceSet({ slug, lang = 'en' }: { slug: string; lang?: Lang }) {
  const facts = loadFacts(slug, lang);
  const models = facts.appliances ?? [];
  const usageNote = (facts.exceptions?.usage_sections ?? []).find(
    (s) => s.category === 'appliances',
  );

  if (models.length === 0 && !usageNote) return null;

  // Bucket appliances by category, collapsing merged categories (e.g.
  // `climate` → `heating`). Preserves per-property order within each
  // bucket so authors can re-order in facts.yaml.
  const byCategory = new Map<Category, string[]>();
  for (const model of models) {
    const raw = loadApplianceCategory(model) as Category;
    const known = (CATEGORY_ORDER as readonly string[]).includes(raw) ? raw : 'other';
    const target = CATEGORY_MERGE[known] ?? known;
    if (!byCategory.has(target)) byCategory.set(target, []);
    byCategory.get(target)!.push(model);
  }

  return (
    <>
      <h2 id="appliances">{APPLIANCES_HEADING[lang]}</h2>
      {usageNote && (
        <ReactMarkdown components={mdxLinkComponents}>{usageNote.body.trim()}</ReactMarkdown>
      )}
      {CATEGORY_ORDER.map((cat) => {
        // Skip categories that have been merged into another (rendered by their target).
        if (CATEGORY_MERGE[cat]) return null;
        const items = byCategory.get(cat);
        if (!items || items.length === 0) return null;
        return (
          <section key={cat}>
            <h3 id={`appliances-${cat}`}>{CATEGORY_LABEL[lang][cat]}</h3>
            {items.map((m) => (
              <AppliancePage key={m} model={m} lang={lang} shiftHeadingsBy={1} />
            ))}
          </section>
        );
      })}
    </>
  );
}
