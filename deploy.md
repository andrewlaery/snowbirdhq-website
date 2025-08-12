# Deployment Instructions

## Current Issue

The local development version is rendering correctly, but the deployed version at snowbirdhq.com is
missing styles.

## Solution Steps

### 1. Verify Current Build

The build is working correctly locally with all Tailwind styles properly generated.

### 2. Check Deployment

If you're using Vercel:

1. Go to your Vercel dashboard
2. Find the snowbirdhq project
3. Check the latest deployment
4. If needed, trigger a new deployment

### 3. Force Redeploy

If the deployment is stuck on an old version:

```bash
# If using Vercel CLI
vercel --prod --force

# Or trigger redeploy from Vercel dashboard
```

### 4. Check Domain Configuration

Ensure snowbirdhq.com is pointing to the correct Vercel deployment.

## Build Verification

The current build generates:

- CSS file with Snowbird brand colors (#B5D3D7)
- All Tailwind classes are properly included
- Static generation working correctly
- No build errors or warnings

## Next Steps

1. Connect this repository to Vercel (if not already connected)
2. Set up automatic deployments from the main branch
3. Ensure domain is pointing to the correct deployment
