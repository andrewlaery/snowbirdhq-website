import PropertyCard from './PropertyCard';
import type { Property } from '@/data/properties';

interface PropertyGridProps {
  properties: Property[];
  featured?: boolean;
}

export default function PropertyGrid({ properties, featured }: PropertyGridProps) {
  const items = featured ? properties.filter((p) => p.featured) : properties;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((property) => (
        <PropertyCard
          key={property.slug}
          slug={property.slug}
          name={property.name}
          imageSrc={property.heroImage}
        />
      ))}
    </div>
  );
}
