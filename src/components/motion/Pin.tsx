"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  /** How long the pin lasts, in viewport heights. */
  length?: number;
  /** Receives 0..1 while pinned (drive your own timeline with it). */
  onProgress?: (progress: number) => void;
  /** Only pin from this media query up (pins are kept off phones by default). */
  media?: string;
  className?: string;
};

/**
 * Reusable pinned stage: holds its content at the top of the viewport for
 * `length` screens and reports the progress. No pin under reduced motion or
 * below `media`: the content simply scrolls. The ceremony scene uses the same
 * pattern with its own timeline.
 */
export function Pin({ children, length = 2, onProgress, media = "(min-width: 1024px)", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${media} and ${MOTION_OK}`, () => {
        const st = ScrollTrigger.create({
          trigger: ref.current,
          start: "top top",
          end: () => `+=${window.innerHeight * length}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => onProgress?.(self.progress),
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [length, media] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
