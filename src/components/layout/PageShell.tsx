import { ViewTransition, type ReactNode } from "react";

/**
 * Wraps every page so navigations play the curtain view transition
 * (::view-transition-*(.curtain) in globals.css). Lives in each page, not in
 * the layout, because layouts persist and would never enter/exit.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="curtain" exit="curtain" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
