"use client";

import { useEffect, useRef } from "react";
import { TRACKING_ENABLED, trackingIds } from "@/lib/tracking/env";

const COOKIEBOT_ID = /^[0-9a-fA-F-]{36}$/;

/**
 * The Cookiebot cookie declaration: the live list of cookies found by the
 * scanner. The script is appended in an effect, so the list also renders after
 * a client-side navigation to the page, not only on a full load.
 */
export function CookieDeclaration() {
  const holder = useRef<HTMLDivElement>(null);
  const enabled = TRACKING_ENABLED && COOKIEBOT_ID.test(trackingIds.cookiebot);

  useEffect(() => {
    const node = holder.current;
    if (!enabled || !node) {
      return;
    }
    const script = document.createElement("script");
    script.id = "CookieDeclaration";
    script.src = `https://consent.cookiebot.com/${trackingIds.cookiebot}/cd.js`;
    script.async = true;
    node.appendChild(script);
    return () => {
      node.replaceChildren();
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }
  return <div ref={holder} data-cookie-declaration="" />;
}
