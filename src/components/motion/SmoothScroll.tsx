"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsap";

type ScrollApi = {
  lenis: Lenis | null;
  /** Freeze page scroll (menu open, dialogs). */
  lock: () => void;
  unlock: () => void;
  scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void;
};

const ScrollContext = createContext<ScrollApi>({
  lenis: null,
  lock: () => {},
  unlock: () => {},
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(ScrollContext);

/**
 * One ticker for everything: Lenis is driven by gsap.ticker and feeds
 * ScrollTrigger on every scroll frame. Disabled under prefers-reduced-motion
 * (native scrolling, no inertia).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED);
    let instance: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const start = () => {
      instance = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        // Touch keeps native momentum: it is what phones do best.
        syncTouch: false,
      });
      instance.on("scroll", ScrollTrigger.update);
      tick = (time: number) => instance?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("lenis-on");
      setLenis(instance);
    };

    const stop = () => {
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      instance = null;
      document.documentElement.classList.remove("lenis-on");
      setLenis(null);
    };

    if (!mq.matches) start();
    const onChange = () => (mq.matches ? stop() : start());
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  // New route: jump to top (or to the hash) and re-measure every trigger.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const hash = window.location.hash;
    const target = hash ? document.querySelector<HTMLElement>(hash) : null;
    if (lenis) {
      lenis.scrollTo(target ?? 0, { immediate: true, force: true });
    }
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);

  const api: ScrollApi = {
    lenis,
    lock: () => {
      lenis?.stop();
      document.documentElement.classList.add("scroll-locked");
    },
    unlock: () => {
      lenis?.start();
      document.documentElement.classList.remove("scroll-locked");
    },
    scrollTo: (target, opts) => {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      if (el === null) return;
      if (lenis) {
        lenis.scrollTo(el, { offset: opts?.offset ?? 0, immediate: opts?.immediate, duration: 1.4 });
      } else if (typeof el === "number") {
        window.scrollTo({ top: el });
      } else {
        el.scrollIntoView({ block: "start" });
      }
    },
  };

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
