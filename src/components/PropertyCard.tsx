'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
  slug: string;
  name: string;
  imageSrc: string;
}

export default function PropertyCard({ slug, name, imageSrc }: PropertyCardProps) {
  return (
    <Link href={`/properties/${slug}`} className="group relative block aspect-[4/3] overflow-hidden">
      <Image
        src={imageSrc}
        alt={name}
        fill

        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <p className="absolute bottom-4 left-4 font-serif text-lg text-white tracking-wide">
        {name}
      </p>
    </Link>
  );
}
