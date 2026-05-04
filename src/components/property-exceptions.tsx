/**
 * Renderers for facts.yaml::exceptions — the per-property structured deltas.
 *
 * The five components map 1:1 to the five exception subsections so MDX can
 * place them precisely (hazards belong in critical-info, house_rules in
 * welcome-house-rules, etc.).
 *
 * Each accepts an optional `lang` prop (default `'en'`). When set, facts are
 * loaded from the locale's translated overlay at
 * `data/sot/properties/<slug>/<lang>/facts.yaml`.
 *
 * UI-chrome strings (section headings, labels) are still hardcoded English
 * here — they move to next-intl in Phase A's UI-chrome step.
 */

import ReactMarkdown from 'react-markdown';

import { loadFacts, type Lang } from '@/lib/sot';
import { mdxLinkComponents } from '@/lib/mdx-link';

interface SlugProp {
  slug: string;
  lang?: Lang;
}

const HEADINGS = {
  en: {
    hazards: 'Property-Specific Hazards',
    access: 'Access',
    accessFront: 'Front door',
    accessBack: 'Back door',
    accessGarage: 'Garage',
    notes: 'Notes',
  },
  zh: {
    hazards: '房源特定安全提示',
    access: '门禁',
    accessFront: '前门',
    accessBack: '后门',
    accessGarage: '车库',
    notes: '其他说明',
  },
  ja: {
    hazards: '物件固有の安全注意事項',
    access: '入退室方法',
    accessFront: '玄関ドア',
    accessBack: '裏口',
    accessGarage: 'ガレージ',
    notes: 'その他のご案内',
  },
} as const;

export function PropertyHazards({ slug, lang = 'en' }: SlugProp) {
  const hazards = loadFacts(slug, lang).exceptions?.hazards ?? [];
  if (hazards.length === 0) return null;
  const t = HEADINGS[lang];
  return (
    <>
      <h3>{t.hazards}</h3>
      <ul>
        {hazards.map((h, i) => (
          <li key={i}>{h.description.trim()}</li>
        ))}
      </ul>
    </>
  );
}

// Custom react-markdown components: render bullet content inline (no <p>
// wrapper inside <li>) so **bold** / _italics_ / [links] in YAML bullets
// render as proper HTML, not literal characters.
const inlineMarkdownComponents = {
  ...mdxLinkComponents,
  p: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
};

export function PropertyHouseRulesDeltas({ slug, lang = 'en' }: SlugProp) {
  const deltas = loadFacts(slug, lang).exceptions?.house_rules ?? [];
  if (deltas.length === 0) return null;
  return (
    <>
      {deltas.map((d) => (
        <section key={d.category}>
          <h3>{d.heading}</h3>
          <ul>
            {d.bullets.map((b, i) => (
              <li key={i}>
                <ReactMarkdown components={inlineMarkdownComponents}>
                  {b}
                </ReactMarkdown>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

export function PropertyAccessInstructions({ slug, lang = 'en' }: SlugProp) {
  const a = loadFacts(slug, lang).exceptions?.access;
  if (!a || !(a.front_door || a.back_door || a.garage || a.other)) return null;
  const t = HEADINGS[lang];
  return (
    <section>
      <h3>{t.access}</h3>
      <ul>
        {a.front_door && (
          <li>
            <strong>{t.accessFront}:</strong> {a.front_door.trim()}
          </li>
        )}
        {a.back_door && (
          <li>
            <strong>{t.accessBack}:</strong> {a.back_door.trim()}
          </li>
        )}
        {a.garage && (
          <li>
            <strong>{t.accessGarage}:</strong> {a.garage.trim()}
          </li>
        )}
        {a.other && <li>{a.other.trim()}</li>}
      </ul>
    </section>
  );
}

export function PropertyOperationalNotes({ slug, lang = 'en' }: SlugProp) {
  const notes = loadFacts(slug, lang).exceptions?.notes ?? [];
  if (notes.length === 0) return null;
  const t = HEADINGS[lang];
  return (
    <section>
      <h3>{t.notes}</h3>
      <ul>
        {notes.map((n, i) => (
          <li key={i}>
            <ReactMarkdown components={inlineMarkdownComponents}>
              {n}
            </ReactMarkdown>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PropertyUsageSections({ slug, lang = 'en' }: SlugProp) {
  // The `appliances` category is owned by <ApplianceSet> — it renders the
  // body inline under its own H2/anchor so the page only ever has one
  // "Appliances" section, regardless of which underlying pattern
  // (component-library or text-tip) provides the content.
  const sections = (loadFacts(slug, lang).exceptions?.usage_sections ?? []).filter(
    (s) => s.category !== 'appliances',
  );
  if (sections.length === 0) return null;
  return (
    <>
      {sections.map((s) => (
        <section key={s.category}>
          <h3>{s.heading}</h3>
          <ReactMarkdown components={mdxLinkComponents}>{s.body.trim()}</ReactMarkdown>
        </section>
      ))}
    </>
  );
}
