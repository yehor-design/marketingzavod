"use client";

import { LineAnimator, PulseGradient } from "@/components/motion";
import { CtaLink } from "@/components/ui/button";
import styles from "@/components/site-cta-styles";

const NBSP = "\u00A0";

/** Homepage footer CTA, reused on every other page that closes with this block. */
export function SiteCta({ titleId = "site-cta" }: { titleId?: string }) {
  return (
    <section className={styles.cta} aria-labelledby={titleId}>
      <div className={styles.card}>
        <div className={styles.media}>
          <PulseGradient label="Footer background" />
          <div className={styles.grain} />
        </div>
        <LineAnimator />
        <div className={styles.copy}>
          <h2 id={titleId}>Boost your site speed today.</h2>
          <p>Try Jet now—one click, instant performance. No risk, cancel anytime.</p>
          <CtaLink
            href="/waitlist"
            text={`Join${NBSP}waitlist`}
            location="footer_cta"
            className="mt-[28px]"
          />
        </div>
      </div>
    </section>
  );
}
