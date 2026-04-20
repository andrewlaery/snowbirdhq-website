# SnowbirdHQ Website

## Overview

Marketing website and documentation portal for SnowbirdHQ, a luxury short-term rental property management company in Queenstown, New Zealand. Serves three audiences: public visitors (marketing pages), guests (property guides via tokenised links), and owners/staff (authenticated docs portal).

- **Production**: https://snowbirdhq.com
- **Docs portal**: https://docs.snowbirdhq.com
- **Repository**: https://github.com/andrewlaery/snowbirdhq-website

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.1 |
| Language | TypeScript (strict) | 5.x |
| UI | React | 19.2.3 |
| Styling | Tailwind CSS | 3.4.14 |
| Docs engine | Fumadocs (MDX) | 14.x |
| Animation | Framer Motion | 12.x |
| Auth | Two-tier HMAC cookie gate (`docs_property` slug-scoped, `docs_portal` full) | — |
| Guest tokens | jose (JWT) — **retired 2026-04-20**, kept for restore path only | 6.x |
| Hosting | Vercel (`andrewlaerys-projects/snowbirdhq`, auto-deploy from GitHub) | - |
| DNS | Vercel nameservers | - |

> **Current access model (2026-04-20)**: Two-tier cookie gate, both HMAC-signed with `DOCS_COOKIE_SECRET`. Short.io `-010-LandingPage` links carry `?access=<DOCS_ACCESS_KEY>`; first hit sets a slug-scoped `docs_property` cookie — the guest can view only their property + Queenstown Insights, and the sidebar is hidden so other properties aren't discoverable. Typing the password (`DOCS_PORTAL_PASSWORD`, currently `SnowbirdHQ`) on `/access` sets a `docs_portal` cookie — unlocks `/`, `/properties` listing, every property, and the full sidebar. `/docs/internal/*` and `/docs/owner-docs/*` hard-404 regardless. See `src/middleware.ts`, `src/lib/auth/docs-cookie.ts`, `src/app/api/access-unlock/route.ts`.

## Architecture

```mermaid
graph TD
    Browser[Browser] -->|HTTPS| Vercel[Vercel CDN]
    Vercel --> App[Next.js App]

    App --> Marketing[Marketing Pages]
    App --> DocsPortal[Docs Portal]
    App --> PropertyPages[Property Pages]

    DocsPortal --> Middleware[Middleware<br/>JWT + Supabase]
    Middleware --> Supabase[Supabase Auth]
    Middleware --> RBAC[Role-Based Access]

    RBAC --> GuestGuides[Guest Guides<br/>content/docs/properties]
    RBAC --> OwnerDocs[Owner Docs<br/>content/docs/owner-docs]
    RBAC --> Internal[Internal Docs<br/>content/docs/internal]

    DocsPortal --> Fumadocs[Fumadocs MDX]
    Fumadocs --> MDXContent[content/docs/**/*.mdx]

    Dev[Developer] -->|git push| GitHub[GitHub]
    GitHub -->|auto-deploy| Vercel
```

### Core Components

| Component | Path | Purpose |
|-----------|------|---------|
| Root layout | `src/app/layout.tsx` | SEO metadata, Google Fonts (Inter, Cormorant Garamond), viewport |
| Homepage | `src/app/page.tsx` | Marketing landing: hero, property grid, about, contact |
| Property pages | `src/app/properties/[slug]/page.tsx` | Individual property detail with gallery |
| Docs layout | `src/app/docs/layout.tsx` | Fumadocs shell with RBAC-filtered sidebar |
| Docs home | `src/app/docs/page.tsx` | Section cards based on user role |
| Middleware | `src/middleware.ts` | Auth gate for `/docs/*` routes — Supabase session + guest JWT |
| Roles | `src/lib/auth/roles.ts` | RBAC engine: anonymous, guest, owner, staff |
| Page tree filter | `src/lib/auth/filter-page-tree.ts` | Filters Fumadocs sidebar by user access |
| Properties data | `src/data/properties.ts` | Property catalogue (11 properties with gallery config) |
| Search API | `src/app/api/search/route.ts` | Fumadocs simple search index |
| Auth callback | `src/app/auth/callback/route.ts` | Supabase OAuth code exchange |
| Guest token script | `scripts/generate-guest-token.ts` | CLI to generate time-limited guest access JWTs |

## Getting Started

```bash
# Install dependencies
npm install

# Copy env template and fill in values
cp .env.local.example .env.local

# Start dev server (Turbopack, port 3000)
npm run dev
```

Required environment variables (see `.env.local.example`):

