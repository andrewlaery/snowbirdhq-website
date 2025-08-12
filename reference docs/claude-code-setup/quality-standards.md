# Quality Standards

## Overview

This document defines the non-negotiable quality standards for the Snowbird project. Every piece of
code must meet these standards before being merged to production.

## Code Quality Metrics

### Required Standards

| Metric           | Requirement         | Current Status    | Tools             |
| ---------------- | ------------------- | ----------------- | ----------------- |
| Test Coverage    | ≥ 80%               | 0% (No tests yet) | Vitest + NYC      |
| Type Coverage    | 100%                | ~95%              | TypeScript strict |
| Build Warnings   | 0                   | ✅ 0              | Next.js build     |
| Linting Errors   | 0                   | ✅ 0              | ESLint            |
| Bundle Size      | < 200KB initial     | ✅ ~100KB         | Next.js analyzer  |
| Lighthouse Score | ≥ 90 all categories | ✅ 100/100        | Chrome DevTools   |

### Performance Standards

- **Core Web Vitals**: All metrics must be in the "Good" range
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
  - INP (Interaction to Next Paint): < 200ms

### Accessibility Standards

- **WCAG 2.1 Level AA**: Minimum compliance
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text

## Development Process Standards

### 1. Test-Driven Development (TDD)

```typescript
// 1. Write the test first
describe('PropertyCard', () => {
  it('should display property title and price', () => {
    const property = { title: 'Luxury Villa', price: 850 };
    render(<PropertyCard property={property} />);
    expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
    expect(screen.getByText('$850/night')).toBeInTheDocument();
  });
});

// 2. Write minimal code to pass
// 3. Refactor while keeping tests green
```

### 2. Type Safety Requirements

```typescript
// ❌ Bad - Avoid any types
const processData = (data: any) => { ... }

// ✅ Good - Explicit types
interface PropertyData {
  id: string;
  title: string;
  price: number;
}
const processData = (data: PropertyData) => { ... }

// Exceptions must be documented
const legacyApiResponse = data as any; // TODO: Type once API is stabilized
```

### 3. Component Standards

```typescript
// Every component must have:
// 1. TypeScript interface for props
// 2. JSDoc comment describing purpose
// 3. Default props where applicable
// 4. Error boundaries for critical components

/**
 * Displays a property card with image, title, and price
 * @component
 */
interface PropertyCardProps {
  property: Property;
  variant?: 'default' | 'featured';
  onSelect?: (id: string) => void;
}

export function PropertyCard({ property, variant = 'default', onSelect }: PropertyCardProps) {
  // Implementation
}
```

## Code Review Checklist

### Before Submitting PR

- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting warnings (`npm run lint`)
- [ ] Test coverage ≥ 80% for new code
- [ ] Performance impact assessed
- [ ] Accessibility checked
- [ ] Mobile responsive tested
- [ ] Documentation updated

### Security Checklist

- [ ] No hardcoded secrets or API keys
- [ ] Input validation on all user inputs
- [ ] XSS prevention (React handles most)
- [ ] CSRF protection for forms
- [ ] Proper error handling (no stack traces to users)

## Testing Standards

### Test Structure

```
src/
├── components/
│   ├── PropertyCard.tsx
│   └── __tests__/
│       └── PropertyCard.test.tsx
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts
```

### Test Categories

1. **Unit Tests** (Vitest)
   - All utility functions
   - Component rendering
   - Business logic
2. **Integration Tests** (Vitest + Testing Library)
   - Component interactions
   - API integrations
   - Form submissions

3. **E2E Tests** (Playwright)
   - Critical user journeys
   - Cross-browser testing
   - Mobile testing

### Test Quality Standards

```typescript
// Tests must be:
// 1. Descriptive - Clear test names
// 2. Independent - No test dependencies
// 3. Repeatable - Same result every time
// 4. Fast - < 100ms for unit tests

// ❌ Bad test
it('test1', () => {
  expect(add(1, 1)).toBe(2);
});

// ✅ Good test
it('should return sum of two positive numbers', () => {
  expect(add(1, 1)).toBe(2);
  expect(add(5, 3)).toBe(8);
});
```

## Documentation Standards

### Code Documentation

````typescript
/**
 * Calculates the total price including fees and taxes
 * @param basePrice - The nightly rate in NZD
 * @param nights - Number of nights
 * @param options - Additional pricing options
 * @returns Total price including all fees
 * @example
 * ```ts
 * const total = calculateTotalPrice(850, 3, { cleaningFee: 150 });
 * // Returns: 2700 (850 * 3 + 150)
 * ```
 */
function calculateTotalPrice(basePrice: number, nights: number, options?: PricingOptions): number {
  // Implementation
}
````

### README Standards

Every significant feature must have:

1. Purpose explanation
2. Usage examples
3. API documentation
4. Configuration options
5. Troubleshooting guide

## Git Commit Standards

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding missing tests
- `chore`: Changes to build process or auxiliary tools

### Examples

```bash
# ✅ Good commits
feat(auth): add Google OAuth integration
fix(properties): correct price calculation for weekly stays
docs(api): update REST endpoint documentation
test(components): add PropertyCard unit tests

# ❌ Bad commits
update files
fix bug
changes
```

## Monitoring & Alerts

### Quality Gates

1. **Pre-commit**: Linting and formatting
2. **Pre-push**: Type checking and tests
3. **CI Pipeline**: Full test suite and build
4. **Pre-deploy**: Performance and security scans

### Automated Checks

```json
// package.json scripts
{
  "scripts": {
    "quality:check": "npm run lint && npm run type-check && npm run test:coverage",
    "quality:fix": "npm run lint:fix && npm run format",
    "precommit": "npm run quality:check",
    "prepush": "npm run build && npm run test:e2e"
  }
}
```

## Continuous Improvement

### Weekly Quality Review

- Review test coverage trends
- Analyze performance metrics
- Check accessibility scores
- Review error rates
- Update standards as needed

### Quality Debt Tracking

Track and prioritize quality improvements:

1. Missing tests (Priority: High)
2. Type safety gaps (Priority: High)
3. Performance optimizations (Priority: Medium)
4. Documentation gaps (Priority: Medium)
5. Code duplication (Priority: Low)

## Exception Process

When standards cannot be met:

1. Document the exception in code
2. Create a tracking issue
3. Set a remediation timeline
4. Get team approval

Example:

```typescript
// TODO(#123): Add proper types once API stabilizes
// Exception: Using 'any' due to rapidly changing third-party API
// Remediation: Q2 2024
const apiResponse = data as any;
```
