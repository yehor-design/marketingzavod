"use client";

import {
  CoverImage as BlockCoverImage,
  PostCard as BlockPostCard,
  type PostCardItem,
} from "@/components/blocks/post-card";
import type { Post } from "@/lib/blog";

export function postToCardItem(post: Post): PostCardItem {
  return {
    href: `/blog/${post.slug}`,
    category: post.category,
    title: post.title,
    description: post.description,
    date: post.date,
    dateTime: post.dateTime,
    cover: {
      kind: "dither",
      src: post.image,
      label: post.imageAlt,
    },
  };
}

export function CoverImage({
  src,
  label,
  decorative = false,
  pixelSize,
  hot = false,
}: {
  src: string;
  label: string;
  decorative?: boolean;
  pixelSize?: number;
  hot?: boolean;
}) {
  return (
    <BlockCoverImage
      src={src}
      label={label}
      decorative={decorative}
      pixelSize={pixelSize}
      hot={hot}
    />
  );
}

export function PostCard({
  post,
  variant,
}: {
  post: Post;
  variant: "feature" | "small";
}) {
  return <BlockPostCard item={postToCardItem(post)} variant={variant} />;
}
