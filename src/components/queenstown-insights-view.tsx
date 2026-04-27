'use client';

/**
 * Interactive view for Queenstown Insights.
 *
 * - Hero quick-jump grid of section icons (anchor links, mobile-friendly TOC).
 * - Sticky area filter chip bar (queenstown / arrowtown / cromwell / wanaka /
 *   gibbston-valley / regional).
 * - Each section rendered as a card grid; cards have line-clamped descriptions
 *   that expand on click, plus pill action links (Website / Map / area).
 *
 * Sections collapse out of the DOM (display:none) when the area filter has
 * no matching items, so the section TOC stays accurate to what's visible.
 */

import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Beer,
  Bike,
  Briefcase,
  ChevronDown,
  Cloud,
  Coffee,
  Compass,
  ExternalLink,
  Hammer,
  Map as MapIcon,
  MapPin,
  Martini,
  Mountain,
  MountainSnow,
  Newspaper,
  ShoppingBag,
  Snowflake,
  Truck,
  UtensilsCrossed,
  Users,
  Wine,
  type LucideIcon,
} from 'lucide-react';
import type { PreparedItem, PreparedSection, SectionType } from './queenstown-insights';

const SECTION_ICONS: Record<string, LucideIcon> = {
  'luggage-storage': Briefcase,
  'groceries-shop': ShoppingBag,
  breweries: Beer,
  wineries: Wine,
  cafes: Coffee,
  dining: UtensilsCrossed,
  'food-delivery': Truck,
  bars: Martini,
  'activities-adventures': Compass,
  hiking: Mountain,
  'rainy-days': Cloud,
  'local-news': Newspaper,
  'local-communities': Users,
  'ski-board-hire': Snowflake,
  'ski-fields': MountainSnow,
  'bike-tracks': Bike,
};

function iconFor(sectionId: string): LucideIcon {
  return SECTION_ICONS[sectionId] ?? Hammer;
}

interface AreaFacet {
  slug: string;
  label: string;
  count: number;
}

interface TypeFacet {
  slug: SectionType;
  label: string;
  count: number;
}

interface Props {
  sections: PreparedSection[];
  areas: AreaFacet[];
  types: TypeFacet[];
  totalItems: number;
}

const AREA_MAPS_QUERY: Record<string, string> = {
  all: 'Queenstown New Zealand',
  queenstown: 'Queenstown CBD New Zealand',
  arrowtown: 'Arrowtown New Zealand',
  cromwell: 'Cromwell Central Otago New Zealand',
  wanaka: 'Wanaka New Zealand',
  'gibbston-valley': 'Gibbston Valley wineries New Zealand',
  regional: 'Central Otago Queenstown New Zealand',
};

