import type { NextConfig } from "next";
import { isBg } from "./lib/edition";

const allowIndexing =
  process.env.VERCEL_ENV === "production" &&
  process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

/** Bulgarian-only redirects populated in M8 (CR-30). Always empty in the `jet` edition. */
const bgRedirects: Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>> = [];

const nextConfig: NextConfig = {
  // The dev server binds 0.0.0.0. Browsers that open it at 127.0.0.1 send that
  // origin on the HMR socket, and Next blocks the socket unless the host is listed.
  // Without the socket, the dev debug channel never closes and the page never hydrates.
  allowedDevOrigins: ["127.0.0.1"],

  turbopack: {
    resolveAlias: {
      "@/lib/fonts/active": isBg ? "./lib/fonts/bg.ts" : "./lib/fonts/jet.ts",
    },
  },

  env: {
    // Client code cannot read VERCEL_ENV. Tracking is allowed only when this is "production".
    NEXT_PUBLIC_SITE_ENV: process.env.VERCEL_ENV ?? "development",
  },

  async redirects() {
    return isBg ? bgRedirects : [];
  },

  async headers() {
    const noindex = [
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
    ];
    return [
      // Stay out of search in every environment until NEXT_PUBLIC_ALLOW_INDEXING=true in production.
      ...(allowIndexing ? [] : [{ source: "/:path*", headers: noindex }]),
      // Never index vercel.app addresses even once production opens up.
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
