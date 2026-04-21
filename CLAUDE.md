# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
npm run dev          # Start Next.js dev server with Turbopack (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Git Workflow
git add .            # Stage changes
git commit -m "msg"  # Commit with message
git push             # Push to GitHub (triggers automatic Vercel deployment)

# Deployment (Manual via Vercel CLI if needed)
vercel --prod --yes  # Manual production deployment (--yes required for non-interactive)
vercel list          # List recent deployments
vercel domains ls    # List domains

# DNS Management (for subdomains like pay.snowbirdhq.com)
vercel dns ls snowbirdhq.com                                     # List all DNS records
vercel dns add snowbirdhq.com [subdomain] [type] [value]         # Add DNS record
vercel dns rm [record-id]                                        # Remove DNS record
```

## Architecture Overview

**Framework**: Next.js 16.1.1 (App Router) with TypeScript
**Repository**: https://github.com/andrewlaery/snowbirdhq-website
**Hosting**: Vercel (`andrewlaerys-projects/snowbirdhq`, project ID `prj_n4lc90DMguGdRww3DxB6y8p9SLSN`)
**Domains**: snowbirdhq.com and www.snowbirdhq.com (Vercel nameservers)
**Styling**: Tailwind CSS with custom Snowbird brand colors
**Deployment**: Automatic via GitHub → Vercel integration
**Current State**: Full property brochure site with gallery pages, guest messages, and docs portal

### Tech Stack

- Next.js 16.1.1 with App Router and TypeScript (strict)
- React 19.2.3
- Fumadocs 14.x (MDX docs engine)
- Tailwind CSS 3.4 with custom configuration
- ESLint for code quality
- Node.js >=18.0.0 requirement

## High-Level Architecture

### Routing Structure
- App Router pattern with file-based routing in `src/app/`
- Static pages: `/` (homepage), `/properties` (all properties), `/privacy-policy`, `/terms`
- Dynamic pages: `/properties/[slug]` (property gallery), `/guestmessage/[slug]` (guest messages)
- Docs portal: `/docs/*` (served via `docs.snowbirdhq.com` subdomain rewrite)
- Dynamic favicon generation via `icon.tsx` using Next.js ImageResponse API

### Styling System
- Global styles imported via `app/globals.css`
- Tailwind configuration extends default theme with:
  - Custom colors: `snowbird.blue` (#B5D3D7), `snowbird.blue-dark` (#9BC5CA)
  - Extended letter spacing: `tracking-wider-xl` (0.2em)
  - System font stack for consistent cross-platform typography

### Build & Deployment Pipeline
1. **Local Development**: Turbopack-powered dev server for fast HMR
2. **Build Process**: Next.js static optimization for all pages
3. **Deployment**: GitHub push → Vercel automatic build → CDN distribution
4. **DNS**: Managed through Vercel CLI (domain registered with Vercel)

## Tailwind Custom Configuration

```javascript
// Key custom extensions in tailwind.config.js
colors: {
  snowbird: {
    blue: '#B5D3D7',      // Primary brand color
    'blue-dark': '#9BC5CA' // Darker variant (unused currently)
  }
}
letterSpacing: {
  'wider-xl': '0.2em'     // Used for "COMING SOON" text
}
```

## Auth & Access Control

**Docs portal**: `docs.snowbirdhq.com` — protected by a **two-tier HMAC-signed cookie gate** in `src/middleware.ts`. See `content/docs/internal/guest-tokens.mdx` and the Session State below.

### Two tiers

| Cookie | Set by | Grants | Sidebar |
|---|---|---|---|
| `docs_property` = `{slug}.{hmac}` | Short.io handshake — `?access=<DOCS_ACCESS_KEY>` on a `/docs/properties/{slug}` URL | `/properties/{that-slug}/*` + `/queenstown-insights` | hidden (focused single-property view) |
| `docs_portal` = `1.{hmac}` | Password form — POST `password=SnowbirdHQ` to `/api/access-unlock` | Full portal: `/`, `/properties`, every property, Queenstown Insights | shown everywhere |

Both HMAC-SHA256-signed with `DOCS_COOKIE_SECRET` via Web Crypto (`src/lib/auth/docs-cookie.ts`). `/docs/internal/*` and `/docs/owner-docs/*` remain hard-404 regardless of cookie. Unauthenticated hits to gated paths redirect to `/access?from=<path>` — the password form lives there; after POST the user is redirected back to the `from` target.

### Environment variables (Vercel)

| Variable | Format | Purpose |
|----------|--------|---------|
| `DOCS_ACCESS_KEY` | 32-char hex | Short.io handshake key (sets `docs_property`) |
| `DOCS_PORTAL_PASSWORD` | Plaintext, case-sensitive | Password users type on `/access` (currently `SnowbirdHQ`) |
| `DOCS_COOKIE_SECRET` | 32-byte hex | HMAC signing key for both cookies — rotating invalidates every active session |
| `GUEST_TOKEN_SECRET` | Random string | Deprecated per-slug JWT scheme — kept so the old middleware can be restored |
| `STAFF_EMAILS` / `OWNER_EMAILS` / `OWNER_PROPERTIES` | Legacy | Consumed by the retired Supabase middleware; currently inert |

**Managing access**: Edit env vars in Vercel dashboard (Settings → Environment Variables) or via CLI (`vercel env add` with `printf '%s'`, not `echo` — see trailing-`\n` note below), then redeploy so the edge-runtime env snapshot updates.

### External services

| Service | Purpose | Config location |
|---------|---------|----------------|
| Supabase | Auth (magic link OTP) | Dashboard: Authentication → URL Configuration, SMTP Settings |
| Resend | SMTP email sending | Dashboard: Domains (snowbirdhq.com verified), API Keys |
| Vercel DNS | Resend DNS records (DKIM, SPF) | `vercel dns ls snowbirdhq.com` |

**Supabase redirect URLs**: `https://docs.snowbirdhq.com/**` and `https://snowbirdhq.com/auth/callback` must be in Authentication → URL Configuration → Redirect URLs.

**SMTP (Supabase → Resend)**: Host `smtp.resend.com`, port `465`, username `resend`, password is Resend API key. Sender: `noreply@snowbirdhq.com`.

### Subdomain auth flow

1. `docs.snowbirdhq.com` paths are rewritten to `/docs/*` via `next.config.mjs` `beforeFiles` rewrites. The general rewrite uses `/:path(...).+` (non-empty path); `/access`, `/auth`, `/api`, `/_next`, `/icon` are excluded so they render without the fumadocs shell.
2. A redirect in `next.config.mjs` strips any `/docs` prefix on the subdomain (prevents double-prefix after auth callback).
3. Middleware matches both pre-rewrite subdomain paths (`/`, `/properties/*`, `/queenstown-insights*`, `/owner-docs/*`, `/internal/*`) and `/docs/:path+` to catch direct deep hits.
4. Middleware normalises subdomain paths by prepending `/docs` for access checks.
5. Root `/` on the docs subdomain: portal users get redirected to `/properties` (sidesteps a fumadocs/Next.js routing collision where `src/app/docs/page.tsx` loses to `src/app/docs/[...slug]/page.tsx` with `slug=[]`). Anonymous users go to `/access`.

## Property Data & Photos

> **Authoring reference**: `docs/AUTHORING.md` has the full playbooks (add property, rename slug, rotate docs access key, common gotchas). This section stays for quick orientation.

### Data source
- `src/data/properties.ts` — static property array with gallery definitions, exported helpers (`getProperty`, `getFeaturedProperties`, `getAllSlugs`)
- Imported by property pages, homepage, and menu overlay — do not delete without replacing all imports

### Photo conventions
- Photos live in `public/properties/{slug}/` with semantic filenames: `hero.jpg`, `living.jpg`, `bedroom.jpg`, `kitchen.jpg`, `bathroom.jpg`, `balcony.jpg`, etc.
- Directory name must be lowercase to match the slug (macOS is case-insensitive but Vercel can be case-sensitive)
- Gallery layout types: `full` (single wide image) and `split` (paired side-by-side)
- Only properties with a photo directory should be listed in `properties.ts` — remove entries without photos to avoid broken images

### Adding a new property
1. Create `public/properties/{slug}/` with semantic-named photos (at minimum `hero.jpg`)
2. Add entry to `src/data/properties.ts` with slug, name, description, gallery array, and hostawayId
3. Set `featured: true` to show on homepage (currently 6 featured)

## Compendium / Docs Content

Per-property compendium content (Welcome & House Rules / User Instructions / Critical Info / landing page) is authored in an Obsidian vault and synced into this repo. Full authoring playbooks are in `docs/AUTHORING.md`.

**Source of truth (compendium)**: Obsidian vault at `~/Documents/andrewlaery/SnowbirdHQ/Property/{Name}/` — files named `{N.M}_{PropertyName}_ {Title}.md`.
- `1.0_*_Landing Page.md` → `index.mdx`
- `1.1_*_Welcome And House Rules.md` → `welcome-house-rules.mdx`
- `1.2_*_User Instructions.md` → `user-instructions.mdx`
- `1.3_*_Critical And Essential Information.md` → `critical-info.mdx`
- `_General/Queenstown Insights.md` → `content/docs/queenstown-insights.mdx`

**Sync script**: `scripts/sync-property-compendium.sh`
- `./scripts/sync-property-compendium.sh` — all properties
- `--only {slug}` — single property
- `--dry-run` — preview
- Injects `title:` / `description:` frontmatter if missing
- Rewrites legacy `go.bcampx.com/{X}-011-HouseRules` short-URLs to absolute `/docs/properties/{slug}/welcome-house-rules` paths
- **Always edit the vault `.md`, not the generated `.mdx`** — MDX is overwritten on next sync.

**Case sensitivity**: Vercel's Linux filesystem is case-sensitive; always use lowercase slugs in `public/properties/{slug}/` and `content/docs/properties/{slug}/`.

**Fumadocs folder rule**: any folder listed in its parent's `meta.json` `pages` array MUST contain an `index.mdx`, or clicking the section header triggers `notFound()`.

**Next.js redirect quirk**: `next.config.mjs` strips `/docs/` prefix on the `docs.*` subdomain, so **never use `./relative` markdown links** — they resolve against the cleaned URL and break. Always emit absolute `/docs/...` paths. The sync script does this automatically.

## Security Configuration

Next.js security headers (next.config.js):
- X-Frame-Options: SAMEORIGIN (prevents clickjacking)
- X-Content-Type-Options: nosniff (prevents MIME sniffing)
- Referrer-Policy: origin-when-cross-origin (controls referrer information)

## DNS & Subdomain Management

**Important**: snowbirdhq.com uses Vercel's nameservers with a wildcard ALIAS record that catches all subdomains. When adding subdomains for external services (e.g., Stripe):
- CNAME records require DNS propagation (up to 24 hours)
- Wildcard ALIAS may initially intercept subdomains
- Use `vercel dns` commands to manage records

## Deployment Verification

```bash
# Pre-deployment checks
npm run build        # Must complete without errors
npm run lint         # Zero warnings required
npm run type-check   # Strict TypeScript compliance

# Post-deployment verification
vercel list          # Check deployment status
curl -I https://snowbirdhq.com  # Verify production response
```

## Known Issues & Solutions

### Subdomain Routing to Vercel Instead of External Service
- **Issue**: Wildcard ALIAS record catches all subdomains
- **Solution**: Wait for DNS propagation (1-24 hours) after adding CNAME records

### Build Warnings
- **TypeScript**: All strict mode violations must be resolved
- **ESLint**: Zero warnings policy enforced
- **Tailwind**: Unused custom classes will trigger build warnings

### Vercel env-var trailing `\n` corruption
Multiple env vars on production (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OWNER_EMAILS`, `STAFF_EMAILS`, `OWNER_PROPERTIES`) have literal `\n` trailing bytes from legacy `echo "$v" | vercel env add` pipes. Symptoms: `vercel env pull` writes values that end in `\n"` in dotenv format; in runtime, URLs fail DNS ("Bad hostname") and allowlists don't match. **Always use `printf '%s'` (not `echo`) when piping secrets to `vercel env add`**. Project-scoped memory has a full note at `~/.claude/projects/-Users-andrewlaery-code---Production---server-vercel-snowbirdhq-website/memory/feedback_vercel_env_add.md`.

### Supabase project is dead (2026-04-20)
`NEXT_PUBLIC_SUPABASE_URL` references `axgqojutjbyopchnmwzh.supabase.co` — DNS returns NXDOMAIN. Project appears to have been deleted (paused projects still resolve). Magic-link sign-in is broken. A soft shared-key gate (`DOCS_ACCESS_KEY`) now bridges the docs portal in its place; see "Docs access" below. Restoration path back to Supabase: rebuild the project, clean all 5 corrupted env vars with `printf`, `vercel --prod` for a fresh build (NEXT_PUBLIC vars are baked in), then swap the middleware back to the Supabase + per-slug JWT version from git history.

## Session State

- **6-25-Belfast compendium refreshed from Pete Bouma feedback** (2026-04-21 evening, commits `f41fda5` + `ae21420`). 12 edits shipped to production MDX across both `welcome-house-rules.mdx` and `user-instructions.mdx`, plus Pete's Harvia sauna dial photo at `public/properties/6-25-belfast/sauna-dial.jpg`. Summary: FOB clarification (1 in lockbox + 1 inside apartment, $300 replacement charge), parking rewrite (1 garage + 2 overflow + street, no campervans), late-checkout/luggage "discuss with host", leave-unused-food-for-housekeeping, Bosch oven wall switch prerequisite, sauna "Three Things Must Be On" + dial photo embed, drinking water section (fridge dispenser), cot availability (24h notice), gas fire location (upstairs lounge → living room), KOCOM intercom replaced with "not in operation" note. Ice bath winter shutdown deferred to owners/managers ops SOP per Andrew's instruction.
- **Vault ↔ MDX reconciled** (2026-04-21 late evening). After granting Full Disk Access to iTerm.app (the TCC subject for Claude Code on this Mac — see `reference_tcc_iterm.md`), the 12 MDX edits were mirrored into vault sources at `~/Documents/andrewlaery/SnowbirdHQ/Property/6-25-Belfast/1.{1,2}_*.md`. `./scripts/sync-property-compendium.sh --only 6-25-belfast` now produces only trailing-whitespace diffs (auto-stripped by pre-commit) — vault and MDX are semantically identical, so no new commit was needed. Stray `_test_write.md` in the vault folder also deleted. **Future edits flow through the vault → sync → commit pattern as originally designed.**
- **Two-tier docs access gate live** (2026-04-20). Short-link handshake sets a property-scoped `docs_property` cookie — guests see only their property + Queenstown Insights, no sidebar. Password `SnowbirdHQ` on `/access` sets a `docs_portal` cookie — unlocks full portal (sidebar, all properties). Both HMAC-signed via `DOCS_COOKIE_SECRET`. `/docs/internal/*` and `/docs/owner-docs/*` hard-404 regardless.
- **Self-hosted short-link redirector live** (2026-04-21). Map in `src/lib/short-links.ts`, route at `src/app/s/[slug]/route.ts`. **Two branded domains**: `go.bcampx.com` (legacy, A record 76.76.21.21 at Cloudflare) and `go.snowbirdhq.com` (2026-04-21, Vercel-native). Both serve the same map in parallel; existing printed material keeps working, new material uses the cleaner `go.snowbirdhq.com` form. Every property has three working path shapes: `{Slug-PascalCase}`, `{slug-lowercase}`, and the legacy `{Slug}-010-LandingPage` long form. Short.io subscription still live until 2026-04-23 (Phase 5 decommission).
- **All 15 property compendiums now have real content** (2026-04-21). Authored from guest-ops knowledge bases + admin cheat sheets + Hostaway listing cache + existing 7-Suburb template. Content covers all 4 pages (landing / welcome & house rules / user instructions / critical info) per property. Thinner content on 73a-hensman (upper lodge — KB had WiFi password typo + TODO utility locations) and 41-suburb-basecamp (post-rename, lighter KB than others). The rest match the depth of the originally-migrated three.
- Property slug rename completed: `41-suburb-bonsai` → `41-suburb-basecamp` across `src/data/properties.ts`, `content/docs/properties/`, `public/properties/`, `content/docs/properties/meta.json`. hostawayId updated 428528 (dead) → 500890 (live).
- Authoring playbook: `docs/AUTHORING.md`. Review tracker: `docs/CONTENT_REVIEW.md`. Access register: `content/docs/internal/guest-tokens.mdx`.
- **Key rotation**: `DOCS_ACCESS_KEY` rotates 2027-04-20. Rotating `DOCS_COOKIE_SECRET` invalidates every active cookie (break-glass reset). `DOCS_PORTAL_PASSWORD` is currently `SnowbirdHQ` — guessable, acceptable under soft-gate threat model.
- **Next session candidate**: once iTerm has Full Disk Access, reconcile the 6-25-Belfast vault files with the 12 MDX edits (rounds 1 + 2), then run `./scripts/sync-property-compendium.sh --only 6-25-belfast` to confirm parity. Then resume the `docs/CONTENT_REVIEW.md` per-page review starting with thinner compendiums (73a-hensman, 14-15-gorge, 41-suburb-basecamp).

## Backlog

- Per-page content review of all 15 live pages — use `docs/CONTENT_REVIEW.md` as the tracker. Start with thinner compendiums (73a-hensman, 14-15-gorge, 41-suburb-basecamp) since they're most likely to surface gaps.
- **Photo sourcing needed** for 4 properties without `public/properties/{slug}/` directories: `73a-hensman`, `14-15-gorge`, `100-risinghurst-home`, `100-risinghurst-unit`. Docs pages already live; marketing gallery pages blocked until photos are on disk (noticed 2026-04-21).
- **73a-hensman compendium is lighter than the rest** — WiFi password has a flagged typo (`Lakeviewipper123` vs `Lakeviewupper123`), fuse box + mains water locations are TODO, heating + kitchen + laundry specifics absent. Owner phone call could fill it in 15 min; then re-author + sync (noticed 2026-04-21).
- **41-suburb-basecamp compendium thinner than others** — guest-ops KB was minimal (lockbox, WiFi, off-street parking only). Fill in from BaseCamp-specific details when next available (noticed 2026-04-21).
- Rebuild Supabase project or commit to the soft-gate model as the long-term auth (noticed 2026-04-20)
- Obsius decommission — scheduled ~2026-05-20 (noticed 2026-04-18)
- `OWNER_PROPERTIES` env var on production contains placeholder example emails (`owner@email.com:...`) (noticed 2026-04-20)
- 5 production env vars have trailing-`\n` corruption — strip during the Supabase rebuild (noticed 2026-04-20)
- Medium-sensitivity info disclosures still live: gas shutoff location in 25-dublin critical-info; lockbox procedure in 6-25-belfast welcome; alarm-not-in-use notes across 3 properties — review as part of the per-page content pass
- Phase 5 of Short.io → self-hosted redirector migration: wait until 2026-04-23 (48h soak), then delete the 14 Short.io links + cancel Short.io subscription + revoke API key `sk_S8pzg...` (noticed 2026-04-21)
- Retire `go.bcampx.com` eventually (~3-6 months out once any printed materials using the old form have cycled out). Trivial to remove: one rewrite rule delete + `vercel domains rm` + one Cloudflare DNS delete (noticed 2026-04-21)
- Rotate `DOCS_PORTAL_PASSWORD` from `SnowbirdHQ` to a non-guessable value if the portal ever hosts content beyond property guides (noticed 2026-04-20)
- Vercel GitHub auto-deploy is unreliable — multiple pushes required manual `vercel --prod`. Check the GitHub → Vercel webhook / integration config (noticed 2026-04-20)
- Upgrade marketing listing descriptions — e.g. `73b-hensman` current `properties.ts` name "Comfortable Lodge, Quiet Neighbourhood" is weaker than the actual Hostaway title "Lakeview Lodge Two with Stunning Views". Similar polish opportunity on several others (noticed 2026-04-21)
- **Per-property action items** for all BCampX properties are tracked in `__server-bcampx/guest-ops/src/property_profile_store.py` (SQLite `property_items` table on the bcampx server, keyed by `property_name` = `internal_name` from `snowbirdhq.properties.PROPERTIES`). Categories: `hazard`, `maintenance`, `amenity`, `improvement`, `compliance`, `process`, `feedback_theme`. Priorities: `low`/`medium`/`high`/`critical`. Six SkyCrest items filed 2026-04-21 evening (`dbbd5630`, `483a6b4e`, `f4bef825`, `7ec01901`, `42c56a02`, `836ae4fe`). Query: `ssh bcampx 'docker exec -i guest-ops python -c "from src.property_profile_store import PropertyProfileStore; [print(i) for i in PropertyProfileStore().get_items(property_name=\"6-25-Belfast\", status=\"open\")]"'`
- $300 lost-FOB replacement charge policy — log into BCampX damage/charge tracking system so it's actually invoiced when a FOB is lost (guest guide states the policy; operational side still needs a home). (noticed 2026-04-21)
- Pete commitments #5 (2 FOBs documented) and #6 (sauna dial photo embedded) — shipped. Owner-log for SkyCrest lives at `__server-bcampx/guest-ops/knowledge/properties/6-25-belfast.md` (the `knowledge/owner-log/` directory referenced in earlier sessions doesn't exist — reference was stale). (noticed 2026-04-21)
- Ice bath winter shutdown procedure (May–Sep: turn chiller OFF at wall plug, water stays cold from ambient) belongs in an owners/managers operations SOP — not the guest guide. Pete's 2026-04-16 email was the source. (noticed 2026-04-21)
