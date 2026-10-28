import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "ghost" | "light";

type Common = {
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  /** Label shown by the cursor light (desktop only). */
  cursor?: string;
  magnetic?: boolean;
  className?: string;
};

type AsLink = Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "children" | "className">;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "children" | "className">;

function Inner({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <>
      <span className="btn-fill" aria-hidden="true" />
      <span className="btn-label">
        <span className="btn-roll">
          <span>{children}</span>
          <span aria-hidden="true">{children}</span>
        </span>
        {icon ? <span className="btn-icon">{icon}</span> : null}
      </span>
    </>
  );
}

/**
 * The house button: a pill with a light that rises from below on hover/focus
 * and a label that rolls. Primary CTAs get a light magnetic pull (fine
 * pointers only). Renders a Next <Link>, an external <a>, or a <button>.
 */
export function Button(props: AsLink | AsButton) {
  const { children, variant = "primary", icon, cursor, magnetic = false, className = "" } = props;
  const cls = `btn btn-${variant} ${className}`;
  let el: ReactNode;

  if (props.href !== undefined) {
    const { href, external, children: _c, variant: _v, icon: _i, cursor: _cu, magnetic: _m, className: _cl, ...rest } = props as AsLink; // eslint-disable-line @typescript-eslint/no-unused-vars
    const isExternal = external ?? /^(https?:|tel:|mailto:)/.test(href);
    el = isExternal ? (
      <a href={href} className={cls} data-cursor={cursor} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        <Inner icon={icon}>{children}</Inner>
      </a>
    ) : (
      <Link href={href} className={cls} data-cursor={cursor} {...rest}>
        <Inner icon={icon}>{children}</Inner>
      </Link>
    );
  } else {
    const { children: _c, variant: _v, icon: _i, cursor: _cu, magnetic: _m, className: _cl, type = "button", ...rest } = props as AsButton; // eslint-disable-line @typescript-eslint/no-unused-vars
    el = (
      <button type={type} className={cls} data-cursor={cursor} {...rest}>
        <Inner icon={icon}>{children}</Inner>
      </button>
    );
  }

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
