/**
 * Amplitude in the browser. It runs only with statistics consent: without it
 * the SDK is not even downloaded, so nothing is stored on the device and no
 * request reaches Amplitude.
 *
 * Withdrawal opts the running SDK out. Its stored identifiers are removed by
 * the consent module when the visitor narrows their choice.
 */
import { getConsent, type ConsentState } from "@/lib/consent";
import { TRACKING_ENABLED, trackingIds } from "@/lib/tracking/env";

type AmplitudeModule = typeof import("@amplitude/unified");

let sdk: AmplitudeModule | null = null;
let starting: Promise<void> | null = null;

export function amplitudeActive(): boolean {
  return TRACKING_ENABLED && trackingIds.amplitude !== "";
}

/** Starts Amplitude once, and only with statistics consent. Safe to call repeatedly. */
export function initAmplitude(): Promise<void> {
  if (!amplitudeActive() || !getConsent().statistics || typeof window === "undefined") {
    return Promise.resolve();
  }
  if (sdk) {
    sdk.setOptOut(false);
    return Promise.resolve();
  }
  starting ??= import("@amplitude/unified")
    .then(async (module) => {
      // The key is the positional first argument. An options-only call silently does nothing.
      await module.initAll(trackingIds.amplitude, {
        serverZone: "US",
        analytics: { autocapture: true },
        sessionReplay: { sampleRate: 1 },
      });
      sdk = module;
      // Consent may have been withdrawn while the SDK was loading.
      if (!getConsent().statistics) {
        module.setOptOut(true);
      }
    })
    .catch((error) => {
      starting = null;
      console.warn("[tracking] Amplitude failed to load", error);
    });
  return starting;
}

/** Applies a consent change without reloading the page. */
export function applyAmplitudeConsent(state: ConsentState): Promise<void> {
  if (state.statistics) {
    return initAmplitude();
  }
  sdk?.setOptOut(true);
  return Promise.resolve();
}

/** Sends an event when Amplitude is running. Without consent it does nothing. */
export function amplitudeTrack(event: string, properties?: Record<string, string | number | boolean>) {
  if (sdk && getConsent().statistics) {
    sdk.track(event, properties);
  }
}

/** Test hook. */
export function resetAmplitude() {
  sdk = null;
  starting = null;
}
