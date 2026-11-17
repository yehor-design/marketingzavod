import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildMetaPayload } from "@/lib/meta/capi";
import {
  browserId,
  clickId,
  marketingAllowed,
  relayEvent,
  relayRequestSchema,
  sameSitePage,
  sourceUrl,
} from "@/lib/meta/relay";

const NOW = 1_794_900_000; // seconds
const consent = (s: 0 | 1, m: 0 | 1) => `wb_consent=1.s${s}m${m}.${NOW - 60}.${"a".repeat(32)}`;

describe("lib/meta/relay (server)", () => {
  it("accepts only the relayed standard events with a sane payload", () => {
    const ok = { event: "page_view", event_id: "0f8e2a6c-1b2d-4c3e-9f00-123456789abc", page_url: "https://www.heywowboy.com/" };
    expect(relayRequestSchema.safeParse(ok).success).toBe(true);
    expect(relayRequestSchema.safeParse({ ...ok, event: "generate_lead" }).success).toBe(false);
    expect(relayRequestSchema.safeParse({ ...ok, event: "Lead" }).success).toBe(false);
    expect(relayRequestSchema.safeParse({ ...ok, event_id: "x" }).success).toBe(false);
    expect(relayRequestSchema.safeParse({ ...ok, event_id: "a b c d e f g h" }).success).toBe(false);
    expect(relayRequestSchema.safeParse({ ...ok, page_url: "not a url" }).success).toBe(false);
    expect(relayRequestSchema.safeParse({ ...ok, currency: "usd" }).success).toBe(false);
  });

  it("acts only with marketing consent in the cookie", () => {
    expect(marketingAllowed(`a=b; ${consent(1, 1)}`, NOW)).toBe(true);
    expect(marketingAllowed(consent(1, 0), NOW)).toBe(false);
    expect(marketingAllowed("", NOW)).toBe(false);
    // Expired after 180 days.
    expect(marketingAllowed(consent(0, 1), NOW + 181 * 24 * 60 * 60)).toBe(false);
  });

  it("keeps a valid _fbp and creates one in the pixel's format otherwise", () => {
    expect(browserId("fb.1.1794900000000.12345", 0)).toEqual({ value: "fb.1.1794900000000.12345", created: false });
    const made = browserId(undefined, 1794900000000, () => 0.5);
    expect(made.created).toBe(true);
    expect(made.value).toBe("fb.1.1794900000000.1073741823");
    expect(browserId("garbage", 1794900000000, () => 0).created).toBe(true);
  });

  it("takes _fbc from a fbclid in the address, else keeps the cookie", () => {
    const page = "https://www.heywowboy.com/?fbclid=AbC_123-x&utm_source=fb";
    expect(clickId(undefined, page, 1794900000000)).toEqual({ value: "fb.1.1794900000000.AbC_123-x", created: true });
    expect(clickId("fb.1.1700000000000.AbC_123-x", page, 1)).toEqual({ value: "fb.1.1700000000000.AbC_123-x", created: false });
    expect(clickId("fb.1.1700000000000.old", "https://www.heywowboy.com/", 1)).toEqual({ value: "fb.1.1700000000000.old", created: false });
    expect(clickId(undefined, "https://www.heywowboy.com/", 1)).toEqual({ value: undefined, created: false });
    expect(clickId(undefined, "https://www.heywowboy.com/?fbclid=%3Cscript%3E", 1).value).toBeUndefined();
  });

  it("drops the query string from the source URL and checks the host", () => {
    expect(sourceUrl("https://www.heywowboy.com/pricing?fbclid=1&email=a@b.c")).toBe("https://www.heywowboy.com/pricing");
    expect(sameSitePage("https://www.heywowboy.com/x", "www.heywowboy.com")).toBe(true);
    expect(sameSitePage("https://evil.example/x", "www.heywowboy.com")).toBe(false);
    expect(sameSitePage("https://www.heywowboy.com/x", null)).toBe(false);
  });

  it("builds the Conversions API event the GTM pixel tags used to send", () => {
    const at = new Date(NOW * 1000);
    const base = { now: at, clientIp: "203.0.113.7", userAgent: "UA", fbp: "fb.1.1.2" };
    const view = relayEvent(
      { event: "page_view", event_id: "e1e1e1e1", page_url: "https://www.heywowboy.com/?fbclid=z" },
      base,
    );
    expect(view).toMatchObject({ eventName: "PageView", eventId: "e1e1e1e1", actionSource: "website", eventSourceUrl: "https://www.heywowboy.com/" });
    expect(view.customData).toBeUndefined();

    const pricing = relayEvent({ event: "view_pricing", event_id: "e2e2e2e2", page_url: "https://www.heywowboy.com/pricing" }, base);
    expect(pricing).toMatchObject({ eventName: "ViewContent", customData: { content_name: "pricing" } });

    const checkout = relayEvent(
      { event: "begin_checkout", event_id: "e3e3e3e3", page_url: "https://www.heywowboy.com/checkout", value: 149, currency: "USD" },
      base,
    );
    expect(checkout).toMatchObject({ eventName: "InitiateCheckout", customData: { value: 149, currency: "USD" } });

    const contact = relayEvent({ event: "contact_click", event_id: "e4e4e4e4", page_url: "https://www.heywowboy.com/contact" }, base);
    expect(contact.eventName).toBe("Contact");

    const payload = buildMetaPayload(view) as { data: Array<{ user_data: Record<string, unknown> }> };
    expect(payload.data[0].user_data).toEqual({ client_ip_address: "203.0.113.7", client_user_agent: "UA", fbp: "fb.1.1.2" });
  });
});

