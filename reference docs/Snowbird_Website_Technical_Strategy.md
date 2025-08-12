# Snowbird Website Technical Strategy

**Version**: 3.0  
**Updated**: Optimized for 2025 Best Practices  
**Architecture**: Next.js 15 with Integrated Payload CMS v3

## 1. Executive Summary

This document outlines the technical strategy for building the Snowbird website using a
cutting-edge, scalable architecture centered around Next.js 15, Vercel hosting, and Payload CMS
v3.0. The strategy prioritizes 2025 performance standards (Core Web Vitals with INP), developer
experience, and long-term maintainability while ensuring seamless integration with Snowbird's
existing property management systems.

**Key Architecture Decision**: We're adopting Payload CMS v3.0's Next.js-native approach, where the
CMS is integrated directly into our Next.js application, eliminating the need for a separate backend
and enabling zero-latency data fetching through Payload's Local API.

## 2. Core Technology Stack

### 2.1 Frontend Framework

**Next.js 15 (App Router)**

- **Rationale**: Production-ready with stable Turbopack (90% faster builds), React 19 support,
  optimized caching
- **Key Features**:
  - **Turbopack**: Stable dev server with 90% faster builds than webpack
  - **React 19 + React Compiler**: Automatic optimizations and better performance
  - **Improved Caching**: Updated fetch and Route Handler caching behavior
  - React Server Components for minimal client-side JavaScript
  - Built-in image optimization with WebP/AVIF support
  - API routes for backend functionality
  - Incremental Static Regeneration (ISR) for dynamic content
  - Parallel and intercepting routes for enhanced UX

### 2.2 Hosting & Infrastructure

**Vercel**

- **Rationale**: Native Next.js support, global edge network, automatic scaling
- **Key Features**:
  - Automatic CI/CD from Git
  - Edge Functions for personalization
  - Analytics and Web Vitals monitoring
  - Preview deployments for all branches
  - DDoS protection included

### 2.3 Content Management System

**Payload CMS v3.0**

- **Rationale**: TypeScript-native, Next.js-native integration, no separate backend needed
- **Implementation**:
  - Installs directly into Next.js `/app` directory
  - Self-hosted on Vercel or Payload Cloud ($35/month starter)
  - Local API for zero-latency data fetching
  - Built-in authentication and access control
  - Version history and drafts
  - Flexible block-based content editor
  - Real-time updates via WebSockets
  - Job queue system for background tasks

### 2.4 Styling & UI Components

**Tailwind CSS + Mantine v7**

- **Rationale**: Mantine v7 removed CSS-in-JS (emotion) for better performance, 100+ components
- **Tailwind CSS**: Utility-first CSS framework for custom styling
- **Mantine v7**: Performance-optimized component library
- **Benefits**:
  - **No CSS-in-JS overhead**: Mantine v7 uses CSS modules for better performance
  - 100+ production-ready components
  - Excellent TypeScript support
  - Built-in dark mode and theming
  - Accessibility compliance (WCAG)
  - **Alternative**: Shadcn/ui for maximum bundle size optimization

### 2.5 State Management

**Zustand + TanStack Query v5**

- **Zustand**: Industry favorite in 2025, 3KB bundle size, minimal boilerplate
- **TanStack Query v5**: Latest version with React 19 optimizations
- **Use Cases**:
  - Search filters and UI state (Zustand)
  - API data fetching, caching, and synchronization (TanStack Query)
  - Real-time property availability updates

### 2.6 Database

**MongoDB Atlas**

- **Rationale**: Document model perfect for flexible property data, native Payload CMS support
- **Provider**: MongoDB Atlas (integrated with Vercel)
- **Features**:
  - Document-based structure ideal for varied property attributes
  - Geospatial queries for location-based search
  - Built-in full-text search
  - Atlas Search for advanced filtering
  - Automatic scaling and backup
  - Edge-optimized with Vercel

### 2.7 Authentication

**Clerk**

