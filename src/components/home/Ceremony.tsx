"use client";

import Image from "next/image";
import { useRef } from "react";
import { CalendarCheck } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { gsap, useGSAP, ScrollTrigger, EASE } from "@/lib/gsap";
import { getMedia } from "@/lib/media";
import { whatsappHref } from "@/lib/site";
import home from "../../../content/home.json";

/**
 * Scene 4, the leading role: "ciò che ci contraddistingue". On desktop the
 * stage is pinned; scrolling changes the outfit under the follow-spot, from
 * the clean line of a tailleur to the dress that shines, while the narration
 * advances beside it. On phones the same story is told as a sequence of lit
 * frames, no pinning. Reduced motion: everything is laid out, still.
 */
export function Ceremony() {
  const c = home.ceremony;
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const pin = pinRef.current;
        if (!pin) return;
        const frames = gsap.utils.toArray<HTMLElement>("[data-frame]", pin);
        const texts = gsap.utils.toArray<HTMLElement>("[data-step]", pin);
        const dot = pin.querySelector<HTMLElement>("[data-dot]");
        const spot = pin.querySelector<HTMLElement>("[data-spot]");
        const n = frames.length;

        gsap.set(frames.slice(1), { autoAlpha: 0 });
        gsap.set(texts.slice(1), { autoAlpha: 0, y: 40 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${window.innerHeight * (n - 1) * 0.9}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        for (let i = 1; i < n; i++) {
          const at = i - 0.5;
          tl.to(spot, { scale: 0.55, autoAlpha: 0.4, duration: 0.25 }, at - 0.1)
            .to(frames[i - 1], { autoAlpha: 0, duration: 0.35 }, at)
            .fromTo(frames[i], { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: EASE.out }, at)
            .to(spot, { scale: 1, autoAlpha: 1, duration: 0.35 }, at + 0.15)
            .to(texts[i - 1], { autoAlpha: 0, y: -30, duration: 0.2 }, at - 0.05)
            .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.35, ease: EASE.out }, at + 0.2);
        }
        tl.fromTo(dot, { top: "0%" }, { top: "100%", duration: n - 0.5, ease: "none" }, 0);
        tl.to({}, { duration: 0.4 });
        return () => ScrollTrigger.refresh();
      });

      // Phones / tablets: each frame lights up as it crosses the middle of the screen.
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-mframe]", root.current).forEach((el) => {
          gsap.fromTo(
            el.querySelector("[data-mdark]"),
            { opacity: 1 },
            { opacity: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "center 55%", scrub: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="surface-ink grain relative">
      {/* Desktop: pinned stage */}
      <div ref={pinRef} className="cer-pin relative hidden h-[100svh] min-h-[640px] overflow-hidden lg:block">
        <div className="wrap grid h-full grid-cols-12 items-center gap-x-[var(--gutter)] pt-header">
          <div className="col-span-4 self-center">
            <SplitReveal as="h2" id="cer-title" className="t-display text-ivory lg:!text-[clamp(2.6rem,0.6rem+3.2vw,4.6rem)]">
              {c.title}
            </SplitReveal>
            <p className="t-lead mt-6 max-w-[28ch] text-ivory-dim">{c.lead}</p>
            <p className="mt-10 max-w-[34ch] text-[0.9375rem] text-ivory-dim">{c.note}</p>
            <div className="mt-8">
              <Button href={whatsappHref(c.cta.message)} variant="primary" magnetic cursor="Scriveteci" icon={<CalendarCheck size={18} aria-hidden="true" />}>
                {c.cta.label}
              </Button>
            </div>
          </div>

          <div className="relative col-span-4 h-[min(78svh,760px)]">
            {c.steps.map((s, i) => {
              const m = getMedia(s.image);
              return (
                <div key={s.image} data-frame className="absolute inset-0 overflow-hidden" aria-hidden={i > 0 ? true : undefined}>
                  <Image src={m.src} alt={m.alt} fill sizes="34vw" className="object-cover" placeholder="blur" blurDataURL={m.blur} />
                </div>
              );
            })}
            <div data-spot className="pointer-events-none absolute -inset-[18%] bg-[radial-gradient(42%_46%_at_50%_42%,transparent_55%,rgb(13_7_10/0.8)_100%)]" aria-hidden="true" />
            <div className="pointer-events-none absolute -top-[12%] left-1/2 h-[60%] w-[70%] -translate-x-1/2 bg-[linear-gradient(180deg,rgb(255_236_214/0.18),transparent)] mix-blend-screen [clip-path:polygon(44%_0,56%_0,100%_100%,0_100%)]" aria-hidden="true" />
          </div>

          <div className="relative col-span-3 col-start-10 h-[min(60svh,520px)]">
            <div className="absolute -left-8 top-0 h-full w-px bg-[var(--line-dark)]" aria-hidden="true">
              <span data-dot className="absolute -left-[3px] top-0 size-[7px] rounded-full bg-magenta-glow shadow-[0_0_16px_4px_rgb(229_9_127/0.6)]" />
            </div>
            <ol className="relative h-full">
              {c.steps.map((s, i) => (
                <li key={s.title} data-step className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                  <p className="font-display text-[clamp(2rem,1.4rem+1.4vw,3rem)] italic leading-[1.05] text-ivory">{s.title}</p>
                  <p className="mt-4 text-ivory-dim">{s.text}</p>
                  <p className="t-label mt-6 text-ivory-dim">
                    <span className="sr-only">Passo </span>
                    {i + 1} di {c.steps.length}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Phones and tablets */}
      <div className="cer-seq section lg:hidden">
        <div className="wrap">
          <h2 className="t-display text-ivory">
            {c.title}
          </h2>
          <p className="t-lead mt-5 text-ivory-dim">{c.lead}</p>
          <ol className="mt-12 space-y-14 md:grid md:grid-cols-2 md:gap-x-[var(--gutter)] md:gap-y-16 md:space-y-0">
            {c.steps.map((s, i) => {
              const m = getMedia(s.image);
              return (
                <li key={s.title} data-mframe className={`grid content-start gap-5 ${i % 2 ? "pl-[12%] md:pl-0 md:pt-24" : "pr-[12%] md:pr-0"}`}>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={m.src} alt={m.alt} fill sizes="(min-width: 768px) 70vw, 88vw" className="object-cover" placeholder="blur" blurDataURL={m.blur} />
                    <div data-mdark className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,rgb(13_7_10/0.15),rgb(13_7_10/0.9))] opacity-40" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display text-3xl italic text-ivory">{s.title}</p>
                    <p className="mt-2 text-ivory-dim">{s.text}</p>
                  </div>
                </li>
              );
            })}
            <li className="flex flex-col justify-center gap-8 border-t border-[var(--line-dark)] pt-10 md:border-t-0 md:pt-0">
              <p className="font-display text-[clamp(1.6rem,1.2rem+1.2vw,2.3rem)] italic leading-tight text-ivory">Su misura per voi</p>
              <p className="measure text-ivory-dim">{c.note}</p>
              <div>
                <Button href={whatsappHref(c.cta.message)} variant="primary" icon={<CalendarCheck size={18} aria-hidden="true" />}>
                  {c.cta.label}
                </Button>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
