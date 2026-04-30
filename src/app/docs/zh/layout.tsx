import type { ReactNode } from 'react';
import { Noto_Sans_SC } from 'next/font/google';
import { loadStrings } from '@/lib/sot';

const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

/**
 * Nested layout for /docs/zh/* routes. Inherits the parent docs layout
 * (Fumadocs DocsLayout + locale switcher + cookie gate) and adds:
 *   - Noto Sans SC font for native CJK rendering
 *   - Machine-translation disclaimer footer note
 *
 * Parent layout's sidebar still shows the EN page tree (Fumadocs source is
 * EN-only); for the ZH pilot this is acceptable since the property cookie
 * hides the sidebar for guests anyway, and bilingual portal users can read
 * the EN labels.
 */
export default function ZhDocsLayout({ children }: { children: ReactNode }) {
  const strings = loadStrings('zh');
  return (
    <div
      className={notoSansSC.variable}
      style={{
        fontFamily:
          'var(--font-noto-sans-sc), var(--snow-font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
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
