# Changelog

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
