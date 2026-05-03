import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { PropertyAskChat } from '@/components/property-ask-chat';
import { PropertyBackLink } from '@/components/property-back-link';
import { loadPropertyDocs } from '@/lib/chat/property-context';
import { loadStrings } from '@/lib/sot';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const ctx = await loadPropertyDocs(slug);
  if (!ctx) notFound();
  const strings = loadStrings('en');

  return (
    <DocsPage toc={[]}>
      <PropertyBackLink slug={slug} lang="en" />
      <DocsTitle>Ask Me Anything</DocsTitle>
      <DocsDescription>
        Chat with an AI guide about {ctx.title}. Answers come from this
        property&rsquo;s guide and Queenstown Insights.
      </DocsDescription>
      <DocsBody>
        <PropertyAskChat
          slug={slug}
          propertyName={ctx.title}
          lang="en"
          strings={strings.ask_chat}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const ctx = await loadPropertyDocs(slug);
  return {
    title: ctx ? `Ask — ${ctx.title}` : 'Ask Me Anything',
    description: 'Chat with an AI guide scoped to this property.',
  };
}
