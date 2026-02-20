import Header from '@/components/Header';
import VideoHero from '@/components/VideoHero';
import PropertyGrid from '@/components/PropertyGrid';
import ScrollReveal from '@/components/ScrollReveal';
import Footer from '@/components/Footer';
import { getFeaturedProperties } from '@/data/properties';

export default function Home() {
  const featured = getFeaturedProperties();

  return (
    <>
      <Header />

      <VideoHero
        imageSrc="/queenstown-bg.jpg"
        heading="SNOWBIRDHQ"
        subtext="Luxury property management in Queenstown, New Zealand"
      />

      <section id="properties" className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <h2 className="mb-16 text-center font-serif text-3xl font-light tracking-wide text-neutral-800 md:text-4xl">
              Our Properties
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <PropertyGrid properties={featured} />
          </ScrollReveal>
        </div>
      </section>

      <section id="about" className="px-6 py-24 md:px-12 md:py-32">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 font-serif text-3xl font-light tracking-wide text-neutral-800 md:text-4xl">
              About
            </h2>
            <p className="text-base leading-relaxed text-muted md:text-lg">
              SnowbirdHQ manages a curated portfolio of short-term rental properties across
              Queenstown. We handle everything from guest communications and dynamic pricing
              to cleaning, maintenance, and financial reporting — so owners can enjoy strong
              returns without the day-to-day.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section id="contact" className="px-6 py-24 md:px-12 md:py-32">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 font-serif text-3xl font-light tracking-wide text-neutral-800 md:text-4xl">
              Get in Touch
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted md:text-lg">
              Interested in having your property managed by SnowbirdHQ?
            </p>
            <a
              href="mailto:hello@snowbirdhq.com"
              className="inline-block border border-neutral-300 px-8 py-3 text-sm tracking-wider text-neutral-700 transition-colors hover:border-neutral-700 hover:text-neutral-900"
            >
              hello@snowbirdhq.com
            </a>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </>
  );
}
