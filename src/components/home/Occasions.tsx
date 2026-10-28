"use client";

import Image from "next/image";
import { useCallback, useId, useRef, useState, type KeyboardEvent } from "react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap";
import { getMedia } from "@/lib/media";
import { whatsappHref } from "@/lib/site";
import home from "../../../content/home.json";

/**
 * Scene 3. "Per quale occasione?" A playbill of six occasions taken from the
 * site and the real reviews. Choosing one swaps the photograph with a burst of
 * light opening from the spot, and prepares a WhatsApp message for that
 * occasion. A proper ARIA tablist: arrows, Home/End, click and tap.
 */
export function Occasions() {
  const o = home.occasions;
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const uid = useId();
  const stage = useRef<HTMLDivElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = useCallback(
    (i: number, focus = false) => {
      if (i === active) return;
      setPrev(active);
      setActive(i);
      if (focus) tabs.current[i]?.focus();
      const s = stage.current;
      if (!s || prefersReducedMotion()) {
        setPrev(null);
        return;
      }
      const next = s.querySelector<HTMLElement>(`[data-occ="${i}"]`);
      const flare = s.querySelector<HTMLElement>("[data-flare]");
      if (!next) return;
      gsap.killTweensOf([next, flare]);
      gsap
        .timeline({ onComplete: () => setPrev(null) })
        .fromTo(next, { clipPath: "circle(0% at 50% 34%)" }, { clipPath: "circle(150% at 50% 34%)", duration: 1.1, ease: EASE.curtain }, 0)
        .fromTo(next.querySelector("img"), { scale: 1.12 }, { scale: 1, duration: 1.4, ease: EASE.out }, 0)
        .fromTo(flare, { autoAlpha: 0.9, scale: 0.4 }, { autoAlpha: 0, scale: 1.6, duration: 1, ease: "power2.out" }, 0);
    },
    [active],
  );

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = o.items.length;
    const map: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (e.key in map) {
      e.preventDefault();
      select((active + map[e.key] + n) % n, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      select(n - 1, true);
    }
  };

  const item = o.items[active];

  return (
    <section className="surface-dark grain section relative overflow-hidden" aria-labelledby="occ-title">
      <div className="wrap grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-[var(--gutter)]">
        <div className="md:col-span-5 lg:col-span-5">
          <SplitReveal as="h2" id="occ-title" className="t-display text-ivory">
            {o.title}
          </SplitReveal>
          <p className="t-lead mt-6 max-w-[32ch] text-ivory-dim">{o.intro}</p>

          <div
            role="tablist"
            aria-label="Occasioni"
            aria-orientation="vertical"
            className="-mx-[var(--margin)] mt-10 flex snap-x gap-2 overflow-x-auto px-[var(--margin)] pb-2 [scrollbar-width:none] md:mx-0 md:mt-14 md:block md:space-y-1 md:overflow-visible md:px-0"
          >
            {o.items.map((it, i) => {
              const on = i === active;
              return (
                <button
                  key={it.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`${uid}-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`${uid}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={onKey}
                  data-cursor="Guardate"
                  className={`group relative shrink-0 snap-start rounded-full border px-5 py-3 text-left transition-colors duration-500 md:flex md:w-full md:items-center md:gap-5 md:rounded-none md:border-0 md:px-0 md:py-2 ${
                    on ? "border-ivory bg-ivory text-char md:bg-transparent md:text-ivory" : "border-[var(--line-dark)] text-ivory-dim hover:text-ivory"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`hidden size-2 shrink-0 rounded-full bg-magenta-glow transition-transform duration-500 md:block ${on ? "scale-100 shadow-[0_0_18px_4px_rgb(229_9_127/0.6)]" : "scale-0"}`}
                  />
                  <span className={`text-[0.9375rem] md:font-display md:text-[clamp(1.6rem,1rem+1.6vw,2.6rem)] md:leading-[1.15] ${on ? "md:italic" : ""}`}>
                    <span className="md:hidden">{it.short}</span>
                    <span className="hidden md:inline">{it.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-7 lg:col-span-6 lg:col-start-7" id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`}>
          <div ref={stage} className="relative aspect-[4/5] w-full overflow-hidden bg-velvet-2 md:aspect-[5/6]">
            {o.items.map((it, i) => {
              const m = getMedia(it.image);
              const on = i === active;
              const behind = i === prev;
              return (
                <div
                  key={it.id}
                  data-occ={i}
                  className="absolute inset-0"
                  style={{ zIndex: on ? 2 : 1, visibility: on || behind ? "visible" : "hidden" }}
                  aria-hidden={!on}
                >
                  <Image
                    src={m.src}
                    alt={on ? m.alt : ""}
                    fill
                    sizes="(min-width: 1024px) 46vw, (min-width: 768px) 56vw, 92vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={m.blur}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_40%,rgb(13_7_10/0.65)_100%)]" />
                </div>
              );
            })}
            <div data-flare className="pointer-events-none absolute left-1/2 top-[34%] z-[3] size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0" style={{ background: "radial-gradient(closest-side, rgb(255 236 214 / 0.85), rgb(255 236 214 / 0.25) 45%, transparent)" }} aria-hidden="true" />
          </div>
          <div className="mt-7 grid gap-6 md:grid-cols-[1fr_auto] md:items-end" aria-live="polite">
            <div>
              <p className="font-display text-2xl italic text-ivory">{item.label}</p>
              <p className="mt-2 max-w-[44ch] text-ivory-dim">{item.text}</p>
            </div>
            <Button href={whatsappHref(item.message)} variant="primary" cursor="Scriveteci" icon={<WhatsappLogo size={18} aria-hidden="true" />}>
              Chiedete su WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
