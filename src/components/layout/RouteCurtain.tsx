"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap";

/**
 * Fallback page transition for browsers without the View Transitions API:
 * the velvet closes instantly on the new page and parts again, echoing the
 * opening curtain. Browsers with View Transitions use the CSS in globals.css.
 */
export function RouteCurtain() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const prev = useRef(pathname);

  useEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    const el = ref.current;
    if (!el || "startViewTransition" in document || prefersReducedMotion()) return;
    const [l, r] = Array.from(el.children) as HTMLElement[];
    const tl = gsap.timeline();
    tl.set(el, { visibility: "visible" })
      .fromTo(l, { xPercent: 0 }, { xPercent: -101, duration: 0.9, ease: EASE.curtain }, 0.05)
      .fromTo(r, { xPercent: 0 }, { xPercent: 101, duration: 0.9, ease: EASE.curtain }, 0.05)
      .set(el, { visibility: "hidden" });
    return () => {
      tl.kill();
      gsap.set(el, { visibility: "hidden" });
    };
  }, [pathname]);

  return (
    <div ref={ref} className="route-curtain" aria-hidden="true">
      <div className="velvet left-0" />
      <div className="velvet right-0" />
    </div>
  );
}
