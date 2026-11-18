// Link check: every <a href> on every page. Internal links must answer 200,
// tel:/mailto:/wa.me must be well formed, no empty or "#" hrefs, no WordPress leftovers.
const base = process.argv[2] ?? "http://localhost:3200";
const pages = ["/", "/donna", "/uomo", "/chi-siamo", "/contatti", "/privacy", "/cookie", "/accessibilita", "/styleguide"];
const seen = new Map();
const problems = [];
const external = new Set();
for (const p of pages) {
  const html = await (await fetch(base + p)).text();
  if (/wp-login|elementor|wp-content|lorem ipsum/i.test(html)) problems.push(`${p}: residuo WordPress/lorem nel markup`);
  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (!href || href === "#") { problems.push(`${p}: href vuoto o "#"`); continue; }
    if (href.startsWith("tel:")) { if (!/^tel:\+39\d{8,11}$/.test(href)) problems.push(`${p}: tel non valido ${href}`); continue; }
    if (href.startsWith("mailto:")) { if (!/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(href)) problems.push(`${p}: mailto non valido ${href}`); continue; }
    if (href.startsWith("https://wa.me/")) { if (!/^https:\/\/wa\.me\/393760096564(\?text=.+)?$/.test(href)) problems.push(`${p}: wa.me non valido ${href}`); continue; }
    if (/^https?:/.test(href)) { external.add(href.split("?")[0]); continue; }
    const path = href.split("#")[0] || p;
    if (!seen.has(path)) {
      const r = await fetch(base + path, { redirect: "manual" });
      seen.set(path, r.status);
    }
    if (seen.get(path) !== 200) problems.push(`${p}: ${href} -> ${seen.get(path)}`);
  }
}
console.log("Interni controllati:", [...seen.entries()].map(([k, v]) => `${k}=${v}`).join(" "));
console.log("Esterni (formato ok):", [...external].sort().join("\n  "));
console.log(problems.length ? "PROBLEMI:\n" + [...new Set(problems)].join("\n") : "Nessun problema");
