# System Architecture

## Overview

Snowbird is built as a modern, scalable web application using Next.js 15 with a focus on
performance, maintainability, and future extensibility. The architecture is designed to support
rapid growth from a simple brochure site to a full-featured property management platform.

## Current Architecture

### Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                 │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   React 19   │  │ Tailwind CSS │  │  TypeScript   │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                   Hosting (Vercel)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Edge Network │  │     CDN      │  │  Serverless   │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Project Structure

```
/snowbird-website
├── /src
│   ├── /app                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── /components            # React components
│   │   ├── /ui               # Base UI components
│   │   ├── /layout           # Layout components
│   │   └── /sections         # Page sections
│   ├── /lib                   # Utility functions
│   ├── /constants            # Static data
│   └── /types                # TypeScript types
├── /public                    # Static assets
└── /tests                     # Test files (future)
```

## Design Patterns

### Component Architecture

- **Server Components by Default**: Maximize performance with server-side rendering
- **Client Components When Needed**: Only for interactivity (forms, animations)
- **Composition Pattern**: Build complex UIs from simple, reusable components
- **Props Interface Pattern**: Every component has a typed props interface

### Styling Architecture

- **Utility-First CSS**: Tailwind CSS for rapid development
- **Component Classes**: Semantic class names for complex components
- **Responsive Design**: Mobile-first approach with breakpoints
- **Design Tokens**: Consistent spacing, colors, and typography

### State Management Strategy

- **Server State**: Managed by Next.js (no client-side state currently)
- **Future Client State**: Zustand for global state (when needed)
- **Form State**: React Hook Form with Zod validation
- **API State**: TanStack Query for server state synchronization

## Future Architecture

### Planned Integrations

```
┌─────────────────────────────────────────────────────────┐
│                    Snowbird Platform                     │
├─────────────────────────────────────────────────────────┤
│                    Frontend Layer                        │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Next.js    │  │  Payload CMS │  │    Clerk      │  │
│  │   (React)    │  │   (Content)  │  │    (Auth)     │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────────┤
│                     API Layer                            │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   REST API   │  │   GraphQL    │  │   Webhooks    │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────────┤
│                  External Services                       │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Hostaway   │  │  PriceLabs   │  │    Stripe     │  │
│  │    (PMS)     │  │  (Pricing)   │  │  (Payments)   │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    Data Layer                            │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   MongoDB    │  │     Redis    │  │      S3       │  │
│  │  (Primary)   │  │   (Cache)    │  │   (Media)     │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Performance Architecture

### Optimization Strategy

1. **Static Generation**: Pre-render all marketing pages
2. **Image Optimization**: Next.js Image component with WebP/AVIF
3. **Code Splitting**: Automatic with Next.js
4. **Edge Caching**: Vercel Edge Network
5. **Bundle Optimization**: Tree shaking and minification

### Performance Targets

- **First Contentful Paint**: < 1.0s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 200KB initial load

## Security Architecture

### Current Security Measures

- **HTTPS Only**: Enforced via Vercel
- **Security Headers**: X-Frame-Options, CSP, etc.
- **Input Validation**: Zod schemas for all user input
- **Environment Variables**: Secure storage in Vercel

### Planned Security Enhancements

- **Authentication**: Clerk with role-based access control
- **API Security**: Rate limiting and API key validation
- **Data Encryption**: At rest and in transit
- **Audit Logging**: Track all sensitive operations

## Scalability Considerations

### Horizontal Scaling

- **Serverless Functions**: Auto-scale with demand
- **Edge Deployment**: Global distribution via Vercel
- **CDN Strategy**: Static assets cached globally
- **Database Scaling**: MongoDB Atlas auto-scaling

### Vertical Scaling

- **Code Optimization**: Efficient algorithms and data structures
- **Query Optimization**: Indexed database queries
- **Caching Strategy**: Multi-layer caching (CDN, Redis, Browser)
- **Resource Management**: Lazy loading and pagination

## Development Architecture

### Development Environment

- **Local Development**: Next.js dev server with hot reload
- **Version Control**: Git with feature branch workflow
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Testing Strategy**: Unit, Integration, and E2E tests

### CI/CD Pipeline

```
Developer → GitHub → Vercel Build → Preview Deploy → Production Deploy
    │          │           │              │                │
    └─ Commit  └─ Webhook  └─ Tests      └─ Review       └─ Auto
```

## Decision Records

### Why Next.js 15?

- **Performance**: Turbopack for 90% faster builds
- **Developer Experience**: Excellent tooling and documentation
- **SEO**: Built-in optimizations for search engines
- **Vercel Integration**: Seamless deployment and hosting

### Why Tailwind CSS?

- **Rapid Development**: Utility classes speed up styling
- **Consistency**: Design system built into the framework
- **Performance**: Only ship CSS you actually use
- **Maintainability**: No CSS specificity wars

### Why MongoDB (Future)?

- **Flexibility**: Document model suits varied property data
- **Scalability**: Proven at scale with Atlas
- **Integration**: Native support in Payload CMS
- **Features**: Geospatial queries for location-based search

## Monitoring & Observability

### Current Monitoring

- **Vercel Analytics**: Page views and Web Vitals
- **Build Monitoring**: Vercel dashboard
- **Error Tracking**: Browser console (development)

### Planned Monitoring

- **Application Monitoring**: Sentry for error tracking
- **Performance Monitoring**: Real user monitoring (RUM)
- **Business Metrics**: Custom analytics for conversions
- **Infrastructure Monitoring**: Uptime and response times
