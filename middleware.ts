import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED_ROUTES: Record<string, string[]> = {
  '/docs/owner-docs': ['owner', 'admin'],
  '/docs/internal': ['staff', 'admin'],
};

function getRequiredRoles(pathname: string): string[] | null {
  for (const [prefix, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return roles;
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured, allow all requests through
  if (!url || !key) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh the auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requiredRoles = getRequiredRoles(request.nextUrl.pathname);

  if (!requiredRoles) {
    return supabaseResponse;
  }

  // Protected route — must be authenticated
  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/signin';
    redirectUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check role
  const userRole = user.user_metadata?.role as string | undefined;
  if (!userRole || !requiredRoles.includes(userRole)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/access-denied';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/docs/owner-docs/:path*', '/docs/internal/:path*'],
};
