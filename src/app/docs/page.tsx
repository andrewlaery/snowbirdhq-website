import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyCookie } from '@/lib/auth/docs-cookie';

// Mirrors src/middleware.ts /docs handling so preview/non-docs hostnames
// reach the same gate as docs.snowbirdhq.com.
export default async function DocsRoot() {
  const cookieStore = await cookies();
  const portalCookie = cookieStore.get('docs_portal')?.value;
  const secret = process.env.DOCS_COOKIE_SECRET;

  const portalOk = !!(
    secret &&
    portalCookie &&
    (await verifyCookie(portalCookie, secret)) === '1'
  );

  if (portalOk) {
    redirect('/docs/properties');
  }
  redirect('/access?from=/docs');
}
