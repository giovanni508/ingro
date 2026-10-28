import type { ReactNode } from "react";

/**
 * CSS-only marquee (no JS on the main thread). The track is duplicated and
 * the copy is aria-hidden; it pauses on hover/focus and stops entirely under
 * prefers-reduced-motion (see .marquee in globals.css). One per page, max.
 */
export function Marquee({ children, className = "", speed = 38, label }: { children: ReactNode; className?: string; speed?: number; label: string }) {
  return (
    <div className={`marquee ${className}`} style={{ ["--marquee-speed" as string]: `${speed}s` }} role="region" aria-label={label}>
      <div className="marquee-track">
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
