"use client";

import { useEffect, useId, useRef, useState } from "react";
import { XIcon } from "lucide-react";
import { ConsentButton } from "@/components/consent/consent-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { getConsent, onOpenConsentSettings, saveConsent, type ConsentChoice } from "@/lib/consent";
import { CONSENT_UI_ENABLED } from "@/lib/tracking/env";

type Category = {
  key: "necessary" | keyof ConsentChoice;
  name: string;
  purpose: string;
  services: string;
};

/** Texts from the consent spec, section 6.3. */
const CATEGORIES: readonly Category[] = [
  {
    key: "necessary",
    name: "Necessary",
    purpose: "Remembers your cookie choice.",
    services: "Jet",
  },
  {
    key: "statistics",
    name: "Statistics",
    purpose:
      "Shows us how visitors use the site and how fast it loads, including session recordings with form fields hidden. Remembers the campaign that brought you here for 90 days.",
    services: "Google Analytics, PostHog, Amplitude, Vercel Speed Insights",
  },
  {
    key: "marketing",
    name: "Marketing",
    purpose: "Measures whether our ads lead to sign-ups and enquiries.",
    services: "Google Ads, Meta, LinkedIn",
  },
];

const titleType =
  "font-display text-[14px] leading-[1.4] font-strong tracking-[-0.01em] [font-variation-settings:'opsz'_14,'wght'_550]";
const labelType =
  "font-display text-[12px] leading-[1.6] font-strong tracking-normal [font-variation-settings:'opsz'_14,'wght'_550]";
const bodyType =
  "font-display text-[12px] leading-[1.6] font-copy tracking-normal [font-variation-settings:'opsz'_14,'wght'_450]";

/**
 * The second layer: one switch per category, the services behind it and the
 * same equal choices as the banner. Opened from the banner's "Settings" and
 * from "Cookie settings" in the footer. Escape and the close button leave the
 * choice as it was.
 */
export function ConsentSettings() {
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>({ statistics: false, marketing: false });

  useEffect(() => {
    if (!CONSENT_UI_ENABLED) {
      return;
    }
    return onOpenConsentSettings(() => {
      if (open) {
        return;
      }
      const { statistics, marketing } = getConsent();
      setChoice({ statistics, marketing });
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    });
  }, [open]);

  if (!CONSENT_UI_ENABLED) {
    return null;
  }

  const decide = (next: ConsentChoice) => {
    setOpen(false);
    saveConsent(next, "settings");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        data-consent-settings=""
        aria-labelledby={titleId}
        overlayClassName="bg-shimmer backdrop-blur-[5px]"
        className="max-h-[calc(100dvh-32px)] w-full max-w-[calc(100%-32px)] gap-[16px] overflow-auto rounded-field bg-background p-[16px] text-foreground ring-border motion-reduce:data-open:animate-none sm:max-w-[400px]"
        initialFocus={() =>
          document.querySelector<HTMLElement>(
            '[data-consent-settings] [role="switch"]:not([aria-disabled="true"])',
          )
        }
        finalFocus={() => opener.current}
      >
        <DialogHeader className="flex-row items-start justify-between gap-[12px]">
          <div className="flex min-w-0 flex-col gap-[6px]">
            <DialogTitle id={titleId} className={titleType}>
              Cookie settings
            </DialogTitle>
            <DialogDescription className={`${bodyType} text-muted-foreground`}>
              Necessary cookies keep the site working and are always on. Everything else stays off until you turn it on.
            </DialogDescription>
          </div>
          <DialogClose
            render={<Button variant="ghost" aria-label="Close" className="size-[30px] shrink-0 p-0" />}
          >
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
          {CATEGORIES.map((category) => {
            const descriptionId = `${titleId}-${category.key}`;
            const locked = category.key === "necessary";
            const checked = category.key === "necessary" ? true : choice[category.key];
            return (
              <li
                key={category.key}
                className="flex items-start justify-between gap-[16px] border-t border-dashed border-rule pt-[12px] first:border-t-0 first:pt-0"
              >
                <div className="flex min-w-0 flex-col gap-[4px]">
                  <span className={labelType}>{category.name}</span>
                  <p id={descriptionId} className={`${bodyType} m-0 text-muted-foreground`}>
                    {category.purpose}
                  </p>
                  <p className="m-0 font-mono text-[12px] leading-[1.6] font-medium tracking-[0.02em] text-muted-foreground">
                    {category.services}
                  </p>
                </div>
                <Switch
                  aria-label={category.name}
                  aria-describedby={descriptionId}
                  checked={checked}
                  disabled={locked}
                  className="mt-[1px] shrink-0"
                  onCheckedChange={(next) => {
                    if (locked) {
                      return;
                    }
                    const key = category.key as keyof ConsentChoice;
                    setChoice((current) => ({ ...current, [key]: next }));
                  }}
                />
              </li>
            );
          })}
        </ul>
        <DialogFooter className="mx-0 mb-0 flex-row flex-wrap items-center justify-start gap-[8px] rounded-none border-0 bg-transparent p-0 sm:justify-start">
          <ConsentButton text="Necessary only" onClick={() => decide({ statistics: false, marketing: false })} />
          <ConsentButton text="Accept all" variant="default" onClick={() => decide({ statistics: true, marketing: true })} />
          <ConsentButton text="Save choices" onClick={() => decide(choice)} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
