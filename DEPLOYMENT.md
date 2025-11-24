# Deployment Guide

This guide will help you deploy the Baby Tracker app to Vercel with Postgres.

## Prerequisites

- A GitHub account
- A Vercel account (sign up at https://vercel.com)
- Git installed locally

## Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/baby-tracker.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect Next.js settings

## Step 3: Add Vercel Postgres Database

1. After importing, go to your project dashboard
2. Click on the "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Give your database a name (e.g., "baby-tracker-db")
6. Select a region (choose one close to your users)
7. Click "Create"

Vercel will automatically add these environment variables to your project:
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- And several others

## Step 4: Run Database Migration

After the database is created and connected:

1. Go to your project settings
2. Navigate to the "Deployments" tab
3. Find your latest deployment and click the three dots menu
4. Select "Redeploy"

OR use Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link your project
vercel link

# Run migration
vercel env pull .env.local
npx prisma migrate deploy
```

## Step 5: Access Your App

Your app will be available at:
```
https://your-project-name.vercel.app
```

## Optional: Custom Domain

1. Go to project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Updating the App

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically deploy your changes.

## Troubleshooting

### Database Connection Issues

If you see database connection errors:
1. Check that environment variables are set in Vercel
2. Verify database is in the same region as your deployment
3. Run `npx prisma migrate deploy` to ensure schema is up to date

### Build Failures

If the build fails:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Try building locally first: `npm run build`

### PWA Not Working

The manifest.json is configured but you'll need actual icon files:
1. Create 192x192 and 512x512 PNG icons
2. Save them as `public/icon-192.png` and `public/icon-512.png`
3. Use a tool like https://realfavicongenerator.net/ to generate icons

## Environment Variables Reference

Required for production:
- `POSTGRES_PRISMA_URL` - Automatically set by Vercel Postgres
- `POSTGRES_URL_NON_POOLING` - Automatically set by Vercel Postgres

## Monitoring

Monitor your app's performance:
1. Go to Vercel dashboard
2. Check Analytics tab for usage stats
3. Monitor Speed Insights for performance
4. Check Logs for errors

## Support

For issues:
- Vercel docs: https://vercel.com/docs
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
