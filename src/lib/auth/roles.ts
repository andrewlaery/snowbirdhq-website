export type Role = 'guest' | 'owner' | 'staff' | 'anonymous';

export interface UserAccess {
  role: Role;
  allowedProperties: string[];
}

function parseEmailList(envVar: string | undefined): string[] {
  if (!envVar) return [];
  return envVar
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Parses OWNER_PROPERTIES env var.
 * Format: "owner@email.com:25-dublin,7-suburb;other@email.com:1-34-shotover"
 */
export function parseOwnerProperties(
  env: string | undefined
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  if (!env) return map;

  for (const entry of env.split(';')) {
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const email = trimmed.slice(0, colonIdx).trim().toLowerCase();
    const slugs = trimmed
      .slice(colonIdx + 1)
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (email && slugs.length > 0) {
      map.set(email, slugs);
    }
  }
  return map;
}

export function resolveUserAccess({
  userEmail,
  guestProperty,
}: {
  userEmail?: string | null;
  guestProperty?: string | null;
}): UserAccess {
  const staffEmails = parseEmailList(process.env.STAFF_EMAILS);
  const ownerEmails = parseEmailList(process.env.OWNER_EMAILS);
  const ownerProperties = parseOwnerProperties(process.env.OWNER_PROPERTIES);

  const email = userEmail?.toLowerCase();

  if (email && staffEmails.includes(email)) {
    return { role: 'staff', allowedProperties: [] };
  }

  if (email) {
    const scopedSlugs = ownerProperties.get(email);
    if (scopedSlugs) {
      return { role: 'owner', allowedProperties: scopedSlugs };
    }
    // Legacy fallback: OWNER_EMAILS without OWNER_PROPERTIES entry = all properties
    if (ownerEmails.includes(email)) {
      return { role: 'owner', allowedProperties: [] };
    }
  }

  if (guestProperty) {
    return { role: 'guest', allowedProperties: [guestProperty.toLowerCase()] };
  }

  return { role: 'anonymous', allowedProperties: [] };
}

function hasPropertyAccess(access: UserAccess, slug: string): boolean {
  if (access.role === 'staff') return true;
  return access.allowedProperties.includes(slug.toLowerCase());
}

export function canAccessPath(access: UserAccess, pathname: string): boolean {
  // /docs exact — always allowed (public welcome page)
  if (pathname === '/docs') return true;

  // /docs/properties/<slug>/*
  const propsMatch = pathname.match(/^\/docs\/properties\/([^/]+)/);
  if (propsMatch) {
    const slug = propsMatch[1];
    if (access.role === 'anonymous') return false;
    return hasPropertyAccess(access, slug);
  }

  // /docs/properties (index) — any authenticated role
  if (pathname === '/docs/properties') {
    return access.role !== 'anonymous';
  }

  // /docs/owner-docs/<slug>/*
  const ownerMatch = pathname.match(/^\/docs\/owner-docs\/([^/]+)/);
  if (ownerMatch) {
    const slug = ownerMatch[1];
    if (access.role === 'staff') return true;
    if (access.role === 'owner') return hasPropertyAccess(access, slug);
    return false;
  }

  // /docs/owner-docs (index) — staff or owner
  if (pathname === '/docs/owner-docs') {
    return access.role === 'staff' || access.role === 'owner';
  }

  // /docs/internal/* — staff only
  if (pathname.startsWith('/docs/internal')) {
    return access.role === 'staff';
  }

  // Any other /docs/* path — requires authenticated role
  if (pathname.startsWith('/docs/')) {
    return access.role !== 'anonymous';
  }

  return true;
}

interface NavLink {
  text: string;
  url: string;
  active: 'nested-url';
}

export function getLinksForRole(role: Role): NavLink[] {
  const links: NavLink[] = [];

  if (role !== 'anonymous') {
    links.push({
      text: 'Guest Guides',
      url: '/docs/properties',
      active: 'nested-url',
    });
  }

  if (role === 'owner' || role === 'staff') {
    links.push({
      text: 'Owner Docs',
      url: '/docs/owner-docs',
      active: 'nested-url',
    });
  }

  if (role === 'staff') {
    links.push({
      text: 'Internal',
      url: '/docs/internal',
      active: 'nested-url',
    });
  }

  return links;
}
