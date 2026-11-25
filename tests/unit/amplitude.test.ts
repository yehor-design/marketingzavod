import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sdk = vi.hoisted(() => {
  class Identify {
    readonly ops: Array<[string, string, string]> = [];
    set(key: string, value: string) {
      this.ops.push(["set", key, value]);
      return this;
    }
    setOnce(key: string, value: string) {
      this.ops.push(["setOnce", key, value]);
      return this;
    }
  }
  return {
    Identify,
    add: vi.fn(),
    init: vi.fn(() => ({ promise: Promise.resolve() })),
    setOptOut: vi.fn(),
    track: vi.fn(),
    identify: vi.fn(),
    getDeviceId: vi.fn(() => "device-123"),
  };
});

const replay = vi.hoisted(() => ({ sessionReplayPlugin: vi.fn((options: unknown) => ({ name: "replay", options })) }));

vi.mock("@amplitude/analytics-browser", () => sdk);
vi.mock("@amplitude/plugin-session-replay-browser", () => replay);

/** env.ts reads the environment when it is first imported, so each test loads fresh modules. */
async function load() {
  vi.resetModules();
  const consent = await import("@/lib/consent");
  const amplitude = await import("@/lib/tracking/amplitude");
  return { consent, amplitude };
}

const STATISTICS = { preferences: false, statistics: true, marketing: false, answered: true };
const NOTHING = { preferences: false, statistics: false, marketing: false, answered: true };

describe("lib/tracking/amplitude", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {});
    vi.stubEnv("NEXT_PUBLIC_TRACKING_DEBUG", "true");
    vi.stubEnv("NEXT_PUBLIC_AMPLITUDE_API_KEY", "amp_test_key");
    for (const mock of [sdk.add, sdk.init, sdk.setOptOut, sdk.track, sdk.identify, replay.sessionReplayPlugin]) {
      mock.mockClear();
    }
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("does not load the SDK without statistics consent", async () => {
    const { amplitude } = await load();
    await amplitude.initAmplitude();
    amplitude.amplitudeTrack("cta_click", { cta_text: "Join" });
    expect(sdk.init).not.toHaveBeenCalled();
    expect(sdk.track).not.toHaveBeenCalled();
  });

  it("starts with Session Replay and no Guides & Surveys once statistics consent is given", async () => {
    const { consent, amplitude } = await load();
    consent.setConsent(STATISTICS);
    await amplitude.applyAmplitudeConsent(consent.getConsent());
    expect(sdk.init).toHaveBeenCalledTimes(1);
    expect(sdk.init).toHaveBeenCalledWith(
      "amp_test_key",
      expect.objectContaining({
        serverZone: "US",
        remoteConfig: { fetchRemoteConfig: false },
        autocapture: expect.objectContaining({ pageViews: { trackHistoryChanges: "pathOnly" }, elementInteractions: false }),
      }),
    );
    expect(replay.sessionReplayPlugin).toHaveBeenCalledWith(
      expect.objectContaining({ sampleRate: 1, privacyConfig: expect.objectContaining({ defaultMaskLevel: "medium" }) }),
    );
    expect(sdk.add).toHaveBeenCalledTimes(1);

    amplitude.amplitudeTrack("generate_lead", { form_name: "contact" });
    expect(sdk.track).toHaveBeenCalledWith("generate_lead", { form_name: "contact" }, expect.objectContaining({ time: expect.any(Number) }));
  });

  it("keeps events from before the choice and sends them with their own time once consent is given", async () => {
    const { consent, amplitude } = await load();
    amplitude.amplitudeTrack("cta_click", { cta_text: "Join" });
    const queuedAt = Date.now();
    expect(sdk.track).not.toHaveBeenCalled();

    consent.setConsent(STATISTICS);
    await amplitude.applyAmplitudeConsent(consent.getConsent());
    expect(sdk.track).toHaveBeenCalledTimes(1);
    const [, , options] = sdk.track.mock.calls[0] as unknown as [string, unknown, { time: number }];
    expect(options.time).toBeLessThanOrEqual(queuedAt);
  });

  it("drops queued events when the visitor refuses", async () => {
    const { consent, amplitude } = await load();
    amplitude.amplitudeTrack("cta_click", { cta_text: "Join" });
    consent.setConsent(NOTHING);
    await amplitude.applyAmplitudeConsent(consent.getConsent());
    amplitude.amplitudeTrack("faq_open", { question: "q" });

    consent.setConsent(STATISTICS);
    await amplitude.applyAmplitudeConsent(consent.getConsent());
    expect(sdk.track).not.toHaveBeenCalled();
  });

  it("opts out on withdrawal and sends nothing afterwards", async () => {
    const { consent, amplitude } = await load();
    consent.setConsent(STATISTICS);
    await amplitude.initAmplitude();

    consent.setConsent(NOTHING);
    await amplitude.applyAmplitudeConsent(consent.getConsent());
    expect(sdk.setOptOut).toHaveBeenLastCalledWith(true);

    amplitude.amplitudeTrack("faq_open", { question: "q" });
    expect(sdk.track).not.toHaveBeenCalled();
    expect(amplitude.getAmplitudeDeviceId()).toBeUndefined();
  });

  it("ties a lead to the user by its internal ID, never the email", async () => {
    const { consent, amplitude } = await load();
    consent.setConsent(STATISTICS);
    await amplitude.initAmplitude();
    amplitude.amplitudeIdentifyLead("lead-1", { first_utm_source: "google" });
    expect(sdk.identify).toHaveBeenCalledTimes(1);
    const [identify] = sdk.identify.mock.calls[0] as unknown as [{ ops: unknown[] }];
    expect(identify.ops).toEqual([
      ["set", "last_lead_id", "lead-1"],
      ["setOnce", "first_utm_source", "google"],
    ]);
    expect(amplitude.getAmplitudeDeviceId()).toBe("device-123");
  });

  it("stays off without a key or outside production", async () => {
    vi.stubEnv("NEXT_PUBLIC_AMPLITUDE_API_KEY", "");
    const { consent, amplitude } = await load();
    consent.setConsent(STATISTICS);
    await amplitude.initAmplitude();
    expect(sdk.init).not.toHaveBeenCalled();

    vi.stubEnv("NEXT_PUBLIC_AMPLITUDE_API_KEY", "amp_test_key");
    vi.stubEnv("NEXT_PUBLIC_TRACKING_DEBUG", "");
    const fresh = await load();
    fresh.consent.setConsent(STATISTICS);
    await fresh.amplitude.initAmplitude();
    expect(sdk.init).not.toHaveBeenCalled();
  });
});

