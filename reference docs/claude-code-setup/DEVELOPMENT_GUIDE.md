# Development Guide & Workflows

## Development Workflow Standards

### Branching Strategy

Following the Claude Code Standards approach with feature branches:

```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/property-showcase

# Work on your feature
# Make commits following conventional commit format

# Push feature branch
git push origin feature/property-showcase

# Create PR to main branch
# After review and CI passes, merge to main
```

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `chore/description` - Maintenance tasks
- `docs/description` - Documentation updates

### Daily Development Workflow

#### Starting Development

```bash
# Ensure you're on main and pull latest
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Install any new dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

#### Making Changes with Quality Gates

```bash
# Before committing, run quality checks
npm run quality:check  # Linting, type check, tests

# Stage changes
git add -A

# Commit with conventional format
git commit -m "feat(components): add PropertyCard with responsive design"

# Push feature branch
git push origin feature/your-feature-name

# Create PR through GitHub UI
```

## Key Development Commands

### Core Commands

```bash
npm run dev                    # Start dev server with Turbopack (fast!)
npm run build                  # Build for production (test before deploying)
npm run start                  # Start production build locally
npm run lint                   # Run ESLint (must pass for deployment)
npm run lint:fix              # Auto-fix ESLint issues
npm run type-check            # TypeScript type checking
npm run test                   # Run test suite (when implemented)
npm run test:coverage         # Test coverage report
npm run quality:check         # Full quality gate check
npm run quality:fix           # Auto-fix quality issues
```

### Vercel Commands

```bash
vercel               # Deploy preview (for testing)
vercel --prod        # Deploy to production
vercel list          # See recent deployments
vercel logs          # View deployment logs
vercel env ls        # List environment variables
```

### Troubleshooting Commands

```bash
# Clear build cache
rm -rf .next node_modules package-lock.json
npm install

# Check for build issues
npm run build

# Lint check
npm run lint

# Check package vulnerabilities
npm audit
```

## File Structure & Organization

### Where to Make Changes

```
/src
├── /app
│   ├── page.tsx         # ← Main splash page (current)
│   ├── layout.tsx       # ← Root layout and metadata
│   └── globals.css      # ← Global styles
├── /components
│   ├── /ui              # ← Reusable UI components
│   ├── /layout          # ← Layout components (future)
│   └── /sections        # ← Page sections (future)
├── /constants           # ← Static data and config
├── /lib                 # ← Utility functions
└── /types              # ← TypeScript type definitions
```

### Adding New Pages

```bash
# Next.js App Router structure
/src/app/about/page.tsx     # Creates /about route
/src/app/services/page.tsx  # Creates /services route
/src/app/contact/page.tsx   # Creates /contact route
```

## Styling Guidelines

### Tailwind CSS Approach

- Use Tailwind utility classes for styling
- Follow mobile-first responsive design
- Use semantic color names when possible
- Keep CSS custom to minimum

### Current Design System

```css
/* Colors */
background: #B5D3D7        /* Soft blue-gray */
text: black                /* High contrast */

/* Typography */
font-family: system fonts  /* Default Next.js fonts */
font-sizes: responsive     /* 5xl → 80px on xl screens */
line-height: 0.9          /* Tight spacing for impact */

/* Spacing */
padding: px-8 md:px-16 lg:px-24  /* Responsive padding */
```

### Responsive Breakpoints

```css
sm:   640px   /* Small tablets */
md:   768px   /* Tablets */
lg:   1024px  /* Small desktops */
xl:   1280px  /* Large desktops */
```

## Code Quality Standards

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all props
- Avoid `any` types when possible
- Export types from `/src/types`

### Component Structure

```typescript
// Example component structure
interface ComponentProps {
  title: string;
  description?: string;
}

