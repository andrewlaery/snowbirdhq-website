import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyAskChatZh } from '@/components/property-ask-chat-zh';
import { loadIdentity } from '@/lib/sot';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let displayName: string;
  try {
    displayName = loadIdentity(slug, 'zh').display_name;
  } catch {
    notFound();
  }

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
        AI 问答助理
      </h1>
      <p
        style={{
          fontSize: '15px',
          lineHeight: 1.65,
          color: 'var(--snow-ink-2)',
          margin: '0 0 16px',
        }}
      >
        与 AI 助理就 {displayName} 进行对话。回答内容来源于本房源指南与皇后镇当地资讯。
      </p>
      <PropertyAskChatZh slug={slug} propertyName={displayName} />
    </article>
  );
}

export const metadata: Metadata = {
  title: 'AI 问答助理',
  description: '针对本房源的中文 AI 助理对话。',
};
