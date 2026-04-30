import type { Metadata } from 'next';
import { PropertyQuickInfo } from '@/components/property-quick-info';
import { PropertyWelcome } from '@/components/property-welcome';
import { HouseRulesBase } from '@/components/house-rules-base';
import {
  PropertyAccessInstructions,
  PropertyHouseRulesDeltas,
  PropertyOperationalNotes,
} from '@/components/property-exceptions';

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
          margin: '0 0 8px',
        }}
      >
        欢迎与住宿规则
      </h1>
      <PropertyQuickInfo slug={slug} lang="zh" />
      <PropertyWelcome slug={slug} lang="zh" />
      <HouseRulesBase lang="zh" />
      <h2>房源专属规则</h2>
      <PropertyAccessInstructions slug={slug} lang="zh" />
      <PropertyHouseRulesDeltas slug={slug} lang="zh" />
      <PropertyOperationalNotes slug={slug} lang="zh" />
    </article>
  );
}

export const metadata: Metadata = {
  title: '欢迎与住宿规则',
  description: '本房源的欢迎信息与住宿规则。',
};
