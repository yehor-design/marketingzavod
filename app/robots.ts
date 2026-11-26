import type { MetadataRoute } from "next";
import { ALLOW_INDEXING, absoluteUrl } from "@/lib/site";

/** Blocks all crawlers until production indexing is explicitly enabled. */
export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/dev/", "/checkout"] },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
