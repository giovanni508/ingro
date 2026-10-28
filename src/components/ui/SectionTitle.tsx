import type { ReactNode } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";

/**
 * Section heading of the house: Bodoni display, revealed line by line from a
 * mask, with an optional italic tail ("Il camerino *a casa vostra*").
 * No eyebrow above it, ever: the heading carries its own weight.
 */
export function SectionTitle({
  children,
  italic,
  id,
  as = "h2",
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  italic?: ReactNode;
  id?: string;
  as?: "h1" | "h2" | "h3";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <SplitReveal as={as} id={id} className={`t-display ${tone === "dark" ? "text-ivory" : "text-char"} ${className}`}>
      {children}
      {italic ? (
        <>
          {" "}
          <span className="italic">{italic}</span>
        </>
      ) : null}
    </SplitReveal>
  );
}
