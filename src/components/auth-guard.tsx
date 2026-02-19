import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { AccessDenied } from './access-denied';
import type { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  requiredRoles: string[];
  currentPath: string;
}

export async function AuthGuard({
  children,
  requiredRoles,
  currentPath,
}: AuthGuardProps) {
  // If Supabase isn't configured, render children (development mode)
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return <>{children}</>;
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/signin?next=${encodeURIComponent(currentPath)}`);
  }

  const userRole = user.user_metadata?.role as string | undefined;
  if (!userRole || !requiredRoles.includes(userRole)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
