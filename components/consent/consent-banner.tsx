"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ConsentButton } from "@/components/consent/consent-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <Card
      ref={ref}
      role="region"
      className="fixed inset-x-4 bottom-4 z-10 w-auto animate-consent-in gap-3 border border-border bg-nav p-4 text-foreground shadow-none ring-0 backdrop-blur-[5px] motion-reduce:animate-none min-[810px]:right-auto min-[810px]:w-[360px]"
      aria-labelledby="consent-banner-title"
      data-consent-banner=""
    >
      <h2 id="consent-banner-title" className="sr-only">
        Cookie consent
      </h2>
      <p className="text-sm leading-normal text-muted-foreground">
        We use cookies for analytics and ads, some set by our partners.{" "}
        <Link
          href={PRIVACY_COOKIES_HREF}
          className="text-foreground underline decoration-1 underline-offset-2"
          aria-label="Learn more about cookies"
        >
          Learn more
        </Link>
      </p>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2 max-[374.98px]:grid-cols-2">
        <ConsentButton text="Necessary only" onClick={() => choose({ statistics: false, marketing: false })} />
        <ConsentButton
          text="Accept all"
          variant="default"
          onClick={() => choose({ statistics: true, marketing: true })}
        />
        <Button
          type="button"
          variant="secondary"
          className="max-[374.98px]:col-span-2 max-[374.98px]:justify-self-start"
          onClick={() => openConsentSettings()}
        >
          Settings
        </Button>
      </div>
    </Card>
  );
}
