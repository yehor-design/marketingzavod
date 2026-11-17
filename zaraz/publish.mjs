#!/usr/bin/env node
/**
 * Publishes zaraz/config.json to Cloudflare, or checks that the published
 * configuration still matches it.
 *
 *   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ZONE_ID=... npm run zaraz:check
 *   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ZONE_ID=... npm run zaraz:publish
 *
 * The token needs Zaraz Admin on the heywowboy.com zone. Run npm run
 * zaraz:build first; publish refuses a config.json older than the builder.
 */
import { readFileSync } from "node:fs";
import { config as built } from "./build-config.mjs";

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

const live = await api("GET", "/config");

if (checkOnly) {
  const drift = differences(built, live);
  if (drift.length > 0) {
    console.error(`The published Zaraz config differs from zaraz/config.json:\n  ${drift.join("\n  ")}`);
    process.exit(1);
  }
  console.log("The published Zaraz config matches zaraz/config.json.");
  process.exit(0);
}

await api("PUT", "/config", {
  ...built,
  // Kept from the live config: Zaraz manages both.
  debugKey: live.debugKey,
  zarazVersion: live.zarazVersion,
});
await api("POST", "/publish", "Published from zaraz/config.json");
console.log("Zaraz config published.");
