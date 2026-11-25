import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse("2026-11-17T12:00:00.000Z");

type Call = { url: string; method: string; body?: unknown };

/** A fake HubSpot and Meta behind fetch. */
function backend(deals: Array<{ id: string; properties: Record<string, string | null> }>, consent = "true") {
  const calls: Call[] = [];
  vi.stubGlobal("fetch", async (input: string | URL, init: RequestInit = {}) => {
    const url = String(input);
    const method = init.method ?? "GET";
    const body = init.body ? JSON.parse(String(init.body)) : undefined;
    calls.push({ url, method, body });
    const json = (data: unknown) => new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
    if (url.includes("/crm/v3/objects/deals/search")) {
      return json({ results: deals });
    }
    if (url.includes("/associations/contacts")) {
      return json({ results: [{ toObjectId: 77 }] });
    }
    if (url.includes("/crm/v3/objects/contacts/77")) {
      return json({ id: "77", properties: { email: "jane@example.com", mz_consent_marketing: consent, mz_fbp: "fb.1.1.1" } });
    }
    if (url.includes("/crm/v3/objects/deals/") && method === "PATCH") {
      // Like HubSpot, keep the change for the next search.
      const id = url.split("/").pop();
      const stored = deals.find((deal) => deal.id === id);
      Object.assign(stored?.properties ?? {}, (body as { properties: Record<string, string> }).properties);
      return json({});
    }
    if (url.includes("graph.facebook.com")) {
      return json({ events_received: 1 });
    }
    return new Response("not found", { status: 404 });
  });
  return calls;
}

async function load() {
  vi.resetModules();
  return import("@/lib/offline/meta-sync");
}

describe("lib/offline/meta-sync", () => {
  beforeEach(() => {
    vi.stubEnv("META_CAPI_ACCESS_TOKEN", "meta-test-token");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123");
    vi.stubEnv("META_TEST_EVENT_CODE", "");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("reports every stage a deal reached since the last run, once", async () => {
    const deal = {
      id: "9",
      properties: {
        dealstage: "closedwon",
        mz_lead_id: "lead-1",
        mz_offline_sent: null,
        hs_v2_date_entered_qualifiedtobuy: new Date(NOW - 2 * DAY).toISOString(),
        hs_v2_date_entered_closedwon: new Date(NOW - DAY).toISOString(),
      },
    };
    const calls = backend([deal]);
    const { syncMetaOfflineConversions } = await load();

    const results = await syncMetaOfflineConversions("hs-token", NOW);
    expect(results).toEqual([
      { deal: "9", conversion: "qualified_lead", status: "sent" },
      { deal: "9", conversion: "deal_won", status: "sent" },
    ]);
    const metaEvents = calls
      .filter((call) => call.url.includes("graph.facebook.com"))
      .map((call) => (call.body as { data: Array<{ event_name: string; event_id: string; action_source: string }> }).data[0]);
    expect(metaEvents.map((event) => [event.event_name, event.event_id, event.action_source])).toEqual([
      ["QualifiedLead", "lead-1:qualified_lead", "system_generated"],
      ["DealWon", "lead-1:deal_won", "system_generated"],
    ]);
    const patches = calls.filter((call) => call.method === "PATCH").map((call) => call.body);
    expect(patches).toEqual([
      { properties: { mz_offline_sent: "qualified_lead" } },
      { properties: { mz_offline_sent: "qualified_lead,deal_won" } },
    ]);

    // The deal now says both were sent: a second run reports nothing.
    const again = await syncMetaOfflineConversions("hs-token", NOW);
    expect(again).toEqual([]);
  });

  it("skips leads without marketing consent and conversions Meta would reject as too old", async () => {
    const fresh = {
      id: "1",
      properties: { dealstage: "closedwon", mz_lead_id: "l1", hs_v2_date_entered_closedwon: new Date(NOW - DAY).toISOString() },
    };
    const old = {
      id: "2",
      properties: { dealstage: "closedwon", mz_lead_id: "l2", hs_v2_date_entered_closedwon: new Date(NOW - 8 * DAY).toISOString() },
    };
    const calls = backend([fresh, old], "false");
    const { syncMetaOfflineConversions } = await load();
    expect(await syncMetaOfflineConversions("hs-token", NOW)).toEqual([
      { deal: "1", conversion: "deal_won", status: "skipped_no_consent" },
      { deal: "2", conversion: "deal_won", status: "skipped_too_old" },
    ]);
    expect(calls.some((call) => call.url.includes("graph.facebook.com"))).toBe(false);
    expect(calls.some((call) => call.method === "PATCH")).toBe(false);
  });

  it("searches website deals changed in the last seven days, in any stage", async () => {
    const calls = backend([]);
    const { syncMetaOfflineConversions } = await load();
    await syncMetaOfflineConversions("hs-token", NOW);
    const search = calls.find((call) => call.url.includes("/deals/search"))!.body as {
      filterGroups: Array<{ filters: Array<{ propertyName: string; operator: string; value?: string }> }>;
    };
    expect(search.filterGroups[0].filters).toEqual([
      { propertyName: "hs_lastmodifieddate", operator: "GTE", value: String(NOW - 7 * DAY) },
      { propertyName: "mz_lead_id", operator: "HAS_PROPERTY" },
    ]);
  });

  it("treats the current stage as reached when HubSpot has no entry date", async () => {
    const { reachedConversions } = await load();
    const reached = reachedConversions({
      id: "3",
      properties: { dealstage: "qualifiedtobuy", hs_lastmodifieddate: "2026-11-17T10:00:00Z" },
    });
    expect(reached.map((item) => [item.conversion.key, item.at])).toEqual([["qualified_lead", "2026-11-17T10:00:00.000Z"]]);
    expect(reachedConversions({ id: "4", properties: { dealstage: "closedwon", hs_lastmodifieddate: "garbage" } })).toEqual([]);
  });
});
