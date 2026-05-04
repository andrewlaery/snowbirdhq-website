import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import { SnowbirdDocsLogo } from '@/components/snowbird-docs-logo';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { verifyCookie } from '@/lib/auth/docs-cookie';
import { cookies } from 'next/headers';
import { Newsreader, Geist, JetBrains_Mono } from 'next/font/google';
import type { PageTree } from 'fumadocs-core/server';
import type { ReactNode } from 'react';
import 'fumadocs-ui/style.css';
import './snowbird-docs.css';

// Mirrors middleware BLOCKED_PREFIXES — strip these from the navigation tree
// so portal users don't see folders that hard-404 anyway.
const BLOCKED_PREFIXES = ['/docs/owner-docs', '/docs/internal'];

function filterBlockedTree(tree: PageTree.Root): PageTree.Root {
  return {
    ...tree,
    children: tree.children.filter((node) => {
      if (node.type === 'folder') {
        const indexUrl = node.index?.url ?? '';
        return !BLOCKED_PREFIXES.some((p) => indexUrl.startsWith(p));
      }
      if (node.type === 'page') {
        return !BLOCKED_PREFIXES.some((p) => node.url.startsWith(p));
      }
      return true;
    }),
  };
}

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
});

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export default async function Layout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const portalCookie = cookieStore.get('docs_portal')?.value;
  const propertyCookie = cookieStore.get('docs_property')?.value;
  const secret = process.env.DOCS_COOKIE_SECRET;
  const isPortalUser = !!(
    secret &&
    portalCookie &&
    (await verifyCookie(portalCookie, secret)) === '1'
  );
  const isPropertyUser = !!(
    secret &&
    propertyCookie &&
    (await verifyCookie(propertyCookie, secret))
  );
  const hasDocsAccess = isPortalUser || isPropertyUser;

  return (
    <div
      className={`snowbird-docs ${newsreader.variable} ${geist.variable} ${jetbrainsMono.variable}`}
    >
      <RootProvider
        theme={{ forcedTheme: 'light', defaultTheme: 'light', enableSystem: false }}
        search={{
          options: {
            api: '/api/search',
          },
        }}
      >
        <DocsLayout
          tree={filterBlockedTree(source.pageTree)}
          disableThemeSwitch
          nav={{
            // Fumadocs wraps nav.title in a link to the docs root. Keep the
            // interactive locale switcher outside that link so opening the
            // menu doesn't navigate to `/`, which middleware then redirects
            // to `/properties`.
            title: <SnowbirdDocsLogo />,
          }}
          sidebar={{ enabled: isPortalUser }}
        >
          {children}
        </DocsLayout>
        {/* Render outside Fumadocs nav/sidebar chrome so both cookie tiers
         * see the switcher in the same visual and DOM position. */}
        {hasDocsAccess && (
          <div className="fixed right-3.5 top-16 z-50 md:top-3.5">
            <LocaleSwitcher />
          </div>
        )}
      </RootProvider>
    </div>
  );
}
