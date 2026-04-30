import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyAskChat } from '@/components/property-ask-chat';
import { loadIdentity, loadStrings } from '@/lib/sot';

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
  const strings = loadStrings('zh');

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
        {strings.landing_nav.sections.ask?.title ?? 'AI'}
      </h1>
      <p
        style={{
          fontSize: '15px',
          lineHeight: 1.65,
          color: 'var(--snow-ink-2)',
          margin: '0 0 16px',
        }}
      >
        {strings.ask_chat.intro.replace('{propertyName}', displayName)}
      </p>
      <PropertyAskChat
        slug={slug}
        propertyName={displayName}
        lang="zh"
        strings={strings.ask_chat}
      />
    </article>
  );
}

export const metadata: Metadata = {
  title: 'AI 问答助理',
  description: '针对本房源的中文 AI 助理对话。',
};
