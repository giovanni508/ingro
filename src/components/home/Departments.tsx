"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { FabricLight } from "@/components/motion/FabricLight";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { getMedia } from "@/lib/media";
import home from "../../../content/home.json";

const LAYOUT = ["md:col-span-6 lg:col-span-5 lg:col-start-2", "md:col-span-6 md:mt-28 lg:col-span-5 lg:col-start-8"];

/**
 * Scene 6. Two fitting rooms, women and men. Each is closed by a velvet curtain on a brass
 * rod; it opens on hover or keyboard focus with a fine pointer, and by itself
 * as it reaches the middle of the screen on touch devices. Under reduced
 * motion the curtains are simply drawn back.
 */
export function Departments() {
  const d = home.departments;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(hover: none), (pointer: coarse)", () => {
        const triggers = gsap.utils.toArray<HTMLElement>("[data-room]", root.current).map((el) =>
          ScrollTrigger.create({
            trigger: el,
            start: "top 62%",
            end: "bottom 25%",
            onToggle: (self) => el.classList.toggle("is-open", self.isActive),
          }),
        );
        return () => triggers.forEach((t) => t.kill());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="reparti" className="surface-dark grain section relative scroll-mt-16 overflow-hidden" aria-labelledby="rep-title">
      <FabricLight />
      <div className="wrap relative z-[2]">
        <div className="max-w-[46rem]">
          <SplitReveal as="h2" id="rep-title" className="t-display text-ivory">
            {d.title}
          </SplitReveal>
          <p className="t-lead mt-6 text-ivory-dim">{d.intro}</p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-16 md:mt-20 md:grid-cols-12 md:gap-x-[var(--gutter)] md:gap-y-0">
          {d.items.map((it, i) => {
            const m = getMedia(it.image);
            return (
              <li key={it.href} className={LAYOUT[i]}>
                <Link href={it.href} data-room className="room group block" data-cursor="Scoprite">
                  <div className="room-frame relative aspect-[3/4] overflow-hidden bg-ink">
                    <Image
                      src={m.src}
                      alt={m.alt}
                      fill
                      sizes="(min-width: 768px) 40vw, 92vw"
                      className="room-photo object-cover"
                      placeholder="blur"
                      blurDataURL={m.blur}
                    />
                    <span className="room-light" aria-hidden="true" />
                    <span className="room-curtain room-curtain-l velvet" aria-hidden="true" />
                    <span className="room-curtain room-curtain-r velvet" aria-hidden="true" />
                    <span className="room-rod" aria-hidden="true" />
                  </div>
                  <div className="mt-6 flex items-start justify-between gap-6">
                    <div>
                      <h3 className="font-display text-[clamp(2.2rem,1.6rem+1.8vw,3.6rem)] leading-none text-ivory">{it.title}</h3>
                      <p className="mt-3 max-w-[34ch] text-ivory-dim">{it.text}</p>
                    </div>
                    <span className="mt-2 grid size-12 shrink-0 place-items-center rounded-full border border-[var(--line-dark)] text-ivory transition-all duration-500 group-hover:rotate-45 group-hover:border-magenta-glow group-hover:bg-magenta-deep group-focus-visible:bg-magenta-deep" aria-hidden="true">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                  <span className="sr-only">Vai al reparto {it.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
