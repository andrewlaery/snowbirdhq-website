import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import { AuthButton } from '@/components/auth-button';
import { SnowbirdDocsLogo } from '@/components/snowbird-docs-logo';
import { verifyCookie } from '@/lib/auth/docs-cookie';
import { cookies } from 'next/headers';
import { Newsreader, Geist, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import 'fumadocs-ui/style.css';
import './snowbird-docs.css';

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
  const secret = process.env.DOCS_COOKIE_SECRET;
  const isPortalUser = !!(
    secret &&
    portalCookie &&
    (await verifyCookie(portalCookie, secret)) === '1'
  );

  return (
    <div
      className={`snowbird-docs ${newsreader.variable} ${geist.variable} ${jetbrainsMono.variable}`}
    >
      <RootProvider
        search={{
          options: {
            api: '/api/search',
          },
        }}
      >
        <DocsLayout
          tree={source.pageTree}
          disableThemeSwitch
          nav={{
            title: <SnowbirdDocsLogo />,
            children: <AuthButton />,
          }}
          sidebar={{ enabled: isPortalUser }}
        >
          {children}
        </DocsLayout>
      </RootProvider>
    </div>
  );
}
