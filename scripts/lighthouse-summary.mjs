#!/usr/bin/env node
/**
 * Prints a Markdown table from the Lighthouse CI run: the median of each page
 * against the mobile budget in docs/performance-budget.md. Used for the job
 * summary on every pull request, and locally after `npm run lighthouse`.
 */
import { existsSync, readFileSync } from "node:fs";

const manifestPath = ".lighthouseci/reports/manifest.json";
if (!existsSync(manifestPath)) {
  console.log("No Lighthouse reports found.");
  process.exit(0);
}

const BUDGET = { lcp: 2500, cls: 0.1, tbt: 200 };
const mark = (value, limit) => (value <= limit ? "ok" : "**over**");
const rows = JSON.parse(readFileSync(manifestPath, "utf8"))
  .filter((entry) => entry.isRepresentativeRun)
  .map((entry) => {
    const report = JSON.parse(readFileSync(entry.jsonPath, "utf8"));
    const audit = (name) => report.audits[name].numericValue;
    const scripts = (report.audits["network-requests"]?.details?.items ?? [])
      .filter((item) => item.resourceType === "Script")
      .reduce((sum, item) => sum + (item.transferSize ?? 0), 0);
    const lcp = audit("largest-contentful-paint");
    const cls = audit("cumulative-layout-shift");
    const tbt = audit("total-blocking-time");
    return `| ${new URL(entry.url).pathname} | ${Math.round(report.categories.performance.score * 100)} | ${(lcp / 1000).toFixed(2)} s ${mark(lcp, BUDGET.lcp)} | ${cls.toFixed(3)} ${mark(cls, BUDGET.cls)} | ${Math.round(tbt)} ms ${mark(tbt, BUDGET.tbt)} | ${Math.round(scripts / 1024)} KB |`;
  });

console.log("### Lighthouse, mobile (median of 3 runs)\n");
console.log("Budget: LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms (lab stand-in for INP ≤ 200 ms).\n");
console.log("| Page | Score | LCP | CLS | TBT | JS transferred |");
console.log("| --- | --- | --- | --- | --- | --- |");
console.log(rows.join("\n"));
