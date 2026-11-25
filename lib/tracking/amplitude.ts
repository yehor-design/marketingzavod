/**
 * Amplitude in the browser: product analytics and session recordings.
 *
 * It runs only with statistics consent: without it the SDK is not even
 * downloaded, so nothing is stored on the device and no request reaches
 * Amplitude. Events from the current page wait in a short queue and go out,
 * with their original time, once consent is given. A refusal drops them.
 *
 * Only the analytics SDK and the Session Replay plugin are loaded. The
 * unified SDK would also bring Guides & Surveys and Experiment, which the
 * site does not use and which were the heaviest scripts after consent.
 *
 * Withdrawal opts the running SDK out. Its stored identifiers are removed by
 * the consent module when the visitor narrows their choice.
 */
import { getConsent, type ConsentState } from "@/lib/consent";
import { AMPLITUDE_SERVER_ZONE, TRACKING_ENABLED, trackingIds } from "@/lib/tracking/env";

type AmplitudeModule = typeof import("@amplitude/analytics-browser");
type Task = (sdk: AmplitudeModule) => void;

export type AmplitudeProperties = Record<string, string | number | boolean>;

/** Enough for one page before the visitor chooses. Older tasks are dropped. */
const QUEUE_LIMIT = 100;

/** What Amplitude records by itself. Clicks and forms are covered by the site's own events. */
export const AMPLITUDE_AUTOCAPTURE = {
  attribution: true,
  pageViews: { trackHistoryChanges: "pathOnly" },
  sessions: true,
  fileDownloads: true,
  formInteractions: false,
  elementInteractions: false,
  frustrationInteractions: false,
  networkTracking: false,
  webVitals: false,
  pageUrlEnrichment: true,
} as const;

/** Every session is recorded. Form fields and [data-private] are masked. */
export function amplitudeSessionReplayOptions() {
  return {
    sampleRate: 1,
    privacyConfig: { defaultMaskLevel: "medium" as const, maskSelector: ["[data-private]"] },
  };
}

let sdk: AmplitudeModule | null = null;
let starting: Promise<void> | null = null;
let queue: Task[] = [];

export function amplitudeActive(): boolean {
  return TRACKING_ENABLED && trackingIds.amplitude !== "";
}

function run(task: Task) {
  if (!amplitudeActive() || typeof window === "undefined") {
    return;
  }
  const consent = getConsent();
  if (sdk) {
    if (consent.statistics) {
      task(sdk);
    }
    return;
  }
  // The visitor has already said no: nothing waits for a consent that will not come.
  if (consent.answered && !consent.statistics) {
    return;
  }
  queue.push(task);
  if (queue.length > QUEUE_LIMIT) {
    queue.shift();
  }
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
  starting ??= Promise.all([
    import("@amplitude/analytics-browser"),
    import("@amplitude/plugin-session-replay-browser"),
  ])
    .then(async ([module, replay]) => {
      module.add(replay.sessionReplayPlugin(amplitudeSessionReplayOptions()));
      await module.init(trackingIds.amplitude, {
        serverZone: AMPLITUDE_SERVER_ZONE,
        autocapture: AMPLITUDE_AUTOCAPTURE,
        // Autocapture is set here only. Remote settings from the Amplitude UI
        // could switch on capture the consent text does not cover, and each
        // fetch is one more request on every page.
        remoteConfig: { fetchRemoteConfig: false },
      }).promise;
      sdk = module;
      // Consent may have been withdrawn while the SDK was loading.
      if (!getConsent().statistics) {
        module.setOptOut(true);
        queue = [];
        return;
      }
      queue.splice(0).forEach((task) => task(module));
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
  queue = [];
  sdk?.setOptOut(true);
  return Promise.resolve();
}

/** Sends an event, or queues it until consent. Without consent it never leaves the page. */
export function amplitudeTrack(event: string, properties?: AmplitudeProperties) {
  const time = Date.now();
  run((amplitude) => {
    amplitude.track(event, properties, { time });
  });
}

/**
 * Ties the browser to a lead after a form is sent: the internal lead ID and
 * the first touch go to the user's properties. Never the email.
 */
export function amplitudeIdentifyLead(leadId: string, firstTouch: Record<string, string>) {
  if (!getConsent().statistics) {
    return;
  }
  run((amplitude) => {
    const identify = new amplitude.Identify().set("last_lead_id", leadId);
    for (const [key, value] of Object.entries(firstTouch)) {
      identify.setOnce(key, value);
    }
    amplitude.identify(identify);
  });
}

/** The browser's Amplitude device ID, sent with a lead so the server event joins the same user. */
export function getAmplitudeDeviceId(): string | undefined {
  if (!sdk || !getConsent().statistics) {
    return undefined;
  }
  return sdk.getDeviceId();
}

/** Test hook. */
export function resetAmplitude() {
  sdk = null;
  starting = null;
  queue = [];
}
