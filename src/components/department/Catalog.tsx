"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CaretDown, WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, EASE } from "@/lib/gsap";
import { getMedia } from "@/lib/media";
import { whatsappHref } from "@/lib/site";
import type { Category, Department } from "@/lib/departments";

/** Garments shown per category before "Mostrate tutti". */
const INITIAL = 8;

/**
 * The department catalogue: light filters on the real categories of the old
 * site (whose anchors #cerimonia, #casual… still work). Each category opens
 * with its text beside one large lead photograph, then an editorial masonry
 * of the first garments, then "Mostrate tutti". Every garment has its own
 * always-visible WhatsApp button that names it; nothing depends on hover.
 */
export function Catalog({ d }: { d: Department }) {
  const [filter, setFilter] = useState<string>("tutto");
  const [expanded, setExpanded] = useState<string[]>([]);
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
    { scope: root, dependencies: [filter, expanded], revertOnUpdate: true },
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

  const expand = (id: string) => {
    setExpanded((x) => [...x, id]);
    window.requestAnimationFrame(() => ScrollTrigger.refresh());
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

      {d.categories.map((c) => (
        <CategorySection
          key={c.id}
          c={c}
          d={d}
          dept={dept}
          visible={filter === "tutto" || filter === c.id}
          all={expanded.includes(c.id)}
          onExpand={() => expand(c.id)}
        />
      ))}
    </div>
  );
}

function Item({ id, label, dept, sizes, eager = false, big = false }: { id: string; label: string; dept: string; sizes: string; eager?: boolean; big?: boolean }) {
  const m = getMedia(id);
  const message = `Ciao, ho visto sul sito questo capo (${dept}, ${label.toLowerCase()}): "${m.alt}". È disponibile?`;
  return (
    <figure className="group">
      <div className="relative overflow-hidden bg-cipria-2" style={{ aspectRatio: `${m.width} / ${m.height}` }}>
        <Image
          src={m.src}
          alt={m.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
          placeholder="blur"
          blurDataURL={m.blur}
          loading={eager ? "eager" : "lazy"}
        />
        <span className="item-sheen" aria-hidden="true" />
        <a
          href={whatsappHref(message)}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute bottom-3 right-3 grid place-items-center rounded-full bg-ivory/95 text-char shadow-[0_8px_24px_-8px_rgb(13_7_10/0.6)] transition-colors duration-300 hover:bg-magenta-deep hover:text-white focus-visible:bg-magenta-deep focus-visible:text-white ${big ? "size-14" : "size-11"}`}
          aria-label={`Chiedete la disponibilità su WhatsApp: ${m.alt}`}
          data-cursor="Chiedete"
        >
          <WhatsappLogo size={big ? 24 : 20} aria-hidden="true" />
        </a>
      </div>
      <figcaption className={`mt-3 leading-snug text-char-dim ${big ? "text-[0.9375rem]" : "text-[0.875rem]"}`}>{m.alt}</figcaption>
    </figure>
  );
}

function CategorySection({ c, d, dept, visible, all, onExpand }: { c: Category; d: Department; dept: string; visible: boolean; all: boolean; onExpand: () => void }) {
  // Never open a category with the same photo the page hero just showed.
  const images = c.images[0] === d.heroImage ? [...c.images.slice(1), c.images[0]] : c.images;
  const [lead, ...rest] = images;
  const shown = all ? rest : rest.slice(0, INITIAL);
  const hiddenCount = rest.length - shown.length;
  const from = c.sizes ? c.sizes.from : d.sizes.from;
  const to = c.sizes ? c.sizes.to : d.sizes.to;

  return (
    <section id={c.id} hidden={!visible} className="scroll-mt-20 py-[clamp(4rem,2rem+6vw,8rem)]" aria-labelledby={`${c.id}-title`}>
      <div className="wrap">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          <div className={lead ? "lg:col-span-5 lg:self-end" : "lg:col-span-5"}>
            <h2 id={`${c.id}-title`} className="t-display text-char">
              {c.label}
            </h2>
            <div className="mt-6 space-y-4 text-char-dim">
              {c.text.map((t) => (
                <p key={t.slice(0, 24)} className="measure">
                  {t}
                </p>
              ))}
            </div>
            <div className="mt-8">
              <Button href={whatsappHref(c.message)} variant="primary" cursor="Scriveteci" icon={<WhatsappLogo size={18} aria-hidden="true" />}>
                Chiedete disponibilità
              </Button>
            </div>
          </div>

          {lead ? (
            <div data-item className="mx-auto w-full max-w-[36rem] lg:col-span-6 lg:col-start-7 lg:max-w-none">
              <Item id={lead} label={c.label} dept={dept} sizes="(min-width: 1024px) 46vw, (min-width: 640px) 36rem, 92vw" eager big />
            </div>
          ) : (
            <div className="grid grid-cols-1 items-end gap-8 border-t border-[var(--line-light)] pt-10 lg:col-span-6 lg:col-start-7 lg:border-t-0 lg:pt-0">
              <p className="opsz-auto font-display text-[clamp(4rem,2rem+8vw,10rem)] leading-[0.85] text-char" aria-hidden="true">
                {from}
                <span className="mx-[0.12em] inline-block h-[0.04em] w-[0.7em] translate-y-[-0.24em] bg-magenta-text align-middle" />
                <span className="italic">{to}</span>
              </p>
              <p className="text-char-dim">
                {c.sizes ? `Taglie comode dalla ${from} alla ${to}.` : `Tutti i capi dalla taglia ${from} alla ${to}.`} Passate in negozio o scriveteci su WhatsApp: vi aiutiamo a trovare la vestibilità giusta.
              </p>
            </div>
          )}
        </div>

        {shown.length > 0 ? (
          <ul className={`mt-16 columns-2 gap-[var(--gutter)] md:mt-24 md:columns-3 ${shown.length > 8 ? "xl:columns-4" : ""}`}>
            {shown.map((id) => (
              <li key={id} data-item className="mb-[clamp(1.5rem,1rem+2vw,3rem)] break-inside-avoid">
                <Item id={id} label={c.label} dept={dept} sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw" />
              </li>
            ))}
          </ul>
        ) : null}

        {hiddenCount > 0 ? (
          <div className="mt-6 flex justify-center">
            <button type="button" onClick={onExpand} className="btn btn-ghost on-light">
              <span className="btn-fill" aria-hidden="true" />
              <span className="btn-label">
                Mostrate tutti ({c.images.length})
                <CaretDown size={16} aria-hidden="true" />
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
