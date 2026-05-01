import type { ReactNode } from 'react';
import { Noto_Sans_JP } from 'next/font/google';
import { loadStrings } from '@/lib/sot';

const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

/**
 * Nested layout for /docs/ja/* routes. Inherits the parent docs layout
 * (Fumadocs DocsLayout + locale switcher + cookie gate) and adds:
 *   - Noto Sans JP font for native Japanese rendering
 *   - Machine-translation disclaimer footer note (sourced from ja strings)
 */
export default function JaDocsLayout({ children }: { children: ReactNode }) {
  const strings = loadStrings('ja');
  return (
    <div
      className={notoSansJP.variable}
      style={{
        fontFamily:
          'var(--font-noto-sans-jp), var(--snow-font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
      }}
    >
      {children}
      {strings.layout.footer_note && (
        <div
          className="not-prose mx-auto max-w-3xl px-6 py-6 text-center"
          style={{
            color: 'var(--snow-ink-3)',
            fontSize: '12px',
            borderTop: '1px solid var(--snow-line)',
            marginTop: '48px',
          }}
        >
          {strings.layout.footer_note}
        </div>
      )}
    </div>
  );
}
