// Lighthouse (mobile, default throttling) through a Playwright-launched Chromium.
// Usage: node scripts/lighthouse.mjs http://localhost:3200 / /donna ...
import { chromium } from "playwright";
import lighthouse from "lighthouse";
import fs from "node:fs";

const [base, ...paths] = process.argv.slice(2);
fs.mkdirSync("lighthouse", { recursive: true });
const port = 9333;
const browser = await chromium.launch({ args: [`--remote-debugging-port=${port}`] });
const rows = [];
for (const p of paths.length ? paths : ["/"]) {
  const result = await lighthouse(base + p, {
    port,
    output: ["json", "html"],
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    formFactor: "mobile",
    screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
  });
  const name = p === "/" ? "home" : p.replace(/\//g, "");
  fs.writeFileSync(`lighthouse/${name}-mobile.json`, result.report[0]);
  fs.writeFileSync(`lighthouse/${name}-mobile.html`, result.report[1]);
  const lhr = result.lhr;
  const s = Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
  const a = lhr.audits;
  const failing = Object.entries(a)
    .filter(([, v]) => v.score !== null && v.score < 0.9 && !["informative", "manual", "notApplicable"].includes(v.scoreDisplayMode))
    .map(([k, v]) => `${k}=${v.score}${v.displayValue ? ` (${v.displayValue})` : ""}`);
  rows.push({ page: p, ...s, LCP: a["largest-contentful-paint"].displayValue, CLS: a["cumulative-layout-shift"].displayValue, TBT: a["total-blocking-time"].displayValue, SI: a["speed-index"].displayValue, failing });
}
await browser.close();
for (const r of rows) console.log(JSON.stringify(r));
fs.writeFileSync("lighthouse/summary.json", JSON.stringify(rows, null, 2));
