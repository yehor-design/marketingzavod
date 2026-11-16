#!/usr/bin/env node
/**
 * Generates gtm/container.json, a GTM web container export ready for
 * Admin → Import Container. Edit this file or gtm/events.json, then run
 * `npm run gtm:build`. Never edit container.json by hand.
 *
 * Service IDs are not written into the container. The site pushes them into
 * the dataLayer from its environment variables before GTM starts, and the
 * container reads them through "ID - …" variables. A tag whose ID is missing
 * is held back by a blocking trigger, so an unset variable keeps it inactive.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const { events, sharedParams, config } = JSON.parse(readFileSync(join(here, "events.json"), "utf8"));

const ACCOUNT = "0";
const CONTAINER = "0";
const FINGERPRINT = "1794787200000";

/** Built-in "All Pages" style triggers have fixed IDs in every container. */
const BUILT_IN = {
  consentInit: "2147479572",
  init: "2147479573",
};

let nextId = 1;
const id = () => String(nextId++);
const base = () => ({ accountId: ACCOUNT, containerId: CONTAINER, fingerprint: FINGERPRINT });

const template = (key, value) => ({ type: "TEMPLATE", key, value: String(value) });
const bool = (key, value) => ({ type: "BOOLEAN", key, value: String(value) });
const int = (key, value) => ({ type: "INTEGER", key, value: String(value) });
const ref = (name) => `{{${name}}}`;

// ---------------------------------------------------------------- variables
const variables = [];
const addVariable = (name, type, parameter) => {
  variables.push({ ...base(), variableId: id(), name, type, parameter });
  return name;
};
const dataLayerVariable = (name, key) =>
  addVariable(name, "v", [int("dataLayerVersion", 2), bool("setDefaultValue", false), template("name", key)]);

const paramNames = [...new Set([...events.flatMap((event) => event.params), ...sharedParams])];
const DLV = Object.fromEntries(paramNames.map((key) => [key, dataLayerVariable(`DLV - ${key}`, key)]));
const ID = Object.fromEntries(config.map((key) => [key, dataLayerVariable(`ID - ${key}`, key)]));

dataLayerVariable("DLV - user_data.email", "user_data.email");
dataLayerVariable("DLV - user_data.phone_number", "user_data.phone_number");

// Google Ads tags take the numeric part of AW-123456789.
const ADS_NUMERIC = addVariable("JS - Google Ads conversion ID", "jsm", [
  template(
    "javascript",
    `function(){var v=${ref(ID.google_ads_id)}||'';return String(v).replace(/^AW-/,'');}`,
  ),
]);

// Enhanced Conversions. The site puts user_data in the dataLayer for the lead
// event only, with ad_user_data consent, and removes it right after.
const USER_DATA = addVariable("User-Provided Data - lead form", "awec", [
  template("mode", "MANUAL"),
  template("email", ref("DLV - user_data.email")),
  template("phone_number", ref("DLV - user_data.phone_number")),
]);

// ----------------------------------------------------------------- triggers
const triggers = [];
const eventFilter = (name) => [
  { type: "EQUALS", parameter: [template("arg0", "{{_event}}"), template("arg1", name)] },
];
const addEventTrigger = (name, eventName, filter) => {
  const triggerId = id();
  triggers.push({
    ...base(),
    triggerId,
    name,
    type: "CUSTOM_EVENT",
    customEventFilter: eventFilter(eventName),
    ...(filter ? { filter } : {}),
  });
  return triggerId;
};
const equals = (variable, value) => ({
  type: "EQUALS",
  parameter: [template("arg0", ref(variable)), template("arg1", value)],
});

const CE = Object.fromEntries(
  events.map((event) => [event.name, addEventTrigger(`CE - ${event.name}`, event.name)]),
);
const CE_LEAD_CONTACT = addEventTrigger("CE - generate_lead - contact", "generate_lead", [
  equals(DLV.form_name, "contact"),
]);
// Pushed by Cookiebot whenever the visitor's choice is known or changes.
const CE_CONSENT_UPDATE = addEventTrigger("CE - cookie_consent_update", "cookie_consent_update");