- **Rationale**: Industry leader in 2025, polished UI components, comprehensive webhook system
- **Features**:
  - Beautiful pre-built authentication UI
  - Social providers (Google, Apple, Microsoft)
  - Magic links and passwordless authentication
  - Role-based access control and organizations
  - Real-time webhooks for user events
  - Integration with Payload CMS users
  - **Cost**: $25/month for up to 10,000 MAUs
- **Alternative**: Supabase Auth for cost optimization ($25/month for 100K MAUs)

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App (Monolithic)                   │
├─────────────────────────────────────────────────────────────┤
│  /app                                                        │
│  ├── (frontend)      │  ├── (payload)    │  /api           │
│  │   ├── page.tsx    │  │   └── admin/*  │  ├── [...slug]  │
│  │   ├── properties  │  │                 │  └── graphql   │
│  │   ├── about       │  │                 │                 │
│  │   └── blog        │  │                 │                 │
│  └── layout.tsx      │  └── collections   │                 │
├─────────────────────────────────────────────────────────────┤
│              Payload CMS (Integrated in Next.js)            │
├─────────────────────────────────────────────────────────────┤
│  Collections      │  Globals         │  Media/Uploads       │
│  ├── Properties   │  ├── Settings    │  ├── S3/Cloudinary  │
│  ├── Bookings     │  ├── Navigation  │  └── Image API      │
│  ├── Blog Posts   │  └── Footer      │                      │
│  └── Users        │                  │                      │
├─────────────────────────────────────────────────────────────┤
│                    External Integrations                     │
├─────────────────────────────────────────────────────────────┤
│  Hostaway API     │  PriceLabs API   │  Stripe             │
│  SuperHog         │  Email (Resend)  │  Analytics          │
└─────────────────────────────────────────────────────────────┘
```

## 4. Key Technical Decisions

### 4.1 Rendering Strategy

- **Static Generation (SSG)**: Marketing pages, about, blog posts
- **Server-Side Rendering (SSR)**: Property search results, dynamic pricing
- **Incremental Static Regeneration (ISR)**: Property details (revalidate every 5 minutes)
- **Client-Side Rendering (CSR)**: Interactive calculators, user dashboards

### 4.2 API Architecture

```typescript
// API Route Structure
/api/
  ├── properties/
  │   ├── index.ts          // List properties
  │   ├── [id].ts          // Get single property
  │   └── search.ts        // Search with filters
  ├── bookings/
  │   ├── create.ts        // Create booking
  │   ├── availability.ts  // Check availability
  │   └── calculate.ts     // Price calculation
  ├── owner/
  │   ├── calculator.ts    // ROI calculator
  │   └── leads.ts         // Lead submission
  └── webhooks/
      ├── hostaway.ts      // Property updates
      └── stripe.ts        // Payment events
```

### 4.3 Data Fetching Patterns (Payload v3.0)

```typescript
// Server Component - Using Payload Local API (Zero Network Latency)
import { getPayload } from 'payload';
import config from '@payload-config';

async function PropertyList() {
  const payload = await getPayload({ config });

  const { docs: properties } = await payload.find({
    collection: 'properties',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-createdAt',
  });

  return <PropertyGrid properties={properties} />;
}

// Client Component - Interactive Features
'use client';
function ROICalculator() {
  const { data, isLoading } = useQuery({
    queryKey: ['market-data'],
    queryFn: () => fetch('/api/market-data').then(res => res.json()),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  // Calculator logic
}

// Using Payload's REST API for Client Components
async function searchProperties(filters: PropertyFilters) {
  const query = new URLSearchParams({
    where: JSON.stringify(filters),
    limit: '12',
  });

  const response = await fetch(`/api/properties?${query}`);
  return response.json();
}
```

## 5. Development Workflow

### 5.1 Git Strategy

```
main
  ├── develop
  │   ├── feature/property-search
  │   ├── feature/owner-portal
  │   └── feature/booking-system
  └── staging
```

### 5.2 Environment Management

```bash
# .env.local (Development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/bcampx
PAYLOAD_SECRET=your-payload-secret-key
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=bcampx-media
S3_REGION=us-east-1
HOSTAWAY_API_KEY=...
PRICELABS_API_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...

# .env.production (Production)
NEXT_PUBLIC_SITE_URL=https://bcampx.com
MONGODB_URI=mongodb+srv://...@bcampx.mongodb.net/
PAYLOAD_SECRET=production-secret-key
# Additional production variables
```

### 5.3 CI/CD Pipeline (Vercel)

1. **Pull Request**: Automatic preview deployment
2. **Merge to Develop**: Deploy to development environment
3. **Merge to Staging**: Deploy to staging with production data
4. **Merge to Main**: Production deployment with monitoring

## 6. Payload CMS Configuration (v3.0 Best Practices)

### 6.1 Installation and Setup

```bash
# Create new Next.js + Payload app
pnpx create-payload-app@latest bcampx-website
# Select: Next.js, TypeScript, MongoDB

# Or add to existing Next.js app
pnpm add payload @payloadcms/next @payloadcms/richtext-lexical
pnpm add @payloadcms/db-mongodb
```

### 6.2 Collections Structure

```typescript
// payload.config.ts
import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  secret: process.env.PAYLOAD_SECRET || '',

  editor: lexicalEditor(),

  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
    options: {
      // MongoDB connection options
    },
  }),

  collections: [
    {
      slug: 'properties',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'status', 'price', 'updatedAt'],
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          unique: true,
          admin: {
            position: 'sidebar',
          },
          hooks: {
            beforeValidate: [
              ({ value, data }) => {
                return value || data?.title?.toLowerCase().replace(/ /g, '-');
              },
            ],
          },
        },
        {
          name: 'description',
          type: 'richText',
        },
        {
          name: 'gallery',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },
        {
          name: 'amenities',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'WiFi', value: 'wifi' },
            { label: 'Hot Tub', value: 'hot-tub' },
            { label: 'Fireplace', value: 'fireplace' },
            { label: 'Lake View', value: 'lake-view' },
            // Add more amenities
          ],
        },
        {
          name: 'pricing',
          type: 'group',
          fields: [
            {
              name: 'basePrice',
              type: 'number',
              required: true,
              min: 0,
            },
            {
              name: 'currency',
              type: 'select',
              defaultValue: 'NZD',
              options: ['NZD', 'USD', 'AUD'],
            },
            {
              name: 'cleaningFee',
              type: 'number',
              min: 0,
            },
          ],
        },
        {
          name: 'location',
          type: 'group',
          fields: [
            {
              name: 'coordinates',
              type: 'point',
              label: 'GPS Coordinates',
            },
            {
              name: 'address',
              type: 'text',
            },
            {
              name: 'neighborhood',
              type: 'text',
            },
            {
              name: 'nearbyAttractions',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                },
                {
                  name: 'distance',
                  type: 'number',
                  admin: {
                    description: 'Distance in kilometers',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'hostaway_id',
          type: 'text',
          admin: {
            position: 'sidebar',
            description: 'Synced from Hostaway',
          },
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'draft',
          admin: {
            position: 'sidebar',
          },
        },
      ],
      hooks: {
        afterChange: [
          async ({ doc, req, operation }) => {
            if (operation === 'create' || operation === 'update') {
              // Sync with Hostaway
              await syncPropertyToHostaway(doc);
            }
          },
        ],
      },
    },
    {
      slug: 'bookings',
      fields: [
        {
          name: 'property',
          type: 'relationship',
          relationTo: 'properties',
          required: true,
        },
        {
          name: 'guest',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'checkIn',
          type: 'date',
          required: true,
        },
        {
          name: 'checkOut',
          type: 'date',
          required: true,
        },
        {
          name: 'totalPrice',
          type: 'number',
          required: true,
        },
        {
          name: 'stripePaymentIntent',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticDir: 'media',
        disableLocalStorage: true,
        s3: {
          bucket: process.env.S3_BUCKET || '',
          prefix: 'media',
          commandInput: {
            ACL: 'public-read',
          },
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
  ],

  globals: [
    {
      slug: 'site-settings',
      fields: [
        {
          name: 'siteName',
          type: 'text',
          defaultValue: 'BCampX',
        },
        {
          name: 'siteDescription',
          type: 'textarea',
        },
        {
          name: 'contactEmail',
          type: 'email',
        },
      ],
    },
  ],

  admin: {
    user: 'users',
    bundler: 'webpack', // or 'vite' for faster builds
    meta: {
      titleSuffix: '- BCampX Admin',
      favicon: '/favicon.ico',
    },
  },

  typescript: {
    outputFile: 'payload-types.ts',
  },

  plugins: [
    s3Storage({
      collections: {
        media: {
          disableLocalStorage: true,
          generateFileURL: file => {
            return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/media/${file.filename}`;
          },
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'us-east-1',
      },
    }),
  ],
});
```

### 6.3 Payload + Next.js Integration

```typescript
// app/(payload)/admin/[[...segments]]/page.tsx
import { RootPage } from '@payloadcms/next/views';
import { importMap } from '../importMap';
import config from '@payload-config';

type Args = {
  params: {
    segments: string[];
  }
  searchParams: Record<string, string | string[]>
}

export default function Page({ params, searchParams }: Args) {
  return (
    <RootPage
      config={config}
      params={params}
      searchParams={searchParams}
      importMap={importMap}
    />
  );
}

// app/(app)/properties/[slug]/page.tsx
import { getPayload } from 'payload';
import config from '@payload-config';
import { notFound } from 'next/navigation';

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'properties',
    where: {
      slug: {
        equals: params.slug,
      },
      status: {
        equals: 'published',
      },
    },
    limit: 1,
  });

  if (!docs.length) {
    notFound();
  }

  const property = docs[0];

  return (
    <PropertyDetail property={property} />
  );
}

// Custom Hooks for Hostaway Sync
import { CollectionAfterChangeHook } from 'payload/types';

export const syncPropertyToHostaway: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation === 'create' || operation === 'update') {
    try {
      const response = await fetch('https://api.hostaway.com/v1/listings', {
        method: doc.hostaway_id ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HOSTAWAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: doc.title,
          description: doc.description,
          price: doc.pricing.basePrice,
          // Map other fields
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync with Hostaway');
      }

      const data = await response.json();

      // Update the document with Hostaway ID if it's a new property
      if (!doc.hostaway_id && data.id) {
        await req.payload.update({
          collection: 'properties',
          id: doc.id,
          data: {
            hostaway_id: data.id,
          },
        });
      }
    } catch (error) {
      req.payload.logger.error('Hostaway sync failed:', error);
    }
  }
};
```

## 7. Performance Optimization Strategy

### 7.1 Image Optimization

```typescript
// Using Next.js Image with Cloudinary
import Image from 'next/image';

function PropertyImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      loading="lazy"
      placeholder="blur"
      blurDataURL={generateBlurDataURL(src)}
    />
  );
}
```

### 7.2 Code Splitting & Lazy Loading

```typescript
// Dynamic imports for heavy components
const ROICalculator = dynamic(() => import('@/components/ROICalculator'), {
  loading: () => <CalculatorSkeleton />,
  ssr: false,
});
```

### 7.3 Caching Strategy

- **Vercel Edge Cache**: Static assets and pages
- **Redis (Upstash)**: Session data, API responses
- **React Query**: Client-side API cache
- **Next.js Cache**: Full route cache for ISR

## 8. SEO Implementation

### 8.1 Metadata API

```typescript
// app/properties/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const property = await getProperty(params.slug);

  return {
    title: `${property.title} | Luxury Rental in Queenstown`,
    description: property.description,
    openGraph: {
      images: [property.featuredImage],
    },
    alternates: {
      canonical: `https://bcampx.com/properties/${params.slug}`,
    },
  };
}
```

### 8.2 Structured Data

```typescript
function PropertyJsonLd({ property }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.title,
    description: property.description,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: property.location.lat,
      longitude: property.location.lng,
    },
    // Additional schema properties
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

## 9. Security Implementation

### 9.1 Security Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
];
```

### 9.2 API Security

```typescript
// API Route Protection
import { rateLimit } from '@/lib/rate-limit';
import { validateApiKey } from '@/lib/auth';

export async function POST(request: Request) {
  // Rate limiting
  const identifier = request.ip ?? 'anonymous';
  const { success } = await rateLimit.limit(identifier);

  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }

  // API Key validation for external access
  const apiKey = request.headers.get('x-api-key');
  if (!validateApiKey(apiKey)) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Process request
}
```

## 10. Monitoring & Analytics (2025 Standards)

### 10.1 Core Web Vitals Monitoring (2025 Updates)

**Focus on INP (Interaction to Next Paint)**

- **INP Target**: Under 200ms (replaced FID in March 2024)
- **LCP Target**: Under 2.5 seconds
- **CLS Target**: Under 0.1

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
        {/* Custom INP monitoring */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Monitor Long Animation Frames (LoAF) API
            if ('PerformanceObserver' in window) {
              new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (entry.duration > 50) {
                    // Report slow interactions
                    console.warn('Slow interaction detected:', entry);
                  }
                }
              }).observe({ type: 'long-animation-frame', buffered: true });
            }
          `
        }} />
      </body>
    </html>
  );
}
```

