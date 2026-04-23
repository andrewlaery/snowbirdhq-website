# Changelog

## [Unreleased] - 2026-04-23 (per-property "Ask Me Anything" AI chat)

### Added

- **Per-property AI chat** at `/docs/properties/{slug}/ask` — guests can ask natural-language questions scoped to that property's compendium (the 4 MDX files: index, welcome-house-rules, user-instructions, critical-info). Powered by Claude **Haiku 4.5** (`claude-haiku-4-5-20251001`) via the Vercel AI SDK v6 (`ai` + `@ai-sdk/anthropic` + `@ai-sdk/react`). Surfaced as a 5th nav card ("05 · Ask") on every property landing page. Landing-nav grid bumps from `sm:grid-cols-2` to `lg:grid-cols-3` so 5 cards tile cleanly on wide screens.
- **System prompt uses Anthropic ephemeral prompt caching** (`providerOptions.anthropic.cacheControl`) — the 5–6K-token property context is stable per slug, so 2nd+ questions in a conversation hit the cache at ~0.1× cost (verified via `usage.inputTokenDetails.cacheReadTokens` logged in the `onFinish` callback). Haiku 4.5 minimum cacheable prefix is 4096 tokens; all 15 property compendiums clear that bar.
- **Auth**: `/api/chat/[slug]` manually verifies the two-tier docs cookie (`docs_portal` for portal users, `docs_property` for single-property guests with matching slug) using the existing `verifyCookie` helper — API routes bypass the docs middleware (excluded from the `next.config.mjs` subdomain rewrite), so the route owns its own gate. Fails-open when `DOCS_COOKIE_SECRET` is absent, matching middleware behaviour.
- **Rate limit**: in-memory sliding window keyed by IP+slug, 20 messages per 60 minutes per IP. Best-effort across lambda cold starts — acceptable under the soft-gate threat model. Backlog item to upgrade to Upstash/KV if abuse surfaces.
- **New files**: `src/app/api/chat/[slug]/route.ts`, `src/app/docs/properties/[slug]/ask/page.tsx`, `src/components/property-ask-chat.tsx`, `src/lib/chat/property-context.ts` (reads + caches the 4 MDX files per slug, strips frontmatter), `src/lib/chat/prompt.ts` (system prompt builder with strict "answer only from docs" framing + NZ English tone), `src/lib/chat/rate-limit.ts`.
- **New deps**: `ai` (^6.0.168), `@ai-sdk/anthropic` (^3.0.71), `@ai-sdk/react` (for `useChat` hook).

### Required before prod

- **`ANTHROPIC_API_KEY` env var** must be set on Vercel (Production + Preview scopes). Use `printf '%s' 'sk-ant-...' | vercel env add ANTHROPIC_API_KEY production` (NOT `echo` — memory-flagged trailing-\n bug).

## [Unreleased] - 2026-04-22 (10B De La Mare content + design-system reference)

### Added

