import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

/**
 * Page metadata with a canonical URL, Open Graph and Twitter tags. Paths are
 * relative: metadataBase in the root layout turns them into absolute URLs.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  index = true,
  publishedTime,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  index?: boolean;
  publishedTime?: string;
}): Metadata {
  const images = image ? [{ url: image }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description,
      url: path,
      locale: "en_US",
      ...(images ? { images } : {}),
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    ...(index ? {} : { robots: { index: false, follow: false } }),
  };
}
