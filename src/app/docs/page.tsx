import { BookOpen, FileText, Lock } from 'lucide-react';
import { SectionCard } from '@/components/section-card';
import { createServerClient } from '@/lib/supabase/server';
import { resolveUserAccess, type Role } from '@/lib/auth/roles';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Link from 'next/link';

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

function WelcomePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="mb-4 font-serif text-4xl font-semibold text-fd-foreground">
        SnowbirdHQ Documentation
      </h1>
      <p className="mb-8 max-w-2xl text-fd-muted-foreground">
        Property guides, owner documentation, and team resources for
        SnowbirdHQ managed properties in Queenstown.
      </p>
      <p className="mb-6 text-sm text-fd-muted-foreground">
        If you&apos;re a guest, use the link provided in your booking
        confirmation. Property owners and staff can sign in below.
      </p>
      <Link
        href="/auth/signin"
        className="inline-flex items-center rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90"
      >
        Sign In
      </Link>
    </main>
  );
}

function getSections(role: Role) {
  const sections = [];

  if (role !== 'anonymous') {
    sections.push({
      title: 'Guest Guides',
      description: 'Property info, house rules, local area guides',
      href: '/docs/properties',
      icon: <BookOpen className="h-5 w-5" />,
      badge: 'Properties',
    });
  }

  if (role === 'owner' || role === 'staff') {
    sections.push({
      title: 'Owner Docs',
      description: 'Financial reports, management agreements',
      href: '/docs/owner-docs',
      icon: <FileText className="h-5 w-5" />,
      badge: 'Owners',
    });
  }

  if (role === 'staff') {
    sections.push({
      title: 'Internal',
      description: 'Team processes, maintenance procedures',
      href: '/docs/internal',
      icon: <Lock className="h-5 w-5" />,
      badge: 'Staff Only',
    });
  }

  return sections;
}

export default async function DocsHomePage() {
  let userEmail: string | null = null;
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  } catch {
    // Supabase env vars missing
  }

  const guestProperty = await getGuestProperty();
  const access = resolveUserAccess({ userEmail, guestProperty });

  if (access.role === 'anonymous') {
    return <WelcomePage />;
  }

  const sections = getSections(access.role);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="mb-4 font-serif text-4xl font-semibold text-fd-foreground">
        SnowbirdHQ Documentation
      </h1>
      <p className="mb-10 max-w-2xl text-fd-muted-foreground">
        Everything you need for your Queenstown stay — property guides, house
        rules, local tips, and more.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <SectionCard key={section.href} {...section} />
        ))}
      </div>
    </main>
  );
}
