import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { jwtVerify } from 'jose';

function parseEmailList(envVar: string | undefined): string[] {
  if (!envVar) return [];
  return envVar
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function isEmailAllowed(email: string, allowedEmails: string[]): boolean {
  return allowedEmails.includes(email.toLowerCase());
}

async function verifyGuestToken(
  token: string
): Promise<boolean> {
  const secret = process.env.GUEST_TOKEN_SECRET;
  if (!secret) return false;
  try {
    const key = new TextEncoder().encode(secret);
    await jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const ownerEmails = parseEmailList(process.env.OWNER_EMAILS);
  const staffEmails = parseEmailList(process.env.STAFF_EMAILS);

  if (pathname.startsWith('/docs/properties')) {
    const tokenParam = request.nextUrl.searchParams.get('token');

    if (tokenParam) {
      const valid = await verifyGuestToken(tokenParam);
      if (valid) {
        const cleanUrl = request.nextUrl.clone();
        cleanUrl.searchParams.delete('token');
        const response = NextResponse.redirect(cleanUrl);
        response.cookies.set('guest_session', tokenParam, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/docs/properties',
        });
        return response;
      }
    }

    const guestCookie = request.cookies.get('guest_session')?.value;
    if (guestCookie && (await verifyGuestToken(guestCookie))) {
      return supabaseResponse;
    }

    if (
      user?.email &&
      (isEmailAllowed(user.email, ownerEmails) ||
        isEmailAllowed(user.email, staffEmails))
    ) {
      return supabaseResponse;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/access-denied';
    redirectUrl.searchParams.delete('token');
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith('/docs/owner-docs')) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth/signin';
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (
      user.email &&
      (isEmailAllowed(user.email, ownerEmails) ||
        isEmailAllowed(user.email, staffEmails))
    ) {
      return supabaseResponse;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/access-denied';
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith('/docs/internal')) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth/signin';
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (user.email && isEmailAllowed(user.email, staffEmails)) {
      return supabaseResponse;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/access-denied';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/docs/properties/:path*',
    '/docs/owner-docs/:path*',
    '/docs/internal/:path*',
  ],
};