- **`docs/DESIGN_SYSTEM.md`** shipped to main (PR #2, squash commit `52384de`) — single-page reference for the docs portal's editorial-luxe design system. Voice, palette (with Snowbird→Fumadocs HSL mapping), typography, component patterns (eyebrow / QuickInfo / LandingNav / logo), do/don't rules, extension playbook, deferred items. Sits alongside `docs/AUTHORING.md` + `docs/CONTENT_REVIEW.md` as the third doc pillar.
- **10B De La Mare Views content additions** (PR #3, squash commit `8262309`) — surfaced by cross-checking our online docs against the physical Bees Homes house manual PDF. Three vault-first additions:
  - `welcome-house-rules.mdx` parking caution now specifies the **2 metre clearance** before opening the swing-out garage door (previously just "not directly in front").
  - `user-instructions.mdx` Kitchen section now documents the **hob child-safety lock** (hold key button to lock, hold again 3 sec to unlock).
  - `critical-info.mdx` has a new **Roadside assistance** subsection under Getting Around with **AA 0800 500 222** and a pointer to check rental-vehicle cover first.

### Deferred (pending owner input)

- **10B WiFi booster status** — cross-out in the PDF suggests the booster was retired from the physical environment. Online docs still reference it as installed.
- **10B pharmacy recommendation** — PDF recommends Queenstown Pharmacy (Corner Brecon/Isle). Online docs recommend Wilkinson's Unichem (Rees Street & The Mall). Both are real and nearby.

## [Unreleased] - 2026-04-22 (docs portal editorial-luxe redesign)

### Added

- **Editorial-luxe design system** applied to the docs portal (cream/ink/deep-teal palette, Newsreader serif display, Geist sans body, JetBrains Mono eyebrows). New `src/app/docs/snowbird-docs.css` maps Snowbird design tokens onto Fumadocs HSL variables inside a `.snowbird-docs` wrapper — scoped to the docs route; marketing site untouched. Fonts loaded via `next/font/google` in `src/app/docs/layout.tsx`. Live on docs.snowbirdhq.com as of PR #1 squash-merge (commit `039f41a`).
- **New components**: `src/components/property-quick-info.tsx` (editorial KPI card — mono labels, serif values, deep-teal dot, paper background with hairline border), `src/components/property-landing-nav.tsx` (2×2 nav card grid replacing the H1-emoji-links pattern on property landings — numbered mono eyebrows, serif titles, ghost CTAs with deep-teal arrows), `src/components/snowbird-docs-logo.tsx` (dot-in-circle mark + serif italic "HQ" + mono "Docs" eyebrow).
- **Full-text body-content search** — `src/app/api/search/route.ts` now uses `createFromSource(source)` from `fumadocs-core/search/server` (Orama advanced indexer) instead of the title-only `simple` search. Requires `valueToExport: ['structuredData']` in `source.config.ts` so `remarkStructure`'s output gets emitted as a module export. Body-only terms like "Harvia" now return deep-links to the matching heading.
- **Property data extended** in `src/data/properties.ts` with optional `parking` / `checkIn` / `checkOut` fields (populated for 11 properties; 3 PM / 10 AM standard times, per-property parking strings from each welcome-house-rules.mdx). Drives the Quick Reference card's content.
- **`docs/DESIGN_SYSTEM.md`** — single-page design-system reference covering voice, palette (with Snowbird→Fumadocs HSL mapping), typography, component patterns, do/don't rules, extension playbook, deferred items. Sits alongside `docs/AUTHORING.md` + `docs/CONTENT_REVIEW.md` as third doc pillar. **PR #2 open on `docs/design-system` branch pending review.**
- **DOCS_\* env vars propagated to Vercel Preview scope** — `DOCS_PORTAL_PASSWORD`, `DOCS_COOKIE_SECRET`, `DOCS_ACCESS_KEY` copied from Production scope via `printf '%s' $value | vercel env add NAME preview --force`. Preview deployments can now unlock the portal for reviewers.

### Changed

- **Property landing page body** — `src/app/docs/[...slug]/page.tsx` now renders `<PropertyLandingNav slug={slug[1]} />` and skips `<MDX />` when the slug matches `properties/{slug}`. Passes empty `toc={[]}` so the "On this page" rail (which anchored the 4 emoji H1-links) stops rendering. MDX source files are unchanged — the H1-link pattern still works for any other path but isn't rendered on the landing route.
- **Fumadocs theme locked to light** via `RootProvider theme={{ forcedTheme: 'light' }}` in `src/app/docs/layout.tsx`. Previously auto-detected the OS `prefers-color-scheme: dark` preference and flipped the portal to a Fumadocs dark palette that the editorial-luxe design doesn't define. Dark mode deferred until a second palette is authored.
- **Sidebar pageTree filtered** in `src/app/docs/layout.tsx` — strips `/docs/owner-docs/*` and `/docs/internal/*` top-level folders before passing to `DocsLayout`. Mirrors the middleware's `BLOCKED_PREFIXES` so portal users don't see navigation entries for hard-404'd sections.
- **`AuthButton` removed from the docs nav** — the Supabase-backed component was fail-rendering a "Sign In" link that pointed at `/auth/signin` (itself now redirecting to `/access`, but the chrome still read as broken). Dropped with no replacement — portal sign-out affordance is a deferred design item.

### Fixed

- **Docs portal unreachable from non-`docs.*` hostnames** — Vercel preview URLs (`*.vercel.app`) and `snowbirdhq.com/docs` bypassed the middleware (which only enforces on `host.startsWith('docs.')`), landing users on the legacy Supabase `WelcomePage` with a broken "Sign In" link to the dead `/auth/signin` magic-link form (Supabase has been NXDOMAIN since 2026-04-20). Replaced `src/app/docs/page.tsx` with a server-side cookie-aware redirect mirroring the middleware's `/docs` handling. Also replaced `src/app/auth/signin/page.tsx` with `redirect('/access')` so any leftover links to the old signin path funnel to the password gate.
- **Heading-link underlines at serif display size** — the hairline `border-bottom` looked clunky at 40-56px Newsreader serif and broke awkwardly across wrapped lines. Suppressed via CSS when the link is inside `h1/h2/h3/h4`. Body-prose links keep the editorial underline.
- **Search route crash** — when `advanced` search couldn't find `structuredData.headings` (because the `valueToExport` export wasn't enabled), every `/api/search?query=*` request returned `TypeError: Cannot read properties of undefined (reading 'headings')`. Fixed by enabling `valueToExport: ['structuredData']` in `source.config.ts`.

## [Unreleased] - 2026-04-21 (evening — 6-25-Belfast Pete Bouma compendium updates)

### Changed
- **6-25-Belfast compendium refreshed from Pete Bouma's 2026-04-15/16 feedback** (commits `f41fda5`, `ae21420`, `3cacbfb`, `cd891a6`, `7fd3e15`). 13 edits shipped to production MDX across both `welcome-house-rules.mdx` and `user-instructions.mdx`. Summary: FOB clarification (1 in lockbox + 1 inside apartment, $300 replacement charge), parking rewrite (1 garage + 2 overflow + street, no campervans), late-checkout/luggage simplified to "discuss with host in advance", new "leave food/drinks for housekeeping" checkout bullet, Bosch oven wall switch prerequisite, sauna "Three Things Must Be On" block + embedded Harvia dial photo (1 TIMER / 2 HEAT), drinking water note (fridge dispenser), cot availability (24h notice, "shared across properties" language removed), gas fire location corrected (upstairs lounge → living room), KOCOM intercom replaced with "not in operation" note.
- **Vault ↔ MDX reconciled**. After granting Full Disk Access to iTerm.app (the TCC subject for Claude Code on this Mac), all 13 MDX edits were mirrored into vault sources at `~/Documents/andrewlaery/SnowbirdHQ/Property/6-25-Belfast/1.{1,2}_*.md`. `./scripts/sync-property-compendium.sh --only 6-25-belfast` now produces only trailing-whitespace diffs (auto-stripped by pre-commit). Vault-first workflow restored — future edits flow through vault → sync → commit.

### Added
- **Pete's Harvia sauna dial photo** committed at `public/properties/6-25-belfast/sauna-dial.jpg` and embedded in the sauna section (shows the handwritten "1 TIMER" and "2 HEAT" labels Pete added during his March 2026 remediation).

### Notes (non-code, tracked elsewhere)
- Six physical follow-up items filed into the canonical per-property tracker at `__server-bcampx/guest-ops/src/property_profile_store.py` (SQLite `property_items` table on bcampx): Bosch oven wall switch label, sauna isolation switch label, sauna indoor light switch label, 2nd FOB placement + $300 keyring tag, KOCOM "not in service" sticker, 24h cot logistics confirmation. Plus a portfolio-wide dedup pass dismissed 3 duplicate records (SkyCrest sauna light, 73B-Hensman washing machine, 73B-Hensman hot water).
- Project CLAUDE.md Backlog retired the stale `knowledge/owner-log/6-25-belfast.md` reference and now points at `property_items` as the canonical tracker.

## [Unreleased] - 2026-04-21 (pm — compendium authoring batch + branded short domain)

### Added
- **All 15 property compendiums now have real content** (previously only 3 migrated, 12 stubs). Authored from guest-ops knowledge bases + 34 Shotover / 10B De La Mare / 6A-643 Frankton admin cheat sheets + Hostaway listing cache + the existing 7-Suburb template. New compendiums: 10b-delamare, 1-34-shotover, 2-34-shotover, 6a-643-frankton, 73b-hensman, 3-15-gorge, 10-15-gorge, 14-15-gorge, 41-suburb-basecamp, 100-risinghurst-home, 100-risinghurst-unit, 73a-hensman. Vault source-of-truth lives in `~/Documents/andrewlaery/SnowbirdHQ/Property/{Name}/` — all subsequent edits flow through the sync script.
- **30 short-form path aliases** across `src/lib/short-links.ts` — two per property (canonical PascalCase + all-lowercase). `go.bcampx.com/7-Suburb` and `go.bcampx.com/7-suburb` both resolve to the same property landing. Zero route-handler changes.
- **Branded short-link domain** `go.snowbirdhq.com` attached to the Vercel `snowbirdhq` project. Same map, same route, same 302 logic — operates in parallel with `go.bcampx.com`. DNS + TLS auto-provisioned since `snowbirdhq.com` is on Vercel nameservers.

### Changed
- **Property slug rename**: `41-suburb-bonsai` → `41-suburb-basecamp` across `src/data/properties.ts`, `content/docs/properties/`, `public/properties/`, `content/docs/properties/meta.json`. `hostawayId` updated from the dead listing (428528) to the live listing (500890). `41-Suburb-BaseCamp-010-LandingPage` short link was already pre-provisioned in `short-links.ts` from yesterday's migration.

### Notes on compendium depth
- Two compendiums are thinner than the others due to sparse source material: `73a-hensman` (KB had a flagged WiFi typo + several TODOs) and `41-suburb-basecamp` (post-rename, lighter guest-ops KB). Both include a visible "some details being finalised — message us for specifics" note in the User Instructions. Future owner input flows through the vault cleanly via re-sync.
- Four properties have no photos on disk yet (`73a-hensman`, `14-15-gorge`, `100-risinghurst-home`, `100-risinghurst-unit`). Docs portal pages ship now; marketing gallery pages activate once photos land in `public/properties/{slug}/`.

## [Unreleased] - 2026-04-21 (short-link self-hosting)

### Added
- **`go.bcampx.com` redirector self-hosted** on this project's Vercel deployment, replacing the Short.io SaaS. Route handler at `src/app/s/[slug]/route.ts` (Edge runtime) reads a typed map at `src/lib/short-links.ts` and returns a 302. Three entry kinds: `property` (slug + optional page, appends `?access=<DOCS_ACCESS_KEY>`), `path` (explicit docs path, appends key), `external` (verbatim URL, no key). Host-conditional rewrite in `next.config.mjs` maps `go.bcampx.com/:slug` → `/s/:slug` internally.
- **12 new property short-link entries** pre-registered alongside the existing 14 migrated links — the `-010-LandingPage` path for each of the 10 placeholder compendiums plus the `41-Suburb-BaseCamp` rename and the `14-15-Gorge` Whistler sibling.

### Changed
- **DNS cutover for `go.bcampx.com`**: Cloudflare A record changed from CNAME → `cname.short.io` to A → `76.76.21.21` (Vercel), DNS only (grey cloud), TTL 1 min during cutover. Vercel auto-provisioned the TLS cert.
- **Access register rewritten** (`content/docs/internal/guest-tokens.mdx`) to describe the two-tier cookie gate plus the self-hosted short-link infrastructure. No more Short.io references.

### Removed (pending — Phase 5, scheduled 2026-04-23 after 48h soak)
- Short.io subscription, the 14 existing links, and API key `sk_S8pzg...` will be decommissioned after the soak window. Until then Short.io is DNS-orphaned but still alive as a rollback path.

## [Unreleased] - 2026-04-20 (pm — two-tier gate + UX polish)

### Added
- **Friendly `/access` page** replacing the bare-404 dead-end for unauthenticated users. Renders with the root layout (no fumadocs shell) on both `snowbirdhq.com/access` and `docs.snowbirdhq.com/access`. Routed via a `/access` exception added to the docs-subdomain rewrite.
- **Password form + POST handler** at `/api/access-unlock`. Form on `/access` accepts a password, hidden `from` input preserves the original destination. Handler does constant-time comparison against `DOCS_PORTAL_PASSWORD` env var; on match sets a 1-year HMAC-signed `docs_portal` cookie and 303-redirects to the `from` target (or `/` if absent).
- **Two-tier cookie gate** in `src/middleware.ts`. `docs_property` cookie (slug-scoped, set by Short.io `?access=<DOCS_ACCESS_KEY>` handshake) grants access only to the guest's own property guide + Queenstown Insights. `docs_portal` cookie (set by password) grants the full portal including the `/properties` listing and all property pages.
- **HMAC cookie helper** at `src/lib/auth/docs-cookie.ts` — `signCookie()` / `verifyCookie()` using Web Crypto (`crypto.subtle`), works in both the Edge-runtime middleware and Node.js runtime server components.
- **Cookie-driven sidebar toggle** in `src/app/docs/layout.tsx`. Portal users see the full fumadocs sidebar everywhere; property-scoped guests see no sidebar, so other properties aren't discoverable.
- **Env vars** `DOCS_PORTAL_PASSWORD` (plaintext, case-sensitive) and `DOCS_COOKIE_SECRET` (32-byte hex HMAC key), provisioned to Vercel `snowbirdhq` production.

### Fixed
- **Marketing-site regression from earlier today** — the Phase B middleware matcher `/properties/:path*` caught `snowbirdhq.com/properties` as well as `docs.snowbirdhq.com/properties`, 404-ing the public marketing listing. Middleware now early-exits with `NextResponse.next()` when the host isn't `docs.*`.
- **Fumadocs + static-route collision on `/`** — attempted a rewrite `/` → `/docs` for docs-subdomain portal users, but fumadocs generates a static param entry with `slug=[]` for `content/docs/index.mdx`, which wins over `src/app/docs/page.tsx` through the rewrite layer. Sidestepped: middleware redirects portal users from `/` directly to `/properties`.
- **Rewrite regex empty-match bug** — the general docs-subdomain rewrite `/:path(...).*` matched `/` with empty `:path`, producing destination `/docs/` and resolving to the catch-all `[...slug]` with empty slug (404). Tightened to `.+` so the root is no longer caught by the general rule.

## [Unreleased] - 2026-04-20

### Added
- **Soft shared-key docs gate** (`DOCS_ACCESS_KEY`) — middleware validates `?access=<key>` on `/docs/properties/*` and `/docs/queenstown-insights`, sets a 1-year `docs_access` httpOnly cookie, redirects to the clean URL. Bare URLs without the cookie 404. `/docs/internal/*` and `/docs/owner-docs/*` hard-404 regardless of key. Fails open if the env var is missing so misconfiguration can't lock everyone out. Replaces the Supabase + per-slug JWT middleware.
- **Authoring playbook** at `docs/AUTHORING.md` — data-source map + 5 playbooks (update content, update photos, update metadata, add new property, rename slug) + rotation procedure + gotchas.
- **Content review tracker** at `docs/CONTENT_REVIEW.md` — 6-dimension checklist for all 13 live pages + decisions for the 9 placeholder property stubs.
- **Property compendium migration tooling** — `scripts/sync-property-compendium.sh` maps Obsidian vault files at `~/Documents/andrewlaery/SnowbirdHQ/Property/{Name}/` to `content/docs/properties/{slug}/*.mdx` (BCampX filename convention: `1.0`=Landing, `1.1`=Welcome & House Rules, `1.2`=User Instructions, `1.3`=Critical & Essential Information). Injects `title:`/`description:` frontmatter, rewrites legacy `go.bcampx.com` short-URL nav links to absolute `/docs/properties/{slug}/...` paths, strips Obsidian `tags:` frontmatter. Flags: `--only <slug>`, `--dry-run`, `--vault <path>`.
- **Three property compendiums live**: 7-suburb, 25-dublin, 6-25-belfast — full Welcome & House Rules / User Instructions / Critical Info / Landing Page migrated from Obsidian/Obsius.
- **Shared Queenstown Insights** page at `content/docs/queenstown-insights.mdx` (migrated from `_General/Queenstown Insights.md`).
- **Docs access register** at `content/docs/internal/guest-tokens.mdx` — shared-key rotation procedure and Short.io link mapping (replaces the deprecated per-slug JWT table).
- **Properties section landing page** `content/docs/properties/index.mdx` + `"index"` in `content/docs/properties/meta.json` pages array — previously 404'd on section-header click (Fumadocs requires `index.mdx` for clickable folder headers).

### Changed
- **Short.io destinations rotated again** — `go.bcampx.com/{7-Suburb,25-Dublin,6-25-Belfast}-010-LandingPage` now point at `docs.snowbirdhq.com/docs/properties/{slug}?access=<DOCS_ACCESS_KEY>` (shared-key scheme replaces the `?token=<jwt>` query string).
- **Property compendium content scrubbed** — plaintext WiFi passwords → welcome-card references across all 3 migrated user-instructions pages; editor markers (`**MISSING**`, `**UPDATE**`), template artefacts (`Dear Guest1`, `Dinning`), and 4× `[Location to be specified]` placeholders removed in the vault; `/docs/internal/guest-tokens.mdx` no longer discloses the `GUEST_TOKEN_SECRET` storage location or the "gating disabled" state.
- **Property compendium nav links** emitted as absolute `/docs/properties/{slug}/welcome-house-rules` instead of relative `./welcome-house-rules`. Relative links broke because the `next.config.mjs` `redirects()` rule strips `/docs/` on the docs subdomain, and relative links resolved against the cleaned URL.
- **GUEST_TOKEN_SECRET rotated** on Vercel `snowbirdhq` production — cleaned up a stored value corrupted by a legacy `echo | vercel env add` pipeline that embedded a trailing `\n`.

### Fixed
- **Sidebar "Properties" section-header 404** — missing `content/docs/properties/index.mdx` caused Fumadocs `notFound()` trigger.
- **Relative-link resolution bug** on docs subdomain — see Changed above; sync script now emits absolute paths.

### Security / Access
- **Soft shared-key gate restored access control** later on 2026-04-20 — `DOCS_ACCESS_KEY` provisioned in Vercel production via `printf '%s' | vercel env add`, middleware deployed, Short.io destinations updated in one coordinated step. Bare URLs return 404, cookies persist 1y across sessions. Verified end-to-end for all three migrated properties.
- **Supabase + per-slug JWT middleware retired**. The `filterPageTree` import was removed from `src/app/docs/layout.tsx` (was blocking the build with an unused-import lint error). The legacy `scripts/generate-guest-token.ts` and `GUEST_TOKEN_SECRET` env var are left in place so the Supabase-backed scheme can be restored by reverting the middleware.

### Infrastructure
- **Orphan Vercel project `snowbirdhq-website`** deleted (2026-04-20) — was auto-deploying same GitHub repo as the live `snowbirdhq` project (`prj_n4lc90DMguGdRww3DxB6y8p9SLSN`) but served no production domains. Repo's `.vercel/project.json` relinked to the live project.

### Known Issues (logged as Backlog in CLAUDE.md)
- Decide on Supabase rebuild vs committing to shared-key as the long-term auth model.
- 5 production env vars still carry literal `\n` corruption from legacy stdin piping — strip on Supabase rebuild.
- `OWNER_PROPERTIES` env var contains placeholder example emails, never configured with real values.
- Medium-sensitivity info disclosures in the property compendiums (gas shutoff, lockbox procedure, alarm-not-in-use) — review during `docs/CONTENT_REVIEW.md` walkthrough.
- 9 of 12 property slugs are stub scaffolding only — decide per property: delete or `draft: true`.
- Short.io API key `sk_S8pzg...` was pasted into chat during the 2026-04-20 execution session and under the same rule should be rotated again.
