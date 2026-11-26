"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { DitherImage } from "@/components/home/dither-image";
import { orderedDither } from "@/components/motion";
import { cx } from "@/components/blocks/feature-section/feature-section-styles";

export type FeatureSectionVisual =
  | {
      kind: "dither";
      src: string;
      label: string;
    }
  | {
      /** Animated SVG/React illustration from illos.dev/library (DS-27 / ZAV-65). */
      kind: "custom";
      render: () => ReactNode;
    };

export type FeatureSectionProps = {
  id?: string;
  eyebrow?: string;
  accentColor?: string;
  title: string;
  body?: ReactNode;
  points?: readonly ReactNode[];
  link?: { href: string; label: string };
  visual?: FeatureSectionVisual;
  flip?: boolean;
  /** When true, renders the row article directly inside a parent framed section. */
  embedded?: boolean;
  className?: string;
};

function CheckIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true" className={cx("check")}>
      <g
        transform="translate(6.5 8) rotate(180 5.75 4)"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0 8 L7.784 0" />
        <path d="M1.773 0 H8 V6.4" />
      </g>
    </svg>
  );
}

export function FeatureSection({
  id,
  eyebrow,
  accentColor = "var(--color-brand)",
  title,
  body,
  points,
  link,
  visual,
  flip = false,
  embedded = false,
  className,
}: FeatureSectionProps) {
  const hasVisual = visual !== undefined;
  const articleClass = hasVisual
    ? cx(flip ? "featureFlip" : "feature", id && "anchored", embedded && className)
    : cx("featureNoArt", id && "anchored", embedded && className);

  const article = (
    <article
      className={articleClass}
      id={embedded ? id : undefined}
      data-block={embedded ? "feature-section" : undefined}
    >
      <div className={cx("featureCopy")}>
        {eyebrow ? (
          <p className={cx("eyebrow")} style={{ color: accentColor }}>
            {eyebrow}
          </p>
        ) : null}
        <h2>{title}</h2>
        {body ? (
          <p className={cx("featureBody", !hasVisual && "featureBodyWide")}>{body}</p>
        ) : null}
        {points && points.length > 0 ? (
          <ul className={cx("checks")}>
            {points.map((point, index) => (
              <li key={typeof point === "string" ? point : index}>
                <CheckIcon color={accentColor} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {link ? (
          <Link href={link.href} className={cx("link")}>
            {link.label}
          </Link>
        ) : null}
      </div>
      {hasVisual ? (
        <div className={cx("featureArt")}>
          <div className={cx("featureDots")} aria-hidden="true" />
          {visual.kind === "dither" ? (
            <div className={cx("featureFrame")}>
              <DitherImage
                src={visual.src}
                label={visual.label}
                preset={{ ...orderedDither, animation: false }}
              />
            </div>
          ) : (
            <div className={cx("featureCustomFrame")}>{visual.render()}</div>
          )}
        </div>
      ) : null}
    </article>
  );

  if (embedded) {
    return article;
  }

  return (
    <section
      className={cx("section", id && "anchored", className)}
      id={id}
      data-block="feature-section"
    >
      <div className={cx("frame", "dash")}>{article}</div>
    </section>
  );
}
