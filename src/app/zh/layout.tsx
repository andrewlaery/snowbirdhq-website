import type { ReactNode } from 'react';
import { Noto_Sans_SC } from 'next/font/google';
import 'fumadocs-ui/style.css';
import '../docs/snowbird-docs.css';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { loadStrings } from '@/lib/sot';

const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

// Pilot ZH layout. Uses the same snowbird-docs CSS as the EN docs route, but
// wraps Chinese content with Noto Sans SC for native CJK rendering. No
// Fumadocs DocsLayout — the ZH page tree is hand-rolled until we promote to
// full Fumadocs i18n.
export default function ZhLayout({ children }: { children: ReactNode }) {
  const strings = loadStrings('zh');
  return (
    <div
      className={`snowbird-docs ${notoSansSC.variable}`}
      style={{
        minHeight: '100vh',
        background: 'var(--snow-bg)',
        fontFamily:
          'var(--font-noto-sans-sc), var(--snow-font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <header
        className="flex items-center justify-between border-b px-6 py-4"
        style={{ borderColor: 'var(--snow-line)', background: 'var(--snow-paper)' }}
      >
        <a
          href="/zh"
          style={{
            fontFamily: 'var(--snow-font-display)',
            fontSize: '18px',
            fontWeight: 500,
            color: 'var(--snow-ink)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          {strings.layout.brand}
        </a>
        <LocaleSwitcher />
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
      <footer
        className="border-t px-6 py-6 text-center"
        style={{
          borderColor: 'var(--snow-line)',
          color: 'var(--snow-ink-3)',
          fontSize: '12px',
        }}
      >
        {strings.layout.footer_note}
      </footer>
    </div>
  );
}
