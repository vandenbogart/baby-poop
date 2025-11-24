# Baby Tracker

A mobile-first Progressive Web App (PWA) for tracking your baby's poops, pees, and wake times. Built with Next.js, TypeScript, Tailwind CSS, and Vercel Postgres.

## Features

- **Quick Log**: Large, touch-friendly buttons for logging events
- **Timeline View**: See all events chronologically with date grouping
- **Today's Summary**: Quick stats for today's activities
- **Patterns & Insights**: Analyze patterns over 3, 7, 14, or 30 days
- **Mobile-First Design**: Optimized for phone screens with responsive layout
- **PWA Support**: Install on your phone for a native app experience
- **Dark Mode**: Automatically adapts to system preferences

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS v4
- Prisma ORM
- Vercel Postgres
- Progressive Web App (PWA)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:

```env
POSTGRES_PRISMA_URL="your_postgres_prisma_url"
POSTGRES_URL_NON_POOLING="your_postgres_url_non_pooling"
```

4. Generate Prisma Client:

```bash
npx prisma generate
```

5. Run Prisma migration (requires a running PostgreSQL database):

```bash
npx prisma migrate dev --name init
```

Note: You'll need a PostgreSQL database running locally or use the connection string from Vercel Postgres.

6. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deploying to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add a Vercel Postgres database:
   - Go to the Storage tab in your Vercel project
   - Click "Create Database" and select "Postgres"
   - Vercel will automatically set the environment variables
4. Deploy!

After deployment, run the Prisma migration in your Vercel project:

```bash
npx prisma migrate deploy
```

## Database Schema

The app uses a single `Event` table:

- `id`: Unique identifier
- `type`: Event type (POOP, PEE, WAKE)
- `timestamp`: When the event occurred
- `notes`: Optional notes
- `createdAt`: When the event was logged

## Project Structure

```
/app
  /api/events        # API routes for CRUD operations
  /patterns          # Patterns and insights page
  page.tsx           # Main quick log page
/components          # Reusable UI components
/lib                 # Database client and utilities
/prisma              # Database schema
/public              # Static assets and PWA manifest
```

## License

MIT
