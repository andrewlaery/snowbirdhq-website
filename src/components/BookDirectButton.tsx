import type { MouseEventHandler } from 'react';

interface BookDirectButtonProps {
  size?: 'sm' | 'md';
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const BOOKING_URL = 'https://book.snowbirdhq.com';

export default function BookDirectButton({
  size = 'sm',
  className = '',
  onClick,
}: BookDirectButtonProps) {
  const padding = size === 'md' ? 'px-8 py-3' : 'px-6 py-2.5';

  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`inline-block bg-snowbird-blue hover:bg-snowbird-blue-dark text-black ${padding} text-xs uppercase tracking-wider-xl font-medium transition-colors ${className}`}
    >
      Book Direct
    </a>
  );
}
