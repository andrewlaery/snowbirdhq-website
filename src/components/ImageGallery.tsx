import ScrollReveal from './ScrollReveal';
import GalleryRow from './GalleryRow';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryItem {
  images: GalleryImage[];
  layout?: 'full' | 'split';
}

interface ImageGalleryProps {
  items: GalleryItem[];
}

export default function ImageGallery({ items }: ImageGalleryProps) {
  return (
    <div className="flex flex-col gap-gallery">
      {items.map((item, i) => {
        const layout = item.layout ?? (i % 2 === 0 ? 'full' : 'split');
        return (
          <ScrollReveal key={i} delay={0.1}>
            <GalleryRow images={item.images} layout={layout} />
          </ScrollReveal>
        );
      })}
    </div>
  );
}
