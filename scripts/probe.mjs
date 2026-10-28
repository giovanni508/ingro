import { chromium } from "playwright";
const [url, w, expr] = process.argv.slice(2);
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: +w, height: 844 }, reducedMotion: "reduce" });
await ctx.addInitScript(() => { sessionStorage.setItem("ingromoda-pl", "1"); });
const p = await ctx.newPage(); await p.goto(url, { waitUntil: "networkidle" }); await p.waitForTimeout(500);
console.log(JSON.stringify(await p.evaluate(expr), null, 1)); await b.close();
