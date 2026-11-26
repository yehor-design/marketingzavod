"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { DitherImage } from "@/components/home/dither-image";
import { RollingText, orderedDither } from "@/components/motion";
import { CornerMarks } from "@/components/motion/corner-marks";
import { Badge } from "@/components/ui/badge";
import { cx } from "@/components/blocks/posts-preview/posts-preview-styles";

const postDither = {
  ...orderedDither,
  animation: false,
  brightness: -46,
  pixelSize: 2,
  threshold: 116,
  midtones: 56,
  glow: 2,
};

const postHoverDither = {
  ...postDither,
  animation: true,
};

export type PostsPreviewVisual =
  | { kind: "dither"; src: string }
  | {
      /** Animated SVG/React illustration from illos.dev/library (DS-27 / ZAV-65). */
      kind: "custom";
      render: (state: { hot: boolean }) => ReactNode;
    };

export type PostsPreviewItem = {
  href: string;
  tag: string;
  title: string;
  date: string;
  visual?: PostsPreviewVisual;
};

export type PostsPreviewProps = {
  id?: string;
  titleId?: string;
  title: string;
  viewAll?: { href: string; label: string };
  posts: readonly PostsPreviewItem[];
  className?: string;
};

function PreviewCard({ post }: { post: PostsPreviewItem }) {
  const [hot, setHot] = useState(false);

  return (
    <Link
      href={post.href}
      className="corner-host"
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
    >
      <CornerMarks />
      {post.visual?.kind === "dither" ? (
        <span className={cx("postArt")} aria-hidden="true">
          <DitherImage src={post.visual.src} label="" preset={hot ? postHoverDither : postDither} />
        </span>
      ) : post.visual?.kind === "custom" ? (
        <span className={cx("postArt")} aria-hidden="true">
          {post.visual.render({ hot })}
        </span>
      ) : null}
      <span className={cx("postCopy")}>
        <Badge variant="secondary" className={cx("tag")}>
          {post.tag}
        </Badge>
        <h3>{post.title}</h3>
        <span className={cx("date")}>{post.date}</span>
      </span>
    </Link>
  );
}

function ViewAllLink({ href, label }: { href: string; label: string }) {
  const [rolling, setRolling] = useState(false);

  return (
    <Link
      href={href}
      className={cx("viewAll")}
      onPointerEnter={() => setRolling(true)}
      onPointerLeave={() => setRolling(false)}
      onFocus={() => setRolling(true)}
      onBlur={() => setRolling(false)}
    >
      <RollingText text={label} rolling={rolling} fontSize={12} />
      <span className={cx("viewIcon")} aria-hidden="true">
        <svg viewBox="0 0 12 12" width="12" height="12">
          <path
            d="M4.2 2.2 L7.8 6 L4.2 9.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}

export function PostsPreview({
  id,
  titleId = "posts-title",
  title,
  viewAll,
  posts,
  className,
}: PostsPreviewProps) {
  return (
    <section
      className={cx("block", className)}
      id={id}
      aria-labelledby={titleId}
      data-block="posts-preview"
    >
      <div className={cx("frame")}>
        <div className={cx("postsHead")}>
          <h2 id={titleId}>{title}</h2>
          {viewAll ? <ViewAllLink href={viewAll.href} label={viewAll.label} /> : null}
        </div>
        <ul className={cx("posts")}>
          {posts.map((post) => (
            <li key={post.href}>
              <PreviewCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
