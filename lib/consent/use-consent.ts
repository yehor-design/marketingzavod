"use client";

import { useSyncExternalStore } from "react";
import { DENIED, getConsent, onConsentChange, type ConsentState } from "@/lib/consent";

/**
 * The consent state as React state. The server and hydration see DENIED,
 * then the stored choice takes over on the client.
 */
export function useConsent(): ConsentState {
  return useSyncExternalStore(onConsentChange, getConsent, () => DENIED);
}
