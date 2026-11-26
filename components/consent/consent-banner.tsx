"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ConsentButton } from "@/components/consent/consent-button";
import { ui } from "@/content/ui";
import { openConsentSettings, saveConsent, type ConsentChoice } from "@/lib/consent";
import { useConsent } from "@/lib/consent/use-consent";
import { CONSENT_UI_ENABLED } from "@/lib/tracking/env";

export const PRIVACY_COOKIES_HREF = ui.consent.cookiesHref;

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
  const ref = useRef<HTMLDivElement>(null);

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
    <div
      ref={ref}
      role="region"
      className="fixed bottom-[16px] left-[16px] z-10 flex w-auto animate-consent-in flex-col gap-[10px] rounded-field border border-border bg-nav p-[12px] text-foreground backdrop-blur-[5px] motion-reduce:animate-none max-[809.98px]:right-[16px] min-[810px]:w-[360px]"
      aria-labelledby="consent-banner-title"
      data-consent-banner=""
    >
      <h2 id="consent-banner-title" className="sr-only">
        {ui.consent.bannerTitleSr}
      </h2>
      <p className="m-0 font-display text-[12px] leading-[1.6] font-[1000] tracking-normal text-muted-foreground [font-variation-settings:'opsz'_14,'wght'_450]">
        {ui.consent.bannerText}{" "}
        <Link
          href={PRIVACY_COOKIES_HREF}
          className="text-foreground underline decoration-1 underline-offset-2"
          aria-label={ui.consent.learnMoreAria}
        >
          {ui.consent.learnMore}
        </Link>
      </p>
      <div className="flex flex-wrap items-center gap-[8px]">
        <ConsentButton
          text={ui.consent.necessaryOnly}
          variant="tertiary"
          onClick={() => choose({ statistics: false, marketing: false })}
        />
        <ConsentButton
          text={ui.consent.acceptAll}
          variant="primary"
          onClick={() => choose({ statistics: true, marketing: true })}
        />
        <ConsentButton text={ui.consent.settings} onClick={() => openConsentSettings()} />
      </div>
    </div>
  );
}
