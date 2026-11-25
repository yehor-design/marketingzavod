/**
 * Lighthouse on production as a visitor who clicked "Accept all".
 *
 * Every run starts a clean Chrome, sets the mz_consent cookie (statistics and
 * marketing), and runs Lighthouse without resetting storage, so GTM, GA4, the
 * Meta pixel, Amplitude with Session Replay and Speed Insights all load. The
 * requests that carry collected data are blocked, so the runs do not show up
 * in the reports; the scripts themselves load and run as usual.
 *
 * Usage: node scripts/lighthouse-consent.mjs [base URL] [output dir]
 * Prints the median per page; the full reports go to the output dir.
 * lighthouse, chrome-launcher and puppeteer-core come with @lhci/cli.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";

const BASE = (process.argv[2] ?? "https://www.marketingzavod.com").replace(/\/$/, "");
const OUT = process.argv[3] ?? ".lighthouse-consent";
const PAGES = ["", "pricing", "contact"];
const RUNS = 3;
const BLOCKED = [
  "*google-analytics.com/g/collect*",
  "*facebook.com/tr*",
  "*api2.amplitude.com*",
  "*api-sr.amplitude.com*",
  "*/_vercel/speed-insights/vitals*",
  "*/api/consent*",
];

fs.mkdirSync(OUT, { recursive: true });
const host = new URL(BASE).hostname;
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

for (const page of PAGES) {
  const runs = [];
  for (let i = 1; i <= RUNS; i++) {
    const chrome = await launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
    try {
      const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${chrome.port}` });
      const decidedAt = Math.floor(Date.now() / 1000);
      await browser.setCookie({
        name: "mz_consent",
        value: `1.s1m1.${decidedAt}.${crypto.randomBytes(16).toString("hex")}`,
        domain: host,
        path: "/",
        secure: BASE.startsWith("https:"),
        sameSite: "Lax",
      });
      const result = await lighthouse(`${BASE}/${page}`, {
        port: chrome.port,
        output: "json",
        onlyCategories: ["performance"],
        disableStorageReset: true,
        blockedUrlPatterns: BLOCKED,
        logLevel: "error",
      });
      fs.writeFileSync(path.join(OUT, `${page || "home"}-${i}.json`), result.report);
      const { audits, categories } = result.lhr;
      const script = audits["resource-summary"].details.items.find((item) => item.resourceType === "script");
      runs.push({
        score: Math.round(categories.performance.score * 100),
        lcp: audits["largest-contentful-paint"].numericValue,
        cls: audits["cumulative-layout-shift"].numericValue,
        tbt: audits["total-blocking-time"].numericValue,
        js: script ? script.transferSize / 1024 : 0,
      });
      await browser.disconnect();
    } finally {
      chrome.kill();
    }
  }
  const pick = (key) => median(runs.map((run) => run[key]));
  console.log(
    `/${page}`.padEnd(10),
    `score ${pick("score")}`,
    `LCP ${(pick("lcp") / 1000).toFixed(2)} s`,
    `CLS ${pick("cls").toFixed(3)}`,
    `TBT ${Math.round(pick("tbt"))} ms`,
    `JS ${Math.round(pick("js"))} KB`,
    `runs ${runs.map((run) => `${run.score}/${Math.round(run.lcp)}/${Math.round(run.tbt)}`).join(", ")}`,
  );
}
