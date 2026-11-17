#!/usr/bin/env node
/**
 * Builds zaraz/config.json: the Cloudflare Zaraz configuration published on
 * the heywowboy.com zone. It was set up in the Zaraz dashboard on 17.11.2026
 * and read back from the API. Zaraz assigned the short IDs below (tool INqM,
 * action JTJn, purposes MwUo and vMnc), so they are kept as they are.
 *
 *   npm run zaraz:build
 *
 * How it works:
 * - The site sends every event with zaraz.track(name, params), see
 *   lib/tracking/zaraz.ts, and its own page_view on every route change.
 * - GA4 has one action, "Site events": every zaraz.track() call except Zaraz's
 *   own Pageview becomes a GA4 event with the same name and all its
 *   parameters. No event is marked as a conversion here: key events are set in
 *   GA4 itself.
 * - GA4 belongs to the Statistics purpose. Marketing is there for Google Ads
 *   and LinkedIn once they have accounts. The site's banner asks for consent;
 *   Zaraz never shows its modal and gets the choice from zaraz.consent.set(),
 *   matched to these purposes by name.
 * - Meta is not a Zaraz tool: its Conversions API needs an access token, and
 *   that token stays in Vercel. The site relays Meta's events through its own
 *   /api/meta/event (lib/tracking/meta-relay.ts).
 *
 * The configuration holds no secrets. The debug key and zarazVersion are
 * managed by Zaraz and left out.
 */
import { readFileSync, writeFileSync } from "node:fs";

const ids = JSON.parse(readFileSync(new URL("./ids.json", import.meta.url), "utf8"));

/** Purpose IDs assigned by Zaraz. lib/tracking/zaraz.ts finds them by name. */
export const PURPOSES = { statistics: "MwUo", marketing: "vMnc" };

const purpose = (name, description, order) => ({ name: { en: name }, description: { en: description }, order });

export const config = {
  consent: {
    buttonTextTranslations: { accept_all: {}, confirm_my_choices: {}, reject_all: {}, view_all_partners: {} },
    consentModalIntroHTMLWithTranslations: { en: "" },
    cookieName: "wb_zaraz_consent",
    customCSS: "",
    customIntroDisclaimerDismissed: true,
    defaultLanguage: "en",
    enabled: true,
    // The site's own banner asks. Zaraz only receives the choice.
    hideModal: true,
    purposesWithTranslations: {
      [PURPOSES.statistics]: purpose("Statistics", "Google Analytics 4", 0),
      [PURPOSES.marketing]: purpose("Marketing", "Google Ads, LinkedIn", 100),
    },
    tcfCompliant: false,
  },
  // Events come from zaraz.track() only. The dataLayer belongs to GTM.
  dataLayer: false,
  // The site sends page_view on every route change itself.
  historyChange: false,
  // The site is not proxied by Cloudflare: lib/tracking/zaraz.ts adds the
  // script from NEXT_PUBLIC_ZARAZ_HOST after consent.
  settings: { autoInjectScript: false },
  tools: {
    INqM: {
      actions: {
        JTJn: {
          actionType: "event",
          blockingTriggers: [],
          data: {
            __includeClient: true,
            __zaraz_setting_name: "Site events",
            conversion: false,
            en: "{{ client.__zarazTrack }}",
          },
          firingTriggers: ["AllTracks"],
        },
      },
      blockingTriggers: [],
      component: "google-analytics_v4",
      defaultFields: {},
      defaultPurpose: PURPOSES.statistics,
      enabled: true,
      name: "Google Analytics 4",
      // No client network requests and no client-side scripts: nothing goes
      // from the browser to google-analytics.com.
      permissions: ["access_client_kv", "server_network_requests"],
      settings: { tid: ids.ga4 },
      type: "component",
    },
  },
  triggers: {
    AllTracks: {
      description: "All zaraz.track() calls",
      excludeRules: [],
      loadRules: [
        { id: "rul1", match: "{{ client.__zarazTrack }}", op: "NOT_MATCH_REGEX", value: "^__zaraz.*" },
        { id: "rul2", match: "{{ client.__zarazEcommerce }}", op: "NOT_MATCH_REGEX", value: "true" },
        { id: "pgv2", match: "{{ client.__zarazTrack }}", op: "NOT_MATCH_REGEX", value: "^Pageview$" },
      ],
      name: "All Tracks",
    },
    Pageview: {
      clientRules: [],
      description: "All page loads",
      excludeRules: [],
      loadRules: [{ match: "{{ client.__zarazTrack }}", op: "EQUALS", value: "Pageview" }],
      name: "Pageview",
      system: "pageload",
    },
  },
  variables: {},
};

// Google Ads and LinkedIn are added the same way once their accounts exist.
for (const missing of ["googleAds", "linkedin"]) {
  if (ids[missing]) {
    throw new Error(`zaraz/ids.json has ${missing}, but build-config.mjs has no tool for it yet.`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  writeFileSync(new URL("./config.json", import.meta.url), `${JSON.stringify(config, null, 2)}\n`);
  console.log(
    `zaraz/config.json: ${Object.keys(config.tools).length} tools, ${Object.keys(config.triggers).length} triggers.`,
  );
}
