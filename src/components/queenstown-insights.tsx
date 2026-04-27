/**
 * Queenstown Insights — guest-facing local recommendations.
 *
 * Server component: loads the SOT YAML, normalises items into a flat list
 * with derived area tags, then hands off to the interactive client view.
 *
 * Area derivation:
 *   - Items inside an area-named subgroup (Queenstown / Arrowtown / Cromwell
 *     / Wanaka / Gibbston Valley) inherit that area.
 *   - Hiking sub-groups (duration buckets) and Bike Tracks "Bike stores"
 *     are not areas — items inherit the section's default area instead.
 *   - Section default: "queenstown" unless overridden in the map below.
 *
 * The data is shaped for the view rather than mirrored 1:1 — keeping the
 * source YAML editorially flat while letting the component sort/filter on
 * a richer shape.
 */

import {
  loadQueenstownInsights,
  type QueenstownInsightItem,
  type QueenstownInsightSection,
} from '@/lib/sot';
import { QueenstownInsightsView } from './queenstown-insights-view';

export interface PreparedItem extends QueenstownInsightItem {
  /** Stable key derived from name. */
  slug: string;
  /** Lowercase area slug (queenstown, arrowtown, cromwell, wanaka, gibbston-valley, regional). */
  area: string;
  /** Pretty area label for display. */
  areaLabel: string;
}

export interface PreparedSection {
  id: string;
  title: string;
  intro?: string | null;
  outro?: string | null;
  items: PreparedItem[];
  /**
   * Sub-group titles to render above sub-blocks of items, when they aren't
   * just region names (e.g. hiking durations, "Bike stores"). Empty when
   * the only sub-grouping was area-based.
   */
  subgroupLabels?: { title: string; itemSlugs: string[] }[];
}

/** Sections whose items are predominantly outside Queenstown proper. */
const SECTION_DEFAULT_AREA: Record<string, string> = {
  'local-news': 'regional',
  'ski-fields': 'regional',
  'ski-board-hire': 'regional',
};

/** Subgroup titles that *are* areas (case-insensitive). */
const AREA_SUBGROUPS = new Set([
  'queenstown',
  'arrowtown',
  'cromwell',
  'wanaka',
  'gibbston valley',
]);

const AREA_LABELS: Record<string, string> = {
  queenstown: 'Queenstown',
  arrowtown: 'Arrowtown',
  cromwell: 'Cromwell',
  wanaka: 'Wanaka',
  'gibbston-valley': 'Gibbston Valley',
  regional: 'Regional',
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function prepareSection(section: QueenstownInsightSection): PreparedSection {
  const defaultArea = SECTION_DEFAULT_AREA[section.id] ?? 'queenstown';
  const items: PreparedItem[] = [];
  const subgroupLabels: { title: string; itemSlugs: string[] }[] = [];

  const pushItem = (raw: QueenstownInsightItem, area: string) => {
    items.push({
      ...raw,
      slug: slugify(raw.name),
      area,
      areaLabel: AREA_LABELS[area] ?? area,
    });
  };

  if (section.items) {
    for (const raw of section.items) pushItem(raw, defaultArea);
  }

  if (section.subgroups) {
    for (const sub of section.subgroups) {
      const isAreaGroup = AREA_SUBGROUPS.has(sub.title.toLowerCase());
      const area = isAreaGroup ? slugify(sub.title) : defaultArea;
      const sectionStartIdx = items.length;
      for (const raw of sub.items) pushItem(raw, area);
      if (!isAreaGroup) {
        subgroupLabels.push({
          title: sub.title,
          itemSlugs: items.slice(sectionStartIdx).map((i) => i.slug),
        });
      }
    }
  }

  return {
    id: section.id,
    title: section.title,
    intro: section.intro,
    outro: section.outro,
    items,
    subgroupLabels: subgroupLabels.length ? subgroupLabels : undefined,
  };
}

export function QueenstownInsights() {
  const data = loadQueenstownInsights();
  const sections = data.sections.map(prepareSection);

  // Build the area facet (only show areas that have items).
  const areaCounts = new Map<string, number>();
  for (const s of sections) {
    for (const it of s.items) {
      areaCounts.set(it.area, (areaCounts.get(it.area) ?? 0) + 1);
    }
  }
  // Stable ordering: Queenstown first, then alphabetical, with Regional last.
  const orderedAreas = [...areaCounts.entries()]
    .map(([slug, count]) => ({ slug, count, label: AREA_LABELS[slug] ?? slug }))
    .sort((a, b) => {
      if (a.slug === 'queenstown') return -1;
      if (b.slug === 'queenstown') return 1;
      if (a.slug === 'regional') return 1;
      if (b.slug === 'regional') return -1;
      return a.label.localeCompare(b.label);
    });

  const totalItems = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <QueenstownInsightsView
      sections={sections}
      areas={orderedAreas}
      totalItems={totalItems}
    />
  );
}
