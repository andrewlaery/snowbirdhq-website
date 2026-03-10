# Role-Based Access Control for docs.snowbirdhq.com

## Context

The docs portal currently has basic auth (guest JWT tokens, owner/staff email lists) but lacks proper scoping. Guest tokens give access to ALL properties, owners see ALL owner-docs, and the sidebar shows everything to everyone. This plan adds per-property access scoping for guests and owners, sidebar filtering, and a public welcome page.

## Env Var Design

**New env var** (add to `.env.local.example` and Vercel):
```
OWNER_PROPERTIES=owner@email.com:25-dublin,7-suburb;other@email.com:1-34-shotover
```

Keep existing `OWNER_EMAILS` for backward compat (owners in that list but not in `OWNER_PROPERTIES` get access to all properties). `STAFF_EMAILS` unchanged.

---

## Step 1: Create `src/lib/auth/roles.ts`

Centralised role resolution. All auth logic in one place.

```ts
type Role = 'guest' | 'owner' | 'staff' | 'anonymous';
interface UserAccess { role: Role; allowedProperties: string[]; }
```

Functions:
- `parseOwnerProperties(env)` — parses `OWNER_PROPERTIES` into `Map<email, slugs[]>`
- `resolveUserAccess({ userEmail?, guestProperty? })` — returns `UserAccess`. Staff check first, then owner-properties map, then legacy OWNER_EMAILS fallback, then guest token, else anonymous.
- `canAccessPath(access, pathname)` — determines if a role+properties combo can access a given URL path. Rules:
  - `/docs` exact → always allowed (public)
  - `/docs/properties/<slug>/*` → staff always, guest/owner if slug in allowedProperties
  - `/docs/owner-docs/<slug>/*` → staff always, owner if slug in allowedProperties
  - `/docs/internal/*` → staff only
  - Everything else under `/docs/*` → requires any authenticated role
- `getLinksForRole(role)` — returns nav links array filtered by role

## Step 2: Update `scripts/generate-guest-token.ts`

- Add required `--property <slug>` arg
- Include `property` claim in JWT: `{ type: "guest", property: "25-dublin" }`
- Update output URL: `https://docs.snowbirdhq.com/properties/25-dublin?token=...`
- Old tokens without `property` claim will be rejected by updated middleware

## Step 3: Rewrite `src/middleware.ts`

Unified auth flow using `roles.ts`.

- **Matcher**: Change to `/docs/:path+` (protects all `/docs/*` except `/docs` itself)
- **Flow**: Set up Supabase client → get user → check guest token (URL param or cookie) → `resolveUserAccess()` → `canAccessPath()` → allow/redirect
- **Guest token change**: `verifyGuestToken()` returns `{ property: string } | null` instead of `boolean`
- **Cookie**: Change `guest_session` cookie path from `/docs/properties` to `/docs`

## Step 4: Create `src/lib/auth/filter-page-tree.ts`

Filters `source.pageTree` (type: `PageTree.Root` from `fumadocs-core/server`) by `UserAccess`.

Recursive walk:
- **Separator** → keep
- **Item** (page) → keep if `canAccessPath(access, item.url)`
- **Folder** → recursively filter children. Remove folder if no accessible children/index remain. For properties/owner-docs folders specifically, filter child folders by slug matching `allowedProperties`.
- Clean up consecutive/trailing separators

## Step 5: Update `src/app/docs/layout.tsx`

Make it an async server component that:
1. Gets Supabase user via `createServerClient()`
2. Checks `guest_session` cookie for guest property claim
3. Calls `resolveUserAccess()`
4. Calls `filterPageTree(source.pageTree, access)`
5. Calls `getLinksForRole(access.role)`
6. Passes filtered tree + links to `DocsLayout`

## Step 6: Update `src/app/docs/page.tsx`

- **Anonymous visitors**: Branded welcome page with SnowbirdHQ title, welcome message, sign-in button
- **Authenticated visitors**: Section cards filtered by role (guests see Guest Guides only, owners see Guest Guides + Owner Docs, staff see all three)

Make it async server component, reuse `resolveUserAccess()`.

## Step 7: Restructure `content/docs/owner-docs/`

**From** (generic):
```
owner-docs/index.mdx, financial-reporting/, management-agreements/
```

**To** (per-property):
```
owner-docs/
  index.mdx (overview)
  meta.json (list property slugs)
  25-dublin/
    meta.json
    index.mdx
    financial-reporting.mdx
    management-agreement.mdx
  7-suburb/
    ...
```

Create placeholder per-property folders for each managed property. Update `owner-docs/meta.json` and `owner-docs/index.mdx`.

---

## Files Modified

| File | Action |
|------|--------|
| `src/lib/auth/roles.ts` | New — role resolution, path checks |
| `src/lib/auth/filter-page-tree.ts` | New — page tree filtering |
| `src/middleware.ts` | Rewrite — unified role-based auth |
| `src/app/docs/layout.tsx` | Modify — async, filtered tree/links |
| `src/app/docs/page.tsx` | Modify — public welcome + role-filtered home |
| `scripts/generate-guest-token.ts` | Modify — add --property flag |
| `.env.local.example` | Modify — add OWNER_PROPERTIES |
| `content/docs/owner-docs/*` | Restructure — per-property folders |

## Verification

1. `npm run build` — must pass
2. `npm run dev` — visit `localhost:3000/docs`:
   - Not signed in → see welcome page with sign-in button
   - Sign in as staff → see all sections, full sidebar
   - Sign in as owner → see only their properties + their owner-docs
3. Generate guest token: `npx tsx scripts/generate-guest-token.ts --property 25-dublin --expires 2026-12-31`
   - Visit URL with token → see only 25 Dublin docs in sidebar
   - Navigate to different property URL → access denied
4. `npm run lint` and `npm run type-check` — must pass
