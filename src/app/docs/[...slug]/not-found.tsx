import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="mb-4 font-serif text-3xl font-semibold text-fd-foreground">
        Page Not Found
      </h1>
      <p className="mb-8 text-fd-muted-foreground">
        This page doesn&apos;t exist yet. It may have been moved or hasn&apos;t
        been created.
      </p>
      <Link
        href="/docs"
        className="rounded-lg border border-neutral-300 bg-white px-4 py-2 font-medium text-neutral-900 transition-colors hover:bg-neutral-100"
      >
        Back to Docs
      </Link>
    </div>
  );
}
