# Snowbird Website - Claude Code Setup Guide

This guide contains all the information needed to set up a new Claude Code instance for the Snowbird
website project.

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/andrewlaery/snowbird-website.git
   cd snowbird-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Vercel CLI globally**

   ```bash
   npm install -g vercel
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Project Overview

**Snowbird** is a luxury short-term rental property management company based in Queenstown, New
Zealand. This repository contains their brochure-style website, currently deployed as a minimalist
splash page at https://snowbirdhq.com.

## Philosophy & Approach

### Vision-Level Development

We treat AI as a coordinated team of 1000+ developers working in perfect harmony. This means:

- **Think systematically** about the entire system, not just individual features
- **Use "Best-of-N" approach** - generate multiple solutions and choose the best
- **Quality is non-negotiable** - 80%+ test coverage, zero warnings, production-ready code
- **Context is everything** - every decision aligns with our luxury brand positioning

### Core Principles

- **Systematic Quality**: All code must meet production standards from day one
- **Scalable Excellence**: Design for 100+ properties under management
- **Luxury Brand Alignment**: Every technical decision reflects our premium positioning
- **Future-Proof Architecture**: Build for extensibility and integration

## Tech Stack

- **Framework**: Next.js 15.4.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Mantine v8 (installed, not yet used)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Email**: Resend
- **Hosting**: Vercel
- **Domain**: snowbirdhq.com

## Repository Structure

```
/BCampX (root)
├── /src
│   ├── /app              # Next.js App Router
│   │   ├── page.tsx      # Homepage (splash page)
│   │   └── layout.tsx    # Root layout
│   ├── /components       # React components
│   ├── /constants        # Static data
│   ├── /lib             # Utilities
│   └── /types           # TypeScript types
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── /claude-code-setup    # This documentation folder
```

## Key Files in This Documentation

1. **CLAUDE.md** - AI assistant instructions with vision-level guidance and quality standards
2. **architecture.md** - System design and technical architecture overview
3. **quality-standards.md** - Non-negotiable quality requirements and metrics
4. **.claude/commands/** - Reusable AI command templates for common tasks
5. **PROJECT_CONTEXT.md** - Business requirements and goals
6. **TECHNICAL_SETUP.md** - GitHub and Vercel configuration
7. **DEVELOPMENT_GUIDE.md** - Development workflows and commands
8. **CURRENT_IMPLEMENTATION.md** - Current state and code details

### AI Command Templates

Use the templates in `.claude/commands/common-tasks.md` for:

- Feature development with quality standards
- Code review and optimization
- Testing strategy and implementation
- Architecture planning and integration
- Deployment and monitoring

## Important Notes

- The repository has a duplicate `/snowbird-website` subdirectory (legacy structure)
- Current implementation is a minimalist splash page
- Full 5-page website is planned but not yet implemented
- All documentation for future development is in the project files

## Contact

- **Project Owners**: Andrew & Andrea (Founders)
- **Target Market**: Luxury property owners in Queenstown, NZ
- **Primary Goal**: Generate leads from property owners with ADR >$650/night