describe("lib/tracking/meta-relay (browser)", () => {
  const posts: Array<Record<string, unknown>> = [];

  async function load(marketing: boolean) {
    vi.resetModules();
    vi.doMock("@/lib/consent", async (original) => ({
      ...(await original<typeof import("@/lib/consent")>()),
      getConsent: () => ({ necessary: true, preferences: false, statistics: true, marketing, answered: true }),
    }));
    return import("@/lib/tracking/meta-relay");
  }

  beforeEach(() => {
    posts.length = 0;
    vi.stubEnv("NEXT_PUBLIC_TRACKING_DEBUG", "true");
    vi.stubEnv("NEXT_PUBLIC_TAG_MANAGER", "zaraz");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123");
    vi.stubGlobal("window", { location: { href: "https://www.heywowboy.com/pricing" } });
    vi.stubGlobal("fetch", (url: string, init: { body: string }) => {
      posts.push({ url, ...JSON.parse(init.body) });
      return Promise.resolve(new Response(null, { status: 204 }));
    });
  });
  afterEach(() => {
    vi.doUnmock("@/lib/consent");
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("relays only Meta's standard events, and only with marketing consent", async () => {
    const relay = await load(true);
    relay.relayMetaEvent("page_view", { page_location: "https://www.heywowboy.com/" }, "v1");
    relay.relayMetaEvent("faq_open", { question: "q" }, "f1");
    relay.relayMetaEvent("generate_lead", { form_name: "contact" }, "l1");
    relay.relayMetaEvent("begin_checkout", { plan: "once", value: 149, currency: "USD" }, "c1");
    expect(posts).toEqual([
      { url: "/api/meta/event", event: "page_view", event_id: "v1", page_url: "https://www.heywowboy.com/" },
      { url: "/api/meta/event", event: "begin_checkout", event_id: "c1", page_url: "https://www.heywowboy.com/pricing", value: 149, currency: "USD" },
    ]);

    const refused = await load(false);
    refused.relayMetaEvent("page_view", { page_location: "https://www.heywowboy.com/" }, "v2");
    expect(posts).toHaveLength(2);
  });

  it("sends the page's view once marketing is allowed on that page", async () => {
    const relay = await load(false);
    relay.relayMetaEvent("page_view", { page_location: "https://www.heywowboy.com/" }, "v3");
    expect(posts).toEqual([]);
    const granted = { necessary: true as const, preferences: false, statistics: true, marketing: true, answered: true };
    relay.applyMetaRelayConsent(granted);
    relay.applyMetaRelayConsent(granted);
    expect(posts).toEqual([{ url: "/api/meta/event", event: "page_view", event_id: "v3", page_url: "https://www.heywowboy.com/" }]);
  });

  it("stays off with GTM as the tag manager", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAG_MANAGER", "gtm");
    const relay = await load(true);
    relay.relayMetaEvent("page_view", { page_location: "https://www.heywowboy.com/" }, "v4");
    expect(posts).toEqual([]);
  });
});
