"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Play } from "@phosphor-icons/react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import home from "../../../content/home.json";

/**
 * Scene 7. The shop's 20-second commercial. Nothing loads until the visitor
 * asks for it: a poster with a large play button, then the native player
 * with sound and controls. A written description sits under the frame.
 */
export function Spot() {
  const s = home.spot;
  const [on, setOn] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  const start = () => {
    setOn(true);
    // The element mounts on the next frame: play it and give it focus for keyboard users.
    requestAnimationFrame(() => {
      const v = video.current;
      if (!v) return;
      v.focus();
      v.play().catch(() => {});
    });
  };

  return (
    <section id="spot" className="surface-ink grain section relative scroll-mt-16 overflow-hidden" aria-labelledby="spot-title">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-x-[var(--gutter)]">
          <SplitReveal as="h2" id="spot-title" className="t-display text-ivory md:col-span-6">
            Il nostro <span className="italic text-magenta-glow">spot</span>
          </SplitReveal>
          <p className="t-lead text-ivory-dim md:col-span-5 md:col-start-8">{s.lead}</p>
        </div>

        <figure className="mt-12 md:mt-16">
          <div className="relative aspect-video w-full overflow-hidden bg-ink">
            {on ? (
              <video ref={video} src={s.src} poster={s.poster} controls playsInline preload="auto" className="absolute inset-0 h-full w-full bg-ink object-contain" aria-label={`${s.title}: ${s.description}`} />
            ) : (
              <button type="button" onClick={start} className="group absolute inset-0 block h-full w-full text-left" data-cursor="Guardate">
                <Image src={s.poster} alt="" fill sizes="(min-width: 1440px) 1300px, 92vw" className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.02]" />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(13_7_10/0.75)_100%)]" aria-hidden="true" />
                {/* Bottom-left, so the logo on the opening frame stays readable. */}
                <span className="absolute inset-x-0 bottom-0 flex items-center gap-4 p-4 md:gap-5 md:p-8">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-magenta-deep text-[#fff8f3] shadow-[0_0_50px_rgb(224_0_122/0.45)] transition-transform duration-500 group-hover:scale-110 group-focus-visible:scale-110 md:size-20">
                    <Play size={28} weight="fill" aria-hidden="true" />
                  </span>
                  <span className="font-display text-xl italic text-ivory md:text-3xl">
                    {s.label} <span className="tnum font-sans text-sm not-italic text-ivory-dim md:text-base">0:20</span>
                  </span>
                </span>
              </button>
            )}
          </div>
          <figcaption className="mt-5 max-w-[70ch] text-sm text-ivory-dim">{s.description}</figcaption>
        </figure>
      </div>
    </section>
  );
}
