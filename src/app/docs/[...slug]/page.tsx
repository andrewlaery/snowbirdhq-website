import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '../../../../mdx-components';
import { PropertyQuickInfo } from '@/components/property-quick-info';
import { PropertyLandingNav } from '@/components/property-landing-nav';
import { PropertyBackLink } from '@/components/property-back-link';
import { getProperty } from '@/data/properties';
import type { Lang } from '@/lib/sot';
import type { Metadata } from 'next';

/**
 * Detect property sub-page context across all locales.
 *
 *   /docs/properties/<slug>/<sub>             → ['properties', slug, sub]
 *   /docs/zh/properties/<slug>/<sub>          → ['zh', 'properties', slug, sub]
 *   /docs/ja/properties/<slug>/<sub>          → ['ja', 'properties', slug, sub]
 *
 * Returns null for property landing routes (depth 2 / 3) and non-property routes.
 */
function getPropertySubPageContext(
  slug: string[],
): { lang: Lang; propertySlug: string } | null {
  const lang: Lang =
    slug[0] === 'zh' || slug[0] === 'ja' ? slug[0] : 'en';
  const offset = lang === 'en' ? 0 : 1;
  if (slug[offset] !== 'properties') return null;
  if (slug.length !== offset + 3) return null;
  return { lang, propertySlug: slug[offset + 1] };
}

function getPropertyLandingContext(
  slug: string[],
): { lang: Lang; propertySlug: string } | null {
  const lang: Lang =
    slug[0] === 'zh' || slug[0] === 'ja' ? slug[0] : 'en';
  const offset = lang === 'en' ? 0 : 1;
  if (slug[offset] !== 'properties') return null;
  if (slug.length !== offset + 2) return null;
  return { lang, propertySlug: slug[offset + 1] };
}

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const propertyLandingContext = getPropertyLandingContext(params.slug);
  const propertyLanding = propertyLandingContext
    ? getPropertyLanding(propertyLandingContext.propertySlug)
    : null;
  const isPropertyLandingRoute = !!propertyLandingContext;
  const subPageContext = getPropertySubPageContext(params.slug);

  return (
    <DocsPage
      toc={isPropertyLandingRoute ? [] : page.data.toc}
      full={page.data.full}
    >
      {subPageContext ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <DocsTitle>{page.data.title}</DocsTitle>
          <PropertyBackLink
            slug={subPageContext.propertySlug}
            lang={subPageContext.lang}
          />
        </div>
      ) : (
        <DocsTitle>{page.data.title}</DocsTitle>
      )}
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        {propertyLanding && (
          <PropertyQuickInfo
            address={propertyLanding.address}
            parking={propertyLanding.parking}
            checkIn={propertyLanding.checkIn}
            checkOut={propertyLanding.checkOut}
          />
        )}
        {propertyLandingContext ? (
          <PropertyLandingNav
            slug={propertyLandingContext.propertySlug}
            lang={propertyLandingContext.lang}
          />
        ) : (
          <MDX components={getMDXComponents()} />
        )}
      </DocsBody>
    </DocsPage>
  );
}

function getPropertyLanding(propertySlug: string) {
  const property = getProperty(propertySlug);
  if (!property?.parking || !property.checkIn || !property.checkOut) return null;
  return {
    address: property.address,
    parking: property.parking,
    checkIn: property.checkIn,
    checkOut: property.checkOut,
  };
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
