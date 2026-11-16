import type { NextConfig } from "next";

/**
 * PostHog ingestion host. The browser never talks to it directly: requests go
 * to /ingest on this domain and are rewritten here. The path avoids words that
 * ad blockers match.
 */
const posthogHost = (process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com").replace(
  /\/+$/,
  "",
);
const posthogAssets = posthogHost.replace("://eu.i.", "://eu-assets.i.").replace("://us.i.", "://us-assets.i.");

const isProduction = process.env.VERCEL_ENV === "production";

const nextConfig: NextConfig = {
  // The dev server binds 0.0.0.0. Browsers that open it at 127.0.0.1 send that
  // origin on the HMR socket, and Next blocks the socket unless the host is listed.
  // Without the socket, the dev debug channel never closes and the page never hydrates.
  allowedDevOrigins: ["127.0.0.1"],

  env: {
    // Client code cannot read VERCEL_ENV. Tracking is allowed only when this is "production".
    NEXT_PUBLIC_SITE_ENV: process.env.VERCEL_ENV ?? "development",
  },

  // PostHog API paths end with a slash. Without this every event costs a 308 round trip.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: `${posthogAssets}/static/:path*` },
      { source: "/ingest/array/:path*", destination: `${posthogAssets}/array/:path*` },
      { source: "/ingest/:path*", destination: `${posthogHost}/:path*` },
    ];
  },

  async redirects() {
    // skipTrailingSlashRedirect turns off the built-in redirect, so pages keep it here.
    return [
      {
        source: "/:path((?!ingest/|api/|_next/).+)/",
        destination: "/:path",
        permanent: true,
      },
    ];
  },

  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      // Preview and development deployments stay out of search.
      ...(isProduction ? [] : [{ source: "/:path*", headers: noindex }]),
      // So does the production deployment when reached on a vercel.app address.
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: ".*\\.vercel\\.app" }],
        headers: noindex,
      },
      { source: "/dev/:path*", headers: noindex },
    ];
  },
};

export default nextConfig;
