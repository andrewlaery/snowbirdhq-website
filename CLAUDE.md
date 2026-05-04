# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Property updates → see the playbook

**`__Production/_shared/docs/PROPERTY_UPDATE_PLAYBOOK.md`** is the canonical guide for editing property facts that surface in the compendium. Read it before changing anything under `content/docs/properties/<slug>/` or `data/sot/`.

Quick rules:

- **Never hardcode property facts in `content/docs/properties/<slug>/*.mdx`.** The MDX files are pure component composition (post-Phase-4). Every fact resolves from `_shared/properties/<slug>/` via the loader at `src/lib/sot.ts`.
- **Edit the SOT, not `data/sot/`.** Author at `__Production/_shared/properties/<slug>/`, then run `npm run sync-sot` to refresh the vendored copy in `data/sot/`. Commit both.
- **The eight available MDX components** for property pages (registered in `mdx-components.tsx`):
  - `<PropertyQuickInfo slug="..." />` — facts.yaml top card
  - `<PropertyWelcome slug="..." />` — guest_copy.md welcome sections (react-markdown)
  - `<PropertyAccessInstructions slug="..." />` — exceptions.access
  - `<PropertyHouseRulesDeltas slug="..." />` — exceptions.house_rules
  - `<PropertyHazards slug="..." />` — exceptions.hazards
  - `<PropertyOperationalNotes slug="..." />` — exceptions.notes
  - `<PropertyUsageSections slug="..." />` — exceptions.usage_sections (Markdown bodies)
  - `<ApplianceSet slug="..." />` or `<AppliancePage model="..." />` — appliance library
- **Site-wide shared components**: `<HouseRulesBase />`, `<CriticalInfoBase />`, `<QueenstownEssentials />`. One source per concern. Edit these to ripple changes across all 13 properties.
- **Appliance library** at `data/sot/_appliances/<slug>.md` (canonical EN) + `data/sot/_appliances/{zh,ja}/<slug>.md` (translations). 28 entries: 19 cross-property model-based (e.g. `bosch-pue611bb5`) + 9 property-specific (e.g. `25-dublin-gas-fire` — namespaced slugs for things unique to one property). Each entry has `category:` frontmatter (`kitchen` / `heating` / `climate` / `laundry` / `wellness` / `tech` / `outdoor` / `smart-home` / `other`). **No registry** — drop a new `.md` file in. `<ApplianceSet slug="..." lang="...">` reads each appliance's category and renders H3 sub-headings under the `## Appliances` H2; appliance bodies' `### Title` lines auto-shift to H4 inside the grouped layout (standalone `<AppliancePage model="...">` usage unaffected). Reused across properties via `facts.yaml::appliances:` slug list — order in YAML preserved within each category bucket.
- **Sync mechanism**: `scripts/sync-sot.mjs` copies `__Production/_shared/properties/` → `data/sot/properties/`. Wired into `npm run prebuild` so Vercel uses the committed copy. Locally, run `npm run sync-sot` manually before commits.
- **Drift detection**: `vrm doctor [slug]` (in `__bcampx/ota-manager/`) compares SOT against ota-manager + guest-ops files.
- **Auth gating**: `/access` middleware guards everything under `/properties/`. Short-link tokens via `go.snowbirdhq.com/<slug>` grant temporary access. Local dev (`npm run dev`) bypasses auth.

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
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | Powers the per-property AI chat at `/docs/properties/{slug}/ask`. Must be present on Production *and* Preview scopes. Use `printf '%s'` not `echo` when piping to `vercel env add`. |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Auto-injected | Upstash Redis REST endpoint + write token for the `snowbirdhq-clicks` database. Read by `src/lib/click-tracking.ts`. Auto-injected by the Vercel Marketplace Upstash integration across Production + Preview + Development when the store was bound with prefix `KV`. Fallbacks also checked: `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`. |
| `KV_REST_API_READ_ONLY_TOKEN` / `KV_URL` / `KV_REDIS_URL` | Auto-injected | Also provided by the Upstash integration (read-only REST token, Redis protocol URL, `redis://` form). Currently unused by app code but kept for future direct-Redis clients / debugging. |
| `DISABLE_CLICK_TRACKING` | `'true'` or unset | Kill switch — short-circuits both `recordClick()` and `recordDocsPageView()` so no Redis writes happen. Useful if KV cost/latency ever surprises us. |
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

