The marketing site for marketingzavod.com: a Next.js App Router site with a shared dark shell and [shadcn/ui](https://github.com/shadcn-ui/ui) (`base-nova` / Base UI) components in `components/ui/`. On Vercel, use the Next.js preset and do not set an install command.

## Commands

```bash
npm run dev         # local server
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm test            # unit tests (Vitest)
npm run test:e2e    # end-to-end tests (Playwright, builds the site first)
npm run test:visual # visual regression baselines at 390 / 1024 / 1440 px
npm run gtm:build   # regenerate gtm/container.json
npm run lighthouse  # Lighthouse CI against a local production build
```

## Site editions (`bg` / `jet`)

Each build produces a single site edition controlled by `NEXT_PUBLIC_SITE_EDITION` (`bg` by default, or `jet`). Only `lib/edition.ts` reads the variable, and any unknown value fails the build.

```bash
npm run dev                                              # bg (default)
NEXT_PUBLIC_SITE_EDITION=jet npm run dev                 # legacy jet edition locally
npm run test:e2e                                         # bg E2E suite (default)
NEXT_PUBLIC_SITE_EDITION=jet npm run test:e2e            # jet E2E suite
```

## Visual regression tests

Visual baselines for the English (`jet`) edition live in `tests/visual/__snapshots__/{platform}/` and are verified with `maxDiffPixelRatio: 0.001` at `390`, `1024`, and `1440` px widths (reduced motion, frozen clock, canvas/video masks):

```bash
npm run test:visual
```

Updating baselines is allowed **only after explicit approval from Yehor**. Because Linux (`ubuntu-latest` CI) and macOS render fonts differently, regenerate Linux baselines inside a matching Linux environment (for example, the official Playwright Linux image or from the CI `visual-regression-diffs` artifact):

```bash
npx playwright test --config playwright.visual.config.ts --update-snapshots
```

## Analytics, tracking and ads

Start with [docs/analytics.md](docs/analytics.md). Event names and environment variables are in [docs/tracking-plan.md](docs/tracking-plan.md). Copy `.env.example` to `.env.local` for local work. Tracking sends data only from the production deployment unless `NEXT_PUBLIC_TRACKING_DEBUG=true`.
