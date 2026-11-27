import type { Metadata } from "next";
import {
  BG_ROUTE_METADATA,
  BG_SITE_METADATA,
  isBgRouteIndexable,
  stripBgTitleSuffix,
  type BgMetadataRouteKey,
  type BgRouteMetadataEntry,
} from "@/content/bg/metadata";
import { isBg } from "@/lib/edition";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

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
      locale: isBg ? BG_SITE_METADATA.locale : "en_US",
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

/**
 * Builds Bulgarian edition page metadata strictly from docs/site-texts/30-metadani-saytu.md
 * (CR-18…CR-20, CR-23, CR-50).
 */
export function bgPageMetadata(
  route: BgMetadataRouteKey,
  options?: {
    /** Article H1 override for og:title / twitter:title (CR-20). */
    ogTitle?: string;
    image?: string;
    type?: "website" | "article";
    publishedTime?: string;
    index?: boolean;
  },
): Metadata {
  const entry: BgRouteMetadataEntry = BG_ROUTE_METADATA[route];
  const description = entry.description ?? BG_SITE_METADATA.defaultDescription;
  const type = options?.type ?? entry.type ?? "website";
  const ogTitle =
    options?.ogTitle ?? entry.ogTitle ?? stripBgTitleSuffix(entry.title);
  const ogDescription = entry.ogDescription ?? description;
  const canonicalUrl = entry.path ? absoluteUrl(entry.path) : undefined;
  const images = options?.image ? [{ url: options.image }] : undefined;
  const indexable = (options?.index ?? true) && isBgRouteIndexable(route);

  return {
    title: { absolute: entry.title },
    description,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      type,
      siteName: BG_SITE_METADATA.siteName,
      title: ogTitle,
      description: ogDescription,
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      locale: BG_SITE_METADATA.locale,
      ...(images ? { images } : {}),
      ...(type === "article" && options?.publishedTime
        ? { publishedTime: options.publishedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      ...(options?.image ? { images: [options.image] } : {}),
    },
    ...(indexable ? {} : { robots: { index: false, follow: false } }),
  };
}

export { isBgRouteIndexable, stripBgTitleSuffix, type BgMetadataRouteKey };