/** Fires on every event while the ID does not look valid. Used as an exception. */
const addBlock = (name, variable, pattern) => {
  const triggerId = id();
  triggers.push({
    ...base(),
    triggerId,
    name,
    type: "CUSTOM_EVENT",
    customEventFilter: [
      { type: "MATCH_REGEX", parameter: [template("arg0", "{{_event}}"), template("arg1", ".*")] },
    ],
    filter: [
      {
        type: "MATCH_REGEX",
        parameter: [template("arg0", ref(variable)), template("arg1", pattern), bool("negate", true)],
      },
    ],
  });
  return triggerId;
};

const BLOCK = {
  cookiebot: addBlock("Block - Cookiebot ID missing", ID.cookiebot_id, "^[0-9a-fA-F-]{36}$"),
  ga4: addBlock("Block - GA4 ID missing", ID.ga4_id, "^G-[A-Z0-9]+$"),
  clarity: addBlock("Block - Clarity ID missing", ID.clarity_id, "^[a-z0-9]{6,}$"),
  ads: addBlock("Block - Google Ads ID missing", ID.google_ads_id, "^AW-[0-9]+$"),
  adsContact: addBlock("Block - Ads label missing - contact", ID.google_ads_label_contact, "^.+$"),
  adsWaitlist: addBlock("Block - Ads label missing - waitlist", ID.google_ads_label_waitlist, "^.+$"),
  adsCheckout: addBlock("Block - Ads label missing - checkout", ID.google_ads_label_checkout, "^.+$"),
  adsContactClick: addBlock(
    "Block - Ads label missing - contact click",
    ID.google_ads_label_contact_click,
    "^.+$",
  ),
  meta: addBlock("Block - Meta Pixel ID missing", ID.meta_pixel_id, "^[0-9]{5,}$"),
  linkedin: addBlock("Block - LinkedIn Partner ID missing", ID.linkedin_partner_id, "^[0-9]+$"),
  linkedinContact: addBlock(
    "Block - LinkedIn conversion missing - contact",
    ID.linkedin_conversion_contact,
    "^[0-9]+$",
  ),
  linkedinWaitlist: addBlock(
    "Block - LinkedIn conversion missing - waitlist",
    ID.linkedin_conversion_waitlist,
    "^[0-9]+$",
  ),
};

// --------------------------------------------------------------------- tags
/**
 * Consent settings.
 * - Google tags (GA4, Google Ads) have built-in consent checks. They are not
 *   given an additional requirement: with consent denied they must still send
 *   cookieless pings (gcs=G100) so Consent Mode modelling works.
 * - Every other vendor has no built-in checks, so it gets an explicit
 *   requirement and does not load at all without it.
 */
const builtInConsent = { consentStatus: "NOT_NEEDED" };
const requires = (...types) => ({
  consentStatus: "NEEDED",
  consentType: { type: "LIST", list: types.map((value) => ({ type: "TEMPLATE", value })) },
});

const tags = [];
const addTag = ({ name, type, parameter, firing, blocking = [], consent, once = false, notes }) => {
  tags.push({
    ...base(),
    tagId: id(),
    name,
    type,
    parameter,
    firingTriggerId: firing,
    // No tag other than Cookiebot itself may run while Cookiebot is not configured.
    blockingTriggerId: [...new Set([...blocking, BLOCK.cookiebot])],
    tagFiringOption: once ? "ONCE_PER_LOAD" : "ONCE_PER_EVENT",
    consentSettings: consent,
    monitoringMetadata: { type: "MAP" },
    ...(notes ? { notes } : {}),
  });
};
const html = (code) => [template("html", code.trim()), bool("supportDocumentWrite", false)];

