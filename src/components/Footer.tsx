import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="px-6 pb-8 pt-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center text-sm text-muted">
          <span className="font-serif text-lg tracking-wide text-neutral-700">
            Snowbird
          </span>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-neutral-700">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-neutral-700">
              Terms
            </Link>
          </div>
          <p>info@snowbirdhq.com</p>
          <p>&copy; {new Date().getFullYear()} SnowbirdHQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
