"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { ScrollTrigger } from "@/lib/gsap";
import { site, whatsappHref } from "@/lib/site";

/**
 * Discreet WhatsApp door that appears once the first screen is behind you
 * and steps aside near the footer (which has its own contacts).
 */
export function StickyWhatsApp() {
  const ref = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.visible = "false";
    const update = () => {
      const footer = document.querySelector("footer");
      const y = window.scrollY;
      const vh = window.innerHeight;
      const nearFooter = footer ? footer.getBoundingClientRect().top < vh * 0.9 : false;
      el.dataset.visible = String(y > vh * 0.85 && !nearFooter);
    };
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update });
    update();
    return () => st.kill();
  }, [pathname]);

  // The contact page is all doors already.
  if (pathname === "/contatti") return null;

  return (
    <a
      ref={ref}
      href={whatsappHref("Ciao, vorrei qualche informazione.")}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float group flex h-14 items-center gap-3 rounded-full bg-magenta-deep pl-4 pr-4 text-[#fff8f3] shadow-[0_18px_40px_-16px_rgb(196_8_107/0.75)] md:pr-5"
      aria-label={`Scriveteci su WhatsApp (${site.whatsapp.display})`}
      data-visible="false"
      data-cursor="Scriveteci"
    >
      <WhatsappLogo size={24} aria-hidden="true" />
      <span className="hidden text-[0.8125rem] font-medium uppercase tracking-[0.14em] md:inline">Scriveteci</span>
    </a>
  );
}
