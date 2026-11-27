"use client";

import { useState, type ReactNode } from "react";
import { DitherImage } from "@/components/home/dither-image";
import { IlloVisual, type IlloName } from "@/components/illos";
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
      /** Animated SVG reproduction from https://illos.dev/library (DS-27 / PG-07). */
      kind: "illo";
      name: IlloName;
      alt?: string;
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
  /** "cards" = 2x2 visual cards (home); "icons" = 4-column icon row (about/principles). */
  layout?: "cards" | "icons";
  /** Variable-height cards with always-visible body copy for multi-line BG text (DS-10). */
  alwaysShowBody?: boolean;
  className?: string;
};

function FeatureCard({ item, alwaysShowBody }: { item: FeatureGridItem; alwaysShowBody: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [hot, setHot] = useState(false);

  if (alwaysShowBody) {
    return (
      <article
        className={cx("benefitAuto", hot && "benefitHot", "corner-host")}
        onPointerEnter={() => setHot(true)}
        onPointerLeave={() => setHot(false)}
        onFocus={() => setHot(true)}
        onBlur={() => setHot(false)}
      >
        <CornerMarks />
        {item.visual?.kind === "illo" ? (
          <div className={cx("benefitCustomAuto")}>
            <IlloVisual
              name={item.visual.name}
              alt={item.visual.alt}
              decorative={!item.visual.alt}
              className="max-h-full w-auto max-w-full object-contain"
            />
          </div>
        ) : null}
        {item.visual?.kind === "custom" ? (
          <div className={cx("benefitCustomAuto")}>
            {item.visual.render({ hot, reduced: reduced !== false })}
          </div>
        ) : null}
        {item.visual?.kind === "icon" ? (
          <span className={cx("benefitIconWrap", "m-0!")} aria-hidden="true">
            {item.visual.icon}
          </span>
        ) : null}
        <div className={cx("benefitCopyAuto")}>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
      </article>
    );
  }

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
      {item.visual?.kind === "illo" ? (
        <div className={cx("benefitCustom")}>
          <IlloVisual
            name={item.visual.name}
            alt={item.visual.alt}
            decorative={!item.visual.alt}
            className="max-h-full w-auto max-w-full object-contain"
          />
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
  layout = "cards",
  alwaysShowBody = false,
  className,
}: FeatureGridProps) {
  if (layout === "icons") {
    return (
      <section
        className={cx("iconSection", className)}
        id={id}
        aria-labelledby={titleId}
        data-block="feature-grid"
      >
        <div className={cx("iconFrame")}>
          <div className={cx("powersHead")}>
            <h2 id={titleId}>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <ul className={cx("powers")}>
            {items.map((item) => (
              <li key={`${item.title}-${item.body}`}>
                {item.visual?.kind === "icon" ? (
                  <span className={cx("powerIcon")}>{item.visual.icon}</span>
                ) : null}
                <p className={cx("powerTitle")}>{item.title}</p>
                <p className={cx("powerBody")}>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cx("section", className)}
      id={id}
      aria-labelledby={titleId}
      data-block="feature-grid"
    >
      <div className={cx("frame", "dash")}>
        <div className={cx(alwaysShowBody ? "bandHeadAuto" : "bandHead")}>
          <h2 id={titleId}>{title}</h2>
          {description ? <p className={cx("bandDesc")}>{description}</p> : null}
        </div>
        <div className={cx(alwaysShowBody ? "benefitGridAuto" : "benefitGrid")}>
          {items.map((item) => (
            <FeatureCard item={item} alwaysShowBody={alwaysShowBody} key={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
