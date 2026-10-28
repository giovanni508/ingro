"use client";

import Image, { type ImageProps } from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Props = Omit<ImageProps, "fill"> & {
  /** Travel in % of the frame height. */
  amount?: number;
  frameClassName?: string;
};

/**
 * Image that drifts slower than the page inside a fixed crop. The image is
 * oversized by `amount` so the frame never shows an edge.
 */
export function ParallaxImage({ amount = 12, frameClassName = "", className = "", alt, ...img }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          inner.current,
          { yPercent: -amount / 2 },
          {
            yPercent: amount / 2,
            ease: "none",
            scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={`relative overflow-hidden ${frameClassName}`}>
      <div ref={inner} className="absolute inset-x-0 will-change-transform" style={{ top: `-${amount / 2}%`, bottom: `-${amount / 2}%` }}>
        <Image {...img} alt={alt} fill className={`object-cover ${className}`} />
      </div>
    </div>
  );
}
