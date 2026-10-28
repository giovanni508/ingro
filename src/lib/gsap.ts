"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

/**
 * Motion tokens. Mirrored in globals.css (--ease-*, --dur-*) so CSS and GSAP
 * move with the same vocabulary. See DESIGN.md › Motion.
 */
export const EASE = {
  /** cubic-bezier(0.22, 1, 0.36, 1): the house "reveal" ease. */
  out: "ingro.out",
  /** Expressive in-out for curtains and pinned scenes. */
  curtain: "ingro.curtain",
  expo: "expo.out",
  none: "none",
} as const;

export const DUR = { fast: 0.4, base: 0.8, slow: 1.2 } as const;
export const STAGGER = { tight: 0.06, base: 0.09, loose: 0.14 } as const;

let registered = false;

if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
  CustomEase.create("ingro.out", "0.22,1,0.36,1");
  CustomEase.create("ingro.curtain", "0.76,0,0.24,1");
  gsap.defaults({ ease: EASE.out, duration: DUR.base });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export const REDUCED = "(prefers-reduced-motion: reduce)";
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED).matches;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
