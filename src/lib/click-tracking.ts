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

const RECENT_KEY = 'clicks:recent';
const RECENT_MAX = 500;
const TOTAL_PREFIX = 'clicks:total:';

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

export type Stats = {
  totals: Array<{ slug: string; count: number }>;
  recent: ClickEvent[];
  totalClicks: number;
  distinctSlugs: number;
};

export async function getStats(): Promise<Stats | null> {
  const redis = getRedis();
  if (!redis) return null;

  const [recentRaw, keys] = await Promise.all([
    redis.lrange<string | ClickEvent>(RECENT_KEY, 0, RECENT_MAX - 1),
    // The Upstash REST API exposes `keys` — fine at this scale (60-ish slugs).
    // If the slug count ever grows large, switch to SCAN.
    redis.keys(`${TOTAL_PREFIX}*`),
  ]);

  const recent: ClickEvent[] = recentRaw.map((item) =>
    typeof item === 'string' ? (JSON.parse(item) as ClickEvent) : item,
  );

  let totals: Array<{ slug: string; count: number }> = [];
  if (keys.length > 0) {
    const counts = await redis.mget<Array<string | number | null>>(...keys);
    totals = keys
      .map((key, i) => ({
        slug: key.slice(TOTAL_PREFIX.length),
        count: Number(counts[i] ?? 0),
      }))
      .filter((row) => row.count > 0)
      .sort((a, b) => b.count - a.count);
  }

  const totalClicks = totals.reduce((sum, row) => sum + row.count, 0);

  return {
    totals,
    recent,
    totalClicks,
    distinctSlugs: totals.length,
  };
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
