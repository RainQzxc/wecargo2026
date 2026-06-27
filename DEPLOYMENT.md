# Deploying WECARGO to Vercel

This app is a standard Next.js 16 project with Prisma (Postgres via a driver
adapter). Deploy by connecting the GitHub repo to Vercel — every push to the
production branch then deploys automatically.

## One-time setup

1. **Import the repo in Vercel** — Vercel dashboard → *Add New… → Project* →
   import `RainQzxc/wecargo2026`. The Next.js framework preset is detected
   automatically; no `vercel.json` is needed.

2. **Provision a Postgres database** — Vercel Postgres, Neon, Supabase, or any
   Postgres. Copy its connection string.

3. **Set Environment Variables** (Project → Settings → Environment Variables),
   for Production (and Preview if you want PR deploys):

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | your Postgres connection string |
   | `SESSION_SECRET` | a strong random string — `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |

   The app **throws on boot in production if `SESSION_SECRET` is unset** — this
   is intentional.

4. **Create the database schema.** This repo uses Prisma's `db push` (no
   migration history). Run once against the production database, from a machine
   with `DATABASE_URL` pointing at it:

   ```bash
   npm run db:push     # syncs prisma/schema.prisma -> the database
   npm run db:seed     # optional: seed the initial super-admin + warehouses
   ```

   Re-run `db:push` after any schema change (e.g. the SiteContent model). If you
   later adopt migration history, switch to `prisma migrate deploy` in the build.

## Build

Vercel runs `npm install` (which triggers `postinstall: prisma generate`) then
`next build`. No custom build command is required.

## Notes

- `prisma generate` needs network access to fetch the client during install —
  available in Vercel's build environment.
- Serverless: the Prisma client is memoized on `globalThis` in non-production and
  created per-instance in production (`src/server/db.ts`). For heavy traffic put
  a pooler (PgBouncer / Vercel Postgres pooling) in front and use the pooled URL.
- CI (`.github/workflows/ci.yml`) runs lint, typecheck, test, and a production
  build on every PR before anything reaches Vercel.
