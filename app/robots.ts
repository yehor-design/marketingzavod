import type { MetadataRoute } from "next";
import { IS_PRODUCTION_DEPLOY, absoluteUrl } from "@/lib/site";

/** Production allows crawling. Preview and local builds forbid it entirely. */
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_DEPLOY) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/dev/", "/checkout"] },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
