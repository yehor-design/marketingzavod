"use client";

import { LineAnimator, PulseGradient } from "@/components/motion";
import { CtaLink } from "@/components/ui/button";
import { cx } from "@/components/blocks/cta-band/cta-band-styles";

export type CtaBandAction = {
  href: string;
  text: string;
  variant?: "primary" | "secondary";
  location: string;
};

export type CtaBandProps = {
  title: string;
  titleId?: string;
  description?: string;
  actions: readonly CtaBandAction[];
  backgroundLabel?: string;
  /** Matches existing Jet mobile padding split between HomePage ("home") and SiteCta ("page"). */
  spacing?: "page" | "home";
  /** Allows multi-line Bulgarian headings + descriptions to grow cleanly without clipping CTA actions. */
  autoHeight?: boolean;
  className?: string;
};

export function CtaBand({
  title,
  titleId = "cta-title",
  description,
  actions,
  backgroundLabel = "Footer background",
  spacing = "page",
  autoHeight = false,
  className,
}: CtaBandProps) {
  return (
    <section
      className={cx(
        "cta",
        autoHeight && "ctaAuto",
        spacing === "home" ? "ctaHomeSpacing" : "ctaPageSpacing",
        className,
      )}
      aria-labelledby={titleId}
      data-block="cta-band"
    >
      <div className={cx("card", !autoHeight && spacing === "page" && "cardPageSpacing", autoHeight && "cardAuto")}>
        <div className={cx("media")}>
          <PulseGradient label={backgroundLabel} />
          <div className={cx("grain")} />
        </div>
        <LineAnimator />
        <div className={cx("copy")}>
          <h2 id={titleId}>{title}</h2>
          {description ? <p>{description}</p> : null}
          {actions.length === 1 ? (
            <CtaLink
              href={actions[0].href}
              text={actions[0].text}
              variant={actions[0].variant}
              location={actions[0].location}
              className="mt-[28px]"
            />
          ) : actions.length > 1 ? (
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
      </div>
    </section>
  );
}
