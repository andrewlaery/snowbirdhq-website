import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { PropertyAskChat } from '@/components/property-ask-chat';
import { PropertyBackLink } from '@/components/property-back-link';
import { loadIdentity, loadStrings } from '@/lib/sot';

export const dynamic = 'force-dynamic';

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
      <PropertyBackLink slug={slug} lang="zh" />
      <DocsTitle>{strings.landing_nav.sections.ask?.title ?? 'AI'}</DocsTitle>
      <DocsDescription>
        {strings.ask_chat.intro.replace('{propertyName}', displayName)}
      </DocsDescription>
      <DocsBody>
        <PropertyAskChat
          slug={slug}
          propertyName={displayName}
          lang="zh"
          strings={strings.ask_chat}
        />
      </DocsBody>
    </DocsPage>
  );
}

export const metadata: Metadata = {
  title: 'AI 问答助理',
  description: '针对本房源的中文 AI 助理对话。',
};
