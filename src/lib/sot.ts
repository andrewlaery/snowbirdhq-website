/**
 * Property SOT loader for the Next.js website.
 *
 * Reads the vendored copy of `_shared/properties/<slug>/` at
 * `data/sot/properties/<slug>/`. Loaders are sync (Node `fs`) since they
 * run at build time inside Server Components / MDX, not in the browser.
 *
 * The vendored copy is refreshed by `scripts/sync-sot.mjs`. Drift between
 * `_shared/properties/` (canonical) and `data/sot/properties/` (this copy)
 * is detected by `vrm doctor` in the ota-manager repo.
 *
 * Schema mirrors `_shared/snowbirdhq/property_models.py` — keep field names
 * and types aligned with the Python Pydantic models.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const SOT_ROOT = join(process.cwd(), 'data', 'sot', 'properties');
const QUEENSTOWN_ROOT = join(process.cwd(), 'data', 'sot', 'queenstown');
const SHARED_ROOT = join(process.cwd(), 'data', 'sot', '_shared');
const STRINGS_ROOT = join(process.cwd(), 'data', 'sot', '_strings');

// ── Types (mirror _shared/snowbirdhq/property_models.py) ─────────────

export type BedType =
  | 'single'
  | 'long_single'
  | 'double'
  | 'queen'
  | 'king'
  | 'super_king'
  | 'split_king'
  | 'sofa_bed'
  | 'cot';

export interface Bedroom {
  name: string;
  bed?: BedType | null;
  beds?: BedType[];
  ensuite?: boolean;
  notes?: string;
}

export interface Address {
  street: string;
  suburb?: string;
  city: string;
  region?: string;
  country?: string;
  postcode?: string;
}

export interface PlatformIds {
  airbnb_listing_url?: string;
  airbnb_listing_id?: string;
  vrbo_listing_url?: string;
  vrbo_property_id?: string;
  bookingcom_property_id?: string;
}

export interface Identity {
  schema_version: number;
  slug: string;
  listing_id: string;
  internal_name: string;
  display_name: string;
  listing_title?: string;
  short_code?: string;
  nicknames?: string[];
  property_type?: string;
  address: Address;
  platform_ids?: PlatformIds;
}

export interface Wifi {
  network: string;
  password: string;
}

export interface Capacity {
  max_guests: number;
  max_adults: number;
  min_age_lead_guest?: number;
}

export interface Parking {
  spaces?: number;
  type?: string;
  garage?: boolean;
  garage_remote?: boolean;
  notes?: string;
}

export interface CheckIn {
  start_time: string;
  end_time: string;
  method?: string;
  instructions?: string;
}

export interface CheckOut {
  time: string;
}

export interface HouseRules {
  no_smoking?: boolean;
  no_parties?: boolean;
  pets_allowed?: boolean;
  noise_curfew_start?: string;
  noise_curfew_end?: string;
}

export interface Hazard {
  description: string;
  severity?: 'info' | 'minor' | 'major';
}

export interface HouseRuleDelta {
  category: string;
  heading: string;
  bullets: string[];
}

export interface AccessInstructions {
  front_door?: string;
  back_door?: string;
  garage?: string;
  other?: string;
}

export interface UsageSection {
  category: string;
  heading: string;
  /** Markdown source. */
  body: string;
}

export interface PropertyExceptionsBlock {
  hazards?: Hazard[];
  house_rules?: HouseRuleDelta[];
  access?: AccessInstructions;
  notes?: string[];
  usage_sections?: UsageSection[];
}

export interface Facts {
  schema_version: number;
  slug: string;
  capacity: Capacity;
  bedrooms: Bedroom[];
  bedroom_count: number;
  bed_count: number;
  bathroom_count: number;
  beds_summary?: string;
  amenities?: string[];
  features?: string[];
  parking?: Parking;
  check_in: CheckIn;
  check_out: CheckOut;
  wifi: Wifi;
  house_rules?: HouseRules;
  /** Models declared by slug — keys into the appliance library. */
  appliances?: string[];
  /** Property-specific deltas not covered by other facts.yaml fields. */
  exceptions?: PropertyExceptionsBlock;
}

export interface Prose {
  frontMatter: Record<string, unknown>;
  body: string;
  /** Top-level `## ` sections, keyed by heading text (stripped). */
  sections: Record<string, string>;
}

// ── File loaders ─────────────────────────────────────────────────────

