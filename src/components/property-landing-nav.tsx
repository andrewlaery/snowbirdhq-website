import Link from 'next/link';

interface Section {
  num: string;
  eyebrow: string;
  title: string;
  description: string;
  href: (slug: string) => string;
  cta: string;
}

const SECTIONS: Section[] = [
  {
    num: '01',
    eyebrow: 'Welcome',
    title: 'Welcome & House Rules',
    description:
      'Check-in, house rules, parking, access, and what to expect on arrival.',
    href: (slug) => `/docs/properties/${slug}/welcome-house-rules`,
    cta: 'Read the welcome guide',
  },
  {
    num: '02',
    eyebrow: 'Instructions',
    title: 'User Instructions',
    description:
      'WiFi, appliances, heating, entry codes, and how to use everything in the home.',
    href: (slug) => `/docs/properties/${slug}/user-instructions`,
    cta: 'Read the user guide',
  },
  {
    num: '03',
    eyebrow: 'Critical',
    title: 'Critical Information',
    description:
      'Emergency contacts, safety procedures, and essentials you should know.',
    href: (slug) => `/docs/properties/${slug}/critical-info`,
    cta: 'Read the critical guide',
  },
  {
    num: '04',
    eyebrow: 'Local',
    title: 'Queenstown Insights',
    description:
      'Local recommendations, hidden gems, restaurants, and things to do nearby.',
    href: () => `/docs/queenstown-insights`,
    cta: 'Browse the local guide',
  },
  {
    num: '05',
    eyebrow: 'Ask',
    title: 'Ask Me Anything',
    description:
      'Chat with an AI guide about this property — spa, WiFi, check-in, anything.',
    href: (slug) => `/docs/properties/${slug}/ask`,
    cta: 'Start chatting',
  },
];

export function PropertyLandingNav({ slug }: { slug: string }) {
  return (
    <nav
      aria-label="Property guide sections"
      className="not-prose my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      style={{
        border: '1px solid var(--snow-line)',
        borderRadius: '6px',
        background: 'var(--snow-line)',
        gap: '1px',
        overflow: 'hidden',
      }}
    >
      {SECTIONS.map((section) => (
        <Card key={section.num} section={section} slug={slug} />
      ))}
    </nav>
  );
}

function Card({ section, slug }: { section: Section; slug: string }) {
  return (
    <Link
      href={section.href(slug)}
      className="group flex flex-col gap-4 p-7 transition-colors"
      style={{
        background: 'var(--snow-bg)',
        minHeight: '220px',
        textDecoration: 'none',
      }}
    >
      <div
        className="flex items-baseline gap-3"
        style={{
          fontFamily: 'var(--snow-font-mono)',
          fontSize: '11px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--snow-ink-3)',
        }}
      >
        <span style={{ color: 'var(--snow-ink)' }}>{section.num}</span>
        <span aria-hidden style={{ color: 'var(--snow-ink-4)' }}>
          ·
        </span>
        <span>{section.eyebrow}</span>
      </div>
      <h3
        className="m-0"
        style={{
          fontFamily: 'var(--snow-font-display)',
          fontSize: '26px',
          fontWeight: 400,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          color: 'var(--snow-ink)',
        }}
      >
        {section.title}
      </h3>
      <p
        className="m-0"
        style={{
          fontSize: '14px',
          lineHeight: 1.55,
          color: 'var(--snow-ink-2)',
          maxWidth: '38ch',
        }}
      >
        {section.description}
      </p>
      <div
        className="mt-auto flex items-center gap-1.5"
        style={{
          fontFamily: 'var(--snow-font-sans)',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--snow-ink)',
          paddingTop: '8px',
        }}
      >
        <span
          className="border-b border-current pb-0.5 transition-colors"
          style={{ borderBottomColor: 'var(--snow-line-2)' }}
        >
          {section.cta}
        </span>
        <span
          aria-hidden
          className="transition-transform group-hover:translate-x-0.5"
          style={{ color: 'var(--snow-accent)' }}
        >
          →
        </span>
      </div>
    </Link>
  );
}
