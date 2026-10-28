"use client";

import { useRef } from "react";
import { ChatCircleText, Storefront, VideoCamera, WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { SpotlightReveal } from "@/components/motion/SpotlightReveal";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { getMedia } from "@/lib/media";
import { site, whatsappHref } from "@/lib/site";
import home from "../../../content/home.json";

const ICONS = { chat: ChatCircleText, video: VideoCamera, bag: Storefront } as const;

/**
 * Scene 6. "Il camerino a casa vostra": the WhatsApp video call explained in
 * three moves. A point of light travels along the thread as you scroll and
 * switches each step on when it gets there.
 */
export function PersonalShopper() {
  const s = home.shopper;
  const img = getMedia(s.image);
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const t = track.current;
        if (!t) return;
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]", t);
        const fill = t.querySelector("[data-fill]");
        const vertical = window.matchMedia("(max-width: 639px)").matches;
        gsap.set(fill, vertical ? { scaleY: 0, transformOrigin: "50% 0%" } : { scaleX: 0, transformOrigin: "0% 50%" });
        const tl = gsap.timeline({ scrollTrigger: { trigger: t, start: "top 75%", end: "bottom 50%", scrub: 0.6 } });
        tl.to(fill, vertical ? { scaleY: 1, ease: "none", duration: 1 } : { scaleX: 1, ease: "none", duration: 1 }, 0);
        tl.eventCallback("onUpdate", () => {
          steps.forEach((el, i) => el.classList.toggle("is-lit", tl.progress() >= (i / (steps.length - 1)) * 0.98 - 0.001));
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        track.current?.querySelectorAll("[data-step]").forEach((el) => el.classList.add("is-lit"));
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="surface-light section relative overflow-hidden" aria-labelledby="shop-title">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
        <div className="lg:col-span-7">
          <SplitReveal as="h2" id="shop-title" className="t-display text-char">
            Il camerino <span className="italic">a casa vostra</span>
          </SplitReveal>
          <p className="t-lead mt-6 max-w-[36ch] text-char">{s.lead}</p>
          <p className="measure mt-5 text-char-dim">{s.body}</p>

          <ol ref={track} className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6 md:mt-16">
            <span className="absolute left-[1.375rem] top-0 h-full w-px bg-[var(--line-light)] sm:left-0 sm:top-[1.375rem] sm:h-px sm:w-full" aria-hidden="true">
              <span data-fill className="absolute inset-0 bg-magenta-text" />
            </span>
            {s.steps.map((st) => {
              const Icon = ICONS[st.icon as keyof typeof ICONS];
              return (
                <li key={st.title} data-step className="shop-step relative grid grid-cols-[2.75rem_1fr] gap-5 sm:block">
                  <span className="shop-dot relative z-[1] grid size-11 place-items-center rounded-full border border-[var(--line-light)] bg-cipria text-char-dim">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div className="sm:mt-6 sm:pr-4">
                    <h3 className="font-display text-2xl leading-tight text-char">{st.title}</h3>
                    <p className="mt-2 text-[0.9375rem] text-char-dim">{st.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href={whatsappHref(s.cta.message)} variant="primary" magnetic cursor="Scriveteci" icon={<WhatsappLogo size={18} aria-hidden="true" />}>
              {s.cta.label}
            </Button>
            <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="link-trace tnum text-char-dim">
              {site.whatsapp.display}
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[30rem] lg:col-span-5 lg:max-w-none lg:pt-24">
          <SpotlightReveal
            src={img.src}
            alt={img.alt}
            placeholder="blur"
            blurDataURL={img.blur}
            sizes="(min-width: 768px) 38vw, 92vw"
            frameClassName="aspect-[4/5] w-full"
            spot={1.1}
          />
        </div>
      </div>
    </section>
  );
}