### 10.2 Error Tracking & Session Replay

**Sentry with Session Replay**

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  // Enhanced session replay for debugging
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
});
```

### 10.3 Property-Specific Analytics

```typescript
// lib/analytics.ts
export function trackPropertyEvent(
  eventName: string,
  propertyData: {
    propertyId: string;
    propertyTitle: string;
    price: number;
    location: string;
    [key: string]: any;
  }
) {
  // Google Analytics 4 - Enhanced Ecommerce
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      currency: 'NZD',
      value: propertyData.price,
      items: [
        {
          item_id: propertyData.propertyId,
          item_name: propertyData.propertyTitle,
          item_category: 'Property',
          item_variant: propertyData.location,
          price: propertyData.price,
          quantity: 1,
        },
      ],
      ...propertyData,
    });
  }

  // Send to Vercel Analytics
  if (typeof window !== 'undefined' && window.va) {
    window.va('track', eventName, propertyData);
  }
}

// Usage examples
trackPropertyEvent('property_view', {
  propertyId: 'lux-villa-123',
  propertyTitle: 'Luxury Lakefront Villa',
  price: 850,
  location: 'Queenstown',
});

trackPropertyEvent('booking_initiated', {
  propertyId: 'lux-villa-123',
  propertyTitle: 'Luxury Lakefront Villa',
  price: 850,
  location: 'Queenstown',
  checkIn: '2024-08-15',
  checkOut: '2024-08-18',
});
```

## 11. Testing Strategy (2025 Best Practices)

### 11.1 Modern Testing Stack

- **Unit Tests**: **Vitest** (5x faster than Jest, native ESM/TypeScript)
- **Component Tests**: React Testing Library
- **E2E Tests**: **Playwright** (cross-browser, replacing Cypress)
- **Visual Regression**: Percy or Chromatic
- **API Tests**: Vitest + MSW (Mock Service Worker)

### 11.2 Performance Benefits

- **Vitest**: 131ms vs Jest's 739ms execution time
- **Native TypeScript**: No babel transformation needed
- **Hot Module Replacement**: Tests update instantly during development

### 11.3 Test Structure

```typescript
// __tests__/components/PropertyCard.test.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PropertyCard from '@/components/PropertyCard';

describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    const property = {
      title: 'Luxury Lakefront Villa',
      price: 850,
      bedrooms: 4,
    };

    render(<PropertyCard property={property} />);

    expect(screen.getByText('Luxury Lakefront Villa')).toBeInTheDocument();
    expect(screen.getByText('$850 / night')).toBeInTheDocument();
  });
});
```

### 11.4 E2E Testing with Playwright

```typescript
// e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete property booking flow', async ({ page }) => {
  await page.goto('/properties/luxury-lakefront-villa');

  // Select dates
  await page.click('[data-testid="check-in-date"]');
  await page.click('[data-testid="date-2024-08-15"]');

  // Book property
  await page.click('[data-testid="book-now"]');

  // Verify booking confirmation
  await expect(page.getByText('Booking Confirmed')).toBeVisible();
});
```

## 12. Development Guidelines

### 12.1 Code Standards

```typescript
// ESLint Configuration
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/prop-types": "off"
  }
}
```

### 12.2 Component Structure

```typescript
// components/properties/PropertyCard.tsx
interface PropertyCardProps {
  property: Property;
  variant?: 'default' | 'featured';
  onFavorite?: (id: string) => void;
}

export function PropertyCard({ property, variant = 'default', onFavorite }: PropertyCardProps) {
  // Component implementation
}
```

### 12.3 API Response Types

```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
  error?: {
    code: string;
    message: string;
  };
}
```

## 13. Deployment Checklist

### 13.1 Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Payload CMS content populated
- [ ] SEO metadata verified
- [ ] Performance audit completed

### 13.2 Deployment Steps

1. **Create Production Branch**

   ```bash
   git checkout -b release/v1.0.0
   ```

2. **Configure Vercel Project**
   - Link GitHub repository
   - Set environment variables
   - Configure domain

3. **Deploy to Staging**
   - Test all integrations
   - Performance testing
   - Security scan

4. **Production Deployment**
   - Merge to main
   - Monitor deployment
   - Verify all services

### 13.3 Post-Deployment

- [ ] Verify all pages loading
- [ ] Test booking flow end-to-end
- [ ] Check API integrations
- [ ] Monitor error rates
- [ ] Set up alerts

## 14. Future Enhancements

### 14.1 Phase 2 Features

- **Mobile App**: React Native with shared components
- **Real-time Features**: WebSocket for availability updates
- **AI Integration**: Chatbot for guest inquiries
- **Advanced Analytics**: Custom dashboard for owners

### 14.2 Technical Improvements

- **Edge Functions**: Personalization at edge
- **GraphQL Federation**: Microservices architecture
- **Container Deployment**: Docker + Kubernetes option
- **Multi-region**: Database replication

## 15. Resource Requirements

### 15.1 Development Team

- **Frontend Developer**: Next.js expertise (1-2)
- **Backend Developer**: Node.js/API integration (1)
- **UI/UX Designer**: Design system creation (1)
- **DevOps Engineer**: Infrastructure setup (0.5)

### 15.2 Timeline Estimates (with 2025 Tooling)

- **Phase 1**: 6 weeks (Core website) - _Reduced by 2 weeks due to Next.js 15 Turbopack (90% faster
  builds)_
- **Phase 2**: 4 weeks (Owner portal) - _Reduced due to Payload's Local API and better integration_
- **Phase 3**: 6 weeks (Booking system) - _Reduced due to Clerk auth and improved testing with
  Vitest_
- **Total**: 16 weeks + 2 weeks buffer = **18 weeks total**

### 15.3 Budget Allocation

- **Development**: $80,000-100,000
- **Infrastructure**:
  - Vercel Pro: $20/user/month
  - MongoDB Atlas: Free tier to start, $57/month for M10
  - Payload Cloud (optional): $35/month starter
  - Total: ~$77-112/month
- **Third-party Services**:
  - Clerk Authentication: $25/month (up to 10K MAUs)
  - Hostaway API: Included with management
  - PriceLabs: ~$10/property/month
  - Stripe: 2.9% + $0.30 per transaction
  - S3 Storage: ~$50/month
  - Sentry: $26/month for 10K errors
  - Total: ~$250-350/month
- **Maintenance**: $3,000-5,000/month

## 16. Database Choice Analysis

### Why MongoDB Over PostgreSQL for BCampX

**MongoDB Advantages:**

1. **Schema Flexibility**: Properties vary significantly in amenities, features, and structure
2. **Geospatial Queries**: Built-in support for "properties near X" searches
3. **Payload CMS Integration**: More mature, feature-complete integration
4. **API Data Storage**: Easier to store varying structures from Hostaway/PriceLabs
5. **Performance**: Better for read-heavy property browsing workloads
6. **Development Speed**: No migrations needed for schema changes

**Specific BCampX Use Cases:**

- Properties with different amenity sets (some have pools, others hot tubs)
- Dynamic pricing rules that vary by property
- Nested booking data with guest information
- Variable-length photo galleries
- Location-based searches (properties within X km of lake)

**Cost Comparison:**

- MongoDB Atlas M0 (Free): 512MB storage, good for development
- MongoDB Atlas M10 ($57/month): Production-ready, 10GB storage
- vs PostgreSQL options that require more rigid schema management

## 17. Recommended Development Tools

### 17.1 AI-Assisted Development

- **Context7 MCP Server**: Install for real-time documentation access
  ```bash
  npm install -g @upstash/context7-mcp
  ```
  Configure in your AI code editor (Cursor, Claude Desktop, etc.) to access:
  - Next.js documentation
  - Payload CMS documentation
  - Vercel deployment guides
  - API documentation for integrations

### 17.2 Development Environment

- **IDE**: VS Code or Cursor with TypeScript support
- **Version Control**: Git with conventional commits
- **Package Manager**: pnpm (recommended) or npm
- **Code Quality**: ESLint, Prettier, Husky for pre-commit hooks
- **Testing**: Jest, React Testing Library, Playwright

### 17.3 Payload CMS Development

```bash
# Local development with Payload
pnpm dev # Runs Next.js + Payload admin panel

