# snowbirdhq-website — Ecosystem Reference

See [WORKSPACE_CATALOG.md](../../WORKSPACE_CATALOG.md)

## Role
Next.js 15 luxury property management brochure website for Snowbird in Queenstown, NZ. Serves public-facing property listings, guest guides protected by JWT auth, an owner documentation portal, and internal staff documentation. Deployed on Vercel with automatic GitHub integration.

## Language / Runtime
TypeScript / Next.js 15.4.2 + React 19 + Tailwind CSS

## Entry Points
- `src/app/page.tsx` — homepage (featured properties, hero video, about section)
- `src/middleware.ts` — authentication middleware (Supabase JWT + guest JWT from URL params)
- `src/lib/auth/roles.ts` — RBAC engine (staff/owner/guest/anonymous roles)
- `src/data/properties.ts` — static property registry (TypeScript array, Hostaway IDs)
- `next.config.mjs` — Next.js config (Fumadocs MDX, image formats, subdomain routing)

## External APIs
- Supabase (authentication + SSR, JWT validation)
- Hostaway API (OAuth token refresh, guest message fetching for TV kiosk screens)
- Resend (email delivery)

## Data Stores
- Supabase — user authentication and session management
- `src/data/properties.ts` — static property registry (TypeScript, version-controlled)
- Fumadocs MDX — docs content (markdown files in `content/`)

## Depends On
No workspace project code dependencies. Consumes Hostaway API (same credentials as workspace).

## Depended On By
- `kiosk` — Raspberry Pi fleet displays `/guestmessage/[slug]` pages from this site on property TVs

## Shared Resources
- Hostaway API credentials (shared env vars: `HOSTAWAY_CLIENT_ID`, `HOSTAWAY_CLIENT_SECRET`)
- Subdomain routing: `docs.snowbirdhq.com` → Fumadocs docs portal (via next.config.mjs rewrites)

## Deployment
Vercel — automatic deployment on GitHub push. Domain: snowbirdhq.com. Docs subdomain: docs.snowbirdhq.com. Security headers configured (SAMEORIGIN, nosniff).

## Key Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```
