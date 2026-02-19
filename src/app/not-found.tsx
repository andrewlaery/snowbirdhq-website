import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-2 font-serif text-6xl font-light text-gray-900">
        404
      </h1>
      <p className="mb-8 text-lg text-gray-500">Page not found</p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Home
        </Link>
        <Link
          href="/docs"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Docs
        </Link>
      </div>
    </div>
  );
}