# Access points:
# Frontend: http://localhost:3000
# Payload Admin: http://localhost:3000/admin
# API: http://localhost:3000/api
# GraphQL: http://localhost:3000/api/graphql
```

---

## 18. Key 2025 Improvements Summary\n\n### Performance & Developer Experience\n- **Next.js 15**: Stable Turbopack provides 90% faster builds (reducing development time by 4 weeks)\n- **React 19 + React Compiler**: Automatic optimizations and better performance\n- **Vitest**: 5x faster test execution than Jest (131ms vs 739ms)\n- **Mantine v7**: Removed CSS-in-JS overhead for better runtime performance\n\n### Modern Authentication & UI\n- **Clerk**: Industry-leading auth solution with polished UI components\n- **2025 Core Web Vitals**: Focus on INP (Interaction to Next Paint) under 200ms\n- **Long Animation Frames (LoAF) API**: Monitor and optimize slow interactions\n\n### Cost Optimization\n- **Total Infrastructure**: ~$77-112/month (vs previous estimates of $500-1000/month)\n- **Faster Development**: Reduced from 22 weeks to 18 weeks total timeline\n- **Better Performance**: Improved SEO and conversion rates through optimal Core Web Vitals\n\n### Future-Proofing\n- **MongoDB**: Better fit for BCampX's flexible property data model\n- **Payload CMS v3**: Next.js-native architecture eliminates API latency\n- **Modern Testing**: Playwright for E2E, Vitest for units, comprehensive coverage\n\n---\n\n*This Technical Strategy document (v3.0) represents the optimal 2025 architecture for BCampX website development. It leverages cutting-edge tools and best practices to deliver superior performance, developer experience, and maintainability while reducing both development time and operational costs.*
