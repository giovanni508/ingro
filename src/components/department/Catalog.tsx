"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, EASE } from "@/lib/gsap";
import { getMedia } from "@/lib/media";
import { whatsappHref } from "@/lib/site";
import type { Department } from "@/lib/departments";

/**
 * The department catalogue: light filters on the real categories of the old
 * site (whose anchors #cerimonia, #casual… still work), then an editorial
 * masonry per category. Every garment carries its own "Chiedete" link with a
 * WhatsApp message that names it; nothing depends on hover.
 */
export function Catalog({ d }: { d: Department }) {
  const [filter, setFilter] = useState<string>("tutto");
  const root = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();
  const dept = d.title.replace("Abbigliamento ", "").toLowerCase();

  // Deep links from the old site (/donna/#cerimonia) open on that category.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!d.categories.some((c) => c.id === id)) return;
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 300);
    return () => window.clearTimeout(t);
  }, [d.categories]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        ScrollTrigger.batch("[data-item]", {
          start: "top 92%",
          once: true,
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { clipPath: "inset(18% 0% 0% 0%)", autoAlpha: 0, y: 40 },
              { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, y: 0, duration: 1, ease: EASE.out, stagger: 0.08, clearProps: "clipPath,transform" },
            ),
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  );

  const choose = (id: string) => {
    setFilter(id);
    if (typeof window !== "undefined") {
      history.replaceState(null, "", id === "tutto" ? window.location.pathname : `#${id}`);
    }
    window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const el = root.current;
      if (el && el.getBoundingClientRect().top < 0) scrollTo(el, { offset: -8 });
    });
  };

  const chips = [{ id: "tutto", label: "Tutto" }, ...d.categories.map((c) => ({ id: c.id, label: c.label }))];

  return (
    <div ref={root} className="surface-light relative scroll-mt-0">
      <nav aria-label={`Categorie ${dept}`} className="cat-nav sticky top-0 z-20 border-b border-[var(--line-light)] bg-cipria/90 backdrop-blur-md">
        <div className="wrap flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {chips.map((c) => {
            const on = filter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => choose(c.id)}
                className={`shrink-0 rounded-full border px-5 py-2.5 text-[0.8125rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
                  on ? "border-char bg-char text-ivory" : "border-[var(--line-light)] text-char hover:border-char"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </nav>

      {d.categories.map((c) => {
        const visible = filter === "tutto" || filter === c.id;
        return (
          <section key={c.id} id={c.id} hidden={!visible} className="scroll-mt-20 py-[clamp(4rem,2rem+6vw,8rem)]" aria-labelledby={`${c.id}-title`}>
            <div className="wrap">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-[var(--gutter)]">
                <h2 id={`${c.id}-title`} className="t-display text-char md:col-span-5">
                  {c.label}
                </h2>
                <div className="space-y-4 text-char-dim md:col-span-6 md:col-start-7 md:pt-3">
                  {c.text.map((t) => (
                    <p key={t.slice(0, 24)} className="measure">
                      {t}
                    </p>
                  ))}
                  <div className="pt-4">
                    <Button href={whatsappHref(c.message)} variant="primary" cursor="Scriveteci" icon={<WhatsappLogo size={18} aria-hidden="true" />}>
                      Chiedete disponibilità
                    </Button>
                  </div>
                </div>
              </div>

              {c.images.length > 0 ? (
                <ul className="mt-14 columns-2 gap-[var(--gutter)] md:mt-20 md:columns-3 xl:columns-4">
                  {c.images.map((id, i) => {
                    const m = getMedia(id);
                    return (
                      <li key={id} data-item className="mb-[clamp(1.5rem,1rem+2vw,3rem)] break-inside-avoid">
                        <figure className="group">
                          <div className="relative overflow-hidden bg-cipria-2" style={{ aspectRatio: `${m.width} / ${m.height}` }}>
                            <Image
                              src={m.src}
                              alt={m.alt}
                              fill
                              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
                              className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
                              placeholder="blur"
                              blurDataURL={m.blur}
                              loading={i < 2 ? "eager" : "lazy"}
                            />
                            <span className="item-sheen" aria-hidden="true" />
                          </div>
                          <figcaption className="mt-3 flex items-start justify-between gap-3">
                            <span className="text-[0.875rem] leading-snug text-char-dim">{m.alt}</span>
                            <a
                              href={whatsappHref(`Ciao, ho visto sul sito questo capo (${dept}, ${c.label.toLowerCase()}): "${m.alt}". È disponibile?`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--line-light)] px-3 py-1.5 text-[0.75rem] uppercase tracking-[0.1em] text-char transition-colors hover:border-magenta-text hover:bg-magenta-text hover:text-white"
                              data-cursor="Chiedete"
                            >
                              <WhatsappLogo size={14} aria-hidden="true" />
                              Chiedete
                              <span className="sr-only">: {m.alt}</span>
                            </a>
                          </figcaption>
                        </figure>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="mt-14 grid grid-cols-1 items-end gap-8 border-t border-[var(--line-light)] pt-10 md:mt-20 md:grid-cols-12 md:gap-x-[var(--gutter)]">
                  <p className="font-display text-[clamp(4rem,2rem+8vw,10rem)] leading-[0.85] text-char md:col-span-8" aria-hidden="true">
                    {c.sizes ? c.sizes.from : d.sizes.from}
                    <span className="mx-[0.12em] inline-block h-[0.04em] w-[0.7em] translate-y-[-0.24em] bg-magenta-text align-middle" />
                    <span className="italic">{c.sizes ? c.sizes.to : d.sizes.to}</span>
                  </p>
                  <p className="text-char-dim md:col-span-4">
                    {c.sizes ? `Taglie comode dalla ${c.sizes.from} alla ${c.sizes.to}.` : `Tutti i capi dalla taglia ${d.sizes.from} alla ${d.sizes.to}.`} Passate in negozio o scriveteci su WhatsApp: vi aiutiamo a trovare la vestibilità giusta.
                  </p>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
