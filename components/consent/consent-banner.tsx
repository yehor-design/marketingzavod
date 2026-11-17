"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ConsentButton } from "@/components/consent/consent-button";
import styles from "@/components/consent/consent.module.css";
import { openConsentSettings, saveConsent, type ConsentChoice } from "@/lib/consent";
import { useConsent } from "@/lib/consent/use-consent";
import { CONSENT_UI_ENABLED } from "@/lib/tracking/env";

export const PRIVACY_COOKIES_HREF = "/legal/privacy-policy#cookies";

/**
 * After a choice the banner disappears. If it held the focus, the focus moves
 * to the page content instead of falling back to the top of the document.
 */
function moveFocusOut(banner: HTMLElement | null) {
  if (!banner || !banner.contains(document.activeElement)) {
    return;
  }
  const main = document.querySelector<HTMLElement>("main");
  if (main) {
    main.tabIndex = -1;
    main.focus({ preventScroll: true });
  } else {
    (document.activeElement as HTMLElement | null)?.blur();
  }
}

/**
 * The first layer of the consent banner. It sits in a corner, blocks nothing
 * and has no close button: the visitor either accepts everything or keeps
 * only what is necessary, in one click each. "Settings" opens the second
 * layer with a switch per category. Rendered after hydration only,
 * because the server does not know the visitor's choice.
 */
export function ConsentBanner() {
  const consent = useConsent();
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!CONSENT_UI_ENABLED || !hydrated || consent.answered) {
    return null;
  }

  const choose = (choice: ConsentChoice) => {
    moveFocusOut(ref.current);
    saveConsent(choice, "banner");
  };

  return (
    <section ref={ref} className={styles.banner} aria-labelledby="consent-banner-title" data-consent-banner="">
      <h2 id="consent-banner-title" className="visually-hidden">
        Cookie consent
      </h2>
      <p className={styles.text}>
        We use cookies for analytics and ads, some set by our partners.{" "}
        <Link href={PRIVACY_COOKIES_HREF} className={styles.link} aria-label="Learn more about cookies">
          Learn more
        </Link>
      </p>
      <div className={styles.actions}>
        <ConsentButton text="Necessary only" onClick={() => choose({ statistics: false, marketing: false })} />
        <ConsentButton text="Accept all" onClick={() => choose({ statistics: true, marketing: true })} />
        <button type="button" className={styles.textButton} onClick={() => openConsentSettings()}>
          Settings
        </button>
      </div>
    </section>
  );
}
