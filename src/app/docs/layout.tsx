import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';
import 'fumadocs-ui/style.css';

export default function Layout({ children }: { children: ReactNode }) {
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
        }}
        links={[
          {
            text: 'Guest Guides',
            url: '/docs/properties',
            active: 'nested-url',
          },
          {
            text: 'Owner Docs',
            url: '/docs/owner-docs',
            active: 'nested-url',
          },
        ]}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
