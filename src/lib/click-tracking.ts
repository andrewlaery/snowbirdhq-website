// Click tracking for the go.bcampx.com / go.snowbirdhq.com redirector.
//
// Each click increments a per-slug counter and pushes a small JSON record onto
// a capped list of recent hits. Reads live in the /docs/internal/link-stats
// dashboard.
//
// Writes are fire-and-forget — the caller should wrap recordClick() in
// waitUntil() so the 302 redirect is never blocked waiting for Redis.

import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';

export type ClickEvent = {
  slug: string;
  ts: number;
  ipPrefix: string;
  country: string;
  city: string;
  ua: string;
  referer: string;
};

export type DocsPageViewEvent = {
  path: string;
  ts: number;
  ipPrefix: string;
  country: string;
  city: string;
  ua: string;
  referer: string;
};

const RECENT_KEY = 'clicks:recent';
const RECENT_MAX = 500;
const TOTAL_PREFIX = 'clicks:total:';
const DAY_PREFIX = 'clicks:day:'; // clicks:day:{YYYY-MM-DD}:{slug}

const DOCS_RECENT_KEY = 'docs:recent';
const DOCS_RECENT_MAX = 500;
const DOCS_TOTAL_PREFIX = 'docs:total:';
const DOCS_DAY_PREFIX = 'docs:day:'; // docs:day:{YYYY-MM-DD}:{path}

