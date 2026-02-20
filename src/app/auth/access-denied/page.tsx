import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-4 font-serif text-3xl font-semibold text-fd-foreground">
        Access Denied
      </h1>
      <p className="mb-8 text-fd-muted-foreground">
        You don&apos;t have permission to view this page. If you believe this is
        an error, please contact the site administrator.
      </p>
      <div className="flex gap-4">
        <Link
          href="/docs"
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2 font-medium text-neutral-900 transition-colors hover:bg-neutral-100"
        >
          Back to Docs
        </Link>
        <Link
          href="/auth/signin"
          className="rounded-lg border border-fd-border px-4 py-2 font-medium text-fd-foreground transition-colors hover:bg-fd-muted"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
