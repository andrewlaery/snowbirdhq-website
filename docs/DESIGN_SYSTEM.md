# SnowbirdHQ Docs Portal — Design System

Reference for anyone touching the visual design of `docs.snowbirdhq.com`. The marketing site at `snowbirdhq.com` uses a separate style layer (Inter + Cormorant Garamond on white) and is **not** governed by this document.

Source: `src/app/docs/snowbird-docs.css`. All tokens are scoped to a `.snowbird-docs` wrapper applied in `src/app/docs/layout.tsx` so the docs-portal theme never leaks into marketing pages.

---

## Voice

**Editorial luxe-minimal.** Warm cream paper, near-black ink, deep-teal accent. Serif display type with italic emphasis on key words. Mono eyebrows for section labels. Closer to a print editorial (Cereal, Apartamento) than a SaaS docs portal. The docs belong to a premium hospitality brand — they should feel considered, not technical.

If a design choice feels like "Stripe docs but beige," reconsider. We're not imitating SaaS docs; we're treating guest documentation as editorial content.

---

## Palette

Light theme only. Dark mode deferred.

| Token | Value (hex) | Fumadocs map (HSL) | Role |
|---|---|---|---|
| `--snow-bg` | `#F6F2EC` | `--fd-background: 36 35% 95%` | Page background (cream) |
| `--snow-bg-2` | `#EEE8DE` | `--fd-muted: 38 32% 90%` | Muted block background |
| `--snow-paper` | `#FBF8F3` | `--fd-card`, `--fd-popover` | Cards, popovers, code blocks |
| `--snow-ink` | `#141414` | `--fd-foreground: 0 0% 8%` | Primary text |
| `--snow-ink-2` | `#2A2A28` | — | Body prose |
| `--snow-ink-3` | `#5B5853` | `--fd-muted-foreground` | Eyebrows, metadata, secondary |
| `--snow-ink-4` | `#8A867E` | — | Tertiary, captions |
| `--snow-line` | `#E2DCD0` | `--fd-border` | Hairlines, card borders |
| `--snow-line-2` | `#D4CCBE` | — | Slightly stronger hairlines, link underlines |
| `--snow-accent` | `oklch(0.45 0.06 180)` | `--fd-accent`, `--fd-ring` | Deep teal — dots, hover states, CTAs |
| `--snow-accent-soft` | `oklch(0.94 0.02 180)` | — | Pale teal tint (currently unused) |

Fumadocs CSS variables are HSL triplets (`hsl(var(--fd-background) / 1)`). Keep them in that format when extending.

---

## Typography

Three font families, loaded via `next/font/google` in `src/app/docs/layout.tsx`:

| Role | Family | CSS var | Weights |
|---|---|---|---|
| Display | Newsreader | `--snow-font-display` | 300, 400, 500 (regular + italic) |
| Body | Geist | `--snow-font-sans` | 300, 400, 500, 600 |
| Eyebrow / label | JetBrains Mono | `--snow-font-mono` | 400, 500 |

### Scale

| Element | Size | Weight | Family |
|---|---|---|---|
| h1 (article) | `clamp(34px, 4vw, 56px)` | 300 | Display |
| h2 (article) | `clamp(26px, 2.6vw, 36px)` | 400 | Display |
| h3 (article) | 20px | 400 | Display |
| Body | 16px | 400 | Sans |
| Body prose | inherits | 400 | Sans (color: `--snow-ink-2`) |
| Eyebrow | 10-11px | 500 | Mono, `letter-spacing: 0.14-0.16em`, uppercase |
| Inline code | 0.92em | 400 | Mono |

### Italic emphasis

The Newsreader serif has a refined italic. Use `<em>` on key words in headings for emphasis — `Welcome *&* House Rules`, `Snowbird*HQ*`. Never italicise for stress in body prose; reserve italic for display type.

---

## Spacing & shape

| Token | Value | Usage |
|---|---|---|
| Border radius (small) | 2px | (Reserved, currently unused) |
| Border radius (large) | 6px | Cards, code blocks, active sidebar items |
| Card padding | 24-28px | Quick Reference, landing nav, contact side |
| Section vertical rhythm | 56px / 80px / 140px | Hero / content / major sections |
| Container gutter | 40px desktop, 20px mobile | Full-width pages |
| Hairline border | 1px `var(--snow-line)` | Card borders, section dividers |

---

## Components

### Eyebrow utility (`.snow-eyebrow`)

Mono uppercase label in `--snow-ink-3`. Use for:
- Section labels in cards
- "On this page" rails
- Nav breadcrumbs
- Date/time metadata

**Don't** use for inline emphasis in body prose.

### Logo mark (`src/components/snowbird-docs-logo.tsx`)

Dot-in-circle mark (ink circle, cream hole, deep-teal centre dot) + `Snowbird<em>HQ</em>` wordmark in Newsreader 20px + mono "Docs" eyebrow with hairline separator.

Reused in the docs nav header. Don't recreate — import from this file.

### Quick Reference card (`src/components/property-quick-info.tsx`)

