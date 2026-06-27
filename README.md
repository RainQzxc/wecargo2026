This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment variables

Copy `.env.example` to `.env` and fill it in. Required:

- `DATABASE_URL` — Postgres connection string (runtime + Prisma CLI).
- `SESSION_SECRET` — HMAC key for the signed session cookie. **The app throws in
  production if this is unset.** Generate one with
  `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.

## Testing & checks

```bash
npm run test           # run the Vitest unit/action suite
npm run test:watch     # watch mode
npm run test:coverage   # coverage report (text + html)
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
```

Tests live under `test/` and cover the pure libraries, the auth/session/permission
layer, the DAL guards, and server actions (with a mocked Prisma client — no DB
required). CI (`.github/workflows/ci.yml`) runs lint, typecheck, test, and a
production build on every PR.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
