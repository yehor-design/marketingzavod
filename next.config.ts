import type { NextConfig } from "next";

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
