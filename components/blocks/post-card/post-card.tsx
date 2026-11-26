"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { DitherImage } from "@/components/home/dither-image";
import { orderedDither } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { cx } from "@/components/blocks/post-card/post-card-styles";

const coverDither = {
  ...orderedDither,
  animation: false,
  brightness: -46,
  pixelSize: 2,
  threshold: 116,
  midtones: 56,
  glow: 2,
};

export type CoverVisual =
  | {
      kind: "dither";
      src: string;
      label: string;
      pixelSize?: number;
    }
  | {
      kind: "custom";
      render: (props: { hot: boolean }) => ReactNode;
    };

export type PostCardItem = {
  href: string;
  category: string;
  title: string;
  description?: string;
  date: string;
  dateTime: string;
  cover?: CoverVisual | null;
};

export type CoverImageProps = {
  visual?: CoverVisual;
  src?: string;
  label?: string;
  decorative?: boolean;
  pixelSize?: number;
  hot?: boolean;
  className?: string;
};

export function CoverImage({
  visual,
  src,
  label = "",
  decorative = false,
  pixelSize = coverDither.pixelSize,
  hot = false,
  className,
}: CoverImageProps) {
  if (visual?.kind === "custom") {
    return (
      <span className={cx("art", className)} aria-hidden={decorative || undefined}>
        {visual.render({ hot })}
      </span>
    );
  }

  const imageSrc = visual?.kind === "dither" ? visual.src : src;
  const imageLabel = visual?.kind === "dither" ? visual.label : label;
  const effectivePixelSize =
    visual?.kind === "dither" && visual.pixelSize !== undefined ? visual.pixelSize : pixelSize;

  if (!imageSrc) {
    return null;
  }

  return (
    <span className={cx("art", className)} aria-hidden={decorative || undefined}>
      <DitherImage
        src={imageSrc}
        label={decorative ? "" : imageLabel}
        preset={{
          ...coverDither,
          pixelSize: effectivePixelSize,
          animation: hot,
          intensity: 10,
          interval: 0.08,
        }}
      />
    </span>
  );
}

export type PostCardProps = {
  item: PostCardItem;
  variant: "feature" | "small";
  className?: string;
};

export function PostCard({ item, variant, className }: PostCardProps) {
  const [hot, setHot] = useState(false);

  return (
    <Link
      href={item.href}
      className={cx(variant === "feature" ? "feature" : "small", className)}
      data-block="post-card"
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
    >
      {item.cover ? (
        <CoverImage
          visual={item.cover}
          decorative
          pixelSize={variant === "feature" ? 1 : 2}
          hot={hot}
        />
      ) : null}
      <span className={cx("copy")}>
        <span className={cx("tagRow")}>
          <Badge variant="secondary">{item.category}</Badge>
        </span>
        <span className={cx("text")}>
          <h3>{item.title}</h3>
          {variant === "feature" && item.description ? (
            <p className={cx("desc")}>{item.description}</p>
          ) : null}
        </span>
        <time className={cx("date")} dateTime={item.dateTime}>
          {item.date}
        </time>
      </span>
    </Link>
  );
}
