// Short-link redirect map for go.bcampx.com. Used by src/app/s/[slug]/route.ts.
//
// Three entry kinds:
//   - `property` — resolves to /docs/properties/{slug}[/{page}] on docs.snowbirdhq.com
//     and appends ?access=<DOCS_ACCESS_KEY>. Page defaults to the property landing (index).
//   - `path`     — resolves to an explicit path on docs.snowbirdhq.com and appends the key.
//   - `external` — redirects verbatim to an external URL, with no key appended.
//
// Paths are preserved exactly from the legacy Short.io setup so any printed welcome
// cards or already-distributed links keep working.

export type PropertyPage =
  | 'index'
  | 'welcome-house-rules'
  | 'user-instructions'
  | 'critical-info';

export type ShortLink =
  | { kind: 'property'; slug: string; page?: PropertyPage }
  | { kind: 'path'; path: string }
  | { kind: 'external'; url: string };

export const SHORT_LINKS: Record<string, ShortLink> = {
  // === Migrated properties (3) ===
  '7-Suburb-010-LandingPage': { kind: 'property', slug: '7-suburb' },
  '7-Suburb-011-HouseRules': { kind: 'property', slug: '7-suburb', page: 'welcome-house-rules' },
  '7-Suburb-012-UserInstructions': { kind: 'property', slug: '7-suburb', page: 'user-instructions' },
  '7-Suburb-013-CriticalAndEssentialInformation': { kind: 'property', slug: '7-suburb', page: 'critical-info' },

  '25-Dublin-010-LandingPage': { kind: 'property', slug: '25-dublin' },
  '25-Dublin-011-HouseRules': { kind: 'property', slug: '25-dublin', page: 'welcome-house-rules' },
  '25-Dublin-012-UserInstructions': { kind: 'property', slug: '25-dublin', page: 'user-instructions' },
  '25-Dublin-013-CriticalAndEssentialInformation': { kind: 'property', slug: '25-dublin', page: 'critical-info' },

  '6-25-Belfast-010-LandingPage': { kind: 'property', slug: '6-25-belfast' },
  '6-25-Belfast-011-HouseRules': { kind: 'property', slug: '6-25-belfast', page: 'welcome-house-rules' },
  // Note: legacy path `-011-CriticalAndEssentialInformation` was a naming mistake in the old
  // Short.io register. Preserving the path so any materials referencing it still work.
  '6-25-Belfast-011-CriticalAndEssentialInformation': { kind: 'property', slug: '6-25-belfast', page: 'critical-info' },
  '6-25-Belfast-012-UserInstructions': { kind: 'property', slug: '6-25-belfast', page: 'user-instructions' },

  // === Shared pages ===
  'SnowbirdHQ-QueenstownInsights': { kind: 'path', path: '/docs/queenstown-insights' },

  // === Utility / external ===
  // 34 Shotover car-park map — Google Drive PDF, not in docs portal.
  '34-Shotover-Car-Park-Map': {
    kind: 'external',
    url: 'https://drive.google.com/file/d/113OdT4W6Qot17TspgQsyR4yuZM5drWLz/view?usp=sharing',
  },

  // === New property landing pages (to be activated as each compendium migrates) ===
  '10B-DeLaMare-010-LandingPage': { kind: 'property', slug: '10b-delamare' },
  '1-34-Shotover-010-LandingPage': { kind: 'property', slug: '1-34-shotover' },
  '2-34-Shotover-010-LandingPage': { kind: 'property', slug: '2-34-shotover' },
  '3-15-Gorge-010-LandingPage': { kind: 'property', slug: '3-15-gorge' },
  '10-15-Gorge-010-LandingPage': { kind: 'property', slug: '10-15-gorge' },
  '14-15-Gorge-010-LandingPage': { kind: 'property', slug: '14-15-gorge' },
  '6A-643-Frankton-010-LandingPage': { kind: 'property', slug: '6a-643-frankton' },
  '73A-Hensman-010-LandingPage': { kind: 'property', slug: '73a-hensman' },
  '73B-Hensman-010-LandingPage': { kind: 'property', slug: '73b-hensman' },
  '41-Suburb-BaseCamp-010-LandingPage': { kind: 'property', slug: '41-suburb-basecamp' },
  '100-Risinghurst-Home-010-LandingPage': { kind: 'property', slug: '100-risinghurst-home' },
  '100-Risinghurst-Unit-010-LandingPage': { kind: 'property', slug: '100-risinghurst-unit' },
};

const DOCS_ORIGIN = 'https://docs.snowbirdhq.com';

// Resolve a short-link entry to the final destination URL. Caller provides the
// current access key at request time (read from env); this function never reads
// env itself so it's pure + testable.
export function resolveShortLink(entry: ShortLink, accessKey: string | undefined): string {
  if (entry.kind === 'external') {
    return entry.url;
  }

  let path: string;
  if (entry.kind === 'property') {
    path = entry.page
      ? `/docs/properties/${entry.slug}/${entry.page}`
      : `/docs/properties/${entry.slug}`;
  } else {
    path = entry.path;
  }

  const url = new URL(path, DOCS_ORIGIN);
  if (accessKey) {
    url.searchParams.set('access', accessKey);
  }
  return url.toString();
}
