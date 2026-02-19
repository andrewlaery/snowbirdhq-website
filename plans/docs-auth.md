# Docs Auth: Magic Link + Guest Tokens

## Context

The docs site has three sections needing different access levels:
- **Guest Guides** (`/docs/properties/*`) — for guests, owners, and staff. Guests access via time-limited booking tokens in URLs. Owners/staff access via their Supabase session.
- **Owner Docs** (`/docs/owner-docs/*`) — owners and staff only, via Supabase magic link + email allowlist
- **Internal** (`/docs/internal/*`) — staff only, via Supabase magic link + email allowlist
- **Docs home** (`/docs`) — public

Auth infrastructure is partially built (sign-in page, callback, Supabase helpers). Missing: middleware, token generation, nav auth button.

## Access Rules

| Route | Guest Token | Owner Email | Staff Email | Public |
|-------|:-----------:|:-----------:|:-----------:|:------:|
| `/docs` | - | - | - | yes |
| `/docs/properties/*` | yes | yes | yes | no |
| `/docs/owner-docs/*` | no | yes | yes | no |
| `/docs/internal/*` | no | no | yes | no |

## Implementation

### 1. Install `jose` (Edge-compatible JWT library)

```bash
npm install jose
```

Needed for signing/verifying guest tokens in middleware (Edge Runtime can't use `jsonwebtoken`).

### 2. Create `middleware.ts` (project root)

Single middleware handling all protected routes. Matcher: `['/docs/properties/:path*', '/docs/owner-docs/:path*', '/docs/internal/:path*']`

Logic per route:

**`/docs/properties/*`** — check in order:
1. `?token=` query param → verify JWT, set `guest_session` httpOnly cookie, redirect to same URL without token (clean URL)
2. `guest_session` cookie → verify JWT, allow access
3. Supabase session with email in OWNER_EMAILS or STAFF_EMAILS → allow access
4. Otherwise → redirect to error page

**`/docs/owner-docs/*`** — Supabase session required, email in OWNER_EMAILS or STAFF_EMAILS

**`/docs/internal/*`** — Supabase session required, email in STAFF_EMAILS

Also refreshes Supabase session on every request (standard `@supabase/ssr` pattern).

Graceful degradation: if Supabase env vars missing, allow all (dev mode).

### 3. Create `scripts/generate-guest-token.ts`

CLI script to generate guest tokens:

```bash
npx tsx scripts/generate-guest-token.ts --expires 2026-03-15
```

Generates a signed JWT with:
- `type: "guest"` claim
- `exp` set to the provided date (guest checkout date)
- Signed with `GUEST_TOKEN_SECRET` env var

Outputs the full URL: `https://snowbirdhq.com/docs/properties?token=eyJ...`

### 4. Update `.env.local.example`

```
# Supabase (Authentication)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Email allowlists (comma-separated)
# Staff can access: guest guides, owner-docs, internal
# Owners can access: guest guides, owner-docs
OWNER_EMAILS=owner1@example.com,owner2@example.com
STAFF_EMAILS=staff1@example.com,staff2@example.com

# Guest token signing secret (generate with: openssl rand -hex 32)
GUEST_TOKEN_SECRET=your-random-secret-here
```

### 5. Create `src/components/auth-button.tsx`

Client component for docs nav. Shows "Sign In" or "Sign Out" using existing `createBrowserClient()`.

### 6. Update `src/app/docs/layout.tsx`

Add `AuthButton` to `nav.children` (confirmed valid prop on Fumadocs `DocsLayout`).

## Files

| File | Action |
|------|--------|
| `middleware.ts` | **Create** — route protection + session refresh + token verification |
| `scripts/generate-guest-token.ts` | **Create** — CLI to generate time-limited guest tokens |
| `.env.local.example` | **Edit** — add Supabase, allowlist, and token secret vars |
| `src/components/auth-button.tsx` | **Create** — sign in/out button for docs nav |
| `src/app/docs/layout.tsx` | **Edit** — wire AuthButton into nav.children |
| `package.json` | **Edit** — add `jose` dependency (via npm install) |

Existing files reused unchanged:
- `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`
- `src/app/auth/signin/page.tsx`, `src/app/auth/callback/route.ts`, `src/app/auth/access-denied/page.tsx`

## Manual Steps (User)

1. Create Supabase project → enable Email OTP (magic link)
2. Set redirect URLs: `https://snowbirdhq.com/auth/callback`, `http://localhost:3000/auth/callback`
3. Create `.env.local` with credentials, email lists, and token secret
4. Add same env vars to Vercel project settings

## Verification

1. `npm run build` — no type errors
2. Without env vars → all docs accessible (graceful dev mode)
3. With env vars:
   - `/docs` → accessible without auth
   - `/docs/properties/*` without token → blocked
   - `/docs/properties/*` with valid token → accessible, cookie set, clean URL
   - `/docs/properties/*` with expired token → blocked
   - `/docs/owner-docs/*` → sign-in redirect → accessible with owner/staff email
   - `/docs/internal/*` → sign-in redirect → accessible with staff email only
   - Non-allowlisted email → access-denied page
4. `npx tsx scripts/generate-guest-token.ts --expires 2026-03-15` → outputs valid URL
5. Auth button shows Sign In / Sign Out correctly in docs nav