export type Lang = 'en' | 'zh';

function slugDir(slug: string, lang: Lang = 'en'): string {
  const base = join(SOT_ROOT, slug);
  const dir = lang === 'en' ? base : join(base, lang);
  if (!existsSync(dir)) {
    throw new Error(
      `Property SOT folder not found: ${dir}. ${
        lang === 'en'
          ? 'Run `npm run sync-sot` to refresh the vendored copy.'
          : `Run \`node --env-file=.env.local scripts/translate-property.mjs ${slug} ${lang}\` to generate translations.`
      }`,
    );
  }
  return dir;
}

function loadYaml<T>(path: string): T {
  if (!existsSync(path)) {
    throw new Error(`Required SOT file missing: ${path}`);
  }
  return yaml.load(readFileSync(path, 'utf-8')) as T;
}

export function loadIdentity(slug: string, lang: Lang = 'en'): Identity {
  return loadYaml<Identity>(join(slugDir(slug, lang), 'identity.yaml'));
}

export function loadFacts(slug: string, lang: Lang = 'en'): Facts {
  return loadYaml<Facts>(join(slugDir(slug, lang), 'facts.yaml'));
}

/** Front-matter + body + extracted sections from a Markdown file. */
export function loadProse(slug: string, name: string, lang: Lang = 'en'): Prose | null {
  const path = join(slugDir(slug, lang), `${name}.md`);
  if (!existsSync(path)) return null;

  const text = readFileSync(path, 'utf-8');
  const { frontMatter, body } = parseFrontMatter(text);
  const sections = extractSections(body);
  return { frontMatter, body, sections };
}

function parseFrontMatter(text: string): { frontMatter: Record<string, unknown>; body: string } {
  const lines = text.split('\n');
  if (lines[0]?.trim() !== '---') return { frontMatter: {}, body: text };

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      const yamlBlock = lines.slice(1, i).join('\n');
      const body = lines.slice(i + 1).join('\n').replace(/^\n+/, '');
      const fm = (yaml.load(yamlBlock) as Record<string, unknown>) || {};
      return { frontMatter: fm, body };
    }
  }
  return { frontMatter: {}, body: text };
}

function extractSections(body: string): Record<string, string> {
  // Match top-level headings — both H1 (`# `) and H2 (`## `). guest_copy.md
  // files in the SOT use H1 for major sections (Welcome, House Rules, etc.),
  // but earlier authoring sometimes used H2; treat them as siblings so both
  // styles work without forcing a vault-wide migration.
  const sections: Record<string, string> = {};
  const matches = [...body.matchAll(/^(#{1,2})\s+(.+)$/gm)];
  for (let i = 0; i < matches.length; i++) {
    const heading = matches[i][2].trim();
    const start = matches[i].index! + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : body.length;
    sections[heading] = body.slice(start, end).trim();
  }
  return sections;
}

// ── Convenience helpers for components ───────────────────────────────

/** Format an Address for display: "7 Suburb Street, Queenstown" */
export function formatAddress(address: Address): string {
  return [address.street, address.city].filter(Boolean).join(', ');
}

/** Render a 24-hour time as a guest-facing label: "15:00" -> "3pm" (en) / "下午3点" (zh). */
export function formatTime(t: string, lang: Lang = 'en'): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  if (!m) return t;
  const hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  if (lang === 'zh') {
    const period = hour >= 12 ? '下午' : '上午';
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return minute === 0 ? `${period}${h12}点` : `${period}${h12}点${minute}分`;
  }
  const period = hour >= 12 ? 'pm' : 'am';
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return minute === 0 ? `${h12}${period}` : `${h12}:${m[2]}${period}`;
}

/** Format parking summary for the QuickInfo card. */
export function formatParking(parking?: Parking, lang: Lang = 'en'): string {
  if (lang === 'zh') {
    if (!parking) return '请参阅指南';
    const parts: string[] = [];
    if (parking.spaces) parts.push(`${parking.spaces} 个车位`);
    if (parking.garage) parts.push(parking.garage_remote ? '带遥控器的车库' : '车库');
    return parts.length ? parts.join('，') : '请参阅指南';
  }
  if (!parking) return 'See guide';
  const parts: string[] = [];
  if (parking.spaces) parts.push(`${parking.spaces} space${parking.spaces > 1 ? 's' : ''}`);
  if (parking.type) parts.push(parking.type);
  if (parking.garage) parts.push(parking.garage_remote ? 'garage with remote' : 'garage');
  return parts.length ? parts.join(', ') : 'See guide';
}

// ── Shared boilerplate (cross-property, locale-keyed Markdown) ───────

/**
 * Load shared boilerplate Markdown by name. Files live at
 * `data/sot/_shared/<name>.md` (canonical EN) with translation overlays at
 * `data/sot/_shared/<lang>/<name>.md`. Used by the cross-property components
 * `<HouseRulesBase />`, `<CriticalInfoBase />`, `<QueenstownEssentials />`.
 *
 * Falls back to the EN file if the requested locale's overlay is missing —
 * keeps EN rendering unaffected when adding a locale incrementally.
 */
export function loadShared(name: string, lang: Lang = 'en'): string {
  const dir = lang === 'en' ? SHARED_ROOT : join(SHARED_ROOT, lang);
  const path = join(dir, `${name}.md`);
  if (existsSync(path)) {
    return readFileSync(path, 'utf-8');
  }
  // Fallback to EN if the locale-specific file is missing.
  if (lang !== 'en') {
    const enPath = join(SHARED_ROOT, `${name}.md`);
    if (existsSync(enPath)) {
      return readFileSync(enPath, 'utf-8');
    }
  }
  throw new Error(`Shared SOT file missing: ${path}`);
}

// ── UI chrome strings (locale-keyed, non-content) ────────────────────

/**
 * UI chrome strings (suggestion chips, error labels, nav card text, etc.)
 * sourced from data/sot/_strings/<lang>.yaml. Mirrors en.yaml shape.
 */
export interface Strings {
  landing_nav: {
    aria_label: string;
    sections: Record<
      string,
      { num: string; eyebrow: string; title: string; description: string; cta: string }
    >;
  };
  property_landing: { eyebrow: string; intro: string };
  ask_chat: {
    intro: string;
    suggested_aria: string;
    thinking: string;
    error_generic: string;
    placeholder: string;
    send: string;
    suggestions: string[];
  };
  layout: { brand: string; footer_note: string };
  locale_switcher: { english: string; chinese: string };
}

const stringsCache: Partial<Record<Lang, Strings>> = {};

export function loadStrings(lang: Lang = 'en'): Strings {
  const cached = stringsCache[lang];
  if (cached) return cached;
  const path = join(STRINGS_ROOT, `${lang}.yaml`);
  const fallback = join(STRINGS_ROOT, 'en.yaml');
  const target = existsSync(path) ? path : fallback;
  if (!existsSync(target)) {
    throw new Error(`Strings file missing: ${target}`);
  }
  const parsed = yaml.load(readFileSync(target, 'utf-8')) as Strings;
  stringsCache[lang] = parsed;
  return parsed;
}

/** Substitute `{placeholder}` tokens in a translated string. */
export function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

// ── Queenstown Insights (shared, non-property data) ──────────────────

export interface QueenstownInsightItem {
  name: string;
  description: string;
  website?: string | null;
  google_maps?: string | null;
  address?: string | null;
  /** Optional editorial tags (e.g. "family", "splurge"). Currently unused — schema hook for future content work. */
  tags?: string[];
  /** Optional hero image URL or path under /public. Currently unused — schema hook for future content work. */
  image?: string | null;
}

export interface QueenstownInsightSubgroup {
  title: string;
  items: QueenstownInsightItem[];
}

export interface QueenstownInsightHeroImage {
  url: string;
  photographer?: string | null;
  photographer_url?: string | null;
  /** Internal note about why the photo was chosen (not rendered). */
  note?: string | null;
}

export interface QueenstownInsightSection {
  id: string;
  title: string;
  intro?: string | null;
  outro?: string | null;
  items?: QueenstownInsightItem[];
  subgroups?: QueenstownInsightSubgroup[];
  hero_image?: QueenstownInsightHeroImage | null;
}

export interface QueenstownInsights {
  schema_version: number;
  sections: QueenstownInsightSection[];
}

export function loadQueenstownInsights(): QueenstownInsights {
  const path = join(QUEENSTOWN_ROOT, 'insights.yaml');
  if (!existsSync(path)) {
    throw new Error(
      `Queenstown insights SOT missing: ${path}. Run \`npm run sync-sot\` to refresh the vendored copy.`,
    );
  }
  return yaml.load(readFileSync(path, 'utf-8')) as QueenstownInsights;
}
