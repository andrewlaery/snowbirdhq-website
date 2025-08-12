# Snowbird Website

This is a [Next.js](https://nextjs.org) project for Snowbird, a luxury property management company
in Queenstown, New Zealand.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- **Framework**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **Deployment**: Vercel (connected to GitHub)

## Development Commands

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## Deployment

This project is configured for deployment on Vercel with GitHub integration. The production site is
available at:

- **Production**: https://snowbirdhq.com
- **WWW**: https://www.snowbirdhq.com
- **Repository**: https://github.com/andrewlaery/snowbirdhq-website

### Automatic Deployments

- **Main branch**: Triggers production deployments
- **Feature branches**: Creates preview deployments
- **Connected to**: GitHub repository for continuous deployment

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
