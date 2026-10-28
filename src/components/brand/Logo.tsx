import { LOGO_M, LOGO_VIEWBOX, LOGO_WORD } from "./logo-paths";

/**
 * The official logo, traced to vector. The paths live once in <LogoDefs/>
 * (rendered in the root layout) and every <Logo/> reuses them with <use>.
 * Wordmark takes currentColor; the brushed "M" is always the brand magenta.
 */
export function LogoDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <path id="logo-word" fillRule="evenodd" d={LOGO_WORD} />
        <path id="logo-m" fillRule="evenodd" d={LOGO_M} />
      </defs>
    </svg>
  );
}

export function Logo({ className = "", title = "Ingromoda", decorative = false }: { className?: string; title?: string; decorative?: boolean }) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      <use href="#logo-word" fill="currentColor" />
      <use href="#logo-m" className="logo-m" fill="var(--magenta)" />
    </svg>
  );
}
