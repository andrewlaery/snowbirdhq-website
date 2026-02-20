import { notFound } from 'next/navigation';
import { getProperty, getAllSlugs } from '@/data/properties';
import GuestMessageClient from './GuestMessageClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function GuestMessagePage({ params }: PageProps) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  return <GuestMessageClient slug={slug} propertyAddress={property.address} />;
}
