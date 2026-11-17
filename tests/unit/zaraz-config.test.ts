import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { META_BROWSER_EVENTS, META_SERVER_LEAD_EVENTS } from "@/lib/meta/browser-events";
import { TRACK_EVENT_NAMES } from "@/lib/tracking/events";
import { config as built, PURPOSES } from "../../zaraz/build-config.mjs";

type Rule = { match: string; op: string; value: string };
type Trigger = { name: string; loadRules: Rule[]; system?: string };
type Action = { actionType: string; firingTriggers: string[]; data: Record<string, unknown> };
type Tool = {
  component: string;
  enabled: boolean;
  defaultPurpose: string;
  permissions: string[];
  settings: Record<string, unknown>;
  actions: Record<string, Action>;
};

const committed = JSON.parse(readFileSync("zaraz/config.json", "utf8"));
const container = JSON.parse(readFileSync("gtm/container.json", "utf8"));
const triggers = committed.triggers as Record<string, Trigger>;
const tools = committed.tools as Record<string, Tool>;

/** Whether a zaraz.track(name) call passes a trigger's rules (the ops the config uses). */
function fires(trigger: Trigger, name: string): boolean {
  return trigger.loadRules.every((rule) => {
    const value = rule.match === "{{ client.__zarazTrack }}" ? name : "";
    switch (rule.op) {
      case "EQUALS":
        return value === rule.value;
      case "NOT_MATCH_REGEX":
        return !new RegExp(rule.value).test(value);
      default:
        throw new Error(`Unhandled op ${rule.op}`);
    }
  });
}

describe("zaraz/config.json", () => {
  it("is the output of zaraz/build-config.mjs", () => {
    expect(committed).toEqual(built);
  });

  it("sends every event the site tracks to GA4 under its own name, with its parameters", () => {
    const ga4 = Object.values(tools).find((tool) => tool.component === "google-analytics_v4")!;
    const actions = Object.values(ga4.actions);
    expect(actions).toHaveLength(1);
    const [action] = actions;
    expect(action.actionType).toBe("event");
    expect(action.data).toMatchObject({ en: "{{ client.__zarazTrack }}", __includeClient: true, conversion: false });
    for (const name of TRACK_EVENT_NAMES) {
      expect(action.firingTriggers.some((id) => fires(triggers[id], name)), name).toBe(true);
    }
    // Zaraz's own Pageview never reaches GA4: the site's page_view does.
    expect(action.firingTriggers.some((id) => fires(triggers[id], "Pageview"))).toBe(false);
  });

  it("puts GA4 under the Statistics purpose and lets the site's banner ask", () => {
    const purposes = committed.consent.purposesWithTranslations as Record<string, { name: { en: string } }>;
    expect(purposes[PURPOSES.statistics].name.en).toBe("Statistics");
    expect(purposes[PURPOSES.marketing].name.en).toBe("Marketing");
    expect(committed.consent).toMatchObject({ enabled: true, hideModal: true, cookieName: "wb_zaraz_consent" });
    for (const tool of Object.values(tools)) {
      expect(Object.keys(purposes)).toContain(tool.defaultPurpose);
      expect(tool.enabled).toBe(true);
    }
    expect(Object.values(tools)[0].defaultPurpose).toBe(PURPOSES.statistics);
  });

  it("keeps the browser away from google-analytics.com and leaves page views and the script to the site", () => {
    for (const tool of Object.values(tools)) {
      expect(tool.permissions.sort()).toEqual(["access_client_kv", "server_network_requests"]);
    }
    expect(committed.historyChange).toBe(false);
    expect(committed.dataLayer).toBe(false);
    expect(committed.settings.autoInjectScript).toBe(false);
  });

  it("leaves Meta to the site's relay, which with /api/lead covers the GTM pixel events", () => {
    expect(Object.values(tools).map((tool) => tool.component)).not.toContain("facebook-pixel");
    const gtmMeta = (container.containerVersion.tag as Array<{ name: string }>)
      .map((tag) => tag.name)
      .filter((name) => name.startsWith("Meta - "))
      .map((name) => name.slice("Meta - ".length))
      .sort();
    const relayed = [...Object.values(META_BROWSER_EVENTS), ...Object.values(META_SERVER_LEAD_EVENTS)].sort();
    expect(relayed).toEqual(gtmMeta);
  });

  it("holds no secret", () => {
    expect(committed.variables).toEqual({});
    expect(committed).not.toHaveProperty("debugKey");
    expect(JSON.stringify(committed)).not.toMatch(/EAA[A-Za-z0-9]{20,}|accessToken|secret/i);
  });
});
