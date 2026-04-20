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

**Docs portal**: `docs.snowbirdhq.com` — protected by middleware (`src/middleware.ts`) using a shared `DOCS_ACCESS_KEY` cookie gate. See "Docs access" under Session State and `content/docs/internal/guest-tokens.mdx`.

### Environment variables (Vercel)

| Variable | Format | Purpose |
|----------|--------|---------|
| `DOCS_ACCESS_KEY` | 32-char hex (openssl rand -hex 16) | Current docs access key — middleware cookie gate |
| `GUEST_TOKEN_SECRET` | Random string | Deprecated per-slug JWT scheme — kept so the old middleware can be restored |
| `STAFF_EMAILS` / `OWNER_EMAILS` / `OWNER_PROPERTIES` | Legacy | Consumed by the retired Supabase middleware; currently inert |

**Managing access**: Edit env vars in Vercel dashboard (Settings → Environment Variables) or via CLI (`vercel env add` with `printf '%s'`, not `echo` — see trailing-`\n` note below), then redeploy.

### External services

| Service | Purpose | Config location |
|---------|---------|----------------|
| Supabase | Auth (magic link OTP) | Dashboard: Authentication → URL Configuration, SMTP Settings |
| Resend | SMTP email sending | Dashboard: Domains (snowbirdhq.com verified), API Keys |
| Vercel DNS | Resend DNS records (DKIM, SPF) | `vercel dns ls snowbirdhq.com` |

**Supabase redirect URLs**: `https://docs.snowbirdhq.com/**` and `https://snowbirdhq.com/auth/callback` must be in Authentication → URL Configuration → Redirect URLs.

**SMTP (Supabase → Resend)**: Host `smtp.resend.com`, port `465`, username `resend`, password is Resend API key. Sender: `noreply@snowbirdhq.com`.

### Subdomain auth flow

1. `docs.snowbirdhq.com` paths are rewritten to `/docs/*` via `next.config.mjs` `beforeFiles` rewrites
2. A redirect in `next.config.mjs` strips any `/docs` prefix on the subdomain (prevents double-prefix after auth callback)
3. Middleware matches both `/docs/*` and pre-rewrite subdomain paths (`/properties/*`, `/owner-docs/*`, `/internal/*`)
4. Middleware normalises subdomain paths by prepending `/docs` for access checks

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

- **Docs access**: shared `DOCS_ACCESS_KEY` (Vercel production env) gates `/docs/properties/*` and `/docs/queenstown-insights`. `/docs/internal/*` and `/docs/owner-docs/*` are hard-404'd regardless of key. Short.io `-010-LandingPage` destinations append `?access=<KEY>`; first hit sets a 1-year `docs_access` httpOnly cookie and redirects to the clean URL. Middleware fails-open if the env var is missing. See `src/middleware.ts` and `content/docs/internal/guest-tokens.mdx`.
- Three property compendiums live (7-suburb, 25-dublin, 6-25-belfast) + shared Queenstown Insights. 9 remaining properties are stub scaffolding only.
- Authoring playbook: `docs/AUTHORING.md`. Review tracker: `docs/CONTENT_REVIEW.md`.
- **Key rotation**: `DOCS_ACCESS_KEY` rotates 2027-04-20; Short.io API key rotation follows whatever cadence the Short.io dashboard enforces.

## Backlog

- Per-page content review of 13 live pages — use `docs/CONTENT_REVIEW.md` as the tracker, work one property (4 pages) per session
- Decide per-property: delete or mark `draft: true` for the 9 placeholder property stubs
- Rebuild Supabase project or commit to the soft-gate model as the long-term auth (noticed 2026-04-20)
- Migrate 9 remaining property compendiums once vault content exists (noticed 2026-04-20)
- Obsius decommission — scheduled ~2026-05-20 (noticed 2026-04-18)
- `OWNER_PROPERTIES` env var on production contains placeholder example emails (`owner@email.com:...`) (noticed 2026-04-20)
- 5 production env vars have trailing-`\n` corruption — strip during the Supabase rebuild (noticed 2026-04-20)
- Medium-sensitivity info disclosures still live: gas shutoff location in 25-dublin critical-info; lockbox procedure in 6-25-belfast welcome; alarm-not-in-use notes across 3 properties — review as part of the per-page content pass
