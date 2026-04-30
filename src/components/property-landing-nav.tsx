import Link from 'next/link';
import { loadStrings, type Lang } from '@/lib/sot';

interface Props {
  slug: string;
  lang?: Lang;
}

const SECTION_ORDER = [
  'welcome_house_rules',
  'user_instructions',
  'critical_info',
  'queenstown_insights',
  'ask',
] as const;

type SectionKey = (typeof SECTION_ORDER)[number];

function hrefFor(key: SectionKey, slug: string, lang: Lang): string {
  const enPrefix = `/docs/properties/${slug}`;
  const zhPrefix = `/zh/properties/${slug}`;
  const prefix = lang === 'zh' ? zhPrefix : enPrefix;
  switch (key) {
    case 'welcome_house_rules':
      return `${prefix}/welcome-house-rules`;
    case 'user_instructions':
      return `${prefix}/user-instructions`;
    case 'critical_info':
      return `${prefix}/critical-info`;
    case 'queenstown_insights':
      // Queenstown Insights only exists in EN today; always link to /docs/.
      return `/docs/queenstown-insights`;
    case 'ask':
      return `${prefix}/ask`;
  }
}

export function PropertyLandingNav({ slug, lang = 'en' }: Props) {
  const strings = loadStrings(lang);
  return (
    <nav
      aria-label={strings.landing_nav.aria_label}
      className="not-prose my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      style={{
        border: '1px solid var(--snow-line)',
        borderRadius: '6px',
        background: 'var(--snow-line)',
        gap: '1px',
        overflow: 'hidden',
      }}
    >
      {SECTION_ORDER.map((key) => {
        const section = strings.landing_nav.sections[key];
        if (!section) return null;
        return (
          <Card
            key={key}
            section={section}
            href={hrefFor(key, slug, lang)}
          />
        );
      })}
    </nav>
  );
}

interface CardProps {
  section: {
    num: string;
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
  };
  href: string;
}

function Card({ section, href }: CardProps) {
  return (
    <Link
      href={href}
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