export function QueenstownInsightsView({ sections, areas, types, totalItems }: Props) {
  const [activeArea, setActiveArea] = useState<string>('all');
  const [activeTypes, setActiveTypes] = useState<Set<SectionType>>(new Set());

  const matchesFilters = (item: PreparedItem) =>
    (activeArea === 'all' || item.area === activeArea) &&
    (activeTypes.size === 0 || activeTypes.has(item.type));

  // Per-section visible-item count given the active filters.
  const visibleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of sections) {
      counts[s.id] = s.items.filter(matchesFilters).length;
    }
    return counts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, activeArea, activeTypes]);

  const totalVisible = Object.values(visibleCounts).reduce((a, b) => a + b, 0);

  const toggleType = (t: SectionType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    AREA_MAPS_QUERY[activeArea] ?? AREA_MAPS_QUERY.all,
  )}`;

  return (
    <div className="not-prose">
      <Hero
        totalItems={totalItems}
        sections={sections}
        visibleCounts={visibleCounts}
        mapsUrl={mapsUrl}
        activeArea={activeArea}
      />

      <FilterBar
        areas={areas}
        types={types}
        activeArea={activeArea}
        activeTypes={activeTypes}
        onAreaChange={setActiveArea}
        onTypeToggle={toggleType}
        totalItems={totalItems}
        totalVisible={totalVisible}
      />

      {sections.map((section) => {
        const visible = visibleCounts[section.id];
        if (visible === 0) return null;
        return (
          <SectionBlock
            key={section.id}
            section={section}
            matchesFilters={matchesFilters}
            visibleCount={visible}
          />
        );
      })}
    </div>
  );
}

// ── Hero quick-jump grid ─────────────────────────────────────────────

function Hero({
  totalItems,
  sections,
  visibleCounts,
  mapsUrl,
  activeArea,
}: {
  totalItems: number;
  sections: PreparedSection[];
  visibleCounts: Record<string, number>;
  mapsUrl: string;
  activeArea: string;
}) {
  const mapsLabel =
    activeArea === 'all' ? 'Browse the whole guide on Google Maps' : 'Open this area on Google Maps';
  return (
    <section className="mb-12">
      <p
        className="snow-eyebrow mb-3"
        style={{
          fontFamily: 'var(--snow-font-mono)',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--snow-ink-3)',
        }}
      >
        Local guide · {totalItems} hand-picked spots
      </p>
      <p
        className="mb-6 max-w-2xl text-lg leading-relaxed"
        style={{ color: 'var(--snow-ink-2)' }}
      >
        Where to eat, drink, hike, and unwind around Queenstown — curated by
        the SnowbirdHQ team. Filter by area or type, or jump straight to a
        category.
      </p>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
        style={{
          background: 'var(--snow-ink)',
          color: 'var(--snow-bg)',
          borderColor: 'var(--snow-ink)',
          textDecoration: 'none',
        }}
      >
        <MapIcon size={14} strokeWidth={1.75} aria-hidden />
        {mapsLabel}
      </a>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        }}
      >
        {sections.map((s) => {
          const Icon = iconFor(s.id);
          const count = visibleCounts[s.id];
          const dimmed = count === 0;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-disabled={dimmed}
              className="group flex items-center gap-3 rounded-md border p-3 transition-all"
              style={{
                background: 'var(--snow-paper)',
                borderColor: 'var(--snow-line)',
                color: 'var(--snow-ink)',
                opacity: dimmed ? 0.4 : 1,
                pointerEvents: dimmed ? 'none' : 'auto',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--snow-accent)';
                e.currentTarget.style.background = 'var(--snow-accent-soft)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--snow-line)';
                e.currentTarget.style.background = 'var(--snow-paper)';
              }}
            >
              <Icon size={18} strokeWidth={1.5} aria-hidden />
              <div className="flex min-w-0 flex-col">
                <span
                  className="text-sm leading-tight"
                  style={{ fontWeight: 500 }}
                >
                  {s.title}
                </span>
                <span
                  className="mt-0.5 text-xs"
                  style={{ color: 'var(--snow-ink-3)' }}
                >
                  {count} {count === 1 ? 'spot' : 'spots'}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

// ── Filter bar ───────────────────────────────────────────────────────

function FilterBar({
  areas,
  types,
  activeArea,
  activeTypes,
  onAreaChange,
  onTypeToggle,
  totalItems,
  totalVisible,
}: {
  areas: AreaFacet[];
  types: TypeFacet[];
  activeArea: string;
  activeTypes: Set<SectionType>;
  onAreaChange: (a: string) => void;
  onTypeToggle: (t: SectionType) => void;
  totalItems: number;
  totalVisible: number;
}) {
  const areaChips: AreaFacet[] = [
    { slug: 'all', label: 'All', count: totalItems },
    ...areas,
  ];
  return (
    <div
      className="sticky top-0 z-10 -mx-4 mb-10 space-y-2.5 border-y px-4 py-3 backdrop-blur"
      style={{
        background: 'color-mix(in oklab, var(--snow-bg) 92%, transparent)',
        borderColor: 'var(--snow-line)',
      }}
    >
      <FilterRow label="Area">
        {areaChips.map((c) => (
          <Chip
            key={c.slug}
            active={c.slug === activeArea}
            onClick={() => onAreaChange(c.slug)}
            count={c.count}
          >
            {c.label}
          </Chip>
        ))}
      </FilterRow>
      <FilterRow label="Type">
        {types.map((t) => (
          <Chip
            key={t.slug}
            active={activeTypes.has(t.slug)}
            onClick={() => onTypeToggle(t.slug)}
            count={t.count}
          >
            {t.label}
          </Chip>
        ))}
        <span
          className="ml-auto self-center text-xs"
          style={{
            fontFamily: 'var(--snow-font-mono)',
            color: 'var(--snow-ink-3)',
            letterSpacing: '0.05em',
          }}
        >
          {totalVisible} of {totalItems} shown
        </span>
      </FilterRow>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="snow-eyebrow mr-1"
        style={{
          fontFamily: 'var(--snow-font-mono)',
          fontSize: 10,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--snow-ink-3)',
          minWidth: 36,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3 py-1 text-sm transition-colors"
      style={{
        background: active ? 'var(--snow-ink)' : 'var(--snow-paper)',
        color: active ? 'var(--snow-bg)' : 'var(--snow-ink-2)',
        borderColor: active ? 'var(--snow-ink)' : 'var(--snow-line)',
        fontWeight: active ? 500 : 400,
      }}
    >
      {children}
      <span
        className="ml-1.5 text-xs"
        style={{
          color: active ? 'var(--snow-bg)' : 'var(--snow-ink-3)',
          opacity: 0.85,
        }}
      >
        {count}
      </span>
    </button>
  );
}

// ── Section block ────────────────────────────────────────────────────

function SectionBlock({
  section,
  matchesFilters,
  visibleCount,
}: {
  section: PreparedSection;
  matchesFilters: (item: PreparedItem) => boolean;
  visibleCount: number;
}) {
  const Icon = iconFor(section.id);
  const filteredItems = section.items.filter(matchesFilters);

  // Group by sub-label (hiking durations, "Bike stores") if any apply.
  const subgroupedSlugs = section.subgroupLabels?.flatMap((g) => g.itemSlugs) ?? [];
  const hasSubgroups = subgroupedSlugs.length > 0;
  const ungroupedItems = filteredItems.filter(
    (i) => !subgroupedSlugs.includes(i.slug),
  );

  return (
    <section id={section.id} className="mb-16 scroll-mt-24">
      {section.heroImage && (
        <SectionHero
          image={section.heroImage}
          title={section.title}
          icon={Icon}
          visibleCount={visibleCount}
        />
      )}

      {!section.heroImage && (
        <header
          className="mb-5 flex items-end justify-between gap-4 border-b pb-3"
          style={{ borderColor: 'var(--snow-line)' }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-md"
              style={{
                background: 'var(--snow-accent-soft)',
                color: 'var(--snow-accent)',
              }}
            >
              <Icon size={18} strokeWidth={1.5} aria-hidden />
            </span>
            <h2
              className="m-0"
              style={{
                fontFamily: 'var(--snow-font-display)',
                fontWeight: 400,
                fontSize: 'clamp(24px, 2.4vw, 32px)',
                letterSpacing: '-0.01em',
                color: 'var(--snow-ink)',
              }}
            >
              {section.title}
            </h2>
          </div>
          <span
            className="snow-eyebrow whitespace-nowrap"
            style={{
              fontFamily: 'var(--snow-font-mono)',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--snow-ink-3)',
            }}
          >
            {visibleCount} {visibleCount === 1 ? 'spot' : 'spots'}
          </span>
        </header>
      )}

      {section.intro && (
        <div
          className="mb-6 max-w-2xl"
          style={{ color: 'var(--snow-ink-2)' }}
        >
          <ReactMarkdown>{section.intro}</ReactMarkdown>
        </div>
      )}

      {!hasSubgroups && <CardGrid items={filteredItems} />}

      {hasSubgroups && (
        <>
          {ungroupedItems.length > 0 && <CardGrid items={ungroupedItems} />}
          {section.subgroupLabels?.map((sg) => {
            const sgItems = filteredItems.filter((i) => sg.itemSlugs.includes(i.slug));
            if (sgItems.length === 0) return null;
            return (
              <div key={sg.title} className="mt-8">
                <h3
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--snow-font-display)',
                    fontWeight: 400,
                    fontSize: 20,
                    color: 'var(--snow-ink)',
                  }}
                >
                  {sg.title}
                </h3>
                <CardGrid items={sgItems} />
              </div>
            );
          })}
        </>
      )}

      {section.outro && (
        <div
          className="mt-6 max-w-2xl text-sm italic"
          style={{ color: 'var(--snow-ink-3)' }}
        >
          <ReactMarkdown>{section.outro}</ReactMarkdown>
        </div>
      )}
    </section>
  );
}

// ── Section hero (cinematic banner with title overlay) ──────────────

function SectionHero({
  image,
  title,
  icon: Icon,
  visibleCount,
}: {
  image: { url: string; photographer?: string | null; photographer_url?: string | null };
  title: string;
  icon: LucideIcon;
  visibleCount: number;
}) {
  return (
    <header className="relative mb-6 overflow-hidden rounded-lg" style={{ aspectRatio: '5 / 1' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={`${title} — Queenstown`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,20,20,0.05) 0%, rgba(20,20,20,0.15) 40%, rgba(20,20,20,0.65) 100%)',
        }}
      />
      <div className="absolute inset-0 flex items-end justify-between gap-4 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-md backdrop-blur"
            style={{
              background: 'rgba(251, 248, 243, 0.92)',
              color: 'var(--snow-accent)',
            }}
          >
            <Icon size={20} strokeWidth={1.5} aria-hidden />
          </span>
          <h2
            className="m-0"
            style={{
              fontFamily: 'var(--snow-font-display)',
              fontWeight: 400,
              fontSize: 'clamp(26px, 2.8vw, 36px)',
              letterSpacing: '-0.01em',
              color: 'var(--snow-bg)',
              textShadow: '0 1px 14px rgba(0,0,0,0.35)',
            }}
          >
            {title}
          </h2>
        </div>
        <span
          className="snow-eyebrow whitespace-nowrap"
          style={{
            fontFamily: 'var(--snow-font-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--snow-bg)',
            opacity: 0.85,
          }}
        >
          {visibleCount} {visibleCount === 1 ? 'spot' : 'spots'}
        </span>
      </div>
      {image.photographer && (
        <a
          href={image.photographer_url ?? '#'}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="absolute right-2 top-2 rounded px-1.5 py-0.5 text-[10px]"
          style={{
            fontFamily: 'var(--snow-font-mono)',
            background: 'rgba(20,20,20,0.45)',
            color: 'rgba(251,248,243,0.85)',
            textDecoration: 'none',
          }}
        >
          📷 {image.photographer}
        </a>
      )}
    </header>
  );
}

// ── Cards ────────────────────────────────────────────────────────────

function CardGrid({ items }: { items: PreparedItem[] }) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
    >
      {items.map((item) => (
        <Card key={item.slug} item={item} />
      ))}
    </div>
  );
}

const CLAMP_THRESHOLD = 220; // chars — descriptions longer than this clamp by default

function Card({ item }: { item: PreparedItem }) {
  const [expanded, setExpanded] = useState(false);
  const needsClamp = item.description.length > CLAMP_THRESHOLD;

  // Build a Google Maps search URL from the item name + Queenstown — works
  // without an API key and pulls up the venue plus directions.
  const mapsSearchUrl =
    item.google_maps ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' Queenstown New Zealand')}`;

  return (
    <article
      className="flex flex-col rounded-lg border p-5 transition-shadow"
      style={{
        background: 'var(--snow-paper)',
        borderColor: 'var(--snow-line)',
      }}
    >
      <h4
        className="mb-2 m-0"
        style={{
          fontFamily: 'var(--snow-font-display)',
          fontWeight: 500,
          fontSize: 19,
          letterSpacing: '-0.005em',
          color: 'var(--snow-ink)',
          lineHeight: 1.2,
        }}
      >
        {item.name}
      </h4>

      <div
        className="mb-4 text-sm leading-relaxed"
        style={{
          color: 'var(--snow-ink-2)',
          display: needsClamp && !expanded ? '-webkit-box' : 'block',
          WebkitLineClamp: needsClamp && !expanded ? 4 : undefined,
          WebkitBoxOrient: 'vertical' as const,
          overflow: needsClamp && !expanded ? 'hidden' : 'visible',
        }}
      >
        <ReactMarkdown>{item.description}</ReactMarkdown>
      </div>

      {needsClamp && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mb-4 flex items-center gap-1 self-start text-xs"
          style={{
            color: 'var(--snow-accent)',
            fontFamily: 'var(--snow-font-mono)',
            letterSpacing: '0.05em',
          }}
        >
          {expanded ? 'Show less' : 'Read more'}
          <ChevronDown
            size={12}
            strokeWidth={2}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 160ms ease',
            }}
          />
        </button>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Pill href={mapsSearchUrl} icon={MapPin}>
          Map
        </Pill>
        {item.website && (
          <Pill href={item.website} icon={ExternalLink}>
            Website
          </Pill>
        )}
        <span
          className="ml-auto text-xs"
          style={{
            fontFamily: 'var(--snow-font-mono)',
            color: 'var(--snow-ink-3)',
            letterSpacing: '0.05em',
          }}
        >
          {item.areaLabel}
        </span>
      </div>
    </article>
  );
}

function Pill({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors"
      style={{
        background: 'transparent',
        borderColor: 'var(--snow-line-2)',
        color: 'var(--snow-ink-2)',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--snow-accent)';
        e.currentTarget.style.color = 'var(--snow-accent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--snow-line-2)';
        e.currentTarget.style.color = 'var(--snow-ink-2)';
      }}
    >
      <Icon size={12} strokeWidth={1.75} aria-hidden />
      {children}
    </a>
  );
}
