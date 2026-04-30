import type { Metadata } from 'next';
import { CriticalInfoBase } from '@/components/critical-info-base';
import { QueenstownEssentials } from '@/components/queenstown-essentials';
import { PropertyHazards } from '@/components/property-exceptions';

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
      <CriticalInfoBase lang="zh" />
      <PropertyHazards slug={slug} lang="zh" />
      <QueenstownEssentials lang="zh" />
    </article>
  );
}

export const metadata: Metadata = {
  title: '重要信息',
  description: '紧急联系方式与基本安全信息。',
};
