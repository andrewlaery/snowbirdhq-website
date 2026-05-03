/**
 * remark-appliance-toc — expands `<ApplianceSet slug="..." lang="..." />`
 * into explicit H2 + H3 markdown headings (so fumadocs' TOC builder picks
 * them up) plus per-appliance JSX bodies.
 *
 * BEFORE (in MDX source):
 *
 *   <ApplianceSet slug="6-25-belfast" />
 *
 * AFTER (in MDX AST, before fumadocs renders):
 *
 *   ## Appliances
 *
 *   ### Wi-Fi & Entertainment
 *   <AppliancePage model="belfast-samsung-smart-tv" lang="en" shiftHeadingsBy={1} />
 *   <AppliancePage model="belfast-samsung-frame-tv" lang="en" shiftHeadingsBy={1} />
 *   ...
 *
 *   ### Heating & Climate
 *   <AppliancePage model="daikin-ctxm25rvma" lang="en" shiftHeadingsBy={1} />
 *   ...
 *
 * Categories collapsed: `climate` → `heating` (single "Heating & Climate" group).
 * Empty categories are skipped. Order matches CATEGORY_ORDER below, which is
 * intentionally synchronised with src/components/appliance-page.tsx.
 *
 * Why a remark plugin: fumadocs builds the page TOC from markdown AST headings
 * at parse time. Anything emitted by a React component at render time is invisible
 * to the TOC. Lifting headings into the AST via this plugin gives us a complete
 * right-side TOC with every appliance category linked.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { visit } from 'unist-util-visit';
import yaml from 'yaml';

const APPLIANCES_ROOT = join(process.cwd(), 'data', 'sot', '_appliances');
const PROPERTIES_ROOT = join(process.cwd(), 'data', 'sot', 'properties');

// MUST match src/components/appliance-page.tsx
const CATEGORY_ORDER = [
  'smart-home',
  'heating',
  'climate',
  'kitchen',
  'laundry',
  'tech',
  'wellness',
  'outdoor',
  'other',
];

const CATEGORY_MERGE = {
  climate: 'heating',
};

const APPLIANCES_HEADING = {
  en: 'Appliances',
  zh: '电器',
  ja: '家電製品',
};

const CATEGORY_LABEL = {
  en: {
    tech: 'Wi-Fi & Entertainment',
    heating: 'Heating & Climate',
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
    wellness: 'ウェルネス',
    kitchen: 'キッチン',
    laundry: 'ランドリー',
    outdoor: '屋外・BBQ',
    'smart-home': 'スマートホーム',
    other: 'その他',
  },
};

/** Load a property's appliances list from facts.yaml. */
function loadAppliancesList(slug) {
  const path = join(PROPERTIES_ROOT, slug, 'facts.yaml');
  if (!existsSync(path)) return [];
  try {
    const data = yaml.parse(readFileSync(path, 'utf8'));
    return data?.appliances ?? [];
  } catch {
    return [];
  }
}

/** Load an appliance's `category` frontmatter from its .md file. */
function loadApplianceCategory(model) {
  const path = join(APPLIANCES_ROOT, `${model}.md`);
  if (!existsSync(path)) return 'other';
  try {
    const text = readFileSync(path, 'utf8');
    const match = text.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return 'other';
    const fm = yaml.parse(match[1]);
    return fm?.category ?? 'other';
  } catch {
    return 'other';
  }
}

/** Read an attribute's value from a JSX element node, or fall back. */
function getAttr(node, name, fallback = undefined) {
  const attr = (node.attributes ?? []).find(
    (a) => a.type === 'mdxJsxAttribute' && a.name === name,
  );
  if (!attr) return fallback;
  // Plain string attribute: { type: 'mdxJsxAttribute', name, value: 'string' }
  if (typeof attr.value === 'string') return attr.value;
  // Expression attribute (we don't expect these for ApplianceSet but be safe).
  return fallback;
}

/** Build an MDAST `heading` node. */
function heading(depth, text) {
  return {
    type: 'heading',
    depth,
    children: [{ type: 'text', value: text }],
  };
}

/** Build an `<AppliancePage model="..." lang="..." shiftHeadingsBy={1} />` JSX node. */
function appliancePage(model, lang) {
  return {
    type: 'mdxJsxFlowElement',
    name: 'AppliancePage',
    attributes: [
      { type: 'mdxJsxAttribute', name: 'model', value: model },
      { type: 'mdxJsxAttribute', name: 'lang', value: lang },
      {
        type: 'mdxJsxAttribute',
        name: 'shiftHeadingsBy',
        value: {
          type: 'mdxJsxAttributeValueExpression',
          value: '1',
          data: {
            estree: {
              type: 'Program',
              sourceType: 'module',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: { type: 'Literal', value: 1, raw: '1' },
                },
              ],
            },
          },
        },
      },
    ],
    children: [],
  };
}

/** Expand one ApplianceSet JSX node into [heading, ...nodes]. */
function expandApplianceSet(node) {
  const slug = getAttr(node, 'slug');
  const lang = getAttr(node, 'lang', 'en');
  if (!slug) return [node]; // Malformed — leave alone

  const models = loadAppliancesList(slug);
  if (models.length === 0) return []; // Empty list → render nothing

  // Bucket by category, applying CATEGORY_MERGE.
  const byCategory = new Map();
  for (const m of models) {
    const raw = loadApplianceCategory(m);
    const known = CATEGORY_ORDER.includes(raw) ? raw : 'other';
    const target = CATEGORY_MERGE[known] ?? known;
    if (!byCategory.has(target)) byCategory.set(target, []);
    byCategory.get(target).push(m);
  }

  const out = [heading(2, APPLIANCES_HEADING[lang] ?? APPLIANCES_HEADING.en)];
  for (const cat of CATEGORY_ORDER) {
    if (CATEGORY_MERGE[cat]) continue; // Skip merged-into category
    const items = byCategory.get(cat);
    if (!items || items.length === 0) continue;
    out.push(heading(3, CATEGORY_LABEL[lang]?.[cat] ?? CATEGORY_LABEL.en[cat]));
    for (const m of items) out.push(appliancePage(m, lang));
  }
  return out;
}

/** Plugin entry. */
export default function remarkApplianceToc() {
  return (tree) => {
    // Collect indices of ApplianceSet nodes first to avoid mutating during walk.
    const replacements = [];
    visit(tree, 'mdxJsxFlowElement', (node, index, parent) => {
      if (node.name !== 'ApplianceSet') return;
      if (parent == null || index == null) return;
      replacements.push({ parent, index, node });
    });

    // Replace from end to start so earlier indices stay valid.
    for (const { parent, index, node } of replacements.reverse()) {
      const expanded = expandApplianceSet(node);
      parent.children.splice(index, 1, ...expanded);
    }
  };
}
