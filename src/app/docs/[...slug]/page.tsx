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
import { getProperty } from '@/data/properties';
import type { Metadata } from 'next';

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const propertyLanding = getPropertyLanding(params.slug);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
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
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

function getPropertyLanding(slug: string[]) {
  if (slug.length !== 2 || slug[0] !== 'properties') return null;
  const property = getProperty(slug[1]);
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
