"use client";

import { useState, type ReactNode } from "react";
import { DitherImage } from "@/components/home/dither-image";
import { nestedDither, randomDither } from "@/components/motion";
import { CornerMarks } from "@/components/motion/corner-marks";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";
import { cx } from "@/components/blocks/feature-grid/feature-grid-styles";

export type FeatureGridVisual =
  | {
      kind: "dither";
      src: string;
      color: string;
      label: string;
    }
  | {
      /** Animated SVG/React illustration from illos.dev/library (DS-27 / ZAV-65). */
      kind: "custom";
      render: (state: { hot: boolean; reduced: boolean }) => ReactNode;
    }
  | {
      kind: "icon";
      icon: ReactNode;
    };

export type FeatureGridItem = {
  title: string;
  body: string;
  visual?: FeatureGridVisual;
};

export type FeatureGridProps = {
  id?: string;
  titleId?: string;
  title: string;
  description?: string;
  items: readonly FeatureGridItem[];
  className?: string;
};

function FeatureCard({ item }: { item: FeatureGridItem }) {
  const reduced = usePrefersReducedMotion();
  const [hot, setHot] = useState(false);

  return (
    <article
      className={cx("benefit", hot && "benefitHot", "corner-host")}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
    >
      <CornerMarks />
      {item.visual?.kind === "dither" ? (
        <div className={cx("benefitField")}>
          {hot && reduced === false ? (
            <div className={cx("benefitOrdered")}>
              <DitherImage src={item.visual.src} label={item.visual.label} preset={nestedDither} />
            </div>
          ) : null}
          <div className={cx("benefitAccent")}>
            <DitherImage
              src={item.visual.src}
              label={item.visual.label}
              preset={
                hot && reduced === false
                  ? { ...randomDither, animation: true, intensity: 5, interval: 0.2, dot: item.visual.color }
                  : { ...randomDither, dot: item.visual.color }
              }
            />
          </div>
        </div>
      ) : null}
      {item.visual?.kind === "custom" ? (
        <div className={cx("benefitCustom")}>
          {item.visual.render({ hot, reduced: reduced !== false })}
        </div>
      ) : null}
      {item.visual?.kind === "icon" ? (
        <span className={cx("benefitIconWrap")} aria-hidden="true">
          {item.visual.icon}
        </span>
      ) : null}
      <div className={cx("benefitCopy")}>
        <h3>{item.title}</h3>
        <div className={cx("benefitReveal")}>
          <p>{item.body}</p>
        </div>
      </div>
    </article>
  );
}

export function FeatureGrid({
  id,
  titleId = "feature-grid-title",
  title,
  description,
  items,
  className,
}: FeatureGridProps) {
  return (
    <section
      className={cx("section", className)}
      id={id}
      aria-labelledby={titleId}
      data-block="feature-grid"
    >
      <div className={cx("frame", "dash")}>
        <div className={cx("bandHead")}>
          <h2 id={titleId}>{title}</h2>
          {description ? <p className={cx("bandDesc")}>{description}</p> : null}
        </div>
        <div className={cx("benefitGrid")}>
          {items.map((item) => (
            <FeatureCard item={item} key={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
