"use client";

import Image, { type ImageProps } from "next/image";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";

type Props = Omit<ImageProps, "fill"> & {
  frameClassName?: string;
  /** Spot diameter relative to the frame's larger side. */
  spot?: number;
  /** "pointer": follows a fine pointer, sweeps on scroll elsewhere. "sweep": always scroll-driven. */
  mode?: "pointer" | "sweep";
  children?: ReactNode;
};

/**
 * A photo kept in the dark, lit by a single follow-spot. The darkness is one
 * oversized radial-gradient layer moved with transforms only, so the effect
 * stays on the compositor. Under reduced motion the spot rests at centre.
 */
export function SpotlightReveal({ frameClassName = "", className = "", spot = 0.85, mode = "pointer", alt, children, ...img }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const dark = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const f = frame.current;
      const d = dark.current;
      if (!f || !d) return;
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION_OK, fine: FINE_POINTER }, (ctx) => {
        const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
        if (!motion) return;
        // Offsets are in % of the frame (the dark layer is 3x the frame, centred).
        const xTo = gsap.quickTo(d, "xPercent", { duration: 0.9, ease: "power3.out" });
        const yTo = gsap.quickTo(d, "yPercent", { duration: 0.9, ease: "power3.out" });

        if (mode === "pointer" && fine) {
          gsap.set(d, { xPercent: 0, yPercent: 0 });
          const move = (e: PointerEvent) => {
            const r = f.getBoundingClientRect();
            xTo((((e.clientX - r.left) / r.width) - 0.5) * 33.33);
            yTo((((e.clientY - r.top) / r.height) - 0.5) * 33.33);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          f.addEventListener("pointermove", move);
          f.addEventListener("pointerleave", leave);
          return () => {
            f.removeEventListener("pointermove", move);
            f.removeEventListener("pointerleave", leave);
          };
        }

        // Touch / sweep: the spot travels across the frame as it scrolls past.
        gsap.fromTo(
          d,
          { xPercent: -11, yPercent: -7 },
          {
            xPercent: 11,
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: f, start: "top 85%", end: "bottom 20%", scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={`spotlight relative overflow-hidden ${frameClassName}`} style={{ ["--spot" as string]: spot }}>
      <Image {...img} alt={alt} fill className={`object-cover ${className}`} />
      <div ref={dark} className="spotlight-dark" aria-hidden="true" />
      {children}
    </div>
  );
}
