// Motion audit: client navigation, back button, resize, keyboard. Reports console errors and visible state.
import { chromium } from "playwright";
const base = process.argv[2] ?? "http://localhost:3200";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror " + e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push("console " + m.text().slice(0, 160)); });
const report = [];
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(2600); // preloader
report.push(["preloader gone", await page.evaluate(() => getComputedStyle(document.querySelector(".pl")).display === "none" || getComputedStyle(document.querySelector(".pl")).visibility === "hidden")]);
report.push(["hero title visible", await page.evaluate(() => { const r = document.querySelector("#hero-title").getBoundingClientRect(); return r.height > 50; })]);
await page.click('header nav a[href="/donna"]');
await page.waitForURL("**/donna");
await page.waitForTimeout(1500);
report.push(["donna h1", await page.textContent("h1")]);
report.push(["scrollY after nav", await page.evaluate(() => scrollY)]);
await page.goBack();
await page.waitForURL(base + "/");
await page.waitForTimeout(1500);
report.push(["back on home, h1", (await page.textContent("#hero-title"))?.trim()]);
await page.setViewportSize({ width: 820, height: 1180 });
await page.waitForTimeout(800);
await page.setViewportSize({ width: 1180, height: 820 });
await page.waitForTimeout(800);
report.push(["after resize overflow", await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)]);
// keyboard: tab order starts with skip link
await page.keyboard.press("Tab");
report.push(["first tab stop", await page.evaluate(() => document.activeElement?.textContent?.trim())]);
// occasions tablist with arrows
await page.focus('[role="tab"][aria-selected="true"]');
await page.keyboard.press("ArrowDown");
report.push(["arrow selects", await page.evaluate(() => document.activeElement?.textContent?.trim())]);
// mobile menu
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
await page.click('button[aria-controls="menu"]');
await page.waitForTimeout(900);
report.push(["menu open + focus", await page.evaluate(() => [document.querySelector("#menu").dataset.open, document.activeElement?.textContent?.trim()])]);
await page.keyboard.press("Escape");
await page.waitForTimeout(600);
report.push(["menu closed", await page.evaluate(() => document.querySelector("#menu").dataset.open)]);
// form validation
await page.goto(base + "/contatti", { waitUntil: "networkidle" });
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
report.push(["form errors", await page.evaluate(() => [...document.querySelectorAll(".field-error")].map((e) => e.textContent).length), await page.evaluate(() => document.activeElement?.getAttribute("name"))]);
await page.fill("#name", "Prova Verifica");
await page.fill("#email", "prova@example.com");
await page.fill("#message", "Messaggio di prova per la verifica automatica del modulo.");
await page.check("#consent");
await page.waitForTimeout(2600);
await page.click('button[type="submit"]');
await page.waitForTimeout(1500);
report.push(["form result", await page.evaluate(() => document.querySelector('[role="status"], [role="alert"]')?.textContent?.slice(0, 120))]);
// old URL redirect
const r = await page.request.get(base + "/privacy-policy/", { maxRedirects: 0 });
report.push(["redirect /privacy-policy/", r.status(), r.headers()["location"]]);
const r2 = await page.request.get(base + "/donna/", { maxRedirects: 0 });
report.push(["redirect /donna/", r2.status(), r2.headers()["location"]]);
const r3 = await page.request.get(base + "/wp-login.php", { maxRedirects: 0 });
report.push(["redirect /wp-login.php", r3.status(), r3.headers()["location"]]);
await b.close();
for (const row of report) console.log(JSON.stringify(row));
console.log(errors.length ? errors.join("\n") : "nessun errore in console");
