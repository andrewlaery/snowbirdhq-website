import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { loadIdentity, loadStrings } from '@/lib/sot';
import { PropertyLandingNav } from '@/components/property-landing-nav';

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
  let displayName: string;
  try {
    displayName = loadIdentity(slug, 'zh').display_name;
  } catch {
    notFound();
  }
  const strings = loadStrings('zh');

  return (
    <article>
      <p
        style={{
          fontFamily: 'var(--snow-font-mono)',
          fontSize: '11px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--snow-ink-3)',
          margin: 0,
        }}
      >
        {strings.property_landing.eyebrow}
      </p>
      <h1
        style={{
          fontFamily: 'var(--snow-font-display)',
          fontSize: '40px',
          fontWeight: 400,
          letterSpacing: '-0.015em',
          margin: '8px 0 24px',
          color: 'var(--snow-ink)',
        }}
      >
        {displayName}
      </h1>
      <p
        style={{
          fontSize: '15px',
          lineHeight: 1.65,
          color: 'var(--snow-ink-2)',
          margin: '0 0 32px',
        }}
      >
        {strings.property_landing.intro.replace('{propertyName}', displayName)}
      </p>

      <PropertyLandingNav slug={slug} lang="zh" />
    </article>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let title = '住客指南';
  try {
    title = `${loadIdentity(slug, 'zh').display_name} · 住客指南`;
  } catch {
    /* fallthrough */
  }
  return {
    title,
    description: '由 SnowbirdHQ 提供的中文版住客指南。',
    alternates: {
      languages: {
        en: `/docs/properties/${slug}`,
        'zh-Hans': `/zh/properties/${slug}`,
      },
    },
    openGraph: { locale: 'zh_CN' },
  };
}
