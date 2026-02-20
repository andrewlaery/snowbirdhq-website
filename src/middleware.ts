import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { jwtVerify } from 'jose';
import { resolveUserAccess, canAccessPath } from '@/lib/auth/roles';

async function verifyGuestToken(
  token: string
): Promise<{ property: string } | null> {
  const secret = process.env.GUEST_TOKEN_SECRET;
  if (!secret) return null;
  try {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key);
    const property = payload.property;
    if (typeof property !== 'string' || !property) return null;
    return { property };
  } catch {
    return null;
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

  // Handle guest token from URL param — set cookie and redirect to clean URL
  const tokenParam = request.nextUrl.searchParams.get('token');
  if (tokenParam) {
    const guest = await verifyGuestToken(tokenParam);
    if (guest) {
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete('token');
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.set('guest_session', tokenParam, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/docs',
      });
      return response;
    }
  }

  // Resolve guest property from cookie
  let guestProperty: string | null = null;
  const guestCookie = request.cookies.get('guest_session')?.value;
  if (guestCookie) {
    const guest = await verifyGuestToken(guestCookie);
    guestProperty = guest?.property ?? null;
  }

  const access = resolveUserAccess({
    userEmail: user?.email,
    guestProperty,
  });

  if (canAccessPath(access, pathname)) {
    return supabaseResponse;
  }

  // Not authorised — redirect based on auth state
  const redirectUrl = request.nextUrl.clone();
  if (access.role === 'anonymous') {
    redirectUrl.pathname = '/auth/signin';
    redirectUrl.searchParams.set('next', pathname);
  } else {
    redirectUrl.pathname = '/auth/access-denied';
  }
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ['/docs/:path+'],
};
