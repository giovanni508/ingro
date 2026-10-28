"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { WhatsappLogo, X } from "@phosphor-icons/react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import { ScrollTrigger } from "@/lib/gsap";
import { NAV, features, site, whatsappHref } from "@/lib/site";

/**
 * Transparent over the stage, velvet-and-blur once the page moves; slides
 * away while reading down and returns on the way up. Driven by a single
 * ScrollTrigger writing data-attributes (no React state per frame).
 */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  // The menu belongs to the page it was opened on: navigating closes it.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = -1;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        el.dataset.solid = String(y > 40);
        const goingDown = self.direction === 1 && y > 420;
        if (goingDown !== (last === 1)) {
          el.dataset.hidden = String(goingDown);
          last = goingDown ? 1 : 0;
        }
      },
    });
    el.dataset.solid = String(window.scrollY > 40);
    return () => st.kill();
  }, [pathname]);

  // A new page always shows the header.
  useEffect(() => {
    if (ref.current) ref.current.dataset.hidden = "false";
  }, [pathname]);

  const dismissAnnouncement = () => {
    try {
      sessionStorage.setItem("ingromoda-announce", "closed");
    } catch {
      /* ignore */
    }
    document.documentElement.classList.remove("has-announce");
  };

  const a = features.announcement;

  return (
    <>
      <header ref={ref} className="site-header" data-solid="false" data-hidden="false">
        {a.enabled ? (
          <div className="announce relative items-center justify-center gap-3 bg-magenta-deep px-10 text-center text-[0.8125rem] leading-tight text-[#fff8f3]" style={{ minHeight: "var(--announce-h)" }}>
            <p className="py-1.5">
              {a.text}{" "}
              <a href={a.href} target="_blank" rel="noopener noreferrer" className="ml-1 font-medium underline decoration-1 underline-offset-[3px]">
                {a.linkLabel}
              </a>
            </p>
            <button type="button" onClick={dismissAnnouncement} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full hover:bg-white/10" aria-label="Chiudi l'avviso">
              <X size={14} weight="bold" aria-hidden="true" />
            </button>
          </div>
        ) : null}
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" className="relative z-10 -my-2 block shrink-0 py-2 text-ivory" aria-label="Ingromoda, torna alla home" data-cursor="Home">
            <Logo className="h-11 w-auto md:h-[3.1rem]" decorative />
          </Link>

          <nav aria-label="Principale" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link" aria-current={pathname === item.href ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={whatsappHref("Ciao, vorrei qualche informazione.")}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-11 place-items-center rounded-full border border-[rgb(243_234_226/0.28)] text-ivory transition-colors hover:border-ivory hover:bg-ivory hover:text-char"
              aria-label={`Scriveteci su WhatsApp (${site.whatsapp.display})`}
              data-cursor="Scriveteci"
            >
              <WhatsappLogo size={20} weight="regular" aria-hidden="true" />
            </a>
            <Button href={site.maps.href} variant="primary" className="hidden !min-h-11 !px-5 md:inline-flex" cursor="Portami lì">
              Portami lì
            </Button>
            <button
              type="button"
              className="group grid h-11 grid-flow-col items-center gap-3 rounded-full px-3 text-[0.8125rem] uppercase tracking-[0.16em] text-ivory lg:hidden"
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpenAt(pathname)}
            >
              <span>Menu</span>
              <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-2/3 self-end bg-current transition-all group-hover:w-full" />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpenAt(null)} pathname={pathname} />
    </>
  );
}
