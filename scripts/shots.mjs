// Real screenshots with Playwright.
// Usage: node scripts/shots.mjs <baseUrl> <outDir> [mode] [pages...]
//   mode "static": prefers-reduced-motion, full-page captures (layout check)
//   mode "scenes": motion on, viewport captures at scroll positions of every <section>
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [base = "http://localhost:3200", out = ".impeccable/review", mode = "static", ...pagesArg] = process.argv.slice(2);
const pages = pagesArg.length ? pagesArg : ["/", "/donna", "/uomo", "/chi-siamo", "/contatti", "/privacy", "/cookie", "/accessibilita", "/pagina-che-non-esiste"];
const widths = (process.env.WIDTHS ?? "390,768,1440,1920").split(",").map(Number);
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const problems = [];
for (const w of widths) {
  const h = w < 768 ? 844 : w < 1440 ? 1024 : w === 1440 ? 900 : 1080;
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    reducedMotion: mode === "static" ? "reduce" : "no-preference",
    hasTouch: w < 1024,
    isMobile: w < 768,
  });
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem("ingromoda-pl", "1");
      localStorage.setItem("ingromoda-consent", JSON.stringify({ v: 1, external: false, at: "2026-10-28T00:00:00Z" }));
    } catch {}
  });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") problems.push(`[${w}] console: ${m.text().slice(0, 200)}`); });
  page.on("pageerror", (e) => problems.push(`[${w}] pageerror: ${e.message.slice(0, 200)}`));
  page.on("response", (r) => { if (r.status() >= 400 && !r.url().includes("pagina-che-non-esiste")) problems.push(`[${w}] ${r.status()} ${r.url()}`); });
  for (const p of pages) {
    const name = (p === "/" ? "home" : p.replace(/\//g, "")) + `-${w}`;
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(() => {
      const W = document.documentElement.clientWidth;
      const bad = [];
      document.querySelectorAll("body *").forEach((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (cs.position === "fixed" || r.width === 0) return;
        const clipped = (() => { for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a); if (/(hidden|clip|auto|scroll)/.test(o.overflowX)) return true; } return false; })();
        if (r.right > W + 1 && !clipped && !el.closest(".marquee,[data-allow-overflow]")) bad.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right=${Math.round(r.right)}`);
      });
      return { scrollW: document.documentElement.scrollWidth, W, bad: bad.slice(0, 5) };
    });
    if (overflow.scrollW > overflow.W || overflow.bad.length) problems.push(`[${w}] ${p} overflow scrollW=${overflow.scrollW} W=${overflow.W} ${overflow.bad.join(" | ")}`);
    if (mode === "static") {
      // Let lazy images load.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true });
    } else {
      const tops = await page.evaluate(() => [...document.querySelectorAll("main section")].map((s) => ({ top: s.getBoundingClientRect().top + scrollY, h: s.getBoundingClientRect().height })));
      let i = 0;
      for (const t of tops) {
        const stops = t.h > h * 1.6 ? [0, 0.33, 0.66, 0.95].map((f) => t.top + (t.h - h) * f) : [t.top];
        for (const y of stops) {
          await page.evaluate((yy) => { const l = window.__lenis; if (l) l.scrollTo(yy, { immediate: true, force: true }); else window.scrollTo(0, yy); }, Math.round(y));
          await page.waitForTimeout(1300);
          await page.screenshot({ path: path.join(out, `${name}-s${String(i++).padStart(2, "0")}.png`) });
        }
      }
    }
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(out, `problems-${mode}.txt`), problems.join("\n") || "nessun problema");
console.log(problems.length ? problems.join("\n") : "nessun problema");
