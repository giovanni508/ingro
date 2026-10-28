"use client";

import { useEffect } from "react";
import { markStageReady } from "@/lib/stage";

/** Time (ms) at which the curtains start to part in the CSS timeline. */
const OPEN_AT = 1450;

/**
 * Wires the CSS preloader to the page: tells the stage when the curtains
 * open (so the hero choreography starts on cue), and lets visitors skip.
 */
export function PreloaderControl() {
  useEffect(() => {
    const root = document.documentElement;
    const pl = document.getElementById("preloader");
    if (!pl || root.classList.contains("pl-off")) {
      markStageReady();
      return;
    }

    const finish = () => {
      root.classList.add("pl-done");
      markStageReady();
    };
    const skip = () => {
      if (root.classList.contains("pl-skip") || root.classList.contains("pl-done")) return;
      root.classList.add("pl-skip");
      markStageReady();
      window.setTimeout(finish, 650);
    };

    // Where are we in the CSS timeline? (hydration may land mid-animation)
    const anim = pl.querySelector(".pl-left")?.getAnimations?.()[0];
    const elapsed = typeof anim?.currentTime === "number" ? anim.currentTime : 0;
    const t1 = window.setTimeout(markStageReady, Math.max(0, OPEN_AT - elapsed));
    const t2 = window.setTimeout(finish, Math.max(0, 2250 - elapsed));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    pl.addEventListener("click", skip);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      pl.removeEventListener("click", skip);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <button type="button" className="pl-skip-btn">
      Salta l&apos;introduzione
    </button>
  );
}
