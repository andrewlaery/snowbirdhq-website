import type { Metadata } from 'next';
import { DocsBody, DocsPage, DocsTitle } from 'fumadocs-ui/page';
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
    <DocsPage toc={[]}>
      <DocsTitle>重要信息</DocsTitle>
      <DocsBody>
        <CriticalInfoBase lang="zh" />
        <PropertyHazards slug={slug} lang="zh" />
        <QueenstownEssentials lang="zh" />
      </DocsBody>
    </DocsPage>
  );
}

export const metadata: Metadata = {
  title: '重要信息',
  description: '紧急联系方式与基本安全信息。',
};
