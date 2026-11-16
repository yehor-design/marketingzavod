import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { careers } from "@/lib/careers";
import { legalDocuments } from "@/lib/legal";
import { absoluteUrl } from "@/lib/site";
import { updates } from "@/lib/updates";

/**
 * Every public, indexable page. /checkout and /dev/* are left out on purpose:
 * they are noindex.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["/", "/pricing", "/about", "/blog", "/updates", "/careers", "/contact", "/waitlist"];

  return [
    ...staticPages.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.dateTime),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...updates.map((note) => ({
      url: absoluteUrl(`/updates/${note.slug}`),
      lastModified: new Date(note.dateTime),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...careers.map((role) => ({
      url: absoluteUrl(`/careers/${role.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...legalDocuments.map((document) => ({
      url: absoluteUrl(`/legal/${document.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
