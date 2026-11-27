import { BG_SITE_METADATA } from "@/content/bg/metadata";
import { isBg } from "@/lib/edition";

/**
 * Canonical origin. The apex domain redirects to www on Vercel, so canonical
 * URLs point at www. Change this one value if the primary domain changes.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.marketingzavod.com").replace(
  /\/+$/,
  "",
);

export const SITE_NAME = isBg ? BG_SITE_METADATA.siteName : "Jet";

export const SITE_DESCRIPTION = isBg
  ? BG_SITE_METADATA.defaultDescription
  : "Supercharge your website with Jet. Instantly optimize images, code, and speed with no code required.";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** True only for the Vercel production deployment. Set at build time in next.config.ts. */
export const IS_PRODUCTION_DEPLOY = process.env.NEXT_PUBLIC_SITE_ENV === "production";

/**
 * Search engine indexing stays disabled everywhere (including production) until
 * explicitly turned on for launch via NEXT_PUBLIC_ALLOW_INDEXING=true.
 */
export const ALLOW_INDEXING =
  IS_PRODUCTION_DEPLOY && process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
