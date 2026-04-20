import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Access required — SnowbirdHQ',
  description:
    'Our guest portal is private. Please use your personal access link or the portal password.',
  robots: { index: false, follow: false },
};

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;
  const showError = error === '1';
  const fromSafe =
    typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && !from.includes(':')
      ? from
      : '';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full max-w-lg">
        <h1 className="mb-4 font-serif text-5xl font-light text-gray-900 md:text-6xl">
          Access required
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          This is a private guest portal for Snowbird properties in Queenstown.
        </p>

        <form
          method="POST"
          action="/api/access-unlock"
          className="mb-8 flex flex-col items-center gap-3"
        >
          {fromSafe && <input type="hidden" name="from" value={fromSafe} />}
          <label htmlFor="portal-password" className="sr-only">
            Portal password
          </label>
          <input
            id="portal-password"
            type="password"
            name="password"
            placeholder="Portal password"
            autoComplete="current-password"
            autoFocus
            required
            className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          <button
            type="submit"
            className="w-full max-w-xs rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Enter portal
          </button>
          {showError && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              Incorrect password. Please try again.
            </p>
          )}
        </form>

        <p className="mb-10 text-gray-600">
          If you&rsquo;re a current or upcoming guest and have mislaid your personal
          link, please email{' '}
          <a
            href="mailto:hello@snowbirdhq.com?subject=Access%20to%20guest%20portal"
            className="font-medium text-gray-900 underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            hello@snowbirdhq.com
          </a>{' '}
          and we&rsquo;ll send a fresh one.
        </p>
        <Link
          href="https://snowbirdhq.com"
          className="inline-block rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Return to snowbirdhq.com
        </Link>
      </div>
    </main>
  );
}