Paper-background card with hairline border, deep-teal dot + mono "QUICK REFERENCE" eyebrow, 2-column key/value grid:
- Label: mono 10px uppercase
- Value: serif 18px (or mono 14px for codes/passwords)

Injected server-side on property landing pages from `src/app/docs/[...slug]/page.tsx` — not authored in MDX. Data source: `src/data/properties.ts`.

### Landing nav grid (`src/components/property-landing-nav.tsx`)

2×2 card grid with hairline dividers (1px gap on cream background). Each card:
- Mono numbered eyebrow (`01 · WELCOME`)
- Serif 26px title (no emoji)
- Body description in `--snow-ink-2`
- CTA link with hairline underline + deep-teal arrow that nudges on hover

Replaces the MDX H1-link pattern on property landing pages. Hardcoded `SECTIONS` array inside the component — update there if the 4 sub-page set changes.

### Links (body prose)

Hairline underline in `--snow-line-2`, lifts to `--snow-accent` on hover. Text stays `--snow-ink` until hovered.

**Do not** underline links inside `h1/h2/h3` — the hairline at serif size looks clunky and breaks on wrapped lines. CSS already suppresses this; keep the rule.

### Sidebar active item

Ink background, cream text, 6px radius, deep-teal dot before the label. Achieved via CSS on `#nd-sidebar a[data-active="true"]` — don't touch without re-testing.

---

## Do / Don't

**Do**
- Use `--snow-*` tokens inside the `.snowbird-docs` wrapper. For Fumadocs integration, also map to `--fd-*` at the wrapper root.
- Prefer server components over client for design-bearing elements — keeps hydration clean.
- Keep emojis out of headings. Emojis have no place in the editorial voice.
- Add new components as server components in `src/components/` with `snowbird-docs-*` naming when they're docs-portal-specific.

**Don't**
- Import from the marketing-site tokens (`--font-inter`, `--font-cormorant`, `snowbird.blue`) — those are a different system.
- Introduce new colours without adding them to this palette doc.
- Edit raw Fumadocs CSS (`node_modules/fumadocs-ui/dist/style.css`). Override via CSS variables on `.snowbird-docs`.
- Add dark-mode branches — deferred until a second palette is defined.
- Style content by authoring JSX in MDX vault files. Vault is content; styling lives in components injected by the route.

---

## Extension rules

**Adding a new token**
1. Define in `.snowbird-docs` block at the top of `src/app/docs/snowbird-docs.css`.
2. Add to the palette table in this doc.
3. If it maps to a Fumadocs variable, set both.

**Adding a new component**
1. Server component in `src/components/snowbird-docs-*.tsx` (or existing `property-*` if property-scoped).
2. Inline styles using `var(--snow-*)` — avoid Tailwind classes that hard-code colours.
3. Reuse `--snow-font-*` and existing spacing values; don't introduce one-off sizes.
4. Add a section to this doc covering role + where it's used.

**Modifying an existing pattern**
- Quick Reference card: edit `src/components/property-quick-info.tsx`. Shape is stable; if changing the field set, also audit `getPropertyLanding` in `src/app/docs/[...slug]/page.tsx`.
- Landing nav sections: edit the `SECTIONS` array in `src/components/property-landing-nav.tsx`. The 4-section shape is intentional — resist adding a fifth unless it lives on every property.
- Logo: edit `src/components/snowbird-docs-logo.tsx`.

---

## Deferred

- **Dark mode**: `prefers-color-scheme: dark` support. Requires a second palette + dark-variant Fumadocs var overrides. Currently forced to light via `RootProvider theme={{ forcedTheme: 'light' }}`.
- **Accent swatches**: ember, moss, plum, ink variants exist in the source design system (`data-accent` attribute). Not wired up — deep teal only for now.
- **Floating tweaks panel**: marketing-site pattern from original design (theme switcher in bottom-right). Not useful for docs portal; skip unless a staff-only need emerges.
- **Sidebar folder labels in mono eyebrow**: Fumadocs `SidebarComponents` override needed to customise folder trigger rendering — deferred because it requires reimplementing Radix Collapsible state. Target post-Pass-2.
- **Sign-out affordance**: portal-cookie-aware sign-out button. Legacy `AuthButton` was dropped; a clean replacement is pending.

---

## Files

- `src/app/docs/snowbird-docs.css` — tokens, typography overrides, prose styling, sidebar polish
- `src/app/docs/layout.tsx` — wrapper className, font loading, Fumadocs RootProvider config, pageTree filter
- `src/components/snowbird-docs-logo.tsx` — logo component
- `src/components/property-quick-info.tsx` — Quick Reference card
- `src/components/property-landing-nav.tsx` — landing nav card grid
- `src/app/docs/[...slug]/page.tsx` — injection points for QuickInfo + LandingNav

---

## Attribution

Design tokens + voice derived from the SnowbirdHQ marketing site design by Andrew Laery. Original source: an editorial-luxe-minimal stylesheet delivered 2026-04-22, translated from that system onto Fumadocs' variable architecture.
