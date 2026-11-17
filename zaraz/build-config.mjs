#!/usr/bin/env node
/**
 * Builds zaraz/config.json, the Cloudflare Zaraz configuration, from the same
 * event plan as the GTM container (gtm/events.json).
 *
 *   npm run zaraz:build
 *
 * The site sends every event with zaraz.track(name, params), see
 * lib/tracking/zaraz.ts. Each event has a trigger that matches its name. The
 * tools map those triggers to GA4 events and Meta standard events, the same
 * mapping as the GTM container. Every tool belongs to a consent purpose:
 * GA4 to statistics, Meta, Google Ads and LinkedIn to marketing.
 *
 * Public IDs come from zaraz/ids.json. A tool without an ID is left out.
 * Secrets never go in this file: the Meta access token is a Zaraz secret
 * variable whose value zaraz/publish.mjs sends from the environment.
 */
import { readFileSync, writeFileSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const plan = read("../gtm/events.json");
const ids = read("./ids.json");

const pascal = (name) => name.replace(/(^|_)([a-z])/g, (_, __, letter) => letter.toUpperCase());
const client = (key) => `{{ client.${key} }}`;

/** The variable that holds the Meta Conversions API token. Its value is set by publish.mjs. */
export const META_TOKEN_VARIABLE = "metaCapiToken";

// Triggers: one per event, matched on the name given to zaraz.track().
const triggers = {};
const triggerId = (name) => `ev${pascal(name)}`;

function addTrigger(id, name, description, rules) {
  triggers[id] = {
    name,
    description,
    loadRules: rules.map(([match, value], index) => ({ id: `${id}r${index}`, match, op: "EQUALS", value })),
    excludeRules: [],
    clientRules: [],
  };
}

for (const event of plan.events) {
  addTrigger(triggerId(event.name), event.name, `zaraz.track("${event.name}")`, [
    ["{{ client.__zarazTrack }}", event.name],
  ]);
}
// The GTM container fires the lead conversions for Contact only: Waitlist has
// join_waitlist (CompleteRegistration) of its own.
const LEAD_CONTACT = "evGenerateLeadContact";
addTrigger(LEAD_CONTACT, "generate_lead (contact)", 'zaraz.track("generate_lead") from the Contact form', [
  ["{{ client.__zarazTrack }}", "generate_lead"],
  [client("form_name"), "contact"],
]);

const action = (actionType, firing, name, data = {}) => ({
  actionType,
  firingTriggers: [firing],
  blockingTriggers: [],
  data: { __zaraz_setting_name: name, ...data },
});

const tools = {};

// GA4. The site reports one page_view per route, so the pageview action
// listens to that event and not to Zaraz's own Pageview trigger.
if (ids.ga4) {
  const actions = {};
  for (const event of plan.events) {
    const params = Object.fromEntries(
      [...event.params, ...plan.sharedParams].map((key) => [key, client(key)]),
    );
    if (event.name === "page_view") {
      actions.pageView = action("pageview", triggerId(event.name), "page_view", {
        ...params,
        dl: client("page_location"),
        dt: client("page_title"),
      });
    } else {
      actions[pascal(event.name).replace(/^./, (c) => c.toLowerCase())] = action(
        "event",
        triggerId(event.name),
        event.name,
        { en: event.name, ...params },
      );
    }
  }
  tools.ga4 = {
    type: "component",
    component: "google-analytics_v4",
    name: "Google Analytics 4",
    enabled: true,
    defaultPurpose: "statistics",
    permissions: ["access_client_kv", "server_network_requests"],
    // The original IP gives GA4 the visitor's country. GA4 does not store it.
    settings: { tid: ids.ga4, hideOriginalIP: false, ecommerce: false, "ga-audiences": false },
    defaultFields: {},
    blockingTriggers: [],
    actions,
  };
}

// Meta. Zaraz sends these through the Conversions API from Cloudflare. The
// event_id is the one the server uses for Lead, so Meta deduplicates them.
if (ids.metaPixel) {
  const meta = (ev, extra = {}) => ({ ev, event_id: client("event_id"), ...extra });
  tools.metaPixel = {
    type: "component",
    component: "facebook-pixel",
    name: "Meta Pixel",
    enabled: true,
    defaultPurpose: "marketing",
    permissions: ["access_client_kv", "server_network_requests"],
    settings: { property: ids.metaPixel, accessToken: `{{ $$${META_TOKEN_VARIABLE}$$ }}` },
    defaultFields: {},
    blockingTriggers: [],
    actions: {
      pageView: action("pageview", triggerId("page_view"), "PageView", { event_id: client("event_id") }),
      lead: action("event", LEAD_CONTACT, "Lead", meta("Lead")),
      completeRegistration: action("event", triggerId("join_waitlist"), "CompleteRegistration", meta("CompleteRegistration")),
      initiateCheckout: action(
        "event",
        triggerId("begin_checkout"),
        "InitiateCheckout",
        meta("InitiateCheckout", { value: client("value"), currency: client("currency") }),
      ),
      viewContent: action("event", triggerId("view_pricing"), "ViewContent", meta("ViewContent", { content_name: "pricing" })),
      contact: action("event", triggerId("contact_click"), "Contact", meta("Contact")),
    },
  };
}

// Google Ads and LinkedIn are added the same way once their accounts exist
// (ids.googleAds, ids.linkedin). Until then they are not configured at all.
for (const missing of ["googleAds", "linkedin"]) {
  if (ids[missing]) {
    throw new Error(`zaraz/ids.json has ${missing}, but build-config.mjs has no tool for it yet.`);
  }
}

const purpose = (name, description, order) => ({ name: { en: name }, description: { en: description }, order });

export const config = {
  // The site's own banner asks for consent. Zaraz only receives the choice
  // through zaraz.consent.set() and never shows its modal.
  consent: {
    enabled: true,
    hideModal: true,
    cookieName: "wb_zaraz_consent",
    defaultLanguage: "en",
    customIntroDisclaimerDismissed: true,
    tcfCompliant: false,
    purposesWithTranslations: {
      statistics: purpose("Statistics", "Google Analytics 4", 0),
      marketing: purpose("Marketing", "Meta, Google Ads, LinkedIn", 1),
    },
  },
  // Events come from zaraz.track() only. The dataLayer belongs to GTM.
  dataLayer: false,
  // The site sends page_view on every route change itself.
  historyChange: false,
  settings: {
    // The site is not proxied by Cloudflare, so the script tag is added by the
    // site (lib/tracking/zaraz.ts) after consent.
    autoInjectScript: false,
    cookieDomain: "heywowboy.com",
    ecommerce: false,
    hideExternalReferer: false,
    hideIPAddress: false,
    // UTM parameters in the URL are needed for attribution in GA4.
    hideQueryParams: false,
    hideUserAgent: false,
    injectIframes: false,
  },
  analytics: { enabled: true, defaultPurpose: "statistics", sessionExpTime: 1800 },
  tools,
  triggers,
  variables: {
    ...(ids.metaPixel && { [META_TOKEN_VARIABLE]: { name: "Meta Conversions API token", type: "secret", value: "" } }),
  },
};

if (import.meta.url === `file://${process.argv[1]}`) {
  writeFileSync(new URL("./config.json", import.meta.url), `${JSON.stringify(config, null, 2)}\n`);
  console.log(
    `zaraz/config.json: ${Object.keys(tools).length} tools, ${Object.keys(triggers).length} triggers.`,
  );
}
