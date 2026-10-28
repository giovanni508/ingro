"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, EASE, MOTION_OK } from "@/lib/gsap";

/** Counts up to a verified number once it is seen. Renders the final value server-side. */
export function CountUp({ value, className, duration = 1.8 }: { value: number; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const state = { n: 0 };
        const fmt = new Intl.NumberFormat("it-IT");
        el.textContent = fmt.format(0);
        const tween = gsap.to(state, {
          n: value,
          duration,
          ease: EASE.out,
          paused: true,
          onUpdate: () => {
            el.textContent = fmt.format(Math.round(state.n));
          },
        });
        const st = ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => tween.play() });
        return () => {
          st.kill();
          tween.kill();
          el.textContent = fmt.format(value);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {new Intl.NumberFormat("it-IT").format(value)}
    </span>
  );
}
