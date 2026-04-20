export interface GalleryItem {
  src: string;
  alt: string;
  layout: 'full' | 'split';
}

export interface Property {
  slug: string;
  name: string;
  address: string;
  description: string;
  heroImage: string;
  gallery: GalleryItem[];
  featured: boolean;
  hostawayId: number;
}

export const properties: Property[] = [
  {
    slug: '25-dublin',
    name: 'Lakeside Luxury, Steps from Town',
    address: '25 Dublin Street, Queenstown',
    description:
      'A beautifully appointed home on one of Queenstown\'s most sought-after streets, moments from the town centre and Lake Wakatipu. Ideal for families or groups seeking a central base with space to unwind.',
    heroImage: '/properties/25-dublin/hero.jpg',
    gallery: [
      { src: '/properties/25-dublin/living.jpg', alt: 'Open-plan living area', layout: 'full' },
      { src: '/properties/25-dublin/kitchen.jpg', alt: 'Modern kitchen', layout: 'split' },
      { src: '/properties/25-dublin/bedroom.jpg', alt: 'Master bedroom', layout: 'split' },
      { src: '/properties/25-dublin/outdoor.jpg', alt: 'Outdoor entertaining', layout: 'full' },
      { src: '/properties/25-dublin/view.jpg', alt: 'Mountain views', layout: 'full' },
    ],
    featured: true,
    hostawayId: 285499,
  },
  {
    slug: '7-suburb',
    name: 'Character and Charm, Central Queenstown',
    address: '7 Suburb Street, Queenstown',
    description:
      'Tucked away on a quiet residential street yet only a short stroll to Queenstown\'s waterfront and vibrant dining scene. A generous property with character and warmth throughout.',
    heroImage: '/properties/7-suburb/hero.jpg',
    gallery: [
      { src: '/properties/7-suburb/living.jpg', alt: 'Spacious living room', layout: 'full' },
      { src: '/properties/7-suburb/kitchen.jpg', alt: 'Kitchen and dining', layout: 'split' },
      { src: '/properties/7-suburb/bedroom.jpg', alt: 'Bedroom suite', layout: 'split' },
      { src: '/properties/7-suburb/outdoor.jpg', alt: 'Outdoor area', layout: 'full' },
      { src: '/properties/7-suburb/view.jpg', alt: 'Mountain views', layout: 'full' },
    ],
    featured: true,
    hostawayId: 355814,
  },
  {
    slug: '6-25-belfast',
    name: 'Modern Living, Remarkables Views',
    address: '6/25 Belfast Terrace, Queenstown',
    description:
      'A modern apartment on Belfast Terrace with views across to the Remarkables. Well-appointed interiors and easy access to Queenstown amenities.',
    heroImage: '/properties/6-25-belfast/hero.jpg',
    gallery: [
      { src: '/properties/6-25-belfast/living.jpg', alt: 'Living area', layout: 'full' },
      { src: '/properties/6-25-belfast/bedroom.jpg', alt: 'Bedroom', layout: 'split' },
      { src: '/properties/6-25-belfast/view.jpg', alt: 'Mountain views', layout: 'split' },
    ],
    featured: false,
    hostawayId: 408022,
  },
  {
    slug: '3-15-gorge',
    name: 'Central Base, Walk to Everything',
    address: '3/15 Gorge Road, Queenstown',
    description:
      'A comfortable apartment on Gorge Road, one of Queenstown\'s most central thoroughfares. Walk to restaurants, shops, and the lakefront within minutes.',
    heroImage: '/properties/3-15-gorge/hero.jpg',
    gallery: [
      { src: '/properties/3-15-gorge/living.jpg', alt: 'Open-plan living area', layout: 'full' },
      { src: '/properties/3-15-gorge/bedroom.jpg', alt: 'Bedroom', layout: 'split' },
      { src: '/properties/3-15-gorge/kitchen.jpg', alt: 'Kitchen and dining', layout: 'split' },
      { src: '/properties/3-15-gorge/balcony.jpg', alt: 'Balcony with mountain views', layout: 'full' },
      { src: '/properties/3-15-gorge/bathroom.jpg', alt: 'Modern bathroom', layout: 'split' },
      { src: '/properties/3-15-gorge/bedroom-detail.jpg', alt: 'Bedroom with wardrobe and art', layout: 'split' },
    ],
    featured: false,
    hostawayId: 408632,
  },
  {
    slug: '1-34-shotover',
    name: 'In the Heart of Queenstown',
    address: '1/34 Shotover Street, Queenstown',
    description:
      'Right in the heart of Queenstown on iconic Shotover Street. Step outside to find yourself surrounded by the best bars, restaurants, and adventure booking offices the town has to offer.',
    heroImage: '/properties/1-34-shotover/hero.jpg',
    gallery: [
      { src: '/properties/1-34-shotover/living.jpg', alt: 'Living and dining', layout: 'full' },
      { src: '/properties/1-34-shotover/kitchen.jpg', alt: 'Kitchen', layout: 'split' },
      { src: '/properties/1-34-shotover/bedroom.jpg', alt: 'Bedroom', layout: 'split' },
      { src: '/properties/1-34-shotover/bathroom.jpg', alt: 'Bathroom', layout: 'full' },
      { src: '/properties/1-34-shotover/street.jpg', alt: 'Shotover Street', layout: 'full' },
    ],
    featured: true,
    hostawayId: 408637,
  },
  {
    slug: '2-34-shotover',
    name: 'Downtown Pad, Shotover Street',
    address: '2/34 Shotover Street, Queenstown',
    description:
      'A centrally located apartment on Shotover Street, perfect for couples or small groups wanting to be in the thick of Queenstown\'s action.',
    heroImage: '/properties/2-34-shotover/hero.jpg',
    gallery: [
      { src: '/properties/2-34-shotover/living.jpg', alt: 'Living area', layout: 'full' },
      { src: '/properties/2-34-shotover/bedroom.jpg', alt: 'Bedroom', layout: 'split' },
      { src: '/properties/2-34-shotover/kitchen.jpg', alt: 'Kitchen', layout: 'split' },
    ],
    featured: false,
    hostawayId: 408638,
  },
  {
    slug: '10b-delamare',
    name: 'Panoramic Views, Peaceful Retreat',
    address: '10B De La Mare Place, Queenstown',
    description:
      'A stylish property in the quiet De La Mare neighbourhood with panoramic views of the surrounding ranges. A peaceful retreat just minutes from town.',
    heroImage: '/properties/10b-delamare/hero.jpg',
    gallery: [
      { src: '/properties/10b-delamare/living.jpg', alt: 'Living room with views', layout: 'full' },
      { src: '/properties/10b-delamare/kitchen.jpg', alt: 'Modern kitchen', layout: 'split' },
      { src: '/properties/10b-delamare/bedroom.jpg', alt: 'Master bedroom', layout: 'split' },
      { src: '/properties/10b-delamare/deck.jpg', alt: 'Outdoor deck', layout: 'full' },
      { src: '/properties/10b-delamare/view.jpg', alt: 'Panoramic views', layout: 'full' },
    ],
    featured: true,
    hostawayId: 408640,
  },

  {
    slug: '6a-643-frankton',
    name: 'Lakefront Living on Frankton Road',
    address: '6A/643 Frankton Road, Queenstown',
    description:
      'A well-positioned apartment on Frankton Road with easy access to both Queenstown town centre and the Remarkables ski field.',
    heroImage: '/properties/6a-643-frankton/hero.jpg',
    gallery: [
      { src: '/properties/6a-643-frankton/living.jpg', alt: 'Open-plan living', layout: 'full' },
      { src: '/properties/6a-643-frankton/bedroom.jpg', alt: 'Bedroom', layout: 'split' },
      { src: '/properties/6a-643-frankton/kitchen.jpg', alt: 'Kitchen', layout: 'split' },
      { src: '/properties/6a-643-frankton/view.jpg', alt: 'Lake and mountain views', layout: 'full' },
    ],
    featured: false,
    hostawayId: 408642,
  },
  {
    slug: '73b-hensman',
    name: 'Comfortable Lodge, Quiet Neighbourhood',
    address: '73B Hensman Road, Queenstown',
    description:
      'The companion property at Hensman Road, offering comfortable accommodation in a quiet Queenstown neighbourhood.',
    heroImage: '/properties/73b-hensman/hero.jpg',
    gallery: [
      { src: '/properties/73b-hensman/living.jpg', alt: 'Living room', layout: 'full' },
      { src: '/properties/73b-hensman/bedroom.jpg', alt: 'Bedroom', layout: 'split' },
      { src: '/properties/73b-hensman/exterior.jpg', alt: 'Property exterior', layout: 'split' },
    ],
    featured: false,
    hostawayId: 418309,
  },
  {
    slug: '41-suburb-basecamp',
    name: 'Lake Panorama and Glass Conservatory',
    address: '41 Suburb Street, Queenstown',
    description:
      'A stunning elevated home with panoramic views of Lake Wakatipu and The Remarkables. Features a glass conservatory, spacious living areas, and outdoor dining terrace — a true Queenstown retreat.',
    heroImage: '/properties/41-suburb-basecamp/hero.jpg',
    gallery: [
      { src: '/properties/41-suburb-basecamp/living.jpg', alt: 'Living room with lake views', layout: 'full' },
      { src: '/properties/41-suburb-basecamp/kitchen.jpg', alt: 'Modern kitchen', layout: 'split' },
      { src: '/properties/41-suburb-basecamp/bedroom.jpg', alt: 'Bedroom with mountain views', layout: 'split' },
      { src: '/properties/41-suburb-basecamp/sunroom.jpg', alt: 'Glass conservatory', layout: 'full' },
      { src: '/properties/41-suburb-basecamp/outdoor.jpg', alt: 'Outdoor dining terrace', layout: 'full' },
      { src: '/properties/41-suburb-basecamp/view.jpg', alt: 'Lake and mountain panorama', layout: 'full' },
    ],
    featured: true,
    hostawayId: 500890,
  },
  {
    slug: '10-15-gorge',
    name: 'Central Apartment, Gorge Road',
    address: '10/15 Gorge Road, Queenstown',
    description:
      'A well-located apartment on Gorge Road with convenient access to central Queenstown and local amenities.',
    heroImage: '/properties/10-15-gorge/hero.jpg',
    gallery: [
      { src: '/properties/10-15-gorge/living.jpg', alt: 'Open-plan living area', layout: 'full' },
      { src: '/properties/10-15-gorge/bedroom.jpg', alt: 'Bedroom', layout: 'split' },
      { src: '/properties/10-15-gorge/kitchen.jpg', alt: 'Kitchen', layout: 'split' },
      { src: '/properties/10-15-gorge/balcony.jpg', alt: 'Balcony with mountain views', layout: 'full' },
      { src: '/properties/10-15-gorge/bathroom.jpg', alt: 'Bathroom', layout: 'full' },
      { src: '/properties/10-15-gorge/lounge.jpg', alt: 'Living area', layout: 'split' },
      { src: '/properties/10-15-gorge/dining.jpg', alt: 'Dining setting', layout: 'split' },
    ],
    featured: true,
    hostawayId: 481225,
  },
];

export function getProperty(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured);
}

export function getAllSlugs(): string[] {
  return properties.map((p) => p.slug);
}
