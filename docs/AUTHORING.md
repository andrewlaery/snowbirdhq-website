# Property Authoring Guide

Where each piece of property data lives and how to update it.

## Data sources

| Data | Source of truth | Format | File / location |
|---|---|---|---|
| Slug, name, address, description, featured flag, hostawayId | Repo | TypeScript array | `src/data/properties.ts` |
| Gallery image list (order, layout, alt text) | Repo | `GalleryItem[]` inside the properties.ts entry | `src/data/properties.ts` |
| Photo files | Repo | `.jpg` in lowercase-slug folder | `public/properties/{slug}/` |
| Compendium content (welcome, instructions, critical info, landing) | Obsidian vault | Markdown with optional frontmatter | `~/Documents/andrewlaery/SnowbirdHQ/Property/{Name}/1.{0-3}_*.md` |
| Deployed compendium MDX | Generated | MDX with injected title/description | `content/docs/properties/{slug}/*.mdx` |
| Property sidebar title + intra-property page order | Repo | meta.json | `content/docs/properties/{slug}/meta.json` |
| Top-level sidebar order | Repo | meta.json | `content/docs/properties/meta.json` |
| Shared Queenstown Insights | Obsidian vault | Markdown | `_General/Queenstown Insights.md` → `content/docs/queenstown-insights.mdx` |
| Access control | Vercel env | `DOCS_ACCESS_KEY` (shared key) | Vercel `snowbirdhq` project production env |

## How the pages render

- `/docs/properties/{slug}/...` — served by fumadocs via `src/app/docs/[...slug]/page.tsx` reading from `content/docs/`.
- `/properties/{slug}` (marketing gallery page) — served by `src/app/properties/[slug]/page.tsx` reading `getProperty(slug)` from `src/data/properties.ts`, using images from `public/properties/{slug}/`.
- Two domains: `snowbirdhq.com` serves the marketing site; `docs.snowbirdhq.com` serves the docs (via Next.js host-based rewrites in `next.config.mjs`).

## Update playbooks

### Update compendium content for an existing property
1. Edit the relevant `.md` file in the Obsidian vault under `~/Documents/andrewlaery/SnowbirdHQ/Property/{Name}/`.
2. `cd ~/code/__Production/__server-vercel/snowbirdhq-website`
3. `./scripts/sync-property-compendium.sh --only {slug}`
4. `git diff content/docs/properties/{slug}/` — review
5. `git add content/docs/properties/{slug}/ && git commit && git push`
6. Vercel auto-deploys.

### Update photos for an existing property
1. Add/replace `.jpg` files in `public/properties/{slug}/`. Lowercase names must match the `src` values in `properties.ts`.
2. If adding a new photo, add a `GalleryItem` entry to the `gallery[]` array in `src/data/properties.ts`.
3. Commit + push.

### Update marketing metadata
1. Edit fields in `src/data/properties.ts` — `name`, `description`, `address`, or `hostawayId`.
2. Commit + push. `<title>` and `<meta description>` on the marketing page flow from these fields via `generateMetadata` in `src/app/properties/[slug]/page.tsx`.

### Add a new property from scratch
1. Marketing: create `public/properties/{slug}/hero.jpg` (+ others), add the properties.ts entry.
2. Docs scaffolding: create `content/docs/properties/{slug}/` + a `meta.json` with `{"title":"Display Name","pages":["index","welcome-house-rules","user-instructions","critical-info"]}`.
3. Add `"{slug}"` to the `pages` array in `content/docs/properties/meta.json`.
4. Vault: create `~/Documents/andrewlaery/SnowbirdHQ/Property/{Name}/` with the four source files named `1.0_{Name}_ Landing Page.md`, `1.1_{Name}_ Welcome And House Rules.md`, `1.2_{Name}_ User Instructions.md`, `1.3_{Name}_ Critical And Essential Information.md`.
5. `./scripts/sync-property-compendium.sh --only {slug}`, then commit/push.

### Rename a property slug
Six atomic edits in one commit:
1. Rename `public/properties/{old-slug}/` → `public/properties/{new-slug}/` (lowercase).
2. Update slug + all `src` paths in `properties.ts`.
3. Rename `content/docs/properties/{old-slug}/` → `content/docs/properties/{new-slug}/`.
4. Update slug in `content/docs/properties/meta.json` `pages` array.
5. Update Short.io destination URL if it's a migrated property.
6. Redeploy.

### Rotate the docs access key
See `content/docs/internal/guest-tokens.mdx` for the full rotation procedure.

## Gotchas

- **Vercel is case-sensitive.** `public/properties/7-Suburb/` and `public/properties/7-suburb/` are different directories on Vercel's Linux filesystem, identical on macOS. Always lowercase.
- **Sync script won't create the target directory.** `./scripts/sync-property-compendium.sh` at line 190 rejects a vault folder if `content/docs/properties/{slug}/` doesn't exist. Create the folder + `meta.json` manually before first sync.
- **Slug mismatch is silent.** The script derives the slug by lowercasing the Obsidian folder name. `7-Suburb` in the vault and `7-suburb` in content/ must agree after lowercasing. Typos cause the vault folder to be silently skipped with no build error.
- **Edit the vault, not the MDX.** Compendium MDX files under `content/docs/properties/{slug}/` are generated. Direct edits will be overwritten on the next sync.
- **Short-link URL rewriting happens at sync time.** The sync script rewrites legacy `go.bcampx.com/{X}-011-HouseRules` URLs into absolute `/docs/properties/{slug}/welcome-house-rules` paths. See `rewrite_compendium_urls()` in `scripts/sync-property-compendium.sh`.
- **Obsidian `tags:` frontmatter is stripped at sync time.** The `inject_frontmatter()` awk filter drops `tags:` blocks so Obsidian-native metadata doesn't leak into the deployed MDX. Keep the vault pristine for Obsidian use.
- **Use `printf '%s'`, not `echo`, when piping secrets to `vercel env add`.** Five pre-existing production env vars on this project have trailing-`\n` corruption from legacy `echo` pipes.
