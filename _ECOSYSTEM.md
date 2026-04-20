# snowbirdhq-website — Ecosystem Reference

See [WORKSPACE_CATALOG.md](../../WORKSPACE_CATALOG.md)

## Role
Next.js 16 luxury property management brochure website for Snowbird in Queenstown, NZ. Serves public-facing property listings, per-property guest compendiums migrated from Obsidian/Obsius, an owner documentation portal, and internal staff documentation. Deployed on Vercel with automatic GitHub integration.

## Language / Runtime
TypeScript / Next.js 16.1.1 + React 19.2.3 + Tailwind CSS 3.4 + Fumadocs 14

## Entry Points
- `src/app/page.tsx` — homepage (featured properties, hero video, about section)
- `src/middleware.ts` — two-tier docs gate: `docs_property` cookie from Short.io handshake + `docs_portal` cookie from password form, both HMAC-signed
- `src/lib/auth/docs-cookie.ts` — `signCookie()` / `verifyCookie()` HMAC-SHA256 helpers via Web Crypto (works in both Edge middleware and Node.js runtimes)
- `src/app/api/access-unlock/route.ts` — POST handler: constant-time password compare against `DOCS_PORTAL_PASSWORD`, sets `docs_portal` cookie, 303-redirects to safe `from` target
- `src/app/access/page.tsx` — password form + mailto fallback; anonymous gate page
- `src/lib/auth/roles.ts` — retired Supabase RBAC engine; kept for restoration path
- `src/data/properties.ts` — static property registry (TypeScript array, Hostaway IDs)
- `next.config.mjs` — Next.js config (Fumadocs MDX, image formats, docs.snowbirdhq.com subdomain routing — redirects strip `/docs/` prefix; rewrite uses `.+` not `.*` to leave `/` alone)
- `scripts/sync-property-compendium.sh` — Obsidian → MDX mapper for property compendiums (BCampX-aware filename convention; strips vault `tags:` frontmatter)
- `scripts/generate-guest-token.ts` — deprecated JWT signing tool; kept so the old Supabase + per-slug middleware can be restored

## External APIs
- Supabase (authentication + SSR) — **project dead**: `axgqojutjbyopchnmwzh.supabase.co` returns NXDOMAIN (2026-04-20). Replaced by shared-key middleware cookie gate.
- Hostaway API (OAuth token refresh, guest message fetching for TV kiosk screens)
- Resend (email delivery, currently unused while Supabase magic-link is down)
- Short.io REST API (`api.short.io`) — manages `go.bcampx.com` short links that carry `?access=<DOCS_ACCESS_KEY>` into the docs portal (domain ID `1295533`)

## Data Stores
- `src/data/properties.ts` — static property registry (TypeScript, version-controlled)
- Fumadocs MDX — docs content (markdown files in `content/docs/`)
- Obsidian vault at `~/Documents/andrewlaery/SnowbirdHQ/Property/{Name}/` — authoring source of truth for property compendiums; generated MDX in `content/docs/properties/{slug}/` is **overwritten on every sync**
- Vercel project `snowbirdhq` production env — stores `DOCS_ACCESS_KEY`, `DOCS_PORTAL_PASSWORD`, `DOCS_COOKIE_SECRET` (and the retired Supabase vars, see CREDENTIALS_MAP)

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
