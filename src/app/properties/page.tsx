import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyGrid from '@/components/PropertyGrid';
import ScrollReveal from '@/components/ScrollReveal';
import { properties } from '@/data/properties';

export const metadata: Metadata = {
  title: 'Our Properties | Snowbird',
  description:
    'Browse our full portfolio of short-term rental properties across Queenstown, New Zealand.',
};

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="px-6 pt-32 pb-24 md:px-12 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <h1 className="mb-16 text-center font-serif text-3xl font-light tracking-wide text-neutral-800 md:text-4xl">
              Our Properties
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <PropertyGrid properties={properties} />
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
