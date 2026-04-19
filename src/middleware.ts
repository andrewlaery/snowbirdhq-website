// Auth gating temporarily disabled (2026-04-20) while the upstream Supabase
// project is rebuilt. Docs are publicly readable for now; restore the full
// gated middleware by reverting this file.
//
// For the gated version see git history — it enforces per-slug guest tokens
// (jwt verified against GUEST_TOKEN_SECRET), staff/owner email allowlists,
// and Supabase magic-link sessions.
import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}

export const config = { matcher: [] };
