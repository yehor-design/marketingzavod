#!/usr/bin/env node
/**
 * Publishes zaraz/config.json to Cloudflare, or checks that the published
 * configuration still matches it.
 *
 *   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ZONE_ID=... npm run zaraz:check
 *   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ZONE_ID=... [ZARAZ_META_ACCESS_TOKEN=...] npm run zaraz:publish
 *
 * The token needs Zaraz Admin on the heywowboy.com zone. Run npm run
 * zaraz:build first; publish refuses a config.json older than the builder.
 *
 * Secrets: the Meta Conversions API token lives in a Zaraz secret variable.
 * Publish sends it only when ZARAZ_META_ACCESS_TOKEN is set. Otherwise it keeps
 * the variable already stored in Zaraz, whose value the API never returns.
 */
import { readFileSync } from "node:fs";
import { config as built, META_TOKEN_VARIABLE } from "./build-config.mjs";

const token = process.env.CLOUDFLARE_API_TOKEN;
const zone = process.env.CLOUDFLARE_ZONE_ID;
const checkOnly = process.argv.includes("--check");

if (!token || !zone) {
  console.error("CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID must be set.");
  process.exit(1);
}

const committed = JSON.parse(readFileSync(new URL("./config.json", import.meta.url), "utf8"));
if (JSON.stringify(committed) !== JSON.stringify(built)) {
  console.error("zaraz/config.json is out of date. Run npm run zaraz:build and commit it.");
  process.exit(1);
}

async function api(method, path, body) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone}/settings/zaraz${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.success === false) {
    const errors = (json.errors ?? []).map((error) => `${error.code}: ${error.message}`).join("; ");
    throw new Error(`${method} ${path} → ${response.status} ${errors}`);
  }
  return json.result;
}

/** Every value set in `expected` must be the same in `actual`. Cloudflare may add more. */
function differences(expected, actual, path = "") {
  if (expected === null || typeof expected !== "object") {
    return expected === actual ? [] : [`${path}: ${JSON.stringify(actual)} ≠ ${JSON.stringify(expected)}`];
  }
  if (actual === null || typeof actual !== "object") {
    return [`${path}: missing`];
  }
  if (Array.isArray(expected) && (!Array.isArray(actual) || actual.length !== expected.length)) {
    return [`${path}: ${JSON.stringify(actual)} ≠ ${JSON.stringify(expected)}`];
  }
  return Object.keys(expected).flatMap((key) => differences(expected[key], actual[key], `${path}.${key}`));
}

/** The secret's value is never returned, so it is not compared. */
function comparable(value) {
  const copy = structuredClone(value);
  if (copy.variables?.[META_TOKEN_VARIABLE]) {
    delete copy.variables[META_TOKEN_VARIABLE].value;
  }
  return copy;
}

const live = await api("GET", "/config");

if (checkOnly) {
  const drift = differences(comparable(built), live);
  if (drift.length > 0) {
    console.error(`The published Zaraz config differs from zaraz/config.json:\n  ${drift.join("\n  ")}`);
    process.exit(1);
  }
  console.log("The published Zaraz config matches zaraz/config.json.");
  process.exit(0);
}

const variables = structuredClone(built.variables);
if (variables[META_TOKEN_VARIABLE]) {
  const secret = process.env.ZARAZ_META_ACCESS_TOKEN;
  if (secret) {
    variables[META_TOKEN_VARIABLE].value = secret;
  } else if (live.variables?.[META_TOKEN_VARIABLE]) {
    variables[META_TOKEN_VARIABLE] = live.variables[META_TOKEN_VARIABLE];
  } else {
    console.error("Zaraz has no Meta token yet. Set ZARAZ_META_ACCESS_TOKEN for the first publish.");
    process.exit(1);
  }
}

await api("PUT", "/config", {
  ...built,
  variables,
  // Kept from the live config: Zaraz manages both.
  debugKey: live.debugKey,
  zarazVersion: live.zarazVersion,
});
await api("POST", "/publish", "Published from zaraz/config.json");
console.log("Zaraz config published.");
