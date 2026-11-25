The marketing site for marketingzavod.com: a Next.js App Router site with a shared dark shell. On Vercel, use the Next.js preset and do not set an install command.

## Commands

```bash
npm run dev         # local server
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm test            # unit tests (Vitest)
npm run test:e2e    # end-to-end tests (Playwright, builds the site first)
npm run gtm:build   # regenerate gtm/container.json
npm run lighthouse  # Lighthouse CI against a local production build
```

## Analytics, tracking and ads

Start with [docs/analytics.md](docs/analytics.md). Event names and environment variables are in [docs/tracking-plan.md](docs/tracking-plan.md). Copy `.env.example` to `.env.local` for local work. Tracking sends data only from the production deployment unless `NEXT_PUBLIC_TRACKING_DEBUG=true`.