// Cookiebot CMP: the official template from the Community Template Gallery,
// embedded below. It sets Consent Mode v2 defaults before anything else runs.
const COOKIEBOT_TEMPLATE_ID = "1";
const consentRow = {
  type: "MAP",
  map: [
    template("region", ""),
    template("defaultConsentPreferences", "denied"),
    template("defaultConsentStatistics", "denied"),
    template("defaultConsentMarketing", "denied"),
    template("defaultConsentMarketingAdUserData", "denied"),
    template("defaultConsentMarketingAdPersonalization", "denied"),
  ],
};
addTag({
  name: "Cookiebot CMP",
  type: `cvt_${CONTAINER}_${COOKIEBOT_TEMPLATE_ID}`,
  parameter: [
    template("serial", ref(ID.cookiebot_id)),
    template("language", "auto"),
    template("cdnRegion", "com"),
    bool("addGeoRegion", false),
    bool("consentModeEnabled", true),
    bool("iabFramework", false),
    template("waitForUpdate", 2000),
    template("adsDataRedaction", "dynamic"),
    bool("urlPassthrough", false),
    bool("advertiserConsentModeEnabled", true),
    { type: "LIST", key: "regionSettings", list: [consentRow] },
  ],
  firing: [BUILT_IN.consentInit],
  blocking: [BLOCK.cookiebot],
  consent: builtInConsent,
  notes:
    "Default consent is denied for every region, which covers the EEA, the UK and Switzerland. Auto-blocking stays off: it rewrites script tags and breaks Next.js hydration.",
});

// GA4. The Google tag never sends page_view on its own. The site reports one
// page_view per route change and the event tag below forwards it. Turn off
// "Page changes based on browser history events" in GA4 Enhanced Measurement.
addTag({
  name: "GA4 - Google tag",
  type: "googtag",
  parameter: [
    template("tagId", ref(ID.ga4_id)),
    {
      type: "LIST",
      key: "configSettingsTable",
      list: [{ type: "MAP", map: [template("parameter", "send_page_view"), template("parameterValue", "false")] }],
    },
  ],
  firing: [BUILT_IN.init],
  blocking: [BLOCK.ga4],
  consent: builtInConsent,
});

for (const event of events) {
  addTag({
    name: `GA4 - ${event.name}`,
    type: "gaawe",
    parameter: [
      bool("sendEcommerceData", false),
      template("eventName", event.name),
      template("measurementIdOverride", ref(ID.ga4_id)),
      {
        type: "LIST",
        key: "eventSettingsTable",
        list: [...event.params, ...sharedParams].map((key) => ({
          type: "MAP",
          map: [template("parameter", key), template("parameterValue", ref(DLV[key]))],
        })),
      },
    ],
    firing: [CE[event.name]],
    blocking: [BLOCK.ga4],
    consent: builtInConsent,
  });
}

// Microsoft Clarity. Loads only with analytics consent, then receives the
// consent signal through its Consent API v2.
addTag({
  name: "Clarity - Base",
  type: "html",
  parameter: html(`
<script>
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","${ref(ID.clarity_id)}");
(function(){
  var consent=(window.Cookiebot&&window.Cookiebot.consent)||{};
  window.clarity("consentv2",{ad_Storage:consent.marketing?"granted":"denied",analytics_Storage:"granted"});
  var keys=["utm_source","utm_campaign"],query=new URLSearchParams(window.location.search),stored={};
  try{
    var raw=document.cookie.split("; ").filter(function(row){return row.indexOf("wb_attr=")===0})[0];
    if(raw){stored=(JSON.parse(decodeURIComponent(raw.slice(8))).last)||{};}
  }catch(e){}
  keys.forEach(function(key){
    var value=(query.get(key)||stored[key]||"").toLowerCase().slice(0,100);
    if(value){window.clarity("set",key,value);}
  });
})();
</script>`),
  firing: [CE.page_view, CE_CONSENT_UPDATE],
  blocking: [BLOCK.clarity],
  consent: requires("analytics_storage"),
  once: true,
});

addTag({
  name: "Clarity - Consent update",
  type: "html",
  parameter: html(`
<script>
(function(){
  if(typeof window.clarity!=="function"){return;}
  var consent=(window.Cookiebot&&window.Cookiebot.consent)||{};
  if(consent.statistics){
    window.clarity("consentv2",{ad_Storage:consent.marketing?"granted":"denied",analytics_Storage:"granted"});
  }else{
    window.clarity("consentv2",{ad_Storage:"denied",analytics_Storage:"denied"});
    window.clarity("consent",false);
  }
})();
</script>`),
  firing: [CE_CONSENT_UPDATE],
  blocking: [BLOCK.clarity],
  consent: builtInConsent,
  notes: "Runs without a consent requirement on purpose: it is the tag that tells Clarity consent was withdrawn. It does nothing unless Clarity is already on the page.",
});

