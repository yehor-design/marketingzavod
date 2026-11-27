"use client";

import Link from "next/link";
import { useState } from "react";
import { cx as blockCx } from "@/components/blocks/announcement-bar/announcement-bar-styles";
import { cx as chromeCx } from "@/components/chrome-styles";
import { ui } from "@/content/ui";

export const ANNOUNCEMENT_DISMISSED_KEY = "mz_announcement_dismissed";

export const ANNOUNCEMENT_INIT_SCRIPT = `try{if(window.sessionStorage.getItem("${ANNOUNCEMENT_DISMISSED_KEY}")==="1"){document.documentElement.dataset.announcementDismissed="true";}}catch{}`;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <g
        transform="translate(8 8)"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0 8 L7.784 0" />
        <path d="M1.773 0 H8 V6.4" />
      </g>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
      <path
        d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export type AnnouncementBarProps = {
  text?: string;
  href?: string;
  /** "inline" matches the original Jet home-hero pill; "global" renders the dismissible BG top bar. */
  variant?: "inline" | "global";
  /** Adds top header offset when rendered above a flush home hero with pt-0. */
  flushTop?: boolean;
  /** Accessible label for the dismiss button (global variant). */
  closeAria?: string;
  /** Tracking cta_location attribute (global variant defaults to "announcement"). */
  location?: string;
  /** When false, renders statically for styleguide previews without touching sessionStorage or html attrs. */
  persistDismiss?: boolean;
  /** Optional callback invoked after dismiss. */
  onDismiss?: () => void;
};

export function AnnouncementBar({
  text = ui.announcement.text,
  href = ui.announcement.href,
  variant = "inline",
  flushTop = false,
  closeAria = ui.announcement.closeAria,
  location = "announcement",
  persistDismiss = true,
  onDismiss,
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (variant === "inline") {
    return (
      <div className={chromeCx("announcement-wrap")} data-block="announcement-bar">
        <Link className={chromeCx("announcement")} href={href}>
          <span className={chromeCx("shimmer-text")}>
            {text}
            <span className={chromeCx("shimmer-text-glow")} aria-hidden="true">
              {text}
            </span>
          </span>
          <span className={chromeCx("announcement-icon")}>
            <ArrowIcon />
          </span>
        </Link>
      </div>
    );
  }

  if (dismissed) {
    return null;
  }

  function handleDismiss() {
    if (persistDismiss) {
      try {
        window.sessionStorage.setItem(ANNOUNCEMENT_DISMISSED_KEY, "1");
      } catch {
        // Storage may be unavailable in restricted contexts.
      }
      document.documentElement.dataset.announcementDismissed = "true";
    }
    setDismissed(true);
    onDismiss?.();
  }

  return (
    <div
      className={blockCx(flushTop ? "globalWrapHome" : "globalWrap")}
      data-block="announcement-bar"
      data-announcement-slot={persistDismiss ? "global" : "preview"}
    >
      <div className={blockCx("bar")}>
        <Link
          className={blockCx("link")}
          href={href}
          data-track="cta_click"
          data-track-cta-text={text.replace(/\u00a0/g, " ")}
          data-track-cta-location={location}
        >
          <span className={chromeCx("shimmer-text")}>
            {text}
            <span className={chromeCx("shimmer-text-glow")} aria-hidden="true">
              {text}
            </span>
          </span>
        </Link>
        <button
          type="button"
          className={blockCx("closeButton")}
          aria-label={closeAria}
          onClick={handleDismiss}
        >
          <span className={blockCx("closeBadge")}>
            <CloseIcon />
          </span>
        </button>
      </div>
    </div>
  );
}
