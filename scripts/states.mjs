// Captures interactive states: preloader, hovers, mobile menu, cookie banner, occasion switch.
import { chromium } from "playwright";
import fs from "node:fs";
const base = process.argv[2] ?? "http://localhost:3200";
const out = process.argv[3] ?? ".impeccable/review/states";
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();

// Preloader, first visit (desktop + mobile)
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.goto(base + "/", { waitUntil: "commit" });
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${out}/preloader-${w}-a.png` });
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${out}/preloader-${w}-b.png` });
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `${out}/after-preloader-${w}.png` });
  if (w === 390) {
    await p.screenshot({ path: `${out}/cookie-banner-390.png` });
    await p.click('button[aria-controls="menu"]');
    await p.waitForTimeout(1300);
    await p.screenshot({ path: `${out}/menu-open-390.png` });
  }
  await ctx.close();
}

// Hovers (desktop, preloader skipped)
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { sessionStorage.setItem("ingromoda-pl", "1"); localStorage.setItem("ingromoda-consent", JSON.stringify({ v: 1, external: false, at: "x" })); });
const p = await ctx.newPage();
await p.goto(base + "/", { waitUntil: "networkidle" });
await p.evaluate(() => window.__lenis?.scrollTo(document.querySelector("#reparti").offsetTop + 260, { immediate: true, force: true }));
await p.waitForTimeout(1200);
await p.screenshot({ path: `${out}/rooms-closed-1440.png` });
await p.hover("#reparti a[href='/uomo'] .room-frame");
await p.waitForTimeout(1500);
await p.screenshot({ path: `${out}/rooms-hover-uomo-1440.png` });
await p.evaluate(() => window.__lenis?.scrollTo(0, { immediate: true, force: true }));
await p.waitForTimeout(600);
await p.hover(".hero a.btn-light");
await p.waitForTimeout(900);
await p.screenshot({ path: `${out}/hero-button-hover-1440.png`, clip: { x: 0, y: 520, width: 1440, height: 380 } });
const occ = await p.$('[role="tablist"]');
await p.evaluate((el) => window.__lenis?.scrollTo(el.getBoundingClientRect().top + scrollY - 200, { immediate: true, force: true }), occ);
await p.waitForTimeout(800);
await p.click('[role="tab"]:nth-child(3)');
await p.waitForTimeout(450);
await p.screenshot({ path: `${out}/occasion-switch-mid-1440.png` });
await p.waitForTimeout(1200);
await p.screenshot({ path: `${out}/occasion-switch-end-1440.png` });
await b.close();
console.log(fs.readdirSync(out).join("\n"));
