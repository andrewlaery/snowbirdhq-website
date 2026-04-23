const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 20;

const buckets = new Map<string, number[]>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const existing = buckets.get(key) ?? [];
  const recent = existing.filter((t) => t > cutoff);

  if (recent.length >= MAX_REQUESTS) {
    buckets.set(key, recent);
    return {
      ok: false,
      remaining: 0,
      resetAt: recent[0] + WINDOW_MS,
    };
  }

  recent.push(now);
  buckets.set(key, recent);

  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) {
      if (v[v.length - 1] < cutoff) buckets.delete(k);
    }
  }

  return {
    ok: true,
    remaining: MAX_REQUESTS - recent.length,
    resetAt: now + WINDOW_MS,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}
