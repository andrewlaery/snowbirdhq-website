# Snowbird Website - Vercel Deployment Configuration

## Domain Configuration

- **Production Domain**: www.snowbirdhq.com
- **Domain Status**: Already owned and configured in Vercel account
- **SSL**: Automatically provisioned by Vercel

## Deployment Settings

### Build Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Environment Variables

```
RESEND_API_KEY=your_resend_api_key_here
```

## Deployment Steps

1. **Connect Repository**
   - Link GitHub repository to Vercel project
   - Select `snowbird-website` directory as root

2. **Configure Domain**
   - Domain (www.snowbirdhq.com) is already configured in your Vercel account
   - Vercel will automatically handle SSL certificates

3. **Set Environment Variables**
   - Add RESEND_API_KEY for email functionality
   - Add any other required environment variables

4. **Deploy**
   - Push to main branch triggers automatic deployment
   - Preview deployments created for all pull requests

## Post-Deployment Checklist

- [ ] Verify domain is properly connected
- [ ] Test contact forms
- [ ] Check all pages load correctly
- [ ] Verify mobile responsiveness
- [ ] Test email notifications