const DAY_TZ = 'Pacific/Auckland';
const DAY_FMT = new Intl.DateTimeFormat('en-CA', {
  timeZone: DAY_TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

// YYYY-MM-DD in NZT for a given timestamp. en-CA naturally formats as ISO.
export function dayKey(ts: number): string {
  return DAY_FMT.format(new Date(ts));
}

let _redis: Redis | null | undefined;
function getRedis(): Redis | null {
  if (_redis !== undefined) return _redis;
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? '';
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? '';
  _redis = url && token ? new Redis({ url, token }) : null;
  return _redis;
}

export function totalKey(slug: string): string {
  return `${TOTAL_PREFIX}${slug}`;
}

export async function recordClick(
  slug: string,
  request: NextRequest,
): Promise<void> {
  if (process.env.DISABLE_CLICK_TRACKING === 'true') return;
  const redis = getRedis();
  if (!redis) return;

  const event: ClickEvent = {
    slug,
    ts: Date.now(),
    ipPrefix: truncateIp(request.headers.get('x-forwarded-for')),
    country: request.headers.get('x-vercel-ip-country') ?? '',
    city: decodeCity(request.headers.get('x-vercel-ip-city')),
    ua: bucketUserAgent(request.headers.get('user-agent') ?? ''),
    referer: refererHost(request.headers.get('referer')),
  };

  const day = dayKey(event.ts);

  try {
    await Promise.all([
      redis.incr(totalKey(slug)),
      redis.incr(`${DAY_PREFIX}${day}:${slug}`),
      redis.lpush(RECENT_KEY, JSON.stringify(event)),
      redis.ltrim(RECENT_KEY, 0, RECENT_MAX - 1),
    ]);
  } catch {
    // Never let a tracking failure affect the redirect behaviour upstream.
  }
}

export async function recordDocsPageView(
  path: string,
  request: NextRequest,
): Promise<void> {
  if (process.env.DISABLE_CLICK_TRACKING === 'true') return;
  const redis = getRedis();
  if (!redis) return;

  const normalised = normalisePath(path);
  if (!normalised) return;

  const event: DocsPageViewEvent = {
    path: normalised,
    ts: Date.now(),
    ipPrefix: truncateIp(request.headers.get('x-forwarded-for')),
    country: request.headers.get('x-vercel-ip-country') ?? '',
    city: decodeCity(request.headers.get('x-vercel-ip-city')),
    ua: bucketUserAgent(request.headers.get('user-agent') ?? ''),
    referer: refererHost(request.headers.get('referer')),
  };

  const day = dayKey(event.ts);

  try {
    await Promise.all([
      redis.incr(`${DOCS_TOTAL_PREFIX}${normalised}`),
      redis.incr(`${DOCS_DAY_PREFIX}${day}:${normalised}`),
      redis.lpush(DOCS_RECENT_KEY, JSON.stringify(event)),
      redis.ltrim(DOCS_RECENT_KEY, 0, DOCS_RECENT_MAX - 1),
    ]);
  } catch {
    // Never let a tracking failure affect the request upstream.
  }
}

export type Range = 'all' | '30d' | '7d';

export type DayPoint = { day: string; count: number };

export type Stats = {
  range: Range;
  days: string[]; // day labels for the chart, oldest → newest
  clicks: {
    totals: Array<{ slug: string; count: number }>;
    recent: ClickEvent[];
    series: DayPoint[];
    totalClicks: number;
    distinctSlugs: number;
  };
  docs: {
    totals: Array<{ path: string; count: number }>;
    recent: DocsPageViewEvent[];
    series: DayPoint[];
    totalPageViews: number;
    distinctPaths: number;
  };
};

export async function getStats(range: Range = 'all'): Promise<Stats | null> {
  const redis = getRedis();
  if (!redis) return null;

  // Chart always shows last 30 days (even for 'all'); 7d shrinks it to 7.
  const chartDays = rangeDays(range === '7d' ? 7 : 30);
  const chartDaySet = new Set(chartDays);
  const rangeDaySet =
    range === 'all' ? null : new Set(rangeDays(range === '7d' ? 7 : 30));
  const rangeStartMs =
    range === 'all'
      ? 0
      : Date.now() - (range === '7d' ? 7 : 30) * 86400 * 1000;

  const [
    clicksRecentRaw,
    clicksLifetimeKeys,
    clicksDayKeys,
    docsRecentRaw,
    docsLifetimeKeys,
    docsDayKeys,
  ] = await Promise.all([
    redis.lrange<string | ClickEvent>(RECENT_KEY, 0, RECENT_MAX - 1),
    redis.keys(`${TOTAL_PREFIX}*`),
    redis.keys(`${DAY_PREFIX}*`),
    redis.lrange<string | DocsPageViewEvent>(
      DOCS_RECENT_KEY,
      0,
      DOCS_RECENT_MAX - 1,
    ),
    redis.keys(`${DOCS_TOTAL_PREFIX}*`),
    redis.keys(`${DOCS_DAY_PREFIX}*`),
  ]);

  const clicksRecent: ClickEvent[] = clicksRecentRaw
    .map((item) =>
      typeof item === 'string' ? (JSON.parse(item) as ClickEvent) : item,
    )
    .filter((e) => e.ts >= rangeStartMs);
  const docsRecent: DocsPageViewEvent[] = docsRecentRaw
    .map((item) =>
      typeof item === 'string' ? (JSON.parse(item) as DocsPageViewEvent) : item,
    )
    .filter((e) => e.ts >= rangeStartMs);

  const clicksAgg = await aggregateDay(
    redis,
    clicksDayKeys,
    DAY_PREFIX,
    chartDays,
    chartDaySet,
    rangeDaySet,
  );
  const docsAgg = await aggregateDay(
    redis,
    docsDayKeys,
    DOCS_DAY_PREFIX,
    chartDays,
    chartDaySet,
    rangeDaySet,
  );

  // Totals: 'all' uses lifetime counters (matches pre-range semantics and
  // includes anything that predated per-day tracking); ranged uses the
  // day-aggregated values from aggregateDay.
  const clicksTotals =
    range === 'all'
      ? await buildLifetimeTotals(redis, clicksLifetimeKeys, TOTAL_PREFIX, 'slug')
      : clicksAgg.totals.map((r) => ({ slug: r.entity, count: r.count }));
  const docsTotals =
    range === 'all'
      ? await buildLifetimeTotals(redis, docsLifetimeKeys, DOCS_TOTAL_PREFIX, 'path')
      : docsAgg.totals.map((r) => ({ path: r.entity, count: r.count }));

  return {
    range,
    days: chartDays,
    clicks: {
      totals: clicksTotals as Array<{ slug: string; count: number }>,
      recent: clicksRecent,
      series: chartDays.map((d) => ({ day: d, count: clicksAgg.byDay.get(d) ?? 0 })),
      totalClicks: clicksTotals.reduce((sum, r) => sum + r.count, 0),
      distinctSlugs: clicksTotals.length,
    },
    docs: {
      totals: docsTotals as Array<{ path: string; count: number }>,
      recent: docsRecent,
      series: chartDays.map((d) => ({ day: d, count: docsAgg.byDay.get(d) ?? 0 })),
      totalPageViews: docsTotals.reduce((sum, r) => sum + r.count, 0),
      distinctPaths: docsTotals.length,
    },
  };
}

async function buildLifetimeTotals(
  redis: Redis,
  keys: string[],
  prefix: string,
  fieldName: 'slug' | 'path',
): Promise<Array<{ slug?: string; path?: string; count: number }>> {
  if (keys.length === 0) return [];
  const counts = await redis.mget<Array<string | number | null>>(...keys);
  return keys
    .map((key, i) => ({
      [fieldName]: key.slice(prefix.length),
      count: Number(counts[i] ?? 0),
    }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count) as Array<{
    slug?: string;
    path?: string;
    count: number;
  }>;
}

// Aggregate per-day counter keys. Single mget for all in-window keys, then
// fold into { byDay: day → count (for chart) } and { totals: entity → count
// over the selected range (only populated when rangeDaySet is non-null) }.
async function aggregateDay(
  redis: Redis,
  allKeys: string[],
  prefix: string,
  chartDays: string[],
  chartDaySet: Set<string>,
  rangeDaySet: Set<string> | null,
): Promise<{
  byDay: Map<string, number>;
  totals: Array<{ entity: string; count: number }>;
}> {
  const byDay = new Map<string, number>();
  for (const d of chartDays) byDay.set(d, 0);

  if (allKeys.length === 0) return { byDay, totals: [] };

  // Only fetch keys that are in either the chart window or the range window.
  const relevant: Array<{ key: string; day: string; entity: string }> = [];
  for (const k of allKeys) {
    const rest = k.slice(prefix.length); // "YYYY-MM-DD:entity"
    const day = rest.slice(0, 10);
    const entity = rest.slice(11);
    if (chartDaySet.has(day) || rangeDaySet?.has(day)) {
      relevant.push({ key: k, day, entity });
    }
  }
  if (relevant.length === 0) return { byDay, totals: [] };

  const counts = await redis.mget<Array<string | number | null>>(
    ...relevant.map((r) => r.key),
  );
  const byEntity = new Map<string, number>();
  relevant.forEach((r, i) => {
    const n = Number(counts[i] ?? 0);
    if (chartDaySet.has(r.day)) {
      byDay.set(r.day, (byDay.get(r.day) ?? 0) + n);
    }
    if (rangeDaySet?.has(r.day)) {
      byEntity.set(r.entity, (byEntity.get(r.entity) ?? 0) + n);
    }
  });

  const totals = Array.from(byEntity.entries())
    .map(([entity, count]) => ({ entity, count }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  return { byDay, totals };
}

// Produce last N days (oldest → newest) as YYYY-MM-DD strings in NZT.
function rangeDays(n: number): string[] {
  const out: string[] = [];
  const now = Date.now();
  for (let i = n - 1; i >= 0; i--) {
    out.push(dayKey(now - i * 86400 * 1000));
  }
  return out;
}

// Path normalisation for docs pageview tracking. Keep the user-visible URL
// (without the internal `/docs` prefix), strip trailing slash except on root,
// and drop static-asset and auth paths entirely (return null so the caller
// skips the write).
export function normalisePath(path: string): string | null {
  if (!path) return null;
  // Middleware sometimes works with `/docs/...` (direct hits) and sometimes
  // with `/...` (subdomain rewrites). Collapse to the subdomain-facing form.
  let p = path.startsWith('/docs/')
    ? path.slice(5)
    : path === '/docs'
      ? '/'
      : path;
  // Strip trailing slash except for root.
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  // Anything that should never be counted as a pageview.
  if (
    p.startsWith('/api/') ||
    p.startsWith('/_next/') ||
    p.startsWith('/icon') ||
    p === '/access' ||
    p.startsWith('/access/') ||
    p === '/favicon.ico'
  ) {
    return null;
  }
  return p;
}

// --- helpers -------------------------------------------------------------

export function truncateIp(raw: string | null): string {
  if (!raw) return '';
  const first = raw.split(',')[0]?.trim() ?? '';
  const v4 = first.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}$/);
  if (v4) return `${v4[1]}.0`;
  return '';
}

export function bucketUserAgent(ua: string): string {
  if (!ua) return '';
  if (/bot|crawler|spider|curl|wget|python-requests|node-fetch/i.test(ua)) {
    return 'Bot';
  }
  const isMobile = /iPhone|iPad|iPod/.test(ua)
    ? 'iOS'
    : /Android/.test(ua)
      ? 'Android'
      : 'Desktop';
  const browser = /EdgA?\//.test(ua)
    ? 'Edge'
    : /SamsungBrowser/.test(ua)
      ? 'Samsung'
      : /CriOS|Chrome/.test(ua)
        ? 'Chrome'
        : /FxiOS|Firefox/.test(ua)
          ? 'Firefox'
          : /Safari/.test(ua)
            ? 'Safari'
            : 'Other';
  return `${isMobile} ${browser}`;
}

function refererHost(raw: string | null): string {
  if (!raw) return '';
  try {
    return new URL(raw).hostname;
  } catch {
    return '';
  }
}

function decodeCity(raw: string | null): string {
  if (!raw) return '';
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
