"use client";

import Link from "next/link";
import { useRef } from "react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import { NAV, whatsappHref } from "@/lib/site";

/**
 * 404: the follow-spot searches the empty stage for the missing page, wandering
 * on its own (or following the mouse) and lighting what it crosses.
 */
export function NotFoundStage() {
  const root = useRef<HTMLElement>(null);
  const spot = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, fine: FINE_POINTER }, (ctx) => {
        const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
        const el = spot.current;
        const r = root.current;
        if (!el || !r || !motion) return;
        const search = gsap.timeline({ repeat: -1, defaults: { duration: 2.6, ease: "sine.inOut" } });
        search
          .to(el, { xPercent: 60, yPercent: -30 })
          .to(el, { xPercent: -70, yPercent: 10 })
          .to(el, { xPercent: 20, yPercent: 45 })
          .to(el, { xPercent: -10, yPercent: -10, duration: 1.8 });
        if (!fine) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          search.pause();
          gsap.to(el, { xPercent: 0, yPercent: 0, duration: 0.6, overwrite: "auto" });
          const b = r.getBoundingClientRect();
          xTo(e.clientX - b.left - b.width / 2);
          yTo(e.clientY - b.top - b.height / 2);
        };
        r.addEventListener("pointermove", move);
        return () => r.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="surface-ink grain relative isolate flex min-h-[100svh] items-center overflow-hidden pt-header" aria-labelledby="nf-title">
      <div ref={spot} className="nf-spot" aria-hidden="true" />
      <div className="wrap relative z-[2] py-20">
        <p className="opsz-auto font-display text-[clamp(7rem,4rem+18vw,22rem)] leading-[0.8] text-[rgb(243_234_226/0.12)] [-webkit-text-stroke:1px_rgb(243_234_226/0.35)]" aria-hidden="true">
          404
        </p>
        <h1 id="nf-title" className="t-display mt-6 max-w-[16ch] text-ivory">
          Questa pagina è <span className="italic text-magenta-glow">uscita di scena</span>
        </h1>
        <p className="t-lead mt-6 max-w-[40ch] text-ivory-dim">
          Il riflettore la sta ancora cercando. Nel frattempo, il resto dello spettacolo è da questa parte.
        </p>
        <ul className="mt-10 flex flex-wrap gap-3">
          <li>
            <Link href="/" className="btn btn-light">
              <span className="btn-fill" aria-hidden="true" />
              <span className="btn-label">Torna alla home</span>
            </Link>
          </li>
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="btn btn-ghost">
                <span className="btn-fill" aria-hidden="true" />
                <span className="btn-label">{n.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <a href={whatsappHref("Ciao, sul sito non trovo una pagina.")} target="_blank" rel="noopener noreferrer" className="link-trace mt-10 inline-flex items-center gap-2 text-ivory-dim hover:text-ivory">
          <WhatsappLogo size={18} aria-hidden="true" /> Cercavate qualcosa in particolare? Chiedetelo su WhatsApp
        </a>
      </div>
    </section>
  );
}