| Variable | Purpose |
|----------|---------|
| `DOCS_ACCESS_KEY` | Property-scoped handshake key — Short.io `?access=` sets the slug cookie |
| `DOCS_PORTAL_PASSWORD` | Password typed on `/access` to unlock full portal |
| `DOCS_COOKIE_SECRET` | HMAC signing key for both cookies (32-byte hex) |
| `RESEND_API_KEY` | Resend email service (contact forms) |
| `GUEST_TOKEN_SECRET` | Deprecated — kept so the old per-slug JWT middleware can be restored |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Retired — Supabase project is dead (NXDOMAIN) as of 2026-04-20 |
| `OWNER_EMAILS` / `STAFF_EMAILS` / `OWNER_PROPERTIES` | Retired — consumed by the old Supabase middleware, currently inert |

## Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with Turbopack (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server locally |
| `npm run lint` | ESLint (`src/`) |
| `npm run type-check` | TypeScript strict check (`tsc --noEmit`) |
| `npx tsx scripts/generate-guest-token.ts --property <slug> --expires YYYY-MM-DD` | Generate guest access URL |
| `vercel --prod --yes` | Manual production deployment (non-interactive) |
| `vercel dns ls snowbirdhq.com` | List DNS records |

## Key Workflows

### Guest access (current — shared-key)

1. Guest opens the property's `go.bcampx.com/-010-LandingPage` Short.io link
2. Short.io redirects to `docs.snowbirdhq.com/docs/properties/{slug}?access=<DOCS_ACCESS_KEY>`
3. Middleware validates the key, sets a 1-year `docs_access` httpOnly cookie, and redirects to the clean URL
4. Cookie carries the guest across every `/docs/properties/*` and `/docs/queenstown-insights` page
5. Bare URLs without the cookie return 404. `/docs/internal/*` and `/docs/owner-docs/*` always 404.
6. Key rotation cadence: 12 months (see `content/docs/internal/guest-tokens.mdx`)

### Owner/staff access (retired)

The Supabase magic-link + `STAFF_EMAILS` / `OWNER_EMAILS` scheme was retired on 2026-04-20 when the upstream Supabase project (`axgqojutjbyopchnmwzh.supabase.co`) went dead (NXDOMAIN). Restoration path: rebuild the Supabase project, clean the trailing-`\n` corruption on the 5 affected env vars, and swap the middleware back to the git history version. Until then, everyone uses the shared-key gate above.

### Deployment

1. Push to `main` branch on GitHub
2. Vercel automatically builds and deploys to production
3. Feature branches create preview deployments
4. Pre-deploy checks: `npm run build && npm run lint && npm run type-check`

### Content updates (docs)

1. Add/edit MDX files in `content/docs/` (properties, owner-docs, or internal)
2. Fumadocs auto-generates the page tree from the file structure and `meta.json` files
3. Custom MDX components available via `mdx-components.tsx` (e.g. `PropertyQuickInfo`)

## Project Structure

```
snowbirdhq/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (SEO, fonts)
│   │   ├── page.tsx                # Marketing homepage
│   │   ├── globals.css             # Tailwind base + utilities
│   │   ├── icon.tsx                # Dynamic favicon (Edge Runtime)
│   │   ├── not-found.tsx           # Custom 404
│   │   ├── api/search/route.ts     # Fumadocs search API
│   │   ├── auth/                   # Supabase auth flow
│   │   │   ├── signin/page.tsx
│   │   │   ├── callback/route.ts
│   │   │   └── access-denied/page.tsx
│   │   ├── docs/                   # Docs portal (Fumadocs)
│   │   │   ├── layout.tsx          # Docs shell with RBAC sidebar
│   │   │   ├── page.tsx            # Docs home (role-based sections)
│   │   │   └── [...slug]/page.tsx  # Dynamic MDX page renderer
│   │   ├── properties/page.tsx      # All properties listing
│   │   ├── properties/[slug]/      # Public property detail pages
│   │   ├── privacy-policy/         # Legal
│   │   ├── terms/                  # Legal
│   │   └── guestmessage/           # Legacy guest welcome pages
│   ├── components/                 # Shared React components
│   ├── data/properties.ts          # Property catalogue
│   ├── lib/
│   │   ├── auth/roles.ts           # RBAC: resolveUserAccess, canAccessPath
│   │   ├── auth/filter-page-tree.ts
│   │   ├── source.ts               # Fumadocs loader
│   │   └── supabase/               # Supabase client (server + browser)
│   └── middleware.ts               # Auth gate for /docs/*
├── content/docs/                   # MDX documentation content
│   ├── properties/                 # Guest guides (15 properties)
│   ├── owner-docs/                 # Owner financial reports, agreements
│   └── internal/                   # Staff-only operations docs
├── public/                         # Static assets (logos, property images)
├── scripts/                        # CLI utilities
│   ├── generate-guest-token.ts     # Guest JWT generator
│   ├── sync-from-obsidian.sh       # Content sync from Obsidian vault
│   └── sync-to-obsidian.sh         # Content sync to Obsidian vault
├── plans/                          # Architecture decision docs
├── next.config.mjs                 # Security headers, MDX, docs subdomain rewrite
├── tailwind.config.js              # Brand colours, fonts, custom spacing
├── source.config.ts                # Fumadocs MDX config
└── mdx-components.tsx              # Custom MDX component registry
```

