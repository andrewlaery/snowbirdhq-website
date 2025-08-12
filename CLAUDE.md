# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

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
```

## Architecture Overview

**Framework**: Next.js 15.4.2 (App Router) with TypeScript **Repository**:
https://github.com/andrewlaery/snowbirdhq-website (GitHub) **Hosting**: Vercel
(andrewlaerys-projects/snowbirdhq) **Domain**: snowbirdhq.com and www.snowbirdhq.com **Styling**:
Tailwind CSS with custom Snowbird brand colors **Deployment**: Automatic via GitHub → Vercel
integration **Current State**: Production-ready minimalist splash page

### Current Tech Stack

- Next.js 15.4.2 with App Router and TypeScript
- Tailwind CSS with custom configuration (Snowbird blue: #B5D3D7)
- ESLint for code quality
- No additional UI libraries currently installed

## Project Structure

```
/src
  /app                 # Next.js App Router
    page.tsx          # Main splash page component
    layout.tsx        # Root layout with SEO metadata and viewport config
    globals.css       # Tailwind CSS imports and base styles
    icon.tsx          # Dynamic favicon generation using Next.js ImageResponse
/public
  favicon.ico         # Static favicon
tailwind.config.js    # Custom Snowbird brand colors and typography
next.config.js        # Next.js configuration with security headers
tsconfig.json         # TypeScript configuration with strict mode
```

## Current Implementation Status

**✅ Live Production Site**: https://snowbirdhq.com

- Minimalist splash page with Snowbird blue background (#B5D3D7)
- Fully responsive design using Tailwind's breakpoint system
- Absolute positioning for precise layout control
- Clean typography with responsive scaling (5xl to 80px)
- Custom Tailwind color theme with `bg-snowbird-blue` class
- Production-ready with SEO metadata and security headers

## Splash Page Implementation Details

### Design System

- **Brand Color**: `#B5D3D7` (soft blue-gray) defined as `snowbird.blue` in Tailwind config
- **Typography**: System font stack with responsive sizing (mobile to desktop scaling)
- **Layout**: Absolute positioning with flexbox for reliable cross-device rendering
- **Responsive Breakpoints**: sm: 640px, md: 768px, lg: 1024px, xl: 1280px

### Key Components

- **Brand Element**: "Snowbird" with black underline using CSS border
- **Value Proposition**: Two-line message with `text-balance` for optimal line breaks
- **Status Indicator**: "COMING SOON..." with extended letter-spacing
- **Location Footer**: "Queenstown, New Zealand" with reduced opacity

### Custom Tailwind Classes

- `bg-snowbird-blue`: Primary background color (#B5D3D7)
- `tracking-wider-xl`: Extended letter spacing (0.2em)
- `text-balance`: CSS text-wrap property for better typography

## Business Context

**Target Market**: High-net-worth property owners in Queenstown, NZ **Property Focus**: Luxury
rentals >$650/night ADR  
**Brand Style**: Minimalist luxury (inspired by Bower design) **Color Palette**: Soft blue-gray
(#B5D3D7) with black text on white **Business Model**: B2B property management services

## Development Standards

### Code Quality

- **Zero Build Warnings**: All TypeScript and ESLint warnings must be resolved
- **Type Safety**: Strict TypeScript configuration enabled
- **Performance**: Static generation for optimal Core Web Vitals
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Build Verification

```bash
npm run build      # Must complete without errors
npm run lint       # Must pass with zero warnings
npm run type-check # TypeScript strict mode compliance
```

## Deployment Architecture

### GitHub-Vercel Integration

- **Repository**: https://github.com/andrewlaery/snowbirdhq-website
- **Branch Strategy**: `main` branch for production deployments
- **Automatic Deployment**: Push to `main` → Vercel production deployment
- **Preview Deployments**: Feature branches automatically create preview deployments

### Vercel Configuration

- **Project Name**: snowbirdhq (andrewlaerys-projects/snowbirdhq)
- **Source**: GitHub repository (integrated)
- **Build Command**: `npm run build` (auto-detected)
- **Framework**: Next.js (auto-detected)
- **Node Version**: 22.x (latest stable)
- **Domain Assignment**: Both snowbirdhq.com and www.snowbirdhq.com

### Security Headers (next.config.js)

- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin

## Troubleshooting

### GitHub Integration Issues

If automatic deployments aren't working:

1. Check repository connection: `vercel git connect`
2. Verify webhooks in GitHub repository settings
3. Check deployment status: `vercel list`
4. Manual trigger: Push an empty commit or redeploy via Vercel dashboard

### Domain Issues

If snowbirdhq.com redirects to Vercel login:

1. Check domain assignment: `vercel domains inspect snowbirdhq.com`
2. Verify project assignment: `vercel list`
3. Reassign if needed: `vercel domains add snowbirdhq.com`
4. Create alias: `vercel alias [deployment-url] snowbirdhq.com`

### Build Issues

- **TypeScript Errors**: Run `npm run type-check` to isolate TypeScript issues
- **Tailwind Classes**: Verify custom classes are defined in `tailwind.config.js`
- **Import Errors**: Check file paths and Next.js App Router conventions
- **Failed GitHub Deployment**: Check Vercel dashboard for build logs

### Development Workflow

1. **Feature Development**: Create feature branch → develop → push → preview deployment
2. **Production Release**: Merge to `main` → automatic production deployment
3. **Hotfixes**: Direct push to `main` for urgent fixes
4. **Local Testing**: Use `npm run build && npm run start` for production parity
