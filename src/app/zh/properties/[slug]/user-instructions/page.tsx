import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';
import { PropertyQuickInfoZh } from '@/components/property-quick-info-zh';
import { loadGuestCopySections } from '@/lib/zh-guest-copy';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ slug: '7-suburb' }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const body = loadGuestCopySections(slug, ['使用说明', '基本信息及其他说明']);

  return (
    <article className="snowbird-prose">
      <h1
        style={{
          fontFamily: 'var(--snow-font-display)',
          fontSize: '32px',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          margin: '0 0 8px',
        }}
      >
        使用说明
      </h1>
      <PropertyQuickInfoZh slug={slug} />
      <div
        style={{ fontSize: '15.5px', lineHeight: 1.7, color: 'var(--snow-ink-2)' }}
      >
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
    </article>
  );
}

export const metadata: Metadata = {
  title: '使用说明',
  description: 'WiFi、电器、暖气与门禁的使用说明。',
};
