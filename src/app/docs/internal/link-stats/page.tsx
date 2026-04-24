import type { Metadata } from 'next';
import {
  getStats,
  type ClickEvent,
  type DocsPageViewEvent,
} from '@/lib/click-tracking';

export const metadata: Metadata = {
  title: 'Traffic stats — SnowbirdHQ',
  robots: { index: false, follow: false },
};

// Never cache — we want live counters on refresh.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NZ_TZ = 'Pacific/Auckland';

function formatTimestamp(ts: number): string {
  return new Intl.DateTimeFormat('en-NZ', {
    timeZone: NZ_TZ,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(ts));
}

function lastSeenBy<T extends { ts: number }>(
  recent: T[],
  key: (item: T) => string,
): Map<string, number> {
  const out = new Map<string, number>();
  for (const hit of recent) {
    const k = key(hit);
    const prev = out.get(k);
    if (prev === undefined || hit.ts > prev) out.set(k, hit.ts);
  }
  return out;
}

export default async function LinkStatsPage() {
  const stats = await getStats();

  if (!stats) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-4 font-serif text-4xl font-light text-gray-900">
          Traffic stats
        </h1>
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-6 text-amber-900">
          <p className="mb-2 font-semibold">Redis is not configured.</p>
          <p className="text-sm">
            Set <code className="font-mono">KV_REST_API_URL</code> and{' '}
            <code className="font-mono">KV_REST_API_TOKEN</code> (or{' '}
            <code className="font-mono">UPSTASH_REDIS_REST_URL</code> /{' '}
            <code className="font-mono">UPSTASH_REDIS_REST_TOKEN</code>) on this
            Vercel project, then redeploy.
          </p>
        </div>
      </main>
    );
  }

  const { clicks, docs } = stats;
  const clicksLastSeen = lastSeenBy(clicks.recent, (h) => h.slug);
  const docsLastSeen = lastSeenBy(docs.recent, (h) => h.path);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10">
        <h1 className="mb-2 font-serif text-4xl font-light text-gray-900">
          Traffic stats
        </h1>
        <p className="text-sm text-gray-500">
          Short links (go.bcampx.com &amp; go.snowbirdhq.com) and
          docs.snowbirdhq.com pageviews — read-only, portal-gated.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 font-serif text-3xl font-light text-gray-900">
          Short links
        </h2>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Stat
            label="Total clicks"
            value={clicks.totalClicks.toLocaleString('en-NZ')}
          />
          <Stat
            label="Slugs with clicks"
            value={clicks.distinctSlugs.toString()}
          />
          <Stat
            label="Recent hits buffered"
            value={clicks.recent.length.toString()}
          />
        </div>

        <h3 className="mb-2 font-serif text-xl font-light text-gray-900">
          Per-slug totals
        </h3>
        {clicks.totals.length === 0 ? (
          <p className="mb-6 text-sm text-gray-500">No clicks yet.</p>
        ) : (
          <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Slug</th>
                  <th className="px-4 py-2 text-right font-medium">Clicks</th>
                  <th className="px-4 py-2 font-medium">Last seen (NZT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {clicks.totals.map((row) => {
                  const last = clicksLastSeen.get(row.slug);
                  return (
                    <tr key={row.slug}>
                      <td className="px-4 py-2 font-mono text-xs text-gray-900">
                        {row.slug}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold text-gray-900">
                        {row.count.toLocaleString('en-NZ')}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500">
                        {last ? formatTimestamp(last) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <h3 className="mb-2 font-serif text-xl font-light text-gray-900">
          Recent hits
        </h3>
        {clicks.recent.length === 0 ? (
          <p className="text-sm text-gray-500">No hits recorded yet.</p>
        ) : (
          <RecentHitsTable hits={clicks.recent.slice(0, 100)} labelKey="slug" />
        )}
      </section>

      <section>
        <h2 className="mb-4 font-serif text-3xl font-light text-gray-900">
          Docs pages
        </h2>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Stat
            label="Total pageviews"
            value={docs.totalPageViews.toLocaleString('en-NZ')}
          />
          <Stat
            label="Paths with views"
            value={docs.distinctPaths.toString()}
          />
          <Stat
            label="Recent hits buffered"
            value={docs.recent.length.toString()}
          />
        </div>

        <h3 className="mb-2 font-serif text-xl font-light text-gray-900">
          Per-path totals
        </h3>
        {docs.totals.length === 0 ? (
          <p className="mb-6 text-sm text-gray-500">No pageviews yet.</p>
        ) : (
          <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Path</th>
                  <th className="px-4 py-2 text-right font-medium">Views</th>
                  <th className="px-4 py-2 font-medium">Last seen (NZT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {docs.totals.map((row) => {
                  const last = docsLastSeen.get(row.path);
                  return (
                    <tr key={row.path}>
                      <td className="px-4 py-2 font-mono text-xs text-gray-900">
                        {row.path}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold text-gray-900">
                        {row.count.toLocaleString('en-NZ')}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500">
                        {last ? formatTimestamp(last) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <h3 className="mb-2 font-serif text-xl font-light text-gray-900">
          Recent pageviews
        </h3>
        {docs.recent.length === 0 ? (
          <p className="text-sm text-gray-500">No pageviews recorded yet.</p>
        ) : (
          <RecentHitsTable hits={docs.recent.slice(0, 100)} labelKey="path" />
        )}
      </section>
    </main>
  );
}

type Hit = ClickEvent | DocsPageViewEvent;

function RecentHitsTable({
  hits,
  labelKey,
}: {
  hits: Hit[];
  labelKey: 'slug' | 'path';
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
          <tr>
            <th className="px-3 py-2 font-medium">Time (NZT)</th>
            <th className="px-3 py-2 font-medium">
              {labelKey === 'slug' ? 'Slug' : 'Path'}
            </th>
            <th className="px-3 py-2 font-medium">Location</th>
            <th className="px-3 py-2 font-medium">IP /24</th>
            <th className="px-3 py-2 font-medium">Device</th>
            <th className="px-3 py-2 font-medium">Referer</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {hits.map((hit, i) => {
            const label =
              labelKey === 'slug'
                ? (hit as ClickEvent).slug
                : (hit as DocsPageViewEvent).path;
            return (
              <tr key={`${hit.ts}-${i}`}>
                <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-500">
                  {formatTimestamp(hit.ts)}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-gray-900">
                  {label}
                </td>
                <td className="px-3 py-2 text-xs text-gray-700">
                  {hit.city && hit.country
                    ? `${hit.city}, ${hit.country}`
                    : hit.country || '—'}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-gray-500">
                  {hit.ipPrefix || '—'}
                </td>
                <td className="px-3 py-2 text-xs text-gray-700">
                  {hit.ua || '—'}
                </td>
                <td className="px-3 py-2 text-xs text-gray-500">
                  {hit.referer || '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-1 text-xs uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div className="font-serif text-3xl font-light text-gray-900">{value}</div>
    </div>
  );
}
