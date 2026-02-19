# Plan: Redesign snowbirdhq.com + docs.snowbirdhq.com

> **Save location**: Copy this plan to `snowbirdhq/plans/website-redesign.md` as first implementation step.

## Context

SnowbirdHQ currently has a basic splash page (snowbirdhq.com) and a fragile guest guide portal (docs.snowbirdhq.com). The goal is to redesign both:

1. **snowbirdhq.com** -- Premium, image-heavy brochure site inspired by fearonhay.com. Properties are the star, minimal text, stunning Queenstown imagery.
2. **docs.snowbirdhq.com** -- Full internal documentation portal inspired by platform.claude.com/docs. Three content categories: guest guides, owner docs, internal SOPs.

Both sites remain separate Next.js repos deployed independently on Vercel.

---

## Site 1: snowbirdhq.com (Brochure Site)

### Approach
Strip back to a Fearon Hay-inspired visual design: full-viewport hero, hamburger menu at all breakpoints, property photo galleries, serif typography, generous whitespace. One new dependency (framer-motion).

### New Dependencies
- `framer-motion` (page transitions, scroll animations, menu overlay)

### Typography
- **Serif**: `Cormorant Garamond` via `next/font/google` -- for brand name, headings, nav links
- **Sans**: `Inter` via `next/font/google` -- for body text, legal pages

