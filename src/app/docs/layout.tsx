import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import { AuthButton } from '@/components/auth-button';
import { createServerClient } from '@/lib/supabase/server';
import { resolveUserAccess, getLinksForRole } from '@/lib/auth/roles';
import { filterPageTree } from '@/lib/auth/filter-page-tree';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import type { ReactNode } from 'react';
import 'fumadocs-ui/style.css';

async function getGuestProperty(): Promise<string | null> {
  const secret = process.env.GUEST_TOKEN_SECRET;
  if (!secret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get('guest_session')?.value;
  if (!token) return null;

  try {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key);
    return typeof payload.property === 'string' ? payload.property : null;
  } catch {
    return null;
  }
}

export default async function Layout({ children }: { children: ReactNode }) {
  let userEmail: string | null = null;
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  } catch {
    // Supabase env vars missing — treat as anonymous
  }

  const guestProperty = await getGuestProperty();
  const access = resolveUserAccess({ userEmail, guestProperty });
  const filteredTree = filterPageTree(source.pageTree, access);
  const links = getLinksForRole(access.role);

  return (
    <RootProvider
      search={{
        options: {
          api: '/api/search',
        },
      }}
    >
      <DocsLayout
        tree={filteredTree}
        nav={{
          title: 'SnowbirdHQ Docs',
          children: <AuthButton />,
        }}
        links={links}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