describe("lib/amplitude-server", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("posts events to the HTTP API with the public key", async () => {
    vi.stubEnv("NEXT_PUBLIC_TRACKING_DEBUG", "true");
    vi.stubEnv("NEXT_PUBLIC_AMPLITUDE_API_KEY", "amp_test_key");
    vi.resetModules();
    const { sendAmplitudeServerEvents } = await import("@/lib/amplitude-server");
    const fetchImpl = vi.fn(async () => new Response("{}", { status: 200 }));
    const event = { event_type: "lead_saved", device_id: "device-123", insert_id: "lead-1" };
    await expect(sendAmplitudeServerEvents([event], fetchImpl as unknown as typeof fetch)).resolves.toBe(true);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api2.amplitude.com/2/httpapi");
    expect(JSON.parse(String(init.body))).toEqual({ api_key: "amp_test_key", events: [event] });
  });

  it("sends nothing without a key or outside production, and never throws", async () => {
    vi.stubEnv("NEXT_PUBLIC_TRACKING_DEBUG", "");
    vi.stubEnv("NEXT_PUBLIC_AMPLITUDE_API_KEY", "amp_test_key");
    vi.resetModules();
    const server = await import("@/lib/amplitude-server");
    const fetchImpl = vi.fn();
    await expect(server.sendAmplitudeServerEvents([{ event_type: "x", device_id: "abcdef" }], fetchImpl)).resolves.toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();

    vi.stubEnv("NEXT_PUBLIC_TRACKING_DEBUG", "true");
    vi.resetModules();
    const fresh = await import("@/lib/amplitude-server");
    const failing = vi.fn(async () => {
      throw new Error("offline");
    });
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(fresh.sendAmplitudeServerEvents([{ event_type: "x", device_id: "abcdef" }], failing)).resolves.toBe(false);
    error.mockRestore();
  });
});
