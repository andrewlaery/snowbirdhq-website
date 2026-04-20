import { NextResponse, type NextRequest } from 'next/server';
import { signCookie } from '@/lib/auth/docs-cookie';

// Constant-time string compare. Both inputs must be the same length for a
// potential match; different lengths always return false without revealing
// which length was expected.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function isSafeRedirect(target: unknown): target is string {
  return (
    typeof target === 'string' &&
    target.startsWith('/') &&
    !target.startsWith('//') &&
    !target.includes(':')
  );
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get('password');
  const from = formData.get('from');

  const expected = process.env.DOCS_PORTAL_PASSWORD;
  const cookieSecret = process.env.DOCS_COOKIE_SECRET;

  const errorUrl = new URL('/access?error=1', request.url);

  if (!expected || !cookieSecret || typeof password !== 'string') {
    return NextResponse.redirect(errorUrl, 303);
  }

  if (!safeEqual(password, expected)) {
    return NextResponse.redirect(errorUrl, 303);
  }

  const cookieValue = await signCookie('1', cookieSecret);
  const target = isSafeRedirect(from) ? from : '/';
  const res = NextResponse.redirect(new URL(target, request.url), 303);
  res.cookies.set('docs_portal', cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