### Tailwind Config Updates (`tailwind.config.js`)
- Add serif/sans font families
- Add `colors.muted` (#999) for body text
- Add gallery spacing (`spacing.gallery: '8rem'`)
- Keep existing snowbird colours as secondary accents

### Component Architecture
```
src/components/
  Header.tsx          -- Fixed transparent header (brand name + hamburger), scrolls to white bg
  MenuOverlay.tsx     -- Full-page overlay: nav links left, property image grid right
  MenuToggle.tsx      -- Animated hamburger/X icon
  VideoHero.tsx       -- Full-viewport hero (video or image fallback)
  PropertyGrid.tsx    -- 2-column property thumbnail grid
  PropertyCard.tsx    -- Image card with overlaid property name
  ImageGallery.tsx    -- Vertical image gallery for property pages
  GalleryRow.tsx      -- Full-width or two-column image row
  ScrollReveal.tsx    -- framer-motion scroll fade-in wrapper
  Footer.tsx          -- Minimal footer (legal, contact)
```

### Page Structure
```
src/app/
  layout.tsx              -- Fonts, Header, AnimatePresence wrapper
  page.tsx                -- Hero + featured properties grid + brief about + contact
  globals.css             -- Updated base styles
  properties/
    [slug]/page.tsx       -- Property gallery page (hero image, gallery, details, related)
  privacy-policy/page.tsx -- Restyle with new layout (keep content)
  terms/page.tsx          -- Restyle with new layout (keep content)
  guestmessage/          -- Keep existing (independent styling)
  icon.tsx               -- Keep existing
```

### Property Data Strategy
- `src/data/properties.ts` -- TypeScript data file with property metadata, image paths, gallery layout definitions
- Images stored in `/public/properties/{slug}/` (hero.jpg, 01.jpg, 02.jpg, etc.)
- Source property names from `_shared/property_registry.json`
- `generateStaticParams()` for build-time rendering of all property pages
- Scaffold all 18 properties with placeholder images, swap in real photos later

### Key Design Details
- **Homepage**: Full-viewport `<VideoHero>` (queenstown-bg.jpg as fallback, optional video) -> featured property grid (6-8 properties) -> 2-3 sentence about section -> contact -> footer
- **Menu**: Full-page overlay. Left: nav links (Properties, About, Contact). Right: scrollable property thumbnail grid. framer-motion staggered entrance.
- **Property pages**: Hero image top -> property name + short description -> `<ImageGallery>` with alternating full-width and two-column rows -> related properties -> footer
- **Header**: Transparent with white text over hero, transitions to `bg-white/90 backdrop-blur` on scroll
- **Animations**: Scroll-triggered fade-in on gallery images, page transitions (opacity), menu overlay entrance
- **Mobile**: Hamburger at all breakpoints. Menu overlay stacks vertically. Gallery images go single-column.

### Implementation Order
1. Install framer-motion, update tailwind config, add fonts to layout
2. Build components bottom-up: ScrollReveal -> GalleryRow -> ImageGallery -> PropertyCard -> PropertyGrid -> MenuToggle -> Header -> MenuOverlay -> VideoHero -> Footer
3. Create `src/data/properties.ts` with 2-3 test properties
4. Rebuild homepage
5. Build property detail page with `generateStaticParams`
6. Restyle privacy-policy and terms (remove inline headers, use shared layout)
7. Add property photos to `/public/properties/`
8. Test responsive + build + deploy

### Critical Files
- `snowbirdhq/src/app/layout.tsx` -- Complete rewrite (fonts, Header, animation wrapper)
- `snowbirdhq/src/app/page.tsx` -- Complete rewrite (hero + gallery + about + contact)
- `snowbirdhq/tailwind.config.js` -- Add fonts, colours, spacing
- `snowbirdhq/package.json` -- Add framer-motion
- `_shared/property_registry.json` -- Source of truth for property names

---

## Site 2: docs.snowbirdhq.com (Documentation Portal)

### Approach
Replace unmaintained ContentLayer with **Fumadocs** (purpose-built Next.js docs framework). Three content sections with role-based access control via Supabase. Fix the fragile auth implementation.

### Why Fumadocs
- ContentLayer is dead (last release ~2023, peer dep conflicts, Turbopack incompatible)
- Fumadocs provides: sidebar navigation, search (Cmd+K), ToC, breadcrumbs, MDX compilation, multiple content collections -- all out of the box
- Active maintenance (v16+), designed for Next.js App Router
- Nextra doesn't support App Router; next-mdx-remote lacks framework features

### Dependency Changes
**Add**: `fumadocs-core`, `fumadocs-mdx`, `fumadocs-ui`, `@supabase/ssr`
**Remove**: `contentlayer`, `next-contentlayer`, `@mdx-js/loader`, `@mdx-js/react`, `@supabase/auth-helpers-nextjs`

### Content Structure (3 sections)
```
content/
  guest-guides/           # Public -- property info, house rules, local guides
    meta.json
    index.mdx
    properties/
      25-dublin/          # Internal names from property_registry.json
        index.mdx
        welcome-house-rules.mdx
        user-instructions.mdx
        critical-info.mdx
      7-suburb/...
      (all 18 properties)
    locations/
      queenstown-central/local-guide.mdx
      queenstown-hill/local-guide.mdx

  owner-docs/             # Authenticated: owners + admin
    meta.json
    index.mdx
    financial-reporting/
    management-agreements/
    property-onboarding/
    faqs/

  internal/               # Authenticated: staff + admin only
    meta.json
    index.mdx
    operations/
    property-management/
    admin/
```

### Source Configuration
- `source.config.ts` -- Three `defineDocs()` calls with Zod schemas for each content type
- `lib/source.ts` -- Three `loader()` instances with distinct `baseUrl` values

### App Router Structure
```
app/
  layout.tsx                    -- RootProvider, fonts, top nav
  page.tsx                      -- Home: card grid (3 sections)
  globals.css                   -- Tailwind + Fumadocs preset
  (docs)/
    guest-guides/
      layout.tsx                -- DocsLayout with guest sidebar
      [[...slug]]/page.tsx      -- MDX renderer
    owner-docs/
      layout.tsx                -- DocsLayout with owner sidebar
      [[...slug]]/page.tsx      -- MDX renderer (auth required)
    internal/
      layout.tsx                -- DocsLayout with internal sidebar
      [[...slug]]/page.tsx      -- MDX renderer (auth required)
  auth/
    signin/page.tsx             -- Cleaned up magic link auth
    callback/route.ts           -- Auth callback
  api/
    search/route.ts             -- Fumadocs search endpoint
```

### Custom Components
```
components/
  top-nav.tsx             -- Logo, section tabs, search icon, auth button
  section-card.tsx        -- Home page card (icon, title, description, link)
  property-quick-info.tsx -- WiFi/check-in MDX component
  auth-guard.tsx          -- Role-based access wrapper
  access-denied.tsx       -- Unauthorized message
```

### Authentication Fix
- Replace `@supabase/auth-helpers-nextjs` (deprecated) with `@supabase/ssr`
- Proper `createBrowserClient` / `createServerClient` setup
- Remove hardcoded Supabase keys from component files
- Remove AuthContext provider (use cookie-based sessions)
- Middleware checks roles per route:
  - `/guest-guides/*` -- public
  - `/owner-docs/*` -- requires `owner` or `admin` role
  - `/internal/*` -- requires `staff` or `admin` role

### Home Page
Card grid matching Anthropic docs style:
- **Guest Guides** card -- "Property info, house rules, local area guides" -> Browse
- **Owner Docs** card -- "Financial reports, management agreements" -> Sign In Required
- **Internal** card -- "Team processes, maintenance procedures" -> Team Access Only

### Obsidian Sync
Sync scripts remain compatible (content is still MDX in `content/`). Update directory paths in `sync-to-project.sh` and `sync-from-project.sh` for the new three-section layout.

### Implementation Order (Phased)
1. **Foundation**: Remove ContentLayer, install Fumadocs, set up `source.config.ts` with guest guides only, basic DocsLayout, migrate 2 existing properties, verify build
2. **Full Guest Guides**: Scaffold all 18 property directories from registry, migrate location guides, build top nav, set up search
3. **Auth + Owner Docs**: Replace auth packages, fix middleware, add owner docs collection, create initial content templates
4. **Internal SOPs**: Add internal collection, staff-only protection, update Obsidian sync scripts
5. **Polish**: Responsive QA, custom MDX components, print styles, error pages

### Critical Files
- `snowbirdhq-docs/contentlayer.config.ts` -- Replace with `source.config.ts`
- `snowbirdhq-docs/next.config.ts` -- Swap `withContentlayer()` for `createMDX()`
- `snowbirdhq-docs/middleware.ts` -- Rewrite for role-based route protection
- `snowbirdhq-docs/app/layout.tsx` -- Wrap with Fumadocs `RootProvider`, add top nav
- `snowbirdhq-docs/package.json` -- Dependency swap
- `_shared/property_registry.json` -- Source for scaffolding property directories

### Tailwind Note
Current project uses Tailwind v4. If Fumadocs has compatibility issues, fall back to Tailwind v3 (the current CSS is basic and doesn't use v4-specific features).

---

## Verification

### snowbirdhq.com
1. `npm run build` completes without errors
2. `npm run dev` -- homepage renders with hero, property grid, about, contact
3. Property pages render at `/properties/{slug}` with image galleries
4. Menu overlay opens/closes smoothly
5. Header transitions from transparent to white on scroll
6. Responsive: mobile hamburger, single-column gallery, touch targets
7. Existing routes still work: `/privacy-policy`, `/terms`, `/guestmessage/25-dublin`
8. Vercel preview deployment succeeds

### docs.snowbirdhq.com
1. `npm run build` completes without `--legacy-peer-deps`
2. `npm run dev` -- home page shows 3-section card grid
3. Guest guide pages render with sidebar navigation
4. Search (Cmd+K) works across guest content
5. Unauthenticated users redirected from `/owner-docs/*` and `/internal/*`
6. Authenticated owner can access owner docs
7. Authenticated staff can access internal SOPs
8. Obsidian sync scripts work with new directory structure
9. Vercel deployment succeeds
