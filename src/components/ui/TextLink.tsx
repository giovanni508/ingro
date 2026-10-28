import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Props = { href: string; children: ReactNode; className?: string; cursor?: string } & Omit<ComponentProps<"a">, "href" | "children" | "className">;

/** Inline link whose underline draws in from the left like a light trace. */
export function TextLink({ href, children, className = "", cursor, ...rest }: Props) {
  const external = /^(https?:|tel:|mailto:)/.test(href);
  const cls = `link-trace ${className}`;
  if (external) {
    return (
      <a href={href} className={cls} data-cursor={cursor} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} data-cursor={cursor} {...rest}>
      {children}
    </Link>
  );
}
