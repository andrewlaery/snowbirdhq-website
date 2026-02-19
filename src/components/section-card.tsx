import Link from 'next/link';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  badge?: string;
  disabled?: boolean;
}

export function SectionCard({
  title,
  description,
  href,
  icon,
  badge,
  disabled,
}: SectionCardProps) {
  const content = (
    <div
      className={`group relative rounded-lg border border-fd-border bg-fd-card p-6 transition-all ${
        disabled
          ? 'cursor-default opacity-60'
          : 'hover:shadow-md hover:border-fd-primary/30'
      }`}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="text-fd-muted-foreground">{icon}</div>
        {badge && (
          <span className="rounded-full bg-fd-muted px-2.5 py-0.5 text-xs font-medium text-fd-muted-foreground">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mb-1.5 text-lg font-semibold text-fd-foreground">
        {title}
      </h3>
      <p className="text-sm text-fd-muted-foreground">{description}</p>
    </div>
  );

  if (disabled) return content;

  return (
    <Link href={href} className="no-underline">
      {content}
    </Link>
  );
}
