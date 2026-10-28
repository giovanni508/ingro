"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, FINE_POINTER, REDUCED } from "@/lib/gsap";

/**
 * "Faro": a soft pool of light that trails a fine pointer and names the
 * action under it (data-cursor="Scopri" | "Guarda" | "Scrivici"). The system
 * cursor stays visible: the light accompanies it, never replaces it.
 * Mounted only with hover + fine pointer and without reduced motion.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const halo = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia(FINE_POINTER);
    const reduce = window.matchMedia(REDUCED);
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !halo.current || !tag.current) return;
    const h = halo.current;
    const t = tag.current;
    const hx = gsap.quickTo(h, "x", { duration: 0.65, ease: "power3.out" });
    const hy = gsap.quickTo(h, "y", { duration: 0.65, ease: "power3.out" });
    const tx = gsap.quickTo(t, "x", { duration: 0.25, ease: "power3.out" });
    const ty = gsap.quickTo(t, "y", { duration: 0.25, ease: "power3.out" });
    let current: Element | null = null;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hx(e.clientX);
      hy(e.clientY);
      tx(e.clientX);
      ty(e.clientY);
      gsap.to(h, { autoAlpha: 1, duration: 0.4, overwrite: "auto" });
      const target = (e.target as Element | null)?.closest?.("[data-cursor]") ?? null;
      if (target !== current) {
        current = target;
        const text = target?.getAttribute("data-cursor");
        if (text && label.current) {
          label.current.textContent = text;
          gsap.to(t, { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2)", overwrite: "auto" });
          gsap.to(h, { scale: 1.45, duration: 0.6, overwrite: "auto" });
        } else {
          gsap.to(t, { scale: 0.6, autoAlpha: 0, duration: 0.25, overwrite: "auto" });
          gsap.to(h, { scale: 1, duration: 0.6, overwrite: "auto" });
        }
      }
    };
    const leave = () => {
      gsap.to([h, t], { autoAlpha: 0, duration: 0.3, overwrite: "auto" });
      current = null;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={halo} className="cursor-halo" aria-hidden="true" />
      <div ref={tag} className="cursor-tag" aria-hidden="true">
        <span ref={label} />
      </div>
    </>
  );
}