addTag({
  name: "Clarity - Form tag",
  type: "html",
  parameter: html(`
<script>
if(typeof window.clarity==="function"){window.clarity("set","form_name","${ref(DLV.form_name)}");}
</script>`),
  firing: [CE.generate_lead],
  blocking: [BLOCK.clarity],
  consent: requires("analytics_storage"),
});

// Google Ads.
addTag({
  name: "Google Ads - Conversion Linker",
  type: "gclidw",
  parameter: [bool("enableCrossDomain", false), bool("enableUrlPassthrough", false), bool("enableCookieOverrides", false)],
  firing: [BUILT_IN.init],
  blocking: [BLOCK.ads],
  consent: builtInConsent,
});

const adsConversion = ({ name, label, firing, blocking, enhanced, value }) =>
  addTag({
    name: `Google Ads - Conversion - ${name}`,
    type: "awct",
    parameter: [
      template("conversionId", ref(ADS_NUMERIC)),
      template("conversionLabel", ref(label)),
      // The server-issued event_id. Google Ads drops a repeat with the same ID.
      template("orderId", ref(DLV.event_id)),
      bool("enableConversionLinker", true),
      bool("enableNewCustomerReporting", false),
      bool("enableProductReporting", false),
      bool("enableShippingData", false),
      bool("rdp", false),
      ...(value ? [template("conversionValue", ref(DLV.value)), template("currencyCode", ref(DLV.currency))] : []),
      ...(enhanced
        ? [bool("enableEnhancedConversion", true), template("cssProvidedEnhancedConversionValue", ref(USER_DATA))]
        : [bool("enableEnhancedConversion", false)]),
    ],
    firing,
    blocking: [BLOCK.ads, blocking],
    consent: builtInConsent,
  });

adsConversion({ name: "Contact lead", label: ID.google_ads_label_contact, firing: [CE_LEAD_CONTACT], blocking: BLOCK.adsContact, enhanced: true });
adsConversion({ name: "Waitlist signup", label: ID.google_ads_label_waitlist, firing: [CE.join_waitlist], blocking: BLOCK.adsWaitlist, enhanced: true });
adsConversion({ name: "Begin checkout", label: ID.google_ads_label_checkout, firing: [CE.begin_checkout], blocking: BLOCK.adsCheckout, enhanced: false, value: true });
adsConversion({ name: "Contact click", label: ID.google_ads_label_contact_click, firing: [CE.contact_click], blocking: BLOCK.adsContactClick, enhanced: false });

addTag({
  name: "Google Ads - Remarketing",
  type: "sp",
  parameter: [
    template("conversionId", ref(ADS_NUMERIC)),
    template("customParamsFormat", "NONE"),
    bool("enableConversionLinker", true),
    bool("enableDynamicRemarketing", false),
    bool("rdp", false),
  ],
  firing: [CE.page_view],
  blocking: [BLOCK.ads],
  consent: builtInConsent,
});

// Meta Pixel. Every tag carries the loader, so an event that follows a fresh
// consent grant is not lost. eventID equals the dataLayer event_id, which the
// server reuses for the Conversions API event.
const metaLoader = `
  if(!window.fbq){
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init','${ref(ID.meta_pixel_id)}');
  }`;
const metaTag = ({ name, code, firing, once = false }) =>
  addTag({
    name: `Meta - ${name}`,
    type: "html",
    parameter: html(`<script>\n(function(){${metaLoader}\n  ${code}\n})();\n</script>`),
    firing,
    blocking: [BLOCK.meta],
    consent: requires("ad_storage"),
    once,
  });

metaTag({
  name: "PageView",
  code: `var id='${ref(DLV.event_id)}'||String(Date.now());
  if(window.__wbMetaPageView===window.location.pathname){return;}
  window.__wbMetaPageView=window.location.pathname;
  window.fbq('track','PageView',{}, {eventID:id});`,
  firing: [CE.page_view, CE_CONSENT_UPDATE],
});
metaTag({ name: "Lead", code: `window.fbq('track','Lead',{}, {eventID:'${ref(DLV.event_id)}'});`, firing: [CE_LEAD_CONTACT] });
metaTag({
  name: "CompleteRegistration",
  code: `window.fbq('track','CompleteRegistration',{}, {eventID:'${ref(DLV.event_id)}'});`,
  firing: [CE.join_waitlist],
});
metaTag({
  name: "InitiateCheckout",
  code: `window.fbq('track','InitiateCheckout',{value:Number('${ref(DLV.value)}')||0,currency:'${ref(DLV.currency)}'}, {eventID:'${ref(DLV.event_id)}'});`,
  firing: [CE.begin_checkout],
});
metaTag({
  name: "ViewContent",
  code: `window.fbq('track','ViewContent',{content_name:'pricing'}, {eventID:'${ref(DLV.event_id)}'});`,
  firing: [CE.view_pricing],
});
metaTag({ name: "Contact", code: `window.fbq('track','Contact',{}, {eventID:'${ref(DLV.event_id)}'});`, firing: [CE.contact_click] });

