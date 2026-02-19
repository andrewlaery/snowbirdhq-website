import Image from 'next/image';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryRowProps {
  images: GalleryImage[];
  layout: 'full' | 'split';
}

export default function GalleryRow({ images, layout }: GalleryRowProps) {
  if (layout === 'full') {
    const img = images[0];
    if (!img) return null;
    return (
      <div className="overflow-hidden">
        <div className="relative aspect-[16/9] w-full transition-transform duration-700 hover:scale-[1.02]">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
      {images.slice(0, 2).map((img) => (
        <div key={img.src} className="overflow-hidden">
          <div className="relative aspect-[4/3] w-full transition-transform duration-700 hover:scale-[1.02]">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
