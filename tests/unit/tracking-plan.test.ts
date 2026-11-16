import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TRACK_EVENT_NAMES } from "@/lib/tracking/events";
import { gtmConfig } from "@/lib/tracking/env";

type Param = { type: string; key?: string; value?: string; list?: Param[]; map?: Param[] };
type Tag = {
  name: string;
  type: string;
  parameter: Param[];
  firingTriggerId: string[];
  blockingTriggerId: string[];
  consentSettings: { consentStatus: string; consentType?: { list: Array<{ value: string }> } };
};

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const plan = JSON.parse(read("gtm/events.json")) as {
  events: Array<{ name: string; params: string[] }>;
  config: string[];
};
const container = JSON.parse(read("gtm/container.json")).containerVersion as {
  tag: Tag[];
  trigger: Array<{ triggerId: string; name: string }>;
  variable: Array<{ name: string }>;
  customTemplate: Array<{ templateData: string }>;
};

describe("one event list for code, plan and container", () => {
  it("gtm/events.json lists exactly the events of lib/tracking/events.ts", () => {
    expect(plan.events.map((event) => event.name)).toEqual([...TRACK_EVENT_NAMES]);
  });

  it("docs/tracking-plan.md documents every event and parameter", () => {
    const doc = read("docs/tracking-plan.md");
    for (const event of plan.events) {
      expect(doc, event.name).toContain(`\`${event.name}\``);
      for (const param of event.params) {
        expect(doc, `${event.name}.${param}`).toContain(`\`${param}\``);
      }
    }
  });

  it("the container reads every ID the site pushes", () => {
    const pushed = Object.keys(gtmConfig()).filter((key) => key !== "tracking_debug");
    expect(pushed.sort()).toEqual([...plan.config].sort());
    for (const key of plan.config) {
      expect(container.variable.map((variable) => variable.name)).toContain(`ID - ${key}`);
    }
  });
});

describe("gtm/container.json", () => {
  const tag = (name: string) => {
    const found = container.tag.find((item) => item.name === name);
    if (!found) {
      throw new Error(`Tag not found: ${name}`);
    }
    return found;
  };
  const triggerId = (name: string) => container.trigger.find((item) => item.name === name)?.triggerId;

  it("has a trigger, a GA4 tag and variables for every event", () => {
    const variables = container.variable.map((variable) => variable.name);
    for (const event of plan.events) {
      const id = triggerId(`CE - ${event.name}`);
      expect(id, event.name).toBeDefined();
      expect(tag(`GA4 - ${event.name}`).firingTriggerId).toEqual([id]);
      for (const param of event.params) {
        expect(variables).toContain(`DLV - ${param}`);
      }
    }
  });

  it("fires Cookiebot on Consent Initialization with everything denied", () => {
    const cookiebot = tag("Cookiebot CMP");
    expect(cookiebot.firingTriggerId).toEqual(["2147479572"]);
    const row = cookiebot.parameter.find((param) => param.key === "regionSettings")?.list?.[0].map ?? [];
    const defaults = Object.fromEntries(row.map((item) => [item.key, item.value]));
    expect(defaults).toEqual({
      region: "",
      defaultConsentPreferences: "denied",
      defaultConsentStatistics: "denied",
      defaultConsentMarketing: "denied",
      defaultConsentMarketingAdUserData: "denied",
      defaultConsentMarketingAdPersonalization: "denied",
    });
    expect(container.customTemplate[0].templateData).toContain("setDefaultConsentState");
  });

  it("lets no other tag fire on Consent Initialization", () => {
    const early = container.tag.filter((item) => item.firingTriggerId.includes("2147479572"));
    expect(early.map((item) => item.name)).toEqual(["Cookiebot CMP"]);
  });

  it("holds every tag back while Cookiebot is not configured", () => {
    const block = triggerId("Block - Cookiebot ID missing");
    for (const item of container.tag) {
      expect(item.blockingTriggerId, item.name).toContain(block);
    }
  });

  it("requires consent for every tag without built-in consent checks", () => {
    const required = (item: Tag) => item.consentSettings.consentType?.list.map((entry) => entry.value) ?? [];
    for (const item of container.tag) {
      if (item.name.startsWith("Meta - ") || item.name.startsWith("LinkedIn - ")) {
        expect(required(item), item.name).toEqual(["ad_storage"]);
      }
    }
    expect(required(tag("Clarity - Base"))).toEqual(["analytics_storage"]);
    expect(required(tag("Clarity - Form tag"))).toEqual(["analytics_storage"]);
  });

  it("turns off the automatic GA4 page_view", () => {
    const settings = tag("GA4 - Google tag").parameter.find((param) => param.key === "configSettingsTable");
    expect(settings?.list?.[0].map).toEqual([
      { type: "TEMPLATE", key: "parameter", value: "send_page_view" },
      { type: "TEMPLATE", key: "parameterValue", value: "false" },
    ]);
  });

  it("uses event_id as the Google Ads transaction ID and the Meta eventID", () => {
    for (const item of container.tag.filter((entry) => entry.type === "awct")) {
      expect(item.parameter.find((param) => param.key === "orderId")?.value).toBe("{{DLV - event_id}}");
    }
    for (const item of container.tag.filter((entry) => entry.name.startsWith("Meta - "))) {
      expect(item.parameter[0].value, item.name).toContain("eventID:");
    }
  });

  it("is up to date with the generator", async () => {
    const before = read("gtm/container.json");
    await import("../../gtm/build-container.mjs");
    expect(read("gtm/container.json")).toBe(before);
  });
});
