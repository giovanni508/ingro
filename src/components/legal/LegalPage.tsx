import fs from "node:fs";
import path from "node:path";
import { PageShell } from "@/components/layout/PageShell";
import { Prose } from "./Prose";
import { ManageCookies } from "@/components/layout/ManageCookies";

/** Legal pages: house lights on, a readable column, a table of contents on large screens. */
export function LegalPage({ title, file, intro, cookies = false }: { title: string; file: string; intro?: string; cookies?: boolean }) {
  const source = fs.readFileSync(path.join(process.cwd(), "content/legal", file), "utf8");
  const toc = [...source.matchAll(/^## (.+)$/gm)].map((m) => ({
    t: m[1],
    id: m[1].toLowerCase().normalize("NFD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, ""),
  }));
  return (
    <PageShell>
      <section className="surface-ink grain pt-header" aria-labelledby="legal-title">
        <div className="wrap pb-16 pt-14 md:pb-24 md:pt-24">
          <h1 id="legal-title" className="t-display text-ivory">
            {title}
          </h1>
          {intro ? <p className="t-lead mt-6 max-w-[48ch] text-ivory-dim">{intro}</p> : null}
        </div>
      </section>
      <section className="surface-light section !pt-16 md:!pt-24">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          <nav aria-label="In questa pagina" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <p className="t-label text-char-dim">In questa pagina</p>
              <ol className="mt-4 space-y-2 text-[0.9375rem]">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="link-trace text-char-dim hover:text-char">
                      {h.t}
                    </a>
                  </li>
                ))}
              </ol>
              {cookies ? (
                <p className="mt-8 text-[0.9375rem] text-char">
                  <ManageCookies />
                </p>
              ) : null}
            </div>
          </nav>
          <article className="lg:col-span-8 lg:col-start-5">
            <Prose source={source} />
            {cookies ? (
              <p className="mt-10 lg:hidden">
                <ManageCookies />
              </p>
            ) : null}
          </article>
        </div>
      </section>
    </PageShell>
  );
}
