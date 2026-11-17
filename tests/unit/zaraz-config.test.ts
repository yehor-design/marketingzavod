import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TRACK_EVENT_NAMES } from "@/lib/tracking/events";
import { config as built } from "../../zaraz/build-config.mjs";

type Rule = { match: string; op: string; value: string };
type Trigger = { name: string; loadRules: Rule[]; excludeRules: unknown[] };
type Action = { actionType: string; firingTriggers: string[]; data: Record<string, string> };
type Tool = {
  component: string;
  enabled: boolean;
  defaultPurpose: string;
  permissions: string[];
  settings: Record<string, unknown>;
  actions: Record<string, Action>;
};

const committed = JSON.parse(readFileSync("zaraz/config.json", "utf8"));
const plan = JSON.parse(readFileSync("gtm/events.json", "utf8")) as {
  events: Array<{ name: string; params: string[] }>;
  sharedParams: string[];
};
const container = JSON.parse(readFileSync("gtm/container.json", "utf8"));

const triggers = committed.triggers as Record<string, Trigger>;
const tools = committed.tools as Record<string, Tool>;

describe("zaraz/config.json", () => {
  it("is the output of zaraz/build-config.mjs", () => {
    expect(committed).toEqual(built);
  });

  it("has a trigger for every event the site sends, matched on its name", () => {
    for (const name of TRACK_EVENT_NAMES) {
      const matching = Object.values(triggers).filter(
        (trigger) =>
          trigger.loadRules.length === 1 &&
          trigger.loadRules[0].match === "{{ client.__zarazTrack }}" &&
          trigger.loadRules[0].op === "EQUALS" &&
          trigger.loadRules[0].value === name,
      );
      expect(matching, name).toHaveLength(1);
    }
  });

  it("puts every tool under a consent purpose the site sets", () => {
    const purposes = Object.keys(committed.consent.purposesWithTranslations).sort();
    // The keys lib/tracking/zaraz.ts passes to zaraz.consent.set().
    expect(purposes).toEqual(["marketing", "statistics"]);
    expect(committed.consent).toMatchObject({ enabled: true, hideModal: true });
    for (const [id, tool] of Object.entries(tools)) {
      expect(purposes, id).toContain(tool.defaultPurpose);
      expect(tool.enabled).toBe(true);
      expect(tool.permissions, id).not.toContain("execute_unsafe_scripts");
    }
    expect(tools.ga4.defaultPurpose).toBe("statistics");
    expect(tools.metaPixel.defaultPurpose).toBe("marketing");
  });

  it("leaves page views and the script tag to the site", () => {
    expect(committed.historyChange).toBe(false);
    expect(committed.dataLayer).toBe(false);
    expect(committed.settings.autoInjectScript).toBe(false);
    for (const tool of Object.values(tools)) {
      for (const action of Object.values(tool.actions)) {
        expect(action.firingTriggers).not.toContain("Pageview");
        for (const trigger of action.firingTriggers) {
          expect(triggers[trigger], trigger).toBeDefined();
        }
      }
    }
  });

  it("sends GA4 every event with the parameters from the tracking plan", () => {
    const actions = Object.values(tools.ga4.actions);
    expect(actions).toHaveLength(plan.events.length);
    for (const event of plan.events) {
      const action = actions.find((candidate) => candidate.data.__zaraz_setting_name === event.name);
      expect(action, event.name).toBeDefined();
      for (const key of [...event.params, ...plan.sharedParams]) {
        expect(action!.data[key], `${event.name}.${key}`).toBe(`{{ client.${key} }}`);
      }
      if (event.name !== "page_view") {
        expect(action!.data.en).toBe(event.name);
      }
    }
  });

  it("sends Meta the same standard events as the GTM container, with the shared event_id", () => {
    const gtmMeta = (container.containerVersion.tag as Array<{ name: string }>)
      .map((tag) => tag.name)
      .filter((name) => name.startsWith("Meta - "))
      .map((name) => name.slice("Meta - ".length))
      .sort();
    const zarazMeta = Object.values(tools.metaPixel.actions)
      .map((action) => action.data.__zaraz_setting_name)
      .sort();
    expect(zarazMeta).toEqual(gtmMeta);
    for (const action of Object.values(tools.metaPixel.actions)) {
      expect(action.data.event_id).toBe("{{ client.event_id }}");
    }
    // Lead fires for the Contact form only, as in GTM.
    const lead = Object.values(tools.metaPixel.actions).find((action) => action.data.ev === "Lead")!;
    expect(triggers[lead.firingTriggers[0]].loadRules.map((rule) => rule.value)).toEqual([
      "generate_lead",
      "contact",
    ]);
  });

  it("holds no secret", () => {
    for (const variable of Object.values(committed.variables) as Array<{ type: string; value: string }>) {
      if (variable.type === "secret") {
        expect(variable.value).toBe("");
      }
    }
    expect(JSON.stringify(committed)).not.toMatch(/EAA[A-Za-z0-9]{20,}/);
  });
});
