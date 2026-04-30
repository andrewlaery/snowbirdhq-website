import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DocsBody, DocsPage, DocsTitle } from 'fumadocs-ui/page';
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
    <DocsPage toc={[]}>
      <DocsTitle>{displayName}</DocsTitle>
      <DocsBody>
        <p
          style={{
            fontFamily: 'var(--snow-font-mono)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--snow-ink-3)',
            margin: '0 0 4px',
          }}
        >
          {strings.property_landing.eyebrow}
        </p>
        <p>
          {strings.property_landing.intro.replace('{propertyName}', displayName)}
        </p>
        <PropertyLandingNav slug={slug} lang="zh" />
      </DocsBody>
    </DocsPage>
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
        'zh-Hans': `/docs/zh/properties/${slug}`,
      },
    },
    openGraph: { locale: 'zh_CN' },
  };
}
