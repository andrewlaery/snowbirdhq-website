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
    displayName = loadIdentity(slug, 'ja').display_name;
  } catch {
    notFound();
  }
  const strings = loadStrings('ja');

  return (
    <DocsPage toc={[]}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <DocsTitle>{strings.landing_nav.sections.ask?.title ?? 'AI'}</DocsTitle>
        <PropertyBackLink slug={slug} lang="ja" />
      </div>
      <DocsDescription>
        {strings.ask_chat.intro.replace('{propertyName}', displayName)}
      </DocsDescription>
      <DocsBody>
        <PropertyAskChat
          slug={slug}
          propertyName={displayName}
          lang="ja"
          strings={strings.ask_chat}
        />
      </DocsBody>
    </DocsPage>
  );
}

export const metadata: Metadata = {
  title: 'AI コンシェルジュ',
  description: '本物件専用の日本語 AI コンシェルジュとチャットでお話しいただけます。',
};
