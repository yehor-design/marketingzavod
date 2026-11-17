import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sdk = vi.hoisted(() => ({
  initAll: vi.fn(async () => {}),
  setOptOut: vi.fn(),
  track: vi.fn(),
}));

vi.mock("@amplitude/unified", () => sdk);

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
    sdk.initAll.mockClear();
    sdk.setOptOut.mockClear();
    sdk.track.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("does not load the SDK without statistics consent", async () => {
    const { amplitude } = await load();
    await amplitude.initAmplitude();
    amplitude.amplitudeTrack("Waitlist Joined");
    expect(sdk.initAll).not.toHaveBeenCalled();
    expect(sdk.track).not.toHaveBeenCalled();
  });

  it("starts without a reload once statistics consent is given", async () => {
    const { consent, amplitude } = await load();
    consent.setConsent(STATISTICS);
    await amplitude.applyAmplitudeConsent(consent.getConsent());
    expect(sdk.initAll).toHaveBeenCalledTimes(1);
    expect(sdk.initAll).toHaveBeenCalledWith("amp_test_key", expect.objectContaining({ serverZone: "US" }));

    amplitude.amplitudeTrack("Waitlist Joined");
    expect(sdk.track).toHaveBeenCalledWith("Waitlist Joined", undefined);
  });

  it("opts out on withdrawal and sends nothing afterwards", async () => {
    const { consent, amplitude } = await load();
    consent.setConsent(STATISTICS);
    await amplitude.initAmplitude();

    consent.setConsent(NOTHING);
    await amplitude.applyAmplitudeConsent(consent.getConsent());
    expect(sdk.setOptOut).toHaveBeenLastCalledWith(true);

    amplitude.amplitudeTrack("Waitlist Joined");
    expect(sdk.track).not.toHaveBeenCalled();
  });

  it("stays off without a key or outside production", async () => {
    vi.stubEnv("NEXT_PUBLIC_AMPLITUDE_API_KEY", "");
    const { consent, amplitude } = await load();
    consent.setConsent(STATISTICS);
    await amplitude.initAmplitude();
    expect(sdk.initAll).not.toHaveBeenCalled();

    vi.stubEnv("NEXT_PUBLIC_AMPLITUDE_API_KEY", "amp_test_key");
    vi.stubEnv("NEXT_PUBLIC_TRACKING_DEBUG", "");
    const fresh = await load();
    fresh.consent.setConsent(STATISTICS);
    await fresh.amplitude.initAmplitude();
    expect(sdk.initAll).not.toHaveBeenCalled();
  });
});
