# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Vision & Philosophy

**Snowbird** represents the future of luxury property management in Queenstown, New Zealand. We're
building a technology-driven platform that delivers exceptional returns for property owners while
maintaining the highest standards of guest experience.

### Core Principles

- **Context is Everything**: Every decision should align with our luxury brand positioning
- **Systematic Quality**: Build with 80%+ test coverage, zero warnings, and production-ready
  standards
- **Vision-Level Execution**: Think strategically about the entire system, not just individual
  features
- **Scalable Excellence**: Design for a future with 100+ properties under management

### AI Collaboration Philosophy

You are not just a coding assistant - you are a coordinated team of experts working in perfect
harmony. When tackling complex problems:

- Use "think" for standard problems
- Use "think hard" for complex architectural decisions
- Use "ultrathink" for system-wide impacts or critical business logic

## Project Overview

**Snowbird** is a luxury short-term rental property management website for Queenstown, New Zealand.
Currently deployed at https://snowbirdhq.com with a minimalist Bower-inspired splash page.

## Common Development Commands

```bash
# Development
npm run dev          # Start Next.js dev server with Turbopack (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Deployment (Vercel CLI installed globally)
vercel               # Deploy preview
vercel --prod        # Deploy to production
vercel list          # List recent deployments
vercel domains ls    # List domains
```

## Architecture & Tech Stack

**Framework**: Next.js 15.4.2 (App Router) with TypeScript **UI Libraries**:

- Tailwind CSS for styling
- Mantine v8 components (installed but not yet used)
- Framer Motion for animations (installed but not currently used) **Forms**: React Hook Form + Zod
  validation (installed for future use) **Email**: Resend (for contact forms - requires
  RESEND_API_KEY env var) **Hosting**: Vercel (connected to GitHub repo:
  andrewlaery/snowbird-website) **Domain**: snowbirdhq.com (configured in Vercel with SSL)

## Project Structure

```
/src
  /app                 # Next.js App Router pages
    page.tsx          # Homepage (splash page with absolute positioning)
    layout.tsx        # Root layout with metadata
  /components         # React components
    /ui               # Basic UI components (Button, Container, Section)
    /layout           # Layout components (empty)
    /sections         # Page sections (empty)
  /constants          # Static data (properties.ts, services.ts)
  /lib                # Utilities (email.ts, utils.ts)
  /types              # TypeScript types (empty)
```

## Current Implementation Status

**✅ Completed**:

- Minimalist splash page with soft blue-gray background (#B5D3D7)
- Absolute positioning layout for precise control
- Responsive design that works on all screen sizes
- Custom domain (snowbirdhq.com) connected and working
- Vercel deployment with automatic CI/CD from GitHub
- Clean typography matching Bower design aesthetic

**📋 Planned** (per requirements docs):

- 5 main pages: Home, About, Services, Properties, Contact
- Contact form with email integration (Resend)
- Property showcase gallery
- SEO optimization for property management keywords
- Google Analytics 4 integration

## Environment Variables

Required for full functionality:

```
RESEND_API_KEY=your_resend_api_key_here
```

## Key Business Context

- **Target Audience**: High-net-worth property owners (properties >$650/night ADR)
- **Brand Style**: Minimalist, luxury, professional (inspired by Bower design)
- **Color Scheme**: Soft blue-gray background (#B5D3D7) with black text
- **Location**: Queenstown, New Zealand (mountain imagery fits perfectly)
- **Business Model**: B2B (property owners) with some B2C (travelers)

## Current Design Details

The splash page uses absolute positioning for reliability:

- Background: #B5D3D7 (soft blue-gray)
- Typography: Large responsive text (5xl to 80px on xl screens)
- Layout: Centered content with footer always at bottom
- Messaging: "The property management you want. The returns you need."
- Brand: "Snowbird" with black underline
- Status: "COMING SOON..." with letter spacing

## Deployment Notes

- **Production**: https://snowbirdhq.com
- **Git Strategy**: Pushes to main branch trigger automatic Vercel deployments
- **Preview Deployments**: Created for all branches
- **Domain Configuration**: snowbirdhq.com redirects to www.snowbirdhq.com
- **SSL**: Automatically managed by Vercel

## Design Evolution Notes

The page has evolved through several iterations:

1. Started with gradient + mountain background (too busy)
2. Added animations and glass-morphism effects (overcomplicated)
3. Current: Clean Bower-inspired minimalist design (perfect)

**Key lesson**: Keep it simple. The minimalist approach works best for luxury branding.

## Testing

No test suite currently implemented. Planned testing stack (per technical strategy):

- Vitest for unit tests
- Playwright for E2E tests
- React Testing Library for component tests

## Future Integration Plans

Per technical strategy document:

- Hostaway API (property management system)
- PriceLabs API (dynamic pricing)
- Stripe (payments)
- Payload CMS v3 (content management)

## Code Quality Standards

### Non-Negotiable Requirements

- **Zero Warnings**: Code must compile without any warnings
- **Test Coverage**: Maintain 80%+ test coverage on all new features
- **Type Safety**: No `any` types without explicit justification
- **Performance**: Core Web Vitals must remain in green zone
- **Accessibility**: WCAG 2.1 AA compliance minimum

### Development Workflow

1. **Feature Branches**: All changes through feature branches (feature/_, fix/_, chore/\*)
2. **Test-Driven Development**: Write tests first, then implementation
3. **Best-of-N Approach**: Generate multiple implementations and choose the best
4. **Code Review**: Self-review using "think hard" before finalizing
5. **Continuous Deployment**: Every merge to main deploys to production

## Development Best Practices

1. **Always test responsive design** - The layout must work on all screen sizes
2. **Keep it simple** - Avoid overcomplicating the design
3. **Use absolute positioning** when you need precise layout control
4. **Deploy frequently** - Vercel makes it easy, use it
5. **Match the business context** - This is luxury property management, not a tech startup
6. **Think systematically** - Consider how each change affects the entire system
7. **Document decisions** - Major architectural choices need documentation

## Command Templates

### For Complex Features

```
I need to implement [FEATURE]. Please "think hard" about:
1. Architecture implications
2. Performance impact
3. User experience
4. Future scalability
Then provide the best implementation approach.
```

### For System-Wide Changes

```
I need to make a system-wide change to [WHAT]. Please "ultrathink" about:
1. All affected components
2. Migration strategy
3. Rollback plan
4. Testing approach
Generate 3 different approaches and recommend the best one.
```

### For Quality Checks

```
Please review this code for:
1. Type safety (no implicit any)
2. Test coverage opportunities
3. Performance optimizations
4. Accessibility compliance
5. Security best practices
```
