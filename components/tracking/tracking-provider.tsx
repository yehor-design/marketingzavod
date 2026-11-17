"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureAttribution, syncAttributionWithConsent } from "@/lib/attribution";
import { onConsentChange } from "@/lib/consent";
import {
  isTrackEventName,
  NUMERIC_PARAMS,
  track,
  type ContactMethod,
  type FormName,
  type TrackEventName,
  type TrackEvents,
} from "@/lib/tracking";
import { applyAmplitudeConsent, initAmplitude } from "@/lib/tracking/amplitude";
import { applyGtmConsent } from "@/lib/tracking/gtm";
import { applyPosthogConsent, initPosthog } from "@/lib/tracking/posthog";

/** Survives React strict-mode remounts, so a route produces one page_view. */
let lastViewedPath: string | null = null;

const MESSENGERS: Array<[RegExp, ContactMethod]> = [
  [/(^|\.)wa\.me$|(^|\.)whatsapp\.com$/, "whatsapp"],
  [/(^|\.)t\.me$|(^|\.)telegram\.me$/, "telegram"],
  [/(^|\.)m\.me$|(^|\.)messenger\.com$/, "messenger"],
];

const FORM_NAMES: readonly string[] = ["contact", "waitlist", "careers_apply"];

function formName(form: HTMLFormElement | null | undefined): FormName | null {
  const name = form?.dataset.trackForm;
  return name && FORM_NAMES.includes(name) ? (name as FormName) : null;
}

function labelOf(element: Element): string {
  const text = element.getAttribute("aria-label") ?? element.textContent ?? "";
  return text.replace(/ /g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
}

/** data-track-if lets a toggle report only the transition that matters. */
function conditionMet(element: Element): boolean {
  switch (element.getAttribute("data-track-if")) {
    case "collapsed":
      return element.getAttribute("aria-expanded") !== "true";
    case "unpressed":
      return element.getAttribute("aria-pressed") !== "true";
    default:
      return true;
  }
}

function trackElement(element: HTMLElement) {
  const name = element.dataset.track ?? "";
  if (!isTrackEventName(name) || !conditionMet(element)) {
    return;
  }
  const params: Record<string, string | number> = {};
  for (const attribute of Array.from(element.attributes)) {
    if (!attribute.name.startsWith("data-track-") || attribute.name === "data-track-if") {
      continue;
    }
    const key = attribute.name.slice("data-track-".length).replace(/-/g, "_");
    params[key] = NUMERIC_PARAMS.has(key) ? Number(attribute.value) : attribute.value;
  }
  if (name === "cta_click") {
    params.cta_text ??= labelOf(element);
    params.cta_location ??= "page";
    params.destination ??= element.closest("a")?.getAttribute("href") ?? "";
  }
  track(name as TrackEventName, params as TrackEvents[TrackEventName]);
}

/** Contact and outbound links are recognised by their address. They need no attributes. */
function trackLink(link: HTMLAnchorElement) {
  const href = link.getAttribute("href") ?? "";
  if (href.startsWith("mailto:")) {
    track("contact_click", { method: "email" });
    return;
  }
  if (href.startsWith("tel:")) {
    track("contact_click", { method: "phone" });
    return;
  }
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return;
  }
  if (!/^https?:$/.test(url.protocol) || url.host === window.location.host) {
    return;
  }
  const messenger = MESSENGERS.find(([pattern]) => pattern.test(url.hostname));
  if (messenger) {
    track("contact_click", { method: messenger[1] });
    return;
  }
  // The query string is dropped: it can carry identifiers.
  track("outbound_click", {
    link_domain: url.hostname.replace(/^www\./, ""),
    link_url: `${url.origin}${url.pathname}`,
  });
}

/**
 * Mounted once in the root layout. It owns everything that listens:
 * page views, the delegated click and form listeners, attribution capture and
 * the reaction to consent changes. Components only add data-track attributes.
 */
export function TrackingProvider() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
    initPosthog();
    void initAmplitude();

    const stopConsent = onConsentChange((state) => {
      applyGtmConsent(state);
      syncAttributionWithConsent(state);
      applyPosthogConsent(state);
      void applyAmplitudeConsent(state);
    });

    const startedForms = new WeakSet<HTMLFormElement>();

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) {
        return;
      }
      const tracked = target.closest<HTMLElement>("[data-track]");
      if (tracked) {
        trackElement(tracked);
      }
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (link) {
        trackLink(link);
      }
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (
        !(target instanceof HTMLInputElement) &&
        !(target instanceof HTMLTextAreaElement) &&
        !(target instanceof HTMLSelectElement)
      ) {
        return;
      }
      const form = target.form;
      const name = formName(form);
      if (!form || !name || startedForms.has(form) || target.tabIndex === -1) {
        return;
      }
      startedForms.add(form);
      track("form_start", { form_name: name });
    };

    const onInvalid = (event: Event) => {
      const target = event.target;
      if (
        !(target instanceof HTMLInputElement) &&
        !(target instanceof HTMLTextAreaElement) &&
        !(target instanceof HTMLSelectElement)
      ) {
        return;
      }
      const name = formName(target.form);
      if (!name) {
        return;
      }
      const field = (target.dataset.trackField ?? target.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
      track("form_error", { form_name: name, field: field || "unknown" });
    };

    // Capture phase: the handler sees aria-expanded and aria-pressed as they
    // were before React reacts to the click, and "invalid" does not bubble.
    document.addEventListener("click", onClick, true);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("invalid", onInvalid, true);

    return () => {
      stopConsent();
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("invalid", onInvalid, true);
    };
  }, []);

  useEffect(() => {
    if (lastViewedPath === pathname) {
      return;
    }
    lastViewedPath = pathname;
    track("page_view", {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
