import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Access required — SnowbirdHQ',
  description: 'Our guest portal is private. Please use your personal access link or contact us.',
  robots: { index: false, follow: false },
};

export default function AccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg">
        <h1 className="mb-4 font-serif text-5xl font-light text-gray-900 md:text-6xl">
          Access required
        </h1>
        <p className="mb-6 text-lg text-gray-600">
          This is a private guest portal for Snowbird properties in Queenstown. Access is
          available by personal link only.
        </p>
        <p className="mb-10 text-gray-600">
          If you&rsquo;re a current or upcoming guest and have mislaid your link, please email{' '}
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
