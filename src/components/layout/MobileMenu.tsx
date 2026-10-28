"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight, WhatsappLogo, X } from "@phosphor-icons/react";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { NAV, site, whatsappHref } from "@/lib/site";

/**
 * Full-screen menu: the house lights go down from the top (clip-path) and
 * the voices rise from behind a mask, one after the other. WhatsApp and
 * "Portami lì" are the two big doors at the bottom. Focus is trapped while
 * open, Esc closes, page scroll is frozen.
 */
export function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const { lock, unlock } = useSmoothScroll();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    lock();
    const t = window.setTimeout(() => closeBtn.current?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = Array.from(el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      unlock();
      previous?.focus?.();
    };
  }, [open, onClose, lock, unlock]);

  return (
    <div
      ref={ref}
      id="menu"
      className="menu grain lg:hidden"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
    >
      <div className="wrap flex h-[var(--header-h)] shrink-0 items-center justify-end">
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          className="grid h-11 grid-flow-col items-center gap-3 rounded-full px-3 text-[0.8125rem] uppercase tracking-[0.16em] text-ivory"
        >
          Chiudi <X size={18} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Menu principale" className="wrap flex flex-1 flex-col justify-center">
        <ul className="space-y-1">
          {NAV.map((item, i) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="menu-item font-display text-[clamp(2.6rem,11vw,4.5rem)] leading-[1.08] text-ivory"
                style={{ ["--i" as string]: i }}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                <span className={pathname === item.href ? "italic text-magenta-glow" : ""}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="wrap grid shrink-0 grid-cols-2 gap-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
        <a
          href={whatsappHref("Ciao, vorrei qualche informazione.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[4.5rem] flex-col justify-between bg-magenta-deep p-4 text-[#fff8f3]"
        >
          <WhatsappLogo size={22} aria-hidden="true" />
          <span className="text-sm font-medium">WhatsApp con {site.whatsapp.contactName}</span>
        </a>
        <a
          href={site.maps.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[4.5rem] flex-col justify-between border border-[rgb(243_234_226/0.3)] p-4 text-ivory"
        >
          <ArrowUpRight size={22} aria-hidden="true" />
          <span className="text-sm font-medium">Portami lì</span>
        </a>
        <p className="col-span-2 pt-2 text-sm text-ivory-dim">
          {site.address.street}, {site.address.city} · <a className="inline-link" href={site.phone.href}>{site.phone.display}</a>
        </p>
      </div>
    </div>
  );
}