// LinkedIn Insight Tag.
const linkedinLoader = `
  if(!window.lintrk){
    window._linkedin_partner_id='${ref(ID.linkedin_partner_id)}';
    window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];
    window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
    window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[];
    var s=document.getElementsByTagName('script')[0],b=document.createElement('script');
    b.type='text/javascript';b.async=true;b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';
    s.parentNode.insertBefore(b,s);
  }`;
const linkedinTag = ({ name, code = "", firing, blocking = [], once = false }) =>
  addTag({
    name: `LinkedIn - ${name}`,
    type: "html",
    parameter: html(`<script>\n(function(){${linkedinLoader}\n  ${code}\n})();\n</script>`),
    firing,
    blocking: [BLOCK.linkedin, ...blocking],
    consent: requires("ad_storage"),
    once,
  });
linkedinTag({ name: "Insight Tag", firing: [CE.page_view, CE_CONSENT_UPDATE], once: true });
linkedinTag({
  name: "Conversion - Contact lead",
  code: `window.lintrk('track',{conversion_id:Number('${ref(ID.linkedin_conversion_contact)}')});`,
  firing: [CE_LEAD_CONTACT],
  blocking: [BLOCK.linkedinContact],
});
linkedinTag({
  name: "Conversion - Waitlist signup",
  code: `window.lintrk('track',{conversion_id:Number('${ref(ID.linkedin_conversion_waitlist)}')});`,
  firing: [CE.join_waitlist],
  blocking: [BLOCK.linkedinWaitlist],
});

// ----------------------------------------------------------- custom template
// The official Cookiebot template (see gtm/templates/README.md for its source).
const templateData = readFileSync(join(here, "templates", "cookiebot-cmp.tpl"), "utf8");

const container = {
  exportFormatVersion: 2,
  exportTime: "2026-11-16 00:00:00",
  containerVersion: {
    path: `accounts/${ACCOUNT}/containers/${CONTAINER}/versions/0`,
    accountId: ACCOUNT,
    containerId: CONTAINER,
    containerVersionId: "0",
    name: "heywowboy.com tracking",
    description: "Generated by gtm/build-container.mjs. Do not edit by hand.",
    container: {
      path: `accounts/${ACCOUNT}/containers/${CONTAINER}`,
      accountId: ACCOUNT,
      containerId: CONTAINER,
      name: "heywowboy.com",
      publicId: "GTM-XXXXXXX",
      usageContext: ["WEB"],
      fingerprint: FINGERPRINT,
      tagManagerUrl: "https://tagmanager.google.com/",
      features: {},
    },
    tag: tags,
    trigger: triggers,
    variable: variables,
    builtInVariable: [
      { accountId: ACCOUNT, containerId: CONTAINER, type: "PAGE_URL", name: "Page URL" },
      { accountId: ACCOUNT, containerId: CONTAINER, type: "PAGE_PATH", name: "Page Path" },
      { accountId: ACCOUNT, containerId: CONTAINER, type: "EVENT", name: "Event" },
    ],
    customTemplate: [
      {
        ...base(),
        templateId: COOKIEBOT_TEMPLATE_ID,
        name: "Cookiebot CMP",
        templateData,
      },
    ],
    fingerprint: FINGERPRINT,
    tagManagerUrl: "https://tagmanager.google.com/",
  },
};

const out = join(here, "container.json");
writeFileSync(out, `${JSON.stringify(container, null, 2)}\n`);
console.log(
  `Wrote ${out}: ${tags.length} tags, ${triggers.length} triggers, ${variables.length} variables.`,
);
