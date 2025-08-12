# Technical Setup & Configuration

## GitHub Repository

**Repository**: https://github.com/andrewlaery/snowbird-website.git **Owner**: andrewlaery
**Access**: Private repository (you'll need appropriate access)

### Repository Structure

- **Main Branch**: `main` (auto-deploys to production)
- **Default Branch**: `main`
- **Git Strategy**: Direct commits to main (simple workflow for now)

### Cloning the Repository

```bash
git clone https://github.com/andrewlaery/snowbird-website.git
cd snowbird-website
```

## Vercel Deployment

### Project Configuration

- **Project Name**: snowbird-website
- **Project ID**: prj_l2Nk6FWao9eezk3ZkGKalbo0QDQk
- **Organization**: andrewlaerys-projects
- **Organization ID**: team_lf3JNn1Vouehav9sfKsa7RTY

### Domain Configuration

- **Production Domain**: https://snowbirdhq.com
- **Primary Domain**: https://www.snowbirdhq.com
- **Domain Status**: Active with SSL certificate
- **DNS**: Managed by Vercel (ns1.vercel-dns.com, ns2.vercel-dns.com)

### Vercel CLI Setup

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel (you'll need access to andrewlaerys-projects)
vercel login

# Link to existing project
vercel link
# Follow prompts to link to existing snowbird-website project
```

### Deployment Commands

```bash
vercel               # Deploy preview
vercel --prod        # Deploy to production
vercel list          # List recent deployments
vercel domains ls    # List domains
vercel env ls        # List environment variables
```

## Environment Variables

### Required Variables

```bash
# For contact forms (not yet implemented but planned)
RESEND_API_KEY=your_resend_api_key_here
```

### Setting Environment Variables in Vercel

1. Go to Vercel dashboard → Project Settings → Environment Variables
2. Add RESEND_API_KEY when implementing contact forms
3. Available in all environments (Production, Preview, Development)

## Build Configuration

### Next.js Configuration

- **Framework**: Next.js 15.4.2
- **Build Command**: `next build` (automatic)
- **Output Directory**: `.next` (automatic)
- **Install Command**: `npm install` (automatic)
- **Development Command**: `next dev --turbopack`

### Vercel Build Settings

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## DNS and Domain Setup

### Current DNS Records

- **A Record**: Points to Vercel's edge network
- **CNAME**: www.snowbirdhq.com → cname.vercel-dns.com
- **MX Records**: Google Workspace email (configured)
- **CAA Record**: SSL certificate authority (Let's Encrypt)

### SSL Configuration

- **Provider**: Let's Encrypt (via Vercel)
- **Status**: Active and automatically renewed
- **HTTPS**: Forced (HTTP redirects to HTTPS)

## Development Environment Setup

### Prerequisites

```bash
# Node.js 18.17 or later
node --version

# npm 8 or later
npm --version

# Git
git --version
```

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/andrewlaery/snowbird-website.git
cd snowbird-website

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server locally
npm run lint         # Run ESLint
```

## CI/CD Pipeline

### Automatic Deployments

- **Trigger**: Push to any branch
- **Preview**: All branches get preview deployments
- **Production**: Only `main` branch deploys to production
- **Build Time**: ~20-30 seconds (very fast with Turbopack)
- **Deployment URL**: Unique URL for each deployment

### Build Process

1. **Install**: Dependencies installed via npm
2. **Build**: Next.js build with Turbopack optimization
3. **Lint**: ESLint checks (must pass)
4. **Deploy**: Static files + serverless functions deployed to edge
5. **DNS**: Domain automatically updates to new deployment

## Monitoring and Analytics

### Vercel Analytics

- **Web Vitals**: Automatically tracked
- **Performance**: Core Web Vitals monitoring
- **Real User Monitoring**: Available in Vercel dashboard

### Planned Analytics

- **Google Analytics 4**: To be implemented
- **Conversion Tracking**: For contact form submissions
- **Performance Monitoring**: Lighthouse scores

## Security Configuration

### HTTPS

- **Force HTTPS**: Enabled
- **HSTS**: HTTP Strict Transport Security enabled
- **SSL Rating**: A+ (excellent)

### Headers

- **X-Frame-Options**: SAMEORIGIN
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: origin-when-cross-origin

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Node.js version (need 18.17+)
2. **Domain Issues**: Verify DNS propagation (can take 24-48 hours)
3. **Deployment Issues**: Check Vercel logs in dashboard
4. **Local Dev Issues**: Clear `.next` folder and `node_modules`

### Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: Repository issue tracker
