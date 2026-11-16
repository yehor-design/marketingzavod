import { expect, test } from "@playwright/test";
import { UUID } from "./helpers";

const ip = () => `203.0.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250) + 1}`;
const valid = { form_name: "waitlist", fields: { email: "api.tester@example.com" } };

test("the lead API validates, answers a bot quietly and limits bursts", async ({ request }) => {
  const ok = await request.post("/api/lead", { data: valid, headers: { "x-forwarded-for": ip() } });
  expect(ok.status()).toBe(200);
  const saved = await ok.json();
  expect(saved.ok).toBe(true);
  expect(saved.lead_id).toMatch(UUID);
  expect(saved.event_id).toMatch(UUID);
  expect(saved.lead_id).not.toBe(saved.event_id);

  const invalid = await request.post("/api/lead", {
    data: { form_name: "contact", fields: { name: "", email: "nope", reason: "x", message: "" } },
    headers: { "x-forwarded-for": ip() },
  });
  expect(invalid.status()).toBe(400);
  expect(Object.keys((await invalid.json()).errors).sort()).toEqual(["email", "message", "name", "reason"]);

  const garbage = await request.post("/api/lead", {
    data: "not json",
    headers: { "x-forwarded-for": ip(), "content-type": "application/json" },
  });
  expect(garbage.status()).toBe(400);

  const bot = await request.post("/api/lead", {
    data: { ...valid, company_url: "https://spam.example" },
    headers: { "x-forwarded-for": ip() },
  });
  expect(bot.status()).toBe(200);

  const foreign = await request.post("/api/lead", {
    data: valid,
    headers: { "x-forwarded-for": ip(), origin: "https://evil.example" },
  });
  expect(foreign.status()).toBe(403);

  const burst = ip();
  const statuses: number[] = [];
  for (let attempt = 0; attempt < 7; attempt += 1) {
    const response = await request.post("/api/lead", { data: valid, headers: { "x-forwarded-for": burst } });
    statuses.push(response.status());
  }
  expect(statuses).toEqual([200, 200, 200, 200, 200, 429, 429]);
});

test("search files: sitemap, robots and noindex outside production", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(urls).toContain("https://www.heywowboy.com/");
  expect(urls).toContain("https://www.heywowboy.com/pricing");
  expect(urls.some((url) => url.includes("/blog/"))).toBe(true);
  expect(urls.some((url) => url.includes("/updates/"))).toBe(true);
  expect(urls.some((url) => url.includes("/careers/"))).toBe(true);
  expect(urls.some((url) => /checkout|\/dev\//.test(url))).toBe(false);
  // Cookiebot's free plan covers 50 subpages. Keep at least 10 in reserve.
  expect(urls.length).toBeLessThanOrEqual(40);

  // This build is not the production deployment, so it must stay out of search.
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \/\s*$/m);
  const home = await request.get("/");
  expect(home.headers()["x-robots-tag"]).toContain("noindex");

  const missing = await request.get("/this-page-does-not-exist");
  expect(missing.status()).toBe(404);

  const html = await home.text();
  expect(html).toContain('<link rel="canonical" href="https://www.heywowboy.com"');
  expect(html).toContain('"@type":"Organization"');
  expect(html).toContain('"@type":"WebSite"');
  const post = await (await request.get(urls.find((url) => url.includes("/blog/"))!.replace("https://www.heywowboy.com", ""))).text();
  expect(post).toContain('"@type":"Article"');
  expect(post).toContain('property="og:type" content="article"');
});
