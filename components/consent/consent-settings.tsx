"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ConsentButton } from "@/components/consent/consent-button";
import styles from "@/components/consent/consent.module.css";
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

function Switch({
  label,
  describedBy,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  describedBy: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      aria-label={label}
      aria-describedby={describedBy}
      className={styles.switch}
      onClick={() => {
        if (!disabled) {
          onChange?.(!checked);
        }
      }}
    >
      <span className={styles.thumb} aria-hidden="true" />
    </button>
  );
}

/**
 * The second layer: one switch per category, the services behind it and the
 * same equal choices as the banner. Opened from the banner's "Settings" and
 * from "Cookie settings" in the footer. Escape and the close button leave the
 * choice as it was.
 */
export function ConsentSettings() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>({ statistics: false, marketing: false });

  useEffect(() => {
    if (!CONSENT_UI_ENABLED) {
      return;
    }
    return onOpenConsentSettings(() => {
      if (dialog.current?.open) {
        return;
      }
      const { statistics, marketing } = getConsent();
      setChoice({ statistics, marketing });
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    });
  }, []);

  // The content mounts only while the panel is open: the rolling button
  // labels measure their letters on mount, which needs a visible layout.
  useEffect(() => {
    const node = dialog.current;
    if (!open || !node || node.open) {
      return;
    }
    node.showModal();
    node.querySelector<HTMLElement>('[role="switch"]:not([aria-disabled])')?.focus();
  }, [open]);

  if (!CONSENT_UI_ENABLED) {
    return null;
  }

  const close = () => dialog.current?.close();
  const decide = (next: ConsentChoice) => {
    close();
    saveConsent(next, "settings");
  };

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby={titleId}
      data-consent-settings=""
      onClose={() => {
        setOpen(false);
        // Back to where the panel was opened from, if that is still on the page.
        if (opener.current?.isConnected) {
          opener.current.focus();
        }
        opener.current = null;
      }}
    >
      {open ? (
        <div className={styles.panel}>
          <div className={styles.head}>
            <h2 id={titleId} className={styles.title}>
              Cookie settings
            </h2>
            <button type="button" className={styles.close} aria-label="Close" onClick={close}>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
          <p className={styles.text}>
            Necessary cookies keep the site working and are always on. Everything else stays off until you turn it on.
          </p>
          <ul className={styles.categories}>
            {CATEGORIES.map((category) => {
              const descriptionId = `${titleId}-${category.key}`;
              const checked = category.key === "necessary" ? true : choice[category.key];
              return (
                <li key={category.key} className={styles.category}>
                  <div className={styles.categoryHead}>
                    <span className={styles.categoryName}>{category.name}</span>
                    <Switch
                      label={category.name}
                      describedBy={descriptionId}
                      checked={checked}
                      disabled={category.key === "necessary"}
                      onChange={(next) => {
                        const key = category.key as keyof ConsentChoice;
                        setChoice((current) => ({ ...current, [key]: next }));
                      }}
                    />
                  </div>
                  <p id={descriptionId} className={styles.purpose}>
                    {category.purpose}
                  </p>
                  <p className={styles.services}>{category.services}</p>
                </li>
              );
            })}
          </ul>
          <div className={styles.actions}>
            <ConsentButton text="Necessary only" onClick={() => decide({ statistics: false, marketing: false })} />
            <ConsentButton text="Accept all" onClick={() => decide({ statistics: true, marketing: true })} />
            <ConsentButton text="Save choices" onClick={() => decide(choice)} />
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
