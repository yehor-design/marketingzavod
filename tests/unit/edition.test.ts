import { afterEach, describe, expect, it, vi } from "vitest";
import { parseEdition } from "@/lib/edition";

const mockNotFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

describe("parseEdition (LN-A1)", () => {
  it("defaults to jet when unset or blank", () => {
    expect(parseEdition(undefined)).toBe("jet");
    expect(parseEdition("")).toBe("jet");
    expect(parseEdition("   ")).toBe("jet");
  });

  it("accepts jet and bg", () => {
    expect(parseEdition("jet")).toBe("jet");
    expect(parseEdition("bg")).toBe("bg");
    expect(parseEdition(" bg ")).toBe("bg");
  });

  it("throws a clear error on any unknown edition", () => {
    expect(() => parseEdition("foo")).toThrow(/Invalid NEXT_PUBLIC_SITE_EDITION="foo"/);
    expect(() => parseEdition("BG")).toThrow(/Expected one of: jet, bg/);
  });
});

describe("edition module and route guards", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    mockNotFound.mockClear();
  });

  it("exports jet by default and blocks app/(bg) routes", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_EDITION", "");
    vi.resetModules();
    const { EDITION, isBg } = await import("@/lib/edition");
    const { requireBgEdition, requireJetEdition } = await import("@/lib/edition-routes");

    expect(EDITION).toBe("jet");
    expect(isBg).toBe(false);
    expect(() => requireJetEdition()).not.toThrow();
    expect(() => requireBgEdition()).toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });

  it("exports bg when NEXT_PUBLIC_SITE_EDITION=bg and blocks jet-only routes", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_EDITION", "bg");
    vi.resetModules();
    const { EDITION, isBg } = await import("@/lib/edition");
    const { requireBgEdition, requireJetEdition } = await import("@/lib/edition-routes");

    expect(EDITION).toBe("bg");
    expect(isBg).toBe(true);
    expect(() => requireBgEdition()).not.toThrow();
    expect(() => requireJetEdition()).toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });

  it("fails module initialization when NEXT_PUBLIC_SITE_EDITION is invalid", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_EDITION", "foo");
    vi.resetModules();
    await expect(import("@/lib/edition")).rejects.toThrow(/Invalid NEXT_PUBLIC_SITE_EDITION="foo"/);
  });
});
