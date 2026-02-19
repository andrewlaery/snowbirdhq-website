'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let supabase: ReturnType<typeof createBrowserClient>;
    try {
      supabase = createBrowserClient();
    } catch {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <Link
        href="/auth/signin"
        className="text-sm text-fd-muted-foreground hover:text-fd-primary"
      >
        Sign In
      </Link>
    );
  }

  const handleSignOut = async () => {
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      router.refresh();
    } catch {
      // env vars missing
    }
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-fd-muted-foreground truncate max-w-[150px]">
        {user.email}
      </span>
      <button
        onClick={handleSignOut}
        className="text-fd-foreground hover:text-fd-primary"
      >
        Sign Out
      </button>
    </div>
  );
}
