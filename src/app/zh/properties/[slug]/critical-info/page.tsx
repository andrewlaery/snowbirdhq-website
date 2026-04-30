import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';
import { loadGuestCopySection } from '@/lib/zh-guest-copy';

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
  const body = loadGuestCopySection(slug, '重要信息') ?? '';

  return (
    <article className="snowbird-prose">
      <h1
        style={{
          fontFamily: 'var(--snow-font-display)',
          fontSize: '32px',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          margin: '0 0 24px',
        }}
      >
        重要信息
      </h1>
      <div
        style={{ fontSize: '15.5px', lineHeight: 1.7, color: 'var(--snow-ink-2)' }}
      >
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
    </article>
  );
}

export const metadata: Metadata = {
  title: '重要信息',
  description: '紧急联系方式与基本安全信息。',
};
