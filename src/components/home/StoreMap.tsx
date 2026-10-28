"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { MAP_H, MAP_VIEWBOX, MAP_W, ROADS, STORE_XY } from "./map-data";
import { site } from "@/lib/site";

/**
 * Stylised night map drawn from OpenStreetMap data (no third-party script):
 * the streets of the neighbourhood as faint threads, Viale Regione Siciliana
 * drawn in magenta, and the shop marked by a pool of light.
 */
export function StoreMap({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [sx, sy] = STORE_XY;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const viale = root.current?.querySelector<SVGPathElement>("[data-viale]");
        const runner = root.current?.querySelector<SVGPathElement>("[data-runner]");
        if (!viale || !runner) return;
        const len = viale.getTotalLength();
        gsap.set(viale, { strokeDasharray: len, strokeDashoffset: len });
        gsap.set(runner, { opacity: 0 });
        gsap.to(viale, {
          strokeDashoffset: 0,
          duration: 2.4,
          ease: "power2.inOut",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
          onComplete: () => {
            gsap.to(runner, { opacity: 0.9, duration: 0.6 });
          },
        });
        gsap.set(runner, { strokeDasharray: `60 ${len}`, strokeDashoffset: 0 });
        const run = gsap.to(runner, { strokeDashoffset: -len, duration: 14, ease: "none", repeat: -1, paused: true });
        const st = ScrollTrigger.create({ trigger: root.current, start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? run.play() : run.pause()) });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <figure className={className}>
      <div ref={root} className="relative overflow-hidden border border-[var(--line-dark)] bg-ink" style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/map/palermo-strade.svg" alt="" width={MAP_W} height={MAP_H} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full" />
        <svg viewBox={MAP_VIEWBOX} className="absolute inset-0 h-full w-full" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <defs>
            <radialGradient id="map-pool">
              <stop offset="0" stopColor="rgb(255 236 214)" stopOpacity="0.55" />
              <stop offset="0.45" stopColor="rgb(255 236 214)" stopOpacity="0.14" />
              <stop offset="1" stopColor="rgb(255 236 214)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={sx} cy={sy} r="150" fill="url(#map-pool)" />
          <path data-viale d={ROADS.viale} stroke="var(--magenta)" strokeWidth="5" />
          <path data-runner d={ROADS.viale} stroke="#fff3fa" strokeWidth="5" opacity="0.9" />
        </svg>
        <span className="map-pin" style={{ left: `${(sx / MAP_W) * 100}%`, top: `${(sy / MAP_H) * 100}%` }} aria-hidden="true">
          <span className="map-pin-ring" />
          <span className="map-pin-dot" />
          <span className="map-pin-label">Ingromoda</span>
        </span>
        <span className="pointer-events-none absolute left-[4%] top-[57%] -rotate-[9deg] text-[clamp(0.6rem,0.4rem+0.6vw,0.8rem)] uppercase tracking-[0.3em] text-magenta-glow" aria-hidden="true">
          Viale Regione Siciliana
        </span>
      </div>
      <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-ivory-dim">
        <span>
          Il negozio è in Viale Regione Siciliana Sud Est, al civico 4325.
        </span>
        <span>
          Dati ©{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="inline-link">
            OpenStreetMap
          </a>{" "}
          contributors
        </span>
      </figcaption>
      <p className="sr-only">
        {site.name} si trova in {site.address.street}, {site.address.city}.
      </p>
    </figure>
  );
}