## Per-Property AI Chat ("Ask Me Anything")

Live as of 2026-04-23. Route: `/docs/properties/{slug}/ask` (static-segment beats the `[...slug]` catch-all). Surfaced as the 5th nav card on every property landing page via `src/components/property-landing-nav.tsx`.

- **Model**: Claude **Haiku 4.5** (`claude-haiku-4-5-20251001`) via Vercel AI SDK v6 (`ai` ^6, `@ai-sdk/anthropic` ^3, `@ai-sdk/react`). Markdown rendered via `react-markdown` with a custom `components` map matching the editorial-luxe tokens (Newsreader headings, Geist body, deep-teal links, JetBrains Mono inline code).
- **Context scope** (post-2026-04-27 SOT wiring): three layers, declared in priority order in the system prompt — (1) **PROPERTY FACTS** = `data/sot/properties/<slug>/{identity,facts}.yaml` + `guest_copy.md`, loaded by `src/lib/chat/sot-context.ts` (canonical source of truth); (2) **PROPERTY GUIDE** = the 4 MDX files (index, welcome-house-rules, user-instructions, critical-info), now mostly component shells but kept as supplementary; (3) **QUEENSTOWN INSIGHTS** = `content/docs/queenstown-insights.mdx`. **`policies.yaml` is deliberately excluded** — it holds master access codes (front-door master, garage, alarm) that must never reach the chat model. Pre-fix the route only saw the four MDX files, which after Phase 4 are pure `<Property* />` component tags — the AI got literal markup, no facts.
- **Prompt caching**: `providerOptions.anthropic.cacheControl: { type: 'ephemeral' }` set on the **system message inside the `messages` array** (not the top-level `system` field — that approach won't accept providerOptions). Haiku 4.5 minimum cacheable prefix is 4096 tokens; SOT (~12K) + MDX + insights now ~24K tokens total, well clear of the threshold. `onFinish` reads `usage.inputTokenDetails.cacheReadTokens` / `cacheWriteTokens` and logs them for every exchange.
- **Auth**: API route bypasses the docs middleware (API paths are excluded from the `next.config.mjs` subdomain rewrite). `/api/chat/[slug]/route.ts` manually verifies `docs_portal` or matching-slug `docs_property` cookie using `verifyCookie` from `src/lib/auth/docs-cookie.ts`. Fails-open when `DOCS_COOKIE_SECRET` is absent, mirroring middleware behaviour.
- **Rate limit**: in-memory sliding window keyed by `ip:slug`, 20 messages per 60 min per IP. Module-level `Map<string, number[]>` in `src/lib/chat/rate-limit.ts`. Best-effort across lambda cold starts; acceptable under the soft-gate threat model. Upgrade to Upstash/KV is a backlog item if abuse surfaces.
- **Files**: `src/app/api/chat/[slug]/route.ts`, `src/app/docs/properties/[slug]/ask/page.tsx`, `src/components/property-ask-chat.tsx`, `src/lib/chat/{property-context,sot-context,prompt,rate-limit}.ts`.
- **AI SDK v6 gotchas** (worth remembering):
  - `convertToModelMessages()` is **async** in v6 (returns `Promise<ModelMessage[]>`) — `await` it before spreading.
  - Cache fields live at `usage.inputTokenDetails.cacheReadTokens` / `cacheWriteTokens` (the top-level `cachedInputTokens` is deprecated).
  - `useChat` moved out of `ai` into `@ai-sdk/react` — install separately. Transport instance created with `new DefaultChatTransport({ api: ... })`.
  - Client `useChat` sends UIMessages; server must call `convertToModelMessages(messages)` before passing to `streamText`.

## Short-link + docs traffic tracking

Live as of 2026-04-24. Records every hit to `go.bcampx.com` / `go.snowbirdhq.com` (short-link clicks) and every authorised pageview on `docs.snowbirdhq.com` (pageviews through middleware). Dashboard at `/docs/internal/link-stats` (portal-cookie gated) shows per-slug / per-path totals, recent hits tables, and inline-SVG bar charts per section with an `?range=all|30d|7d` filter.

- **Storage**: Upstash Redis via Vercel Marketplace — project `snowbirdhq-clicks` (iad1, Free plan, 500k commands/mo). Env vars auto-injected with `KV_` prefix across Prod/Preview/Dev (see env var table). No manual provisioning after the initial Marketplace install.
- **Redis schema** (two cleanly-split namespaces so the streams can be pruned independently):
  - Short links: `clicks:total:{slug}` (lifetime counter), `clicks:day:{YYYY-MM-DD}:{slug}` (per-day, NZT-aligned), `clicks:recent` (ring buffer of last 500 events).
  - Docs: `docs:total:{path}` / `docs:day:{YYYY-MM-DD}:{path}` / `docs:recent` — same shape. Path key is the subdomain-facing form (no `/docs` prefix, trailing slash stripped).
- **Write path**: `src/lib/click-tracking.ts` exposes `recordClick(slug, request)` (called from `src/app/s/[slug]/route.ts`) and `recordDocsPageView(path, request)` (called from `src/middleware.ts`, for every `NextResponse.next()` in the docs-subdomain branch via an `allow()` helper). Both are fire-and-forget via `after()` from `next/server` — the 302 / page response is never blocked waiting for Redis.
- **What's NOT recorded**: redirects (auth gate, access-key handshake, subdomain root), API paths, `/_next/*` assets, `/icon`, `/favicon.ico`, and the `/access` page itself. Filtered inside `normalisePath()` so they never hit Redis.
- **Privacy posture**: IPv4 truncated to /24 prefix, IPv6 dropped entirely. Country/city from Vercel geo headers (`x-vercel-ip-country`, `x-vercel-ip-city`). User-Agent bucketed to a short label (e.g. "iOS Safari", "Desktop Chrome", "Bot") — full UA string never stored.
- **Dashboard auth**: `src/middleware.ts` has an `INTERNAL_PORTAL_PATHS` carve-out for `/docs/internal/link-stats` (plus future internal tools) — bypasses the `/docs/internal/*` hard-404 but requires the portal cookie, redirects to `/access` otherwise. Everything else under `/docs/internal/*` stays 404.
- **Fails open**: if `KV_REST_API_URL` + `KV_REST_API_TOKEN` (or the `UPSTASH_REDIS_REST_*` equivalents) aren't set, `recordClick` / `recordDocsPageView` no-op and the dashboard renders a "Redis is not configured" state. Safe to ship ahead of provisioning the store.
- **Kill switch**: `DISABLE_CLICK_TRACKING=true` short-circuits every write. Set in Vercel env if cost/latency ever surprises us.
- **Cost envelope**: each hit is 4 Redis commands (incr lifetime + incr per-day + lpush + ltrim). At 1000 hits/day that's ~120k commands/mo — well inside the Upstash Free 500k/mo budget.
- **`@vercel/kv` is deprecated**: we use `@upstash/redis` directly (Vercel now routes all Redis through the Upstash Marketplace). Don't reinstall `@vercel/kv`.
- **Day bucketing** uses `new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland', ... })` — `en-CA` naturally formats as ISO `YYYY-MM-DD`, which keeps day keys sortable and matches the NZT calendar day the user expects (avoids UTC-alignment bugs).
- **Chart**: inline SVG, no chart library. `BarChart` component in `src/app/docs/internal/link-stats/page.tsx`. Hover any bar for a native `<title>`-tooltip count, peak labelled in the header.
- **Files**: `src/lib/click-tracking.ts`, `src/app/docs/internal/link-stats/page.tsx`, `src/app/s/[slug]/route.ts` (short-link redirect + recordClick), `src/middleware.ts` (pageview recording + `INTERNAL_PORTAL_PATHS` carve-out).

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

For per-day session narratives see `sessions/YYYY-MM-DD.md`. Latest commit on each repo: `git log -1 main`.

**Last session: 2026-05-02 (afternoon)** — Two threads.

1. **SOT extensive content + structure audit** (in `__Production/_shared` repo). New `scripts/audit-properties.sh` (one `claude -p` per property × 14, ~$0.50, ~75 min) + `scripts/audit-staleness.sh` (visibility, not gate-keeping). Outputs: 14 per-property `AUDIT.md` + workspace roll-up at `_shared/SOT_AUDIT_2026-05.md` (leaderboard + portfolio-wide P0 backlog + top 5 cross-portfolio gaps). 50-item industry checklist embedded in the prompt (Vacasa / Onefinestay / Schema.org LodgingBusiness / Airbnb Plus/Luxe / QLDC). Cadence: quarterly, registered in `_shared/docs/REFERENCE_INDEX.md`. Companion 11-property door-code leak remediation (commit `b07dac0` in `_shared`, `vrm push --via hostaway` × 11 to live OTAs — Hostaway central + VRBO clean; Airbnb still needs `vrm export` per slug + Booking.com manual extranet).

2. **25-dublin pilot — composition-shell → rich-body MDX + grouped Appliances** (in website repo, on branch `fix/25-dublin-pilot-and-renames`, PR #17 open). Migrated `usage_sections` narrative into MDX bodies. ApplianceSet refactored to read `category:` frontmatter and render H3 sub-headings under the `## Appliances` H2 (kitchen / heating / climate / laundry / wellness / tech / outdoor / smart-home). Auto heading-shift H3→H4 inside grouped layout. 9 new appliance library entries for 25-dublin's device-operating instructions (Gas Fire / Wood Burner / Spa / Bosch Gas Hob / Insinkerator / AEG Washer / AEG Dryer / Electric Blinds / Electric Windows). All 19 existing appliances tagged with `category:`. ZH + JA companions re-translated. 150/150 manifests fresh. Naming alignment: 73a-hensman display_name TODO → "Lakeview Lodge Upper"; 6a-643-frankton inline YAML comment stripped; `properties.ts.name` aligned to "Brand — tagline" form for the 6 already-branded slugs.

**Branches**:
- `__Production/_shared` — `main` clean at `c08ff5c` (lighting backlog).
- `__server-vercel/snowbirdhq-website` — `main` clean at `96ef2cb` (JA merge); active branch `fix/25-dublin-pilot-and-renames` HEAD `d0f5d41`, **PR #17 open**, awaiting merge once Vercel preview reviewed.

**Deployed live** (already shipped this session): JA i18n at /docs/ja/* (PR #15 merged earlier); 11-property door-code OTA scrub (Hostaway central + VRBO clean within 24h).

**Forward-looking facts**:
- Key rotation: `DOCS_ACCESS_KEY` rotates 2027-04-20. Rotating `DOCS_COOKIE_SECRET` invalidates every active cookie. `DOCS_PORTAL_PASSWORD` is `SnowbirdHQ` — guessable, acceptable under soft-gate threat model.
- Next quarterly SOT audit: 2026-08-02. Re-run via `bash __Production/_shared/scripts/audit-properties.sh`. Per-property re-audit: `--slug=<slug>`. Stale-detector wires into `/ops-weekly-meta` Monday dashboard.

## Backlog

- **Apply 25-dublin migration pattern to 41-suburb-basecamp + 7-suburb** (the other 2 composition-shell properties). Driver: `__Production/_shared/scripts/migrate-25-dublin-to-library.py` — generalise the slug parameter, reuse the strip + scaffold flow. Watch out for the strip regex's greedy `\Z` behaviour (broke 25-dublin's `<ApplianceSet />` in the pilot — fix at `migrate-usage-sections-to-mdx.py` strip-regex level: anchor termination on `<ApplianceSet` / `<H2>` / blank-line, not `\Z`). (noticed 2026-05-02)
- **Live OTA propagation still pending for 11 leak-fixed properties**: Airbnb requires `cd ~/code/__Production/__bcampx/ota-manager && OTA_SOT_PROPERTIES=<slug> .venv/bin/python -m vrm.cli export <slug>` per slug (browser automation against Hostaway dashboard); Booking.com requires manual extranet edit per listing (no API path). ~10 min for Airbnb (×11) + ~55 min for Booking.com. (noticed 2026-05-02)
- **WiFi credentials still leak in public OTA listing copy** — same shape as the door-code leak just remediated. Every `ota_copy.md::## WiFi` block (network + password) propagates to public Airbnb / VRBO / Booking.com descriptions. Strip `## WiFi` blocks, deliver via Hostaway pre-arrival message instead. ~30-45 min for all 14 properties. (noticed 2026-05-02)
- **3 lockbox codes need physical rotation** on next on-site visit: 6a-643-frankton (0606), 73a-hensman (2506), 73b-hensman (2507). Codes were public on listings for an indefinite period. Update `policies.yaml::access_codes.front_door_master` after rotation. (noticed 2026-05-02)
- **`doorSecurityCode` field missing in Hostaway dry-run payload** for 6 properties (10-15-gorge, 3-15-gorge, 6-25-belfast, 6a-643-frankton, 73a-hensman, 73b-hensman). The codes ARE in `policies.yaml::access_codes.front_door_master` upstream — projector mapping in `__bcampx/ota-manager/vrm/content_mapper.py` may not be wiring them through. Investigate so Hostaway can send codes in pre-arrival messages automatically. (noticed 2026-05-02)
- **`scripts/scaffold-zh-property.mjs` is now misnamed** — generic `--lang=` parameter but `zh` in filename. Rename to `scaffold-translated-property.mjs` next time touched. (noticed 2026-05-02)
- **Rename `25-dublin-*` appliance slugs to model-based slugs once owners share model numbers** — currently `25-dublin-gas-fire`, `25-dublin-wood-burner`, `25-dublin-spa`, `25-dublin-electric-blinds`, `25-dublin-electric-windows` use property-namespaced slugs because models weren't recorded. Migrate to `escea-<model>`, `metro-fires-<model>`, `vortex-<model>` etc. when known so cross-property appliance sharing works. (noticed 2026-05-02)
- **Per-property AUDIT.md `Action backlog` items** in `__Production/_shared/properties/<slug>/AUDIT.md` are the durable per-property to-do lists. Re-read each property's audit before doing per-property work; refresh via `bash __Production/_shared/scripts/audit-properties.sh --slug=<slug>` if source files have drifted. (noticed 2026-05-02)
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
- Pete commitments #5 (2 FOBs documented) and #6 (sauna dial photo embedded) — shipped. Owner-log for SkyCrest lives at `__server-bcampx/guest-ops/owner-log/6-25-belfast.md` (the earlier reference to `knowledge/owner-log/` was wrong — actual path is `owner-log/` at repo root, confirmed 2026-04-22). (noticed 2026-04-21)
- Judgement call: 10B-DeLaMare near-duplicate high-priority items `5db62932` ("Repair or replace heater/air conditioning system") and `687c941d` ("Repair or replace heating system/air conditioning unit") — same issue with near-identical titles, both open 47 days. Dedup pass only catches exact string matches. `ops-properties show <id>` both, dismiss one if they're the same thing. (noticed 2026-04-22)
- Critical hazard: SkyCrest `921b99c6` "Replace dangerous kitchen knives (loose blade)" — open 50+ days, now surfaced in daily digest. Address before next guest stay. (noticed 2026-04-22)
- Ice bath winter shutdown procedure (May–Sep: turn chiller OFF at wall plug, water stays cold from ambient) belongs in an owners/managers operations SOP — not the guest guide. Pete's 2026-04-16 email was the source. (noticed 2026-04-21)
- **`docs/OVERVIEW.md` is significantly out of date** — still references retired Supabase RBAC model (anonymous/guest/owner/staff roles), `STAFF_EMAILS`/`OWNER_EMAILS`/`OWNER_PROPERTIES` env vars, the legacy `src/app/docs/page.tsx` WelcomePage that no longer exists, Supabase magic-link auth flow, per-slug JWT guest tokens, and 11 properties (actually 12 now in `properties.ts`, and 15 in the docs content tree). Needs full rewrite to reflect the two-tier HMAC cookie gate + editorial-luxe design system. Flagged but not fixed this session. (noticed 2026-04-22)
- **Legacy Supabase code still in repo** — `src/components/auth-guard.tsx`, `src/components/auth-button.tsx`, `src/app/auth/callback/route.ts`, `src/app/auth/access-denied/page.tsx`, `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/lib/auth/roles.ts`, `src/lib/auth/filter-page-tree.ts`. All dead (Supabase project NXDOMAIN since 2026-04-20). Safe to delete once we commit to the soft-gate long-term — Supabase-rebuild decision is the blocker. (noticed 2026-04-22)
- **Design deferred items** (full list in `docs/DESIGN_SYSTEM.md` → Deferred section): dark-mode palette + `.dark` var overrides; accent swatch variants (ember/moss/plum/ink — source system supports 5, only deep-teal wired); sidebar folder labels in mono eyebrow (needs full `SidebarComponents.Folder` override, requires Radix Collapsible state re-impl); portal-cookie-aware sign-out affordance (replacement for the dropped AuthButton). (noticed 2026-04-22)
- **User-reported anomaly to investigate**: "when I copy a heading link it takes me here" followed by Mattermost digest content (from `property_items_digest.py`). Content is clearly from the daily ops digest, not from the docs portal. Possibly a Mattermost preview-card quirk or Chrome extension misbehaving. Interrupted before diagnosis. (noticed 2026-04-22)
- **10B-DeLaMare WiFi booster — confirm with owner** whether it's still installed. Bees Homes PDF has the booster section visibly crossed out in pen (interpreted as "removed"). Online docs still reference it. If retired, update `user-instructions.mdx` via vault. (noticed 2026-04-22)
- **10B-DeLaMare pharmacy recommendation — decide with owner**: PDF lists Queenstown Pharmacy (Corner Brecon/Isle, 03 442 2800). Online docs list Wilkinson's Unichem (Rees Street & The Mall, 03 442 7313). Both real, both nearby. Either align on owner preference or list both. (noticed 2026-04-22)
- **`docs/OVERVIEW.md` now also out of date on AI chat** — doesn't mention `/docs/properties/[slug]/ask`, `/api/chat/[slug]`, the 5th nav card, the new `ANTHROPIC_API_KEY` env var, or (after 2026-04-27) the SOT-backed context (`src/lib/chat/sot-context.ts`, `policies.yaml` exclusion). Folds into the existing "OVERVIEW.md needs rewrite" backlog item. (noticed 2026-04-23, expanded 2026-04-27)
- **AI chat — observability gap**: current logging is `console.log` in `onFinish` (visible in Vercel function logs). No aggregation, no daily cost roll-up, no alerting on runaway usage. Fine for v1 soft-gate threat model; worth a follow-up if we expand scope or see abuse. (noticed 2026-04-23)
- **Rate limiter is in-memory** — best-effort across lambda cold starts. **Upstash Redis is now wired into the project** (as of 2026-04-24) so this upgrade is much lower-friction: swap the `Map` in `src/lib/chat/rate-limit.ts` for a Redis-backed sliding window using the existing `@upstash/redis` client. Still deferred until abuse is observed. (noticed 2026-04-23, Redis now available 2026-04-24)
- **AI chat — suggested questions are static** (`SUGGESTIONS` array in `property-ask-chat.tsx`). Could be derived per-property from frontmatter or property type — deferred for v1. (noticed 2026-04-23)
- **`DOCS_ACCESS_KEY` leaks in 302 redirect URLs from short links** — when `go.bcampx.com/{slug}` 302s to `docs.snowbirdhq.com/docs/properties/{slug}?access=<KEY>`, the `access` query param is visible to anyone who clicks a link, intermediate proxies, and browser history. Acceptable under the current soft-gate threat model (the key only grants scoped access to a single property's docs, not the full portal), but worth remembering when rotating. If the portal ever hosts sensitive content, switch to a signed handshake that sets the cookie in the redirector before forwarding. (noticed 2026-04-24)
- **Traffic dashboard — no CSV export, no per-referer drill-down, no alerting, no unique-visitor counts** (the /24 IP isn't a true unique key). All deferred until we know what questions we actually want to answer from real data. Current chart is day-granularity only — no hourly view even for "Today". (noticed 2026-04-24)
- **`clicks:total:{slug}` lifetime counters and `clicks:day:*:slug` per-day counters can diverge** when the 'all' range is selected — 'all' uses lifetime counters (so pre-2026-04-24 clicks still appear), but any slug that's been hit only since per-day tracking began will show the same number in both. Not a bug, just a thing to be aware of when reconciling numbers. (noticed 2026-04-24)
- **Audit all 15 property vaults for MDX-only drift before the next sync.** The gas-fireplace fix on 2026-04-24 ran `sync-property-compendium.sh --only 6-25-belfast` and silently wiped two earlier features — Sonos physical controls (`0d80c87`) and Shark TurboBlade tower fans (`f3bcf32`) — because both had been committed directly to the MDX without updating the Obsidian vault. `docs/AUTHORING.md` line 68 ("Edit the vault, not the MDX") warns about this, but it's happened at least twice on one property, so likely on others too. Mitigation: for each slug, diff the vault `.md` against the MDX (strip frontmatter + whitespace) and backport any MDX-only content before the next sync touches it. Fixed on 6-25-belfast in `9744125`. (noticed 2026-04-24)
- **SkyCrest (6-25-belfast) — confirm Nutribullet exists.** OTA marketing copy at `__Production/_shared/properties/6-25-belfast/ota_copy.md:25, 69` advertises a "Nutribullet" but it's not in `facts.yaml::usage_sections::Kitchen`, not in `owner_log.md` par-level register, and not in the appliance library. Upstream `AUDIT.md` flags this as "either it exists (add it to SOT) or it's stale listing prose (delete from OTA copy)." On the next on-site visit, confirm physical presence: if present, add `belfast-nutribullet.md` library entry + wire into `facts.yaml::appliances`; if absent, strip from `ota_copy.md` lines 25 + 69 and `vrm push --via hostaway` to clean OTA listings. (noticed 2026-05-03)
- **SkyCrest (6-25-belfast) — Signature K950/MK950 keyboard/mouse decision.** The pre-migration MDX listed a "Signature Keyboard/Mouse (K950/MK950)" wireless combo as part of the Other Equipment section. Deliberately skipped during the portfolio migration as a workspace accessory rather than appliance-class. OTA copy mentions "dedicated workspace" — if Andrew/Pete decide the workspace is a marketing-relevant feature (not just incidental), add `belfast-signature-k950.md` library entry under `category: tech` and wire into `facts.yaml::appliances`. Otherwise leave omitted. Pairs with the broader question of whether the "dedicated workspace" claim warrants its own Property Orientation section. (noticed 2026-05-03)
- **Apply same upstream-vs-migrated audit to the 5 cleaning_checklist properties** that I generated checklists for. The Belfast appliance gap was caught because the user asked — but the same migration pattern (taking the MDX as ground truth without re-checking upstream `_shared/properties/<slug>/facts.yaml::usage_sections`) likely missed similar items on properties whose MDX was thinner than their SOT. Run `scripts/verify-portfolio-rollout.py` + the keyword-cross-check (the inline Python in this session, ~50 lines — could be saved to `scripts/`) on a quarterly cadence, ideally folded into `/ops-weekly-meta`. (noticed 2026-05-03)
- **Sync inversion safeguard needed.** During the 2026-05-03 full SOT audit, found that 10 of 14 properties had `_shared/properties/<slug>/facts.yaml::appliances: []` while `data/sot/properties/<slug>/facts.yaml::appliances:` had 6-25 populated entries. The next `npm run sync-sot` would have wiped all the migration work. Backported all 14 to upstream + verified parity. **Add a guard to `scripts/sync-sot.mjs`** that diffs upstream vs vendored before clobbering and warns/refuses if upstream is materially shorter (e.g. >50% shorter list, or empty when vendored is non-empty). Belt-and-braces against this happening again. (noticed 2026-05-03)
- **41-suburb-basecamp safety amenity contradiction (P0).** `_shared/properties/41-suburb-basecamp/policies.yaml::known_issues` records fire extinguisher / fire blanket / first-aid kit as ABSENT (severity:major) but `facts.yaml::amenities` claims they exist — meaning `<PropertyQuickInfo />` is potentially advertising safety equipment that's not on premises. Either source the equipment + remove from known_issues, OR strip from amenities. Owner-call. (noticed 2026-05-03)
- **7-suburb BBQ contradiction (P0).** `facts.yaml::features` lists `bbq` and `ota_copy.md:24,88` advertises BBQ + outdoor dining, but `guest_copy.md:730` says "No outdoor BBQ." Resolve before next stay. (noticed 2026-05-03)
- **41-suburb-basecamp BBQ contradiction (P0).** Same shape — `facts.yaml` claims BBQ; check actual presence and reconcile. (noticed 2026-05-03)
- **100-risinghurst-unit CO detector status unknown.** Unit has gas hob + gas oven (gas-bottle powered). Neither upstream nor downstream documents whether a CO detector is installed. Added a gas-safety paragraph to `critical-info.mdx` as interim mitigation, but a CO detector should be confirmed (and installed if absent) on next on-site visit. (noticed 2026-05-03)
- **73a-hensman + 73b-hensman ensuite TBC.** SOT has `ensuite: false` on all bedrooms but docs MDX claimed "2 master bedrooms each with ensuite". 73b user-instructions now says "ensuite configuration is being reconfirmed" — replace with definitive answer once owner confirms physical layout. (noticed 2026-05-03)
- **2026-05-03 audit found and fixed (closed):** sync inversion (10 properties), 10-15-gorge missing TV reference, 73b-hensman missing microwave/oven/iron entries, 2-34-shotover missing Laundry section, 6a-frankton oven grill-label note, 100-risinghurst-home bed config (was "2 queens" → "1 queen + bunk"), 73b bed config (was "3 of 5 split" → "3 king + 2 twin"), 10b-delamare bed config (now explicit), 6a-frankton blank `<PropertyAccessInstructions>`, 3-15-gorge WiFi booster note, 41-suburb hallway pump + panel/portable heaters, 7-suburb portable heaters, 73a/73b parking YAML structural fix. All committed in PR #18. Audit methodology: `scripts/verify-portfolio-rollout.py` (token-set coverage) + parallel research-agent SOT cross-check (3 agents × ~4 properties × 5 SOT files each). Next quarterly audit due 2026-08-03.

## Composition Pattern (universal as of 2026-05-04)

**All 14 properties × 4 page types × 3 locales = 168 MDX files share the same shape.** Universal changes to shared components ripple to every property automatically.

```
welcome-house-rules.mdx (~17 lines):
  <PropertyQuickInfo slug="..." />        # address, parking, check-in/out, WiFi (no password)
  <PropertyWelcome slug="..." />          # from data/sot/properties/<slug>/guest_copy.md
  <HouseRulesBase slug="..." />           # shared: universal rules + Appliance Use + In an Emergency cross-links
  ## Property-Specific Rules
  <PropertyHouseRulesDeltas slug="..." /> # from facts.yaml::exceptions.house_rules
  <QueenstownEssentials />                # shared: insects/power/ATMs/groceries/transport

critical-info.mdx (~10 lines):
  <CriticalInfoBase />                    # shared: emergencies + fire + earthquake (Drop/Cover/Hold)
  <PropertyOperationalNotes slug="..." /> # from facts.yaml::exceptions.notes (alarm, first aid, gas shutoff, assembly point)
  <PropertyHazards slug="..." />          # from facts.yaml::exceptions.hazards

user-instructions.mdx (composition shape):
  <PropertyQuickInfo slug="..." />
  <PropertyAccessInstructions slug="..." />  # from facts.yaml::exceptions.access (front_door / garage / other)
  ## Property Orientation                    # property-specific operational narrative (inline MDX)
  <ApplianceSet slug="..." />                # auto-grouped from facts.yaml::appliances + each appliance's category frontmatter
```

`<HouseRulesBase>` accepts an optional `slug` prop. When provided, `{slug}` template tokens in the shared markdown are substituted at render time — enables per-property links in shared content (Appliance Use → User Instructions, In an Emergency → Critical Info).

**Critical:** when modifying any per-property MDX, do NOT add inline content. Author the data into the SOT (`data/sot/properties/<slug>/facts.yaml::exceptions.*` or `guest_copy.md`) and let the components render it.

## Auth-gated content verification

`docs.snowbirdhq.com` requires the `docs_portal` cookie. To verify production content via curl:

```bash
# 1. Get the cookie
curl -sS -i -X POST https://docs.snowbirdhq.com/api/access-unlock \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "password=SnowbirdHQ"
# Response: Set-Cookie: docs_portal=1.<64-char-hex-hmac>; Path=/; Expires=+1y; Secure; HttpOnly; SameSite=lax

# 2. Use it
curl -sL -H "Cookie: docs_portal=1.<hmac>" \
  https://docs.snowbirdhq.com/properties/<slug>/welcome-house-rules
```

Without the cookie, curl gets back the access redirect page (~13KB) and ALL grep markers return 0 — looks like nothing deployed.

## Multi-agent migration verification (2026-05-04 lesson)

Multi-agent runs (Agent A/B/C in parallel for batch migrations) **report "complete" but their changes may not all reach `git`** due to pre-commit hook + staging interactions. Always verify END STATE structurally after multi-agent work:

```bash
~/code/__Production/_shared/.venv/bin/python -c "
from pathlib import Path
slugs = sorted([d.name for d in Path('content/docs/properties').iterdir() if d.is_dir()])
for slug in slugs:
    whr = Path(f'content/docs/properties/{slug}/welcome-house-rules.mdx').read_text()
    ok = '<HouseRulesBase' in whr
    print(f'{slug}: {\"✓\" if ok else \"✗ LEGACY\"}')
"
```

The 2026-05-04 "all 14 on composition" commit (8f27c8c) only included SOT changes; 7 properties' MDX shells were never staged. Caught only because user spot-checked 10b-DeLaMare. Commit 2a58c54 fixed it (-4780 lines deleted).

## TypeScript ES target lib note

`String.replaceAll()` is NOT available in current TS target lib config. Use `body.split(token).join(value)` instead. ES2021 target would fix it but the workaround is fine.
