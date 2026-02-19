import { BookOpen, FileText, Lock } from 'lucide-react';
import { SectionCard } from '@/components/section-card';

export default function DocsHomePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="mb-4 font-serif text-4xl font-semibold text-fd-foreground">
        SnowbirdHQ Documentation
      </h1>
      <p className="mb-10 max-w-2xl text-fd-muted-foreground">
        Everything you need for your Queenstown stay — property guides, house
        rules, local tips, and more.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SectionCard
          title="Guest Guides"
          description="Property info, house rules, local area guides"
          href="/docs/properties"
          icon={<BookOpen className="h-5 w-5" />}
          badge="Public"
        />
        <SectionCard
          title="Owner Docs"
          description="Financial reports, management agreements"
          href="/docs/owner-docs"
          icon={<FileText className="h-5 w-5" />}
          badge="Owners"
        />
        <SectionCard
          title="Internal"
          description="Team processes, maintenance procedures"
          href="#"
          icon={<Lock className="h-5 w-5" />}
          badge="Team Only"
          disabled
        />
      </div>
    </main>
  );
}
