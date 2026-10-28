"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, EASE, DUR, STAGGER, MOTION_OK } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Animate direct children in sequence instead of the wrapper. */
  stagger?: boolean;
  y?: number;
  delay?: number;
  start?: string;
};

/** Content rises a few pixels into place as it enters the light. */
export function FadeUp({ as: Tag = "div", children, className, stagger = false, y = 28, delay = 0, start = "top 86%" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const targets = stagger ? Array.from(el.children) : el;
        gsap.from(targets, {
          autoAlpha: 0,
          y,
          duration: DUR.base,
          ease: EASE.out,
          delay,
          stagger: stagger ? STAGGER.base : 0,
          scrollTrigger: { trigger: el, start, once: true },
          clearProps: "transform,opacity,visibility",
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
