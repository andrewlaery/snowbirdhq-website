import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import PropertyGrid from '@/components/PropertyGrid';
import ScrollReveal from '@/components/ScrollReveal';
import { getProperty, getAllSlugs, properties } from '@/data/properties';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return {};
  return {
    title: property.name,
    description: property.description,
  };
}

function buildGalleryItems(gallery: { src: string; alt: string; layout: 'full' | 'split' }[]) {
  const items: { images: { src: string; alt: string }[]; layout: 'full' | 'split' }[] = [];
  let i = 0;
  while (i < gallery.length) {
    const item = gallery[i];
    if (item.layout === 'full') {
      items.push({ images: [{ src: item.src, alt: item.alt }], layout: 'full' });
      i++;
    } else {
      const pair: { src: string; alt: string }[] = [{ src: item.src, alt: item.alt }];
      if (i + 1 < gallery.length && gallery[i + 1].layout === 'split') {
        pair.push({ src: gallery[i + 1].src, alt: gallery[i + 1].alt });
        i += 2;
      } else {
        i++;
      }
      items.push({ images: pair, layout: 'split' });
    }
  }
  return items;
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const galleryItems = buildGalleryItems(property.gallery);

  const related = properties
    .filter((p) => p.slug !== property.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative h-[70vh]">
        <Image
          src={property.heroImage}
          alt={property.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center text-white">
          <h1 className="font-serif text-4xl tracking-wide md:text-5xl lg:text-6xl">
            {property.name}
          </h1>
          <p className="mt-3 text-sm tracking-widest uppercase text-white/80">
            Queenstown, New Zealand
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="px-6 py-24 md:px-12">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl text-neutral-800 md:text-4xl">
              About the Property
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {property.description}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Gallery */}
      <section className="px-6 py-24 md:px-12">
        <ScrollReveal>
          <div className="mx-auto max-w-6xl">
            <ImageGallery items={galleryItems} />
          </div>
        </ScrollReveal>
      </section>

      {/* Related Properties */}
      <section className="px-6 py-24 md:px-12">
        <ScrollReveal>
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center font-serif text-3xl text-neutral-800 md:text-4xl">
              More Properties
            </h2>
            <PropertyGrid properties={related} />
            <div className="mt-12 text-center">
              <Link
                href="/properties"
                className="inline-block border border-neutral-300 px-8 py-3 text-sm tracking-widest uppercase text-neutral-600 transition-colors hover:border-neutral-800 hover:text-neutral-800"
              >
                View All Properties
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
