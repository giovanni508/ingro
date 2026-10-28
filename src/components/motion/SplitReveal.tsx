"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, ScrollTrigger, useGSAP, EASE, DUR, STAGGER, MOTION_OK } from "@/lib/gsap";
import { onStageReady, stageAlreadyReady } from "@/lib/stage";

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
  // Headings may carry the aria-label SplitText adds; other elements may not,
  // so they get a screen-reader copy and an aria-hidden visual layer instead.
  const isHeading = typeof Tag === "string" && /^h[1-6]$/.test(Tag);
  const Comp: ElementType = Tag;

  useGSAP(
    () => {
      const el = isHeading ? ref.current : ref.current?.querySelector<HTMLElement>("[data-split]");
      if (!el) return;
      // Above-the-fold text that is already lit stays put: no hide-and-replay.
      if (trigger === "stage" && stageAlreadyReady()) return;
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
          aria: isHeading ? "auto" : "none",
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

  if (isHeading) {
    return (
      <Comp ref={ref} className={className} id={id}>
        {children}
      </Comp>
    );
  }
  return (
    <Comp ref={ref} className={className} id={id}>
      <span className="sr-only">{children}</span>
      <span data-split aria-hidden="true" className="block">
        {children}
      </span>
    </Comp>
  );
}
