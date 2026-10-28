"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowDown, WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { gsap, useGSAP, EASE, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import { onStageReady, stageAlreadyReady } from "@/lib/stage";
import { getMedia } from "@/lib/media";
import { whatsappHref } from "@/lib/site";
import home from "../../../content/home.json";

/** Where the follow-spot stops, as fractions of the stage frame (the three dresses). */
const STOPS = [
  { x: 0.46, y: 0.42 },
  { x: 0.8, y: 0.47 },
  { x: 0.2, y: 0.5 },
  { x: 0.46, y: 0.42 },
];

/**
 * Scene 1. A dark stage: a single follow-spot travels across the real shop
 * floor (two mannequins and a client in fuchsia), lighting one dress at a
 * time, with a visible cone of light from the rig. The title is set like a
 * playbill and rises line by line when the opening curtain parts.
 */
export function Hero() {
  const h = home.hero;
  const img = getMedia(h.image);
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const dark = useRef<HTMLDivElement>(null);
  const beam = useRef<HTMLDivElement>(null);
  const blackout = useRef<HTMLDivElement>(null);
  const rest = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const f = frame.current;
      const d = dark.current;
      const b = beam.current;
      if (!f || !d || !b) return;
      const spot = { x: STOPS[0].x, y: STOPS[0].y };
      let rect = f.getBoundingClientRect();

      const apply = () => {
        // Dark layer is 3x the frame: 1 xPercent = 3% of the frame.
        gsap.set(d, { xPercent: (spot.x - 0.5) * 33.333, yPercent: (spot.y - 0.5) * 33.333 });
        const dx = (spot.x - 0.5) * rect.width;
        const dy = spot.y * rect.height;
        gsap.set(b, { rotate: (-Math.atan2(dx, dy) * 180) / Math.PI });
      };
      apply();

      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, fine: FINE_POINTER }, (ctx) => {
        const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
        if (!motion) {
          if (blackout.current) gsap.set(blackout.current, { autoAlpha: 0 });
          return;
        }

        const sweep = gsap.timeline({ repeat: -1, paused: true, defaults: { duration: 3.2, ease: "sine.inOut" } });
        STOPS.slice(1).forEach((s) => sweep.to(spot, { x: s.x, y: s.y, onUpdate: apply }).to({}, { duration: 1.4 }));

        // The stage lamp warms up, then the spot starts its round.
        const lit = () => {
          const tl = gsap.timeline({ onComplete: () => sweep.play() });
          if (blackout.current) {
            tl.to(blackout.current, { keyframes: { autoAlpha: [1, 0.55, 0.9, 0.2, 0], easeEach: "none" }, duration: 0.9, ease: "none" });
          }
          if (rest.current) {
            tl.from(rest.current.children, { autoAlpha: 0, y: 18, duration: 0.9, ease: EASE.out, stagger: 0.1 }, 0.55);
          }
        };

        let cancel = () => {};
        if (stageAlreadyReady()) {
          if (blackout.current) gsap.set(blackout.current, { autoAlpha: 0 });
          sweep.play();
        } else {
          if (blackout.current) gsap.set(blackout.current, { autoAlpha: 1 });
          cancel = onStageReady(lit);
        }

        // Desktop: the spot follows the visitor's pointer, then resumes its round.
        let resume: gsap.core.Tween | null = null;
        const move = (e: PointerEvent) => {
          if (!fine) return;
          const r = f.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          if (x < -0.1 || x > 1.1) return;
          sweep.pause();
          resume?.kill();
          gsap.to(spot, { x: Math.min(Math.max(x, 0.05), 0.95), y: Math.min(Math.max(y, 0.2), 0.85), duration: 0.9, ease: "power3.out", onUpdate: apply, overwrite: true });
          resume = gsap.delayedCall(2.4, () => sweep.play());
        };
        const el = root.current;
        el?.addEventListener("pointermove", move);

        const onResize = () => {
          rect = f.getBoundingClientRect();
          apply();
        };
        window.addEventListener("resize", onResize);
        return () => {
          cancel();
          resume?.kill();
          sweep.kill();
          el?.removeEventListener("pointermove", move);
          window.removeEventListener("resize", onResize);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero surface-ink grain relative isolate min-h-[100svh] overflow-hidden" aria-labelledby="hero-title">
      {/* The stage */}
      <div ref={frame} className="spotlight absolute inset-0 lg:left-auto lg:w-[54%]" style={{ ["--spot" as string]: 0.62 }}>
        <Image
          src={img.src}
          alt={img.alt}
          fill
          priority
          fetchPriority="high"
          quality={75}
          sizes="(min-width: 1024px) 54vw, 100vw"
          className="object-cover object-[46%_30%]"
        />
        <div ref={dark} className="spotlight-dark" aria-hidden="true" />
        <div ref={beam} className="hero-beam" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(13_7_10/0.55)_0%,transparent_22%,transparent_45%,rgb(13_7_10/0.92)_78%,var(--ink)_100%)] lg:bg-[linear-gradient(90deg,var(--ink)_0%,rgb(13_7_10/0.6)_22%,transparent_48%),linear-gradient(180deg,rgb(13_7_10/0.5)_0%,transparent_20%,transparent_80%,rgb(13_7_10/0.7)_100%)]" aria-hidden="true" />
        <div ref={blackout} className="absolute inset-0 bg-ink" aria-hidden="true" style={{ opacity: 0 }} />
      </div>

      {/* The playbill */}
      <div className="wrap relative z-10 flex min-h-[100svh] flex-col justify-end pb-[clamp(2.25rem,6vh,4.5rem)] pt-header">
        <SplitReveal as="h1" id="hero-title" trigger="stage" className="t-hero max-w-[15ch] text-ivory [text-shadow:0_2px_30px_rgb(13_7_10/0.45)]">
          Abiti alla moda per tutte le occasioni <span className="italic text-magenta-glow">a Palermo</span>
        </SplitReveal>
        <div ref={rest} className="mt-6 flex flex-col gap-7 md:mt-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="t-lead max-w-[30ch] text-ivory">{h.subtitle}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={h.primary.href} variant="light" magnetic cursor="Scoprite" icon={<ArrowDown size={18} aria-hidden="true" />}>
              {h.primary.label}
            </Button>
            <Button href={whatsappHref(h.secondary.message)} variant="ghost" cursor="Scriveteci" icon={<WhatsappLogo size={18} aria-hidden="true" />}>
              {h.secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
