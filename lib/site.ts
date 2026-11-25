/**
 * Canonical origin. The apex domain redirects to www on Vercel, so canonical
 * URLs point at www. Change this one value if the primary domain changes.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.marketingzavod.com").replace(
  /\/+$/,
  "",
);

export const SITE_NAME = "Jet";

export const SITE_DESCRIPTION =
  "Supercharge your website with Jet. Instantly optimize images, code, and speed with no code required.";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** True only for the Vercel production deployment. Set at build time in next.config.ts. */
export const IS_PRODUCTION_DEPLOY = process.env.NEXT_PUBLIC_SITE_ENV === "production";
