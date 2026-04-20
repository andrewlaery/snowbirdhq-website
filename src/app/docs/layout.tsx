import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import { AuthButton } from '@/components/auth-button';
import { verifyCookie } from '@/lib/auth/docs-cookie';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import 'fumadocs-ui/style.css';

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
    <RootProvider
      search={{
        options: {
          api: '/api/search',
        },
      }}
    >
      <DocsLayout
        tree={source.pageTree}
        nav={{
          title: 'SnowbirdHQ Docs',
          children: <AuthButton />,
        }}
        sidebar={{ enabled: isPortalUser }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
