"use client";

import type { ReactNode } from "react";
import { PulseGradient } from "@/components/motion";
import { CtaLink } from "@/components/ui/button";
import { cx } from "@/components/blocks/hero/hero-styles";

export type HeroAction = {
  href: string;
  text: string;
  variant?: "primary" | "secondary";
  location: string;
};

export type HeroProps = {
  variant?: "animated" | "static";
  title: string;
  titleId?: string;
  headingAs?: "h1" | "h2";
  eyebrow?: string;
  description?: string;
  announcement?: ReactNode;
  actions?: readonly HeroAction[];
  backgroundLabel?: string;
  className?: string;
};

export function Hero({
  variant = "animated",
  title,
  titleId = "hero-title",
  headingAs = "h1",
  eyebrow,
  description,
  announcement,
  actions,
  backgroundLabel = "Hero background",
  className,
}: HeroProps) {
  const Heading = headingAs;
  const animated = variant === "animated";

  return (
    <section
      className={cx(animated ? "hero" : "staticHero", className)}
      aria-labelledby={titleId}
      data-block="hero"
    >
      <div className={cx("frame", "dash", animated ? "heroFrame" : "staticFrame")}>
        {animated ? (
          <div className={cx("heroVeil")}>
            <div className={cx("heroMedia")}>
              <div className={cx("heroShafts")}>
                <div className={cx("heroGlow")}>
                  <PulseGradient label={backgroundLabel} />
                  <div className={cx("grain")} />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {announcement}
        <div className={cx("heroCopy")}>
          {eyebrow ? <p className={cx("eyebrow")}>{eyebrow}</p> : null}
          <Heading id={titleId}>{title}</Heading>
          {description ? <p className={cx("heroDesc")}>{description}</p> : null}
        </div>
        {actions && actions.length > 0 ? (
          <div className={cx("actions")}>
            {actions.map((action) => (
              <CtaLink
                key={`${action.href}-${action.text}`}
                href={action.href}
                text={action.text}
                variant={action.variant}
                location={action.location}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
