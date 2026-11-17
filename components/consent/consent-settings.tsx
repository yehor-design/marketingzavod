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
import { Separator } from "@/components/ui/separator";
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
        className="max-h-[calc(100dvh-2rem)] overflow-auto bg-background text-foreground ring-border motion-reduce:data-open:animate-none sm:max-w-[440px]"
        initialFocus={() =>
          document.querySelector<HTMLElement>(
            '[data-consent-settings] [role="switch"]:not([aria-disabled="true"])',
          )
        }
        finalFocus={() => opener.current}
      >
        <DialogHeader className="flex-row items-center justify-between gap-3">
          <DialogTitle id={titleId} className="font-display text-base tracking-[-0.01em]">
            Cookie settings
          </DialogTitle>
          <DialogClose render={<Button variant="secondary" size="icon-sm" aria-label="Close" />}>
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <DialogDescription className="text-sm leading-normal">
          Necessary cookies keep the site working and are always on. Everything else stays off until you turn it on.
        </DialogDescription>
        <ul className="flex flex-col">
          {CATEGORIES.map((category) => {
            const descriptionId = `${titleId}-${category.key}`;
            const checked = category.key === "necessary" ? true : choice[category.key];
            return (
              <li key={category.key} className="flex flex-col gap-1 py-3">
                <Separator />
                <div className="flex items-center justify-between gap-3 pt-3">
                  <span className="font-display text-sm leading-normal">{category.name}</span>
                  <Switch
                    aria-label={category.name}
                    aria-describedby={descriptionId}
                    checked={checked}
                    disabled={category.key === "necessary"}
                    className="motion-reduce:transition-none data-checked:bg-brand! data-unchecked:bg-stroke! motion-reduce:[&_[data-slot=switch-thumb]]:transition-none"
                    onCheckedChange={(next) => {
                      const key = category.key as keyof ConsentChoice;
                      setChoice((current) => ({ ...current, [key]: next }));
                    }}
                  />
                </div>
                <p id={descriptionId} className="text-sm leading-normal text-muted-foreground">
                  {category.purpose}
                </p>
                <p className="font-mono text-xs font-medium leading-relaxed tracking-[0.02em] text-muted-foreground">
                  {category.services}
                </p>
              </li>
            );
          })}
        </ul>
        <DialogFooter className="grid grid-cols-3 gap-2 bg-transparent sm:grid-cols-3 max-[479.98px]:grid-cols-1">
          <ConsentButton text="Necessary only" onClick={() => decide({ statistics: false, marketing: false })} />
          <ConsentButton text="Accept all" variant="default" onClick={() => decide({ statistics: true, marketing: true })} />
          <ConsentButton text="Save choices" onClick={() => decide(choice)} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