## Configuration

### Tailwind brand tokens

```js
colors: {
  snowbird: {
    blue: '#B5D3D7',
    'blue-dark': '#9BC5CA',
  }
}
fontFamily: {
  serif: ['Cormorant Garamond', ...],
  sans: ['Inter', ...]
}
```

### Security headers (next.config.mjs)

| Header | Value |
|--------|-------|
| X-Frame-Options | SAMEORIGIN |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | origin-when-cross-origin |

### Docs subdomain rewrite

Requests to `docs.snowbirdhq.com/:path` are rewritten to `/docs/:path` via Next.js `rewrites()` in `next.config.mjs`, allowing the docs portal to live on a subdomain without a separate deployment.

### RBAC model

| Role | Guest Guides | Owner Docs | Internal |
|------|-------------|------------|----------|
| Anonymous | - | - | - |
| Guest (JWT) | Own property only | - | - |
| Owner (Supabase) | Scoped properties | Scoped properties | - |
| Staff (Supabase) | All | All | All |

## Access Management

### Roles summary

| Role | How they get access | What they see |
|------|-------------------|---------------|
| Staff | Email in `STAFF_EMAILS` + magic link sign-in | Everything |
| Owner | Email in `OWNER_PROPERTIES` + magic link sign-in | Owner docs + guest guides for their assigned properties |
| Guest | Tokenised URL (no sign-in needed) | Single property's guest guide |

### Adding/removing staff or owners

1. Open the [Vercel dashboard](https://vercel.com) → **snowbirdhq** project → **Settings** → **Environment Variables**
2. Edit the relevant variable:

| Variable | Format | Example |
|----------|--------|---------|
| `STAFF_EMAILS` | Comma-separated emails | `alice@bcampx.com,bob@bcampx.com` |
| `OWNER_PROPERTIES` | `email:slug1,slug2;email2:slug3` | `owner@gmail.com:25-dublin,7-suburb;jane@example.com:1-34-shotover` |
| `OWNER_EMAILS` | Comma-separated emails | `owner@gmail.com,jane@example.com` |

> **Note**: `OWNER_EMAILS` grants the owner role but no property access on its own. Property access requires a matching entry in `OWNER_PROPERTIES`.

3. Save, then redeploy: **Deployments** → latest → three dots → **Redeploy**

**Via CLI**:
```bash
# Remove old value and add new one
vercel env rm STAFF_EMAILS production
vercel env add STAFF_EMAILS production
# paste new value when prompted, then redeploy:
vercel --prod
```

### Generating guest access links

```bash
# Requires GUEST_TOKEN_SECRET in your environment
# Pull from Vercel if needed: vercel env pull .env.local

npx tsx scripts/generate-guest-token.ts \
  --property 25-dublin \
  --expires 2026-03-31
```

Outputs a URL like:
```
https://docs.snowbirdhq.com/docs/properties/25-dublin?token=<jwt>
```

Send this to the guest. The token is valid until the `--expires` date (23:59:59 UTC). After expiry, generate a new one.

### Viewing registered users

All emails that have attempted sign-in are recorded in Supabase. View them at: **Supabase dashboard** → **Authentication** → **Users**.

### Email sending (SMTP)

Magic link emails are sent via Resend custom SMTP. Configuration:
- **Supabase**: Authentication → Email → SMTP Settings
- **Resend**: Domain `snowbirdhq.com` verified, DNS records on Vercel
- **Sender**: `noreply@snowbirdhq.com`

If emails stop sending, check:
1. Resend API key is still valid (resend.com → API Keys)
2. Domain is still verified (resend.com → Domains)
3. SMTP settings in Supabase are correct (host: `smtp.resend.com`, port: `465`, username: `resend`, password: Resend API key)

## Testing & Deployment

**No automated test suite.** Quality is enforced via:
- TypeScript strict mode
- ESLint (zero warnings policy)
- Vercel preview deployments on feature branches

**Deployment**: Automatic via GitHub push to `main`. Vercel handles build, CDN distribution, and edge functions.

**Pre-deploy checklist**:
```bash
npm run build
npm run lint
npm run type-check
```

## Related Documentation

| Document | Location |
|----------|----------|
| Project-specific Claude instructions | `CLAUDE.md` |
| Authoring playbooks (property compendiums, slug renames, key rotation) | `docs/AUTHORING.md` |
| Content review checklist (13 live pages + 9 placeholders) | `docs/CONTENT_REVIEW.md` |
| Docs access register (rotation procedure) | `content/docs/internal/guest-tokens.mdx` |
| Ecosystem context | `_ECOSYSTEM.md` |
| RBAC design plan | `plans/rbac-docs-portal.md` |
| Website redesign plan | `plans/website-redesign.md` |
| Workspace ecosystem map | `../__Production/CLAUDE.md` |
| Property registry (canonical) | `../_shared/property_registry.json` |
