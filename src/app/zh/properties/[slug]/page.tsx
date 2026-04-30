import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { loadIdentity } from '@/lib/sot';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ slug: '7-suburb' }];
}

const SECTIONS = [
  {
    num: '01',
    eyebrow: '欢迎',
    title: '欢迎与住宿规则',
    description: '入住信息、住宿规则、停车、门禁与到达须知。',
    href: (slug: string) => `/zh/properties/${slug}/welcome-house-rules`,
    cta: '阅读欢迎指南',
  },
  {
    num: '02',
    eyebrow: '使用',
    title: '使用说明',
    description: 'WiFi、电器、暖气、门禁码——本住宅一切设备的使用方式。',
    href: (slug: string) => `/zh/properties/${slug}/user-instructions`,
    cta: '阅读使用指南',
  },
  {
    num: '03',
    eyebrow: '重要',
    title: '重要信息',
    description: '紧急联系方式、安全程序与必备须知。',
    href: (slug: string) => `/zh/properties/${slug}/critical-info`,
    cta: '阅读重要信息',
  },
  {
    num: '04',
    eyebrow: '本地',
    title: '皇后镇精选',
    description: '当地推荐、隐藏好去处、餐饮与周边活动（仅提供英文版）。',
    href: () => `/docs/queenstown-insights`,
    cta: '浏览本地指南（英文）',
  },
  {
    num: '05',
    eyebrow: '问答',
    title: 'AI 问答助理',
    description: '关于本房源的任何问题——按摩浴池、WiFi、入住——尽管开口。',
    href: (slug: string) => `/zh/properties/${slug}/ask`,
    cta: '开始对话',
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let displayName: string;
  try {
    const identity = loadIdentity(slug, 'zh');
    displayName = identity.display_name;
  } catch {
    notFound();
  }

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
        住客指南
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
        欢迎来到 {displayName}。请通过以下链接查阅本房源的各项重要资料。
      </p>

      <nav
        aria-label="房源指南分区"
        className="not-prose grid grid-cols-1 sm:grid-cols-2"
        style={{
          border: '1px solid var(--snow-line)',
          borderRadius: '6px',
          background: 'var(--snow-line)',
          gap: '1px',
          overflow: 'hidden',
        }}
      >
        {SECTIONS.map((section) => (
          <Link
            key={section.num}
            href={section.href(slug)}
            className="group flex flex-col gap-3 p-6"
            style={{
              background: 'var(--snow-bg)',
              minHeight: '200px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--snow-font-mono)',
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--snow-ink-3)',
              }}
            >
              <span style={{ color: 'var(--snow-ink)' }}>{section.num}</span>
              <span aria-hidden style={{ color: 'var(--snow-ink-4)', margin: '0 8px' }}>
                ·
              </span>
              <span>{section.eyebrow}</span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--snow-font-display)',
                fontSize: '24px',
                fontWeight: 400,
                lineHeight: 1.15,
                margin: 0,
                color: 'var(--snow-ink)',
              }}
            >
              {section.title}
            </h3>
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.55,
                color: 'var(--snow-ink-2)',
                margin: 0,
              }}
            >
              {section.description}
            </p>
            <div
              className="mt-auto"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--snow-accent)',
                paddingTop: '4px',
              }}
            >
              {section.cta} →
            </div>
          </Link>
        ))}
      </nav>
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
