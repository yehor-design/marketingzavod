"use client";

import { CtaLink } from "@/components/ui/button";
import { cx } from "@/components/blocks/pilot-banner/pilot-banner-styles";

export type PilotBannerProps = {
  id?: string;
  eyebrow?: string;
  text: string;
  ctaLabel: string;
  href?: string;
  location?: string;
  variant?: "primary" | "secondary" | "tertiary";
  ariaLabel?: string;
  className?: string;
};

export function PilotBanner({
  id,
  eyebrow,
  text,
  ctaLabel,
  href = "/keysi",
  location = "home_pilot_banner",
  variant = "primary",
  ariaLabel,
  className,
}: PilotBannerProps) {
  return (
    <section
      id={id}
      className={cx("section", className)}
      aria-label={ariaLabel}
      data-block="pilot-banner"
    >
      <div className={cx("frame", "dash")}>
        <div className={cx("inner")}>
          <div className={cx("copy")}>
            {eyebrow ? <p className={cx("eyebrow")}>{eyebrow}</p> : null}
            <p className={cx("text")}>{text}</p>
          </div>
          <div className={cx("action")}>
            <CtaLink href={href} text={ctaLabel} variant={variant} location={location} />
          </div>
        </div>
      </div>
    </section>
  );
}
