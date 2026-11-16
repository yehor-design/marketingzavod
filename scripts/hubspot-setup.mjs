#!/usr/bin/env node
/**
 * Creates the custom HubSpot properties the lead adapter writes to. Safe to
 * run again: existing groups and properties are left as they are.
 *
 *   HUBSPOT_ACCESS_TOKEN=... npm run hubspot:setup
 *
 * Needs Node 22.18 or newer (it imports a TypeScript file directly).
 */
import {
  CONTACT_PROPERTIES,
  DEAL_PROPERTIES,
  HUBSPOT_GROUP,
} from "../lib/leads/hubspot-properties.ts";

const token = process.env.HUBSPOT_ACCESS_TOKEN;
if (!token) {
  console.error("HUBSPOT_ACCESS_TOKEN is not set.");
  process.exit(1);
}

async function call(path, body) {
  const response = await fetch(`https://api.hubapi.com${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (response.ok) {
    return "created";
  }
  if (response.status === 409) {
    return "exists";
  }
  throw new Error(`${path} → ${response.status} ${(await response.text()).slice(0, 300)}`);
}

for (const [objectType, properties] of [
  ["contacts", CONTACT_PROPERTIES],
  ["deals", DEAL_PROPERTIES],
]) {
  const group = await call(`/crm/v3/properties/${objectType}/groups`, {
    name: HUBSPOT_GROUP.name,
    label: HUBSPOT_GROUP.label,
  });
  console.log(`${objectType}: group ${HUBSPOT_GROUP.name} ${group}`);
  for (const property of properties) {
    const result = await call(`/crm/v3/properties/${objectType}`, {
      ...property,
      groupName: HUBSPOT_GROUP.name,
    });
    console.log(`${objectType}: ${property.name} ${result}`);
  }
}
console.log("Done.");
