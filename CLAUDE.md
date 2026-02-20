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
vercel --prod        # Manual production deployment
vercel list          # List recent deployments
vercel domains ls    # List domains

# DNS Management (for subdomains like pay.snowbirdhq.com)
vercel dns ls snowbirdhq.com                                     # List all DNS records
vercel dns add snowbirdhq.com [subdomain] [type] [value]         # Add DNS record
vercel dns rm [record-id]                                        # Remove DNS record
```

## Architecture Overview

**Framework**: Next.js 15.4.2 (App Router) with TypeScript
**Repository**: https://github.com/andrewlaery/snowbirdhq-website
**Hosting**: Vercel (andrewlaerys-projects/snowbirdhq)
**Domains**: snowbirdhq.com and www.snowbirdhq.com (Vercel nameservers)
**Styling**: Tailwind CSS with custom Snowbird brand colors
**Deployment**: Automatic via GitHub → Vercel integration
**Current State**: Production-ready minimalist splash page

### Tech Stack

- Next.js 15.4.2 with App Router and TypeScript
- Tailwind CSS with custom configuration
- ESLint for code quality
- Node.js >=18.0.0 requirement

## High-Level Architecture

### Routing Structure
- App Router pattern with file-based routing in `src/app/`
- Static pages: `/` (splash), `/privacy-policy`, `/terms`
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

**Docs portal**: `docs.snowbirdhq.com` — protected by middleware (`src/middleware.ts`) using Supabase magic link auth + JWT guest tokens.

**RBAC engine**: `src/lib/auth/roles.ts` — resolves role from email or guest token.

### Roles

| Role | Access | How granted |
|------|--------|-------------|
| Staff | Everything | Email in `STAFF_EMAILS` env var |
| Owner | Owner docs + assigned properties | Email in `OWNER_PROPERTIES` env var |
| Guest | Single property guide | Tokenised URL via `scripts/generate-guest-token.ts` |
| Anonymous | Public welcome page only | Default |

### Environment variables (Vercel)

| Variable | Format | Example |
|----------|--------|---------|
| `STAFF_EMAILS` | Comma-separated | `alice@bcampx.com,bob@bcampx.com` |
| `OWNER_PROPERTIES` | `email:slug1,slug2;email2:slug3` | `owner@gmail.com:25-dublin,7-suburb` |
| `OWNER_EMAILS` | Comma-separated | `owner@gmail.com` (grants owner role, no property access without `OWNER_PROPERTIES`) |
| `GUEST_TOKEN_SECRET` | Random string | Used to sign/verify guest JWTs |

**Managing access**: Edit env vars in Vercel dashboard (Settings → Environment Variables) or via CLI (`vercel env rm`/`vercel env add`), then redeploy.

### Guest token generation

```bash
GUEST_TOKEN_SECRET=<secret> npx tsx scripts/generate-guest-token.ts \
  --property 25-dublin --expires 2026-03-31
```

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
