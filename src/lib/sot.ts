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

// ── Types (mirror _shared/snowbirdhq/property_models.py) ─────────────

export type BedType =
  | 'single'
  | 'long_single'
  | 'double'
  | 'queen'
  | 'king'
  | 'super_king'
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

function slugDir(slug: string): string {
  const dir = join(SOT_ROOT, slug);
  if (!existsSync(dir)) {
    throw new Error(
      `Property SOT folder not found: ${dir}. Run \`npm run sync-sot\` to refresh the vendored copy.`,
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

export function loadIdentity(slug: string): Identity {
  return loadYaml<Identity>(join(slugDir(slug), 'identity.yaml'));
}

export function loadFacts(slug: string): Facts {
  return loadYaml<Facts>(join(slugDir(slug), 'facts.yaml'));
}

/** Front-matter + body + extracted sections from a Markdown file. */
export function loadProse(slug: string, name: string): Prose | null {
  const path = join(slugDir(slug), `${name}.md`);
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
  const sections: Record<string, string> = {};
  const matches = [...body.matchAll(/^##\s+(.+)$/gm)];
  for (let i = 0; i < matches.length; i++) {
    const heading = matches[i][1].trim();
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

/** Render a 24-hour time as a guest-facing label: "15:00" -> "3pm". */
export function formatTime(t: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  if (!m) return t;
  const hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  const period = hour >= 12 ? 'pm' : 'am';
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return minute === 0 ? `${h12}${period}` : `${h12}:${m[2]}${period}`;
}

/** Format parking summary for the QuickInfo card. */
export function formatParking(parking?: Parking): string {
  if (!parking) return 'See guide';
  const parts: string[] = [];
  if (parking.spaces) parts.push(`${parking.spaces} space${parking.spaces > 1 ? 's' : ''}`);
  if (parking.type) parts.push(parking.type);
  if (parking.garage) parts.push(parking.garage_remote ? 'garage with remote' : 'garage');
  return parts.length ? parts.join(', ') : 'See guide';
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

export interface QueenstownInsightSection {
  id: string;
  title: string;
  intro?: string | null;
  outro?: string | null;
  items?: QueenstownInsightItem[];
  subgroups?: QueenstownInsightSubgroup[];
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
