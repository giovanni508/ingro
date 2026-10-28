import { LOGO_VIEWBOX } from "@/components/brand/logo-paths";
import { PreloaderControl } from "./PreloaderControl";

/**
 * "Si accendono le luci": a follow-spot warms up on the closed velvet,
 * the logo appears in its light, the M is brushed in, the curtains part.
 * Pure CSS timeline (max 2.2s) so it runs before hydration and never waits
 * for JS; the page renders behind it in parallel. Skippable with a click,
 * Esc or the button; shown once per session (see the inline script in
 * layout.tsx) and never under prefers-reduced-motion.
 */
export function Preloader() {
  return (
    <div className="pl" id="preloader" data-preloader>
      <div className="pl-curtain pl-left velvet" aria-hidden="true" />
      <div className="pl-curtain pl-right velvet" aria-hidden="true" />
      <div className="pl-stage" aria-hidden="true">
        <div className="pl-beam" />
        <div className="pl-pool" />
        <div className="pl-logo">
          <svg viewBox={LOGO_VIEWBOX} className="pl-word" focusable="false">
            <use href="#logo-word" fill="currentColor" />
          </svg>
          <svg viewBox={LOGO_VIEWBOX} className="pl-m" focusable="false">
            <use href="#logo-m" fill="var(--magenta)" />
          </svg>
        </div>
      </div>
      <PreloaderControl />
    </div>
  );
}
