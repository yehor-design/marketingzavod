#!/usr/bin/env node
/**
 * Builds zaraz/config.json, the Cloudflare Zaraz configuration, from the same
 * event plan as the GTM container (gtm/events.json).
 *
 *   npm run zaraz:build
 *
 * The site sends every event with zaraz.track(name, params), see
 * lib/tracking/zaraz.ts. Each event has a trigger that matches its name. The
 * GA4 tool maps those triggers to GA4 events, the same mapping as the GTM
 * container. Every tool belongs to a consent purpose: GA4 to statistics,
 * Google Ads and LinkedIn (once they have accounts) to marketing. Meta is
 * relayed by the site's own server, see below.
 *
 * Public IDs come from zaraz/ids.json. A tool without an ID is left out.
 * The configuration holds no secrets.
 */
import { readFileSync, writeFileSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const plan = read("../gtm/events.json");
const ids = read("./ids.json");

const pascal = (name) => name.replace(/(^|_)([a-z])/g, (_, __, letter) => letter.toUpperCase());
const client = (key) => `{{ client.${key} }}`;

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

// Meta is not a Zaraz tool: its Conversions API needs an access token, and
// that token stays in Vercel. The site relays Meta's events through its own
// /api/meta/event instead (lib/tracking/meta-relay.ts).

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
      marketing: purpose("Marketing", "Google Ads, LinkedIn", 1),
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
  variables: {},
};

if (import.meta.url === `file://${process.argv[1]}`) {
  writeFileSync(new URL("./config.json", import.meta.url), `${JSON.stringify(config, null, 2)}\n`);
  console.log(
    `zaraz/config.json: ${Object.keys(tools).length} tools, ${Object.keys(triggers).length} triggers.`,
  );
}