export function Component({ title, description }: ComponentProps) {
  return (
    <div className="responsive-classes">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
```

### Commit Message Format

```
# Good commit messages
"Add responsive navigation component"
"Fix mobile layout issues on contact page"
"Update homepage hero section with new copy"

# Avoid
"updates"
"fix stuff"
"changes"
```

## Deployment Workflow

### Automatic Deployment

1. **Push to main** → Triggers Vercel build
2. **Build succeeds** → Deploys to https://snowbirdhq.com
3. **Build fails** → Check logs in Vercel dashboard

### Manual Deployment

```bash
# For testing changes before committing
vercel                    # Deploy preview
# Test the preview URL
vercel --prod            # Deploy to production
```

### Rollback Process

```bash
# View recent deployments
vercel list

# Promote previous deployment to production
vercel promote [deployment-url] --prod
```

## Testing Strategy

### Manual Testing Checklist

- [ ] Page loads correctly on desktop
- [ ] Page loads correctly on mobile
- [ ] All text is readable and properly sized
- [ ] Layout doesn't break at different screen sizes
- [ ] No console errors in browser dev tools
- [ ] Build completes without errors (`npm run build`)

### Future Testing

Once the full site is built:

- Unit tests with Vitest
- E2E tests with Playwright
- Visual regression testing
- Performance testing

## Performance Optimization

### Current Optimizations

- Next.js 15 with Turbopack (90% faster builds)
- Automatic image optimization
- Static generation for fast loading
- Vercel Edge Network (global CDN)

### Monitoring Performance

```bash
# Local performance testing
npm run build
npm run start

# Check Lighthouse scores
# Open DevTools → Lighthouse → Run audit
```

## Common Issues & Solutions

### Layout Issues

- **Problem**: Content not centering properly
- **Solution**: Use absolute positioning with inset-0 and flex
- **Code**: `absolute inset-0 flex items-center`

### Responsive Issues

- **Problem**: Text too large on mobile
- **Solution**: Use responsive text sizes
- **Code**: `text-5xl md:text-6xl lg:text-7xl xl:text-[80px]`

### Build Failures

- **Problem**: TypeScript errors
- **Solution**: Fix type errors, use proper interfaces
- **Command**: `npm run lint` to see issues

### Deployment Issues

- **Problem**: Vercel deployment fails
- **Solution**: Check build locally first
- **Commands**: `npm run build` then `vercel --prod`

## Best Practices

### Do's

✅ Test responsive design on multiple screen sizes ✅ Use semantic HTML elements ✅ Write
descriptive commit messages ✅ Keep components simple and focused ✅ Follow the established design
system

### Don'ts

❌ Don't overcomplicate the design (learned this lesson!) ❌ Don't commit broken builds ❌ Don't use
hardcoded values (use Tailwind classes) ❌ Don't ignore TypeScript errors ❌ Don't skip testing on
mobile devices

## AI-Assisted Development

### Using Command Templates

Leverage the templates in `.claude/commands/common-tasks.md` for:

```bash
# For new components
"I need to create a PropertyCard component. Please use the component creation template."

# For code review
"Please review this code using the quality standards checklist."

# For complex features
"I need to implement property search. Please 'think hard' about the architecture."
```

### Thinking Levels

- **"think"**: Standard tasks, simple bug fixes
- **"think hard"**: Complex components, performance optimization
- **"ultrathink"**: System architecture, major integrations

### Best-of-N Approach

For critical decisions, request multiple solutions:

```
"Generate 3 different approaches for implementing property filtering and recommend the best one."
```

## Quality Assurance Process

### Pre-Commit Checklist

- [ ] `npm run quality:check` passes
- [ ] All new code has tests (targeting 80% coverage)
- [ ] TypeScript strict mode compliance
- [ ] Mobile responsive design tested
- [ ] Accessibility checked
- [ ] Performance impact assessed

### Code Review Standards

- No merge without passing CI/CD pipeline
- All quality gates must pass
- Documentation updated for new features
- Breaking changes documented

## Future Development Notes

### Planned Features

1. **Contact Forms**: Use React Hook Form + Zod + Resend
2. **Property Gallery**: Image optimization with Next.js Image
3. **SEO**: Dynamic metadata for each page
4. **Analytics**: Google Analytics 4 integration
5. **Testing Suite**: Vitest + Playwright implementation

### Architecture Decisions

- Keep the minimalist design approach (it works!)
- Use absolute positioning for precise layout control
- Stick with server components where possible
- Add client components only when needed for interactivity
- Implement feature branches for all changes
- Maintain 80%+ test coverage for all new code
