# Common AI Commands for Snowbird Project

This file contains reusable command templates for common development tasks. Copy and customize these
prompts for consistent, high-quality results.

## Feature Development Commands

### New Component Creation

```
I need to create a new component called [COMPONENT_NAME]. Please "think hard" about:

1. **Component Architecture**:
   - Props interface design
   - Accessibility requirements
   - Performance considerations
   - Responsive design approach

2. **Implementation Requirements**:
   - TypeScript strict mode compliance
   - Test coverage strategy
   - Documentation standards
   - Error handling

3. **Integration Considerations**:
   - How it fits with existing components
   - Potential reusability
   - Styling approach with Tailwind

Please provide:
- Complete TypeScript component with props interface
- Comprehensive test suite
- Usage documentation
- Accessibility annotations
```

### New Page Implementation

```
I need to implement a new page at [ROUTE_PATH]. Please "ultrathink" about:

1. **User Experience**:
   - Page purpose and user goals
   - Navigation flow
   - Mobile responsiveness
   - Loading states

2. **Technical Implementation**:
   - Next.js App Router structure
   - SEO optimization (metadata, structured data)
   - Performance optimization
   - Type safety

3. **Business Alignment**:
   - Brand consistency with luxury positioning
   - Conversion optimization
   - Analytics tracking points

Generate a complete implementation including:
- Page component with proper metadata
- Required sub-components
- Test coverage
- SEO optimizations
```

## Code Quality Commands

### Code Review Request

```
Please review this code for the Snowbird project standards:

[PASTE CODE HERE]

Check for:
1. **Quality Standards Compliance**:
   - Type safety (no implicit any)
   - Test coverage opportunities
   - Performance optimizations
   - Accessibility compliance
   - Security best practices

2. **Architecture Alignment**:
   - Component composition patterns
   - Proper separation of concerns
   - Consistent styling approach
   - Error boundary usage

3. **Luxury Brand Standards**:
   - Professional code quality
   - Scalability for growth
   - Documentation completeness

Provide specific improvement recommendations with code examples.
```

### Performance Optimization

```
I need to optimize performance for [SPECIFIC_AREA]. Please "think hard" about:

1. **Core Web Vitals Impact**:
   - LCP optimization strategies
   - CLS prevention measures
   - INP improvement opportunities

2. **Bundle Optimization**:
   - Code splitting opportunities
   - Lazy loading candidates
   - Import optimization

3. **Runtime Performance**:
   - React optimization patterns
   - Memory usage considerations
   - Rendering optimization

Generate specific optimization strategies with measurable improvements.
```

## Testing Commands

### Test Suite Creation

```
I need comprehensive tests for [COMPONENT/FEATURE]. Please create:

1. **Unit Tests** (Vitest):
   - All public methods/props combinations
   - Edge cases and error conditions
   - Performance edge cases

2. **Integration Tests**:
   - Component interactions
   - User workflows
   - API integration points

3. **Accessibility Tests**:
   - Keyboard navigation
   - Screen reader compatibility
   - ARIA compliance

Target: 80%+ coverage with meaningful test scenarios.
```

### E2E Test Planning

```
I need E2E tests for the [USER_JOURNEY]. Please "think hard" about:

1. **Critical User Paths**:
   - Primary user goals
   - Error scenarios
   - Edge cases

2. **Cross-Platform Testing**:
   - Desktop/mobile variations
   - Browser compatibility
   - Performance under load

3. **Business Impact**:
   - Conversion funnel protection
   - Lead generation workflows
   - Brand experience validation

Create Playwright test suite with clear assertions and error handling.
```

## Architecture Commands

### System Design Planning

```
I need to design [SYSTEM/FEATURE] for the Snowbird platform. Please "ultrathink" about:

1. **Scalability Requirements**:
   - Current needs vs future growth (100+ properties)
   - Performance under load
   - Integration complexity

2. **Technical Architecture**:
   - Component design patterns
   - Data flow architecture
   - Error handling strategy
   - Security considerations

3. **Business Alignment**:
   - Luxury brand requirements
   - User experience impact
   - Maintenance complexity

Generate 3 different architectural approaches and recommend the best one with detailed rationale.
```

### Integration Planning

```
I need to integrate [EXTERNAL_SERVICE] with our platform. Please analyze:

1. **Integration Strategy**:
   - API design patterns
   - Error handling and fallbacks
   - Performance impact
   - Security considerations

2. **Data Management**:
   - Synchronization strategy
   - Conflict resolution
   - Cache invalidation
   - Type safety for external data

3. **User Experience**:
   - Loading states
   - Error messaging
   - Offline behavior
   - Performance impact

Provide implementation roadmap with risk mitigation strategies.
```

## Deployment Commands

### Production Deployment Review

```
I'm preparing to deploy [FEATURE/CHANGES] to production. Please review:

1. **Quality Checklist**:
   - All tests passing (unit, integration, E2E)
   - Performance benchmarks met
   - Accessibility compliance verified
   - Security review completed

2. **Business Impact Assessment**:
   - User experience impact
   - SEO implications
   - Brand consistency maintained
   - Analytics tracking in place

3. **Risk Analysis**:
   - Potential failure points
   - Rollback strategy
   - Monitoring requirements
   - User communication needs

Provide go/no-go recommendation with specific action items.
```

### Post-Deployment Monitoring

```
I've deployed [FEATURE] to production. Please help me monitor:

1. **Performance Metrics**:
   - Core Web Vitals changes
   - Page load time impact
   - Bundle size changes
   - Error rate monitoring

2. **User Experience Metrics**:
   - Conversion rate impact
   - User engagement changes
   - Accessibility compliance
   - Mobile experience validation

3. **Technical Health**:
   - Server error rates
   - API response times
   - Database performance
   - Third-party integration status

Create monitoring checklist with success criteria and alert thresholds.
```

## Troubleshooting Commands

### Bug Investigation

```
I'm experiencing [BUG_DESCRIPTION]. Please "think hard" to diagnose:

1. **Root Cause Analysis**:
   - Potential causes based on symptoms
   - Related system components
   - Recent changes that could be related

2. **Investigation Strategy**:
   - Debugging steps to isolate the issue
   - Data collection needed
   - Reproduction scenarios

3. **Solution Approaches**:
   - Immediate fixes (hotfixes)
   - Long-term solutions
   - Prevention strategies

Provide step-by-step debugging plan with expected outcomes.
```

### Performance Issue Resolution

```
Users are reporting [PERFORMANCE_ISSUE]. Please analyze:

1. **Performance Profiling**:
   - Likely bottlenecks
   - Measurement strategies
   - Benchmarking approach

2. **Optimization Strategy**:
   - Quick wins for immediate relief
   - Long-term optimization opportunities
   - Trade-off analysis

3. **Impact Assessment**:
   - User experience degradation
   - Business impact quantification
   - Priority classification

Generate action plan with timeline and success metrics.
```

## Usage Guidelines

### When to Use Each Thinking Level

- **"think"**: Standard feature implementation, bug fixes, routine tasks
- **"think hard"**: Complex components, architecture decisions, performance optimization
- **"ultrathink"**: System-wide changes, major integrations, critical business features

### Best-of-N Approach

For critical decisions, request multiple approaches:

```
Please generate 3 different solutions for [PROBLEM] and recommend the best one based on:
- Long-term maintainability
- Performance characteristics
- Development complexity
- Business value alignment
```

### Quality Assurance

Always include quality checks in your requests:

- Type safety validation
- Test coverage requirements
- Performance impact assessment
- Accessibility compliance
- Security review
