import type { Metadata } from 'next';
import { PropertyQuickInfo } from '@/components/property-quick-info';
import {
  PropertyAccessInstructions,
  PropertyUsageSections,
} from '@/components/property-exceptions';
import { ApplianceSet } from '@/components/appliance-page';

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
        使用说明
      </h1>
      <PropertyQuickInfo slug={slug} lang="zh" />
      <PropertyAccessInstructions slug={slug} lang="zh" />
      <PropertyUsageSections slug={slug} lang="zh" />
      <ApplianceSet slug={slug} lang="zh" />
    </article>
  );
}

export const metadata: Metadata = {
  title: '使用说明',
  description: 'WiFi、电器、暖气与门禁的使用说明。',
};
