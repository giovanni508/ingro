"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, ScrollTrigger, useGSAP, EASE, DUR, STAGGER, MOTION_OK } from "@/lib/gsap";
import { onStageReady } from "@/lib/stage";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "scroll": when it enters the viewport. "stage": after the opening curtain. */
  trigger?: "scroll" | "stage";
  by?: "lines" | "words";
  delay?: number;
  id?: string;
};

/**
 * Text revealed line by line from behind a mask, like a title card rising
 * into the light. Visible by default: nothing is hidden until JS is ready,
 * and nothing is split at all under prefers-reduced-motion.
 */
export function SplitReveal({ as: Tag = "div", children, className, trigger = "scroll", by = "lines", delay = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        let cancel: (() => void) | undefined;
        let st: ScrollTrigger | undefined;
        let played = false;
        const split = SplitText.create(el, {
          type: by === "lines" ? "lines" : "words,lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          aria: "auto",
          onSplit(self) {
            const targets = by === "lines" ? self.lines : self.words;
            const tween = gsap.from(targets, {
              yPercent: 112,
              rotate: 2.5,
              transformOrigin: "0% 100%",
              duration: DUR.slow,
              ease: EASE.out,
              stagger: by === "lines" ? STAGGER.base : STAGGER.tight,
              delay,
              paused: true,
              onStart: () => {
                played = true;
              },
            });
            if (played) return tween.progress(1);
            if (trigger === "stage") {
              cancel?.();
              cancel = onStageReady(() => tween.play());
            } else {
              st?.kill();
              st = ScrollTrigger.create({
                trigger: el,
                start: "top 88%",
                once: true,
                onEnter: () => tween.play(),
              });
            }
            return tween;
          },
        });
        return () => {
          cancel?.();
          st?.kill();
          split.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
