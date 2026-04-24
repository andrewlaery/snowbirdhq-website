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

const DOCS_RECENT_KEY = 'docs:recent';
const DOCS_RECENT_MAX = 500;
const DOCS_TOTAL_PREFIX = 'docs:total:';

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

  try {
    await Promise.all([
      redis.incr(totalKey(slug)),
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

  try {
    await Promise.all([
      redis.incr(`${DOCS_TOTAL_PREFIX}${normalised}`),
      redis.lpush(DOCS_RECENT_KEY, JSON.stringify(event)),
      redis.ltrim(DOCS_RECENT_KEY, 0, DOCS_RECENT_MAX - 1),
    ]);
  } catch {
    // Never let a tracking failure affect the request upstream.
  }
}

export type Stats = {
  clicks: {
    totals: Array<{ slug: string; count: number }>;
    recent: ClickEvent[];
    totalClicks: number;
    distinctSlugs: number;
  };
  docs: {
    totals: Array<{ path: string; count: number }>;
    recent: DocsPageViewEvent[];
    totalPageViews: number;
    distinctPaths: number;
  };
};

export async function getStats(): Promise<Stats | null> {
  const redis = getRedis();
  if (!redis) return null;

  const [clicksRecentRaw, clicksKeys, docsRecentRaw, docsKeys] =
    await Promise.all([
      redis.lrange<string | ClickEvent>(RECENT_KEY, 0, RECENT_MAX - 1),
      redis.keys(`${TOTAL_PREFIX}*`),
      redis.lrange<string | DocsPageViewEvent>(
        DOCS_RECENT_KEY,
        0,
        DOCS_RECENT_MAX - 1,
      ),
      redis.keys(`${DOCS_TOTAL_PREFIX}*`),
    ]);

  const clicksRecent: ClickEvent[] = clicksRecentRaw.map((item) =>
    typeof item === 'string' ? (JSON.parse(item) as ClickEvent) : item,
  );
  const docsRecent: DocsPageViewEvent[] = docsRecentRaw.map((item) =>
    typeof item === 'string' ? (JSON.parse(item) as DocsPageViewEvent) : item,
  );

  const clicksTotals = await buildTotals(
    redis,
    clicksKeys,
    TOTAL_PREFIX,
    'slug',
  );
  const docsTotals = await buildTotals(
    redis,
    docsKeys,
    DOCS_TOTAL_PREFIX,
    'path',
  );

  return {
    clicks: {
      totals: clicksTotals as Array<{ slug: string; count: number }>,
      recent: clicksRecent,
      totalClicks: clicksTotals.reduce((sum, row) => sum + row.count, 0),
      distinctSlugs: clicksTotals.length,
    },
    docs: {
      totals: docsTotals as Array<{ path: string; count: number }>,
      recent: docsRecent,
      totalPageViews: docsTotals.reduce((sum, row) => sum + row.count, 0),
      distinctPaths: docsTotals.length,
    },
  };
}

async function buildTotals(
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
