"use client";

import { useRef } from "react";
import { FacebookLogo, Television } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { NextBroadcast } from "./NextBroadcast";
import { gsap, useGSAP, MOTION_OK, EASE } from "@/lib/gsap";
import { features, site, tv } from "@/lib/site";
import home from "../../../content/home.json";

const FROM = 11;
const TO = 24;
const pos = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return ((h + m / 60 - FROM) / (TO - FROM)) * 100;
};
const TICKS = [12, 14, 16, 18, 20, 22];
const ORDER = [1, 2, 3, 4, 5, 6, 0];

/**
 * Scene 7. TV and live. The weekly TVM CH19 schedule drawn as a timeline of
 * light points (exactly the times published on the old site, always labelled
 * as broadcast times, never as shop hours). Facebook lives on Tuesday and
 * Friday from 17:00 are the magenta points. The "next broadcast" line exists
 * but stays off (content/features.json) until the format is confirmed.
 */
export function OnAir() {
  const t = home.tv;
  const root = useRef<HTMLElement>(null);
  const fb = site.social.find((s) => s.id === "facebook")!;
  const rows = ORDER.map((d) => tv.schedule.find((r) => r.dow === d)!);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-onair]",
          { "--glow": 0 },
          {
            keyframes: { "--glow": [0, 0.7, 0.1, 0.9, 0.3, 1], easeEach: "none" },
            duration: 1.1,
            ease: "none",
            scrollTrigger: { trigger: "[data-onair]", start: "top 85%", once: true },
          },
        );
        gsap.from("[data-mark]", {
          scale: 0,
          autoAlpha: 0,
          duration: 0.6,
          ease: EASE.out,
          stagger: { each: 0.025, from: "start" },
          scrollTrigger: { trigger: "[data-timeline]", start: "top 80%", once: true },
        });
        gsap.from("[data-rail]", {
          scaleX: 0,
          transformOrigin: "0% 50%",
          duration: 1.2,
          ease: EASE.out,
          stagger: 0.06,
          scrollTrigger: { trigger: "[data-timeline]", start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="tv" className="surface-ink grain section relative scroll-mt-16 overflow-hidden" aria-labelledby="tv-title">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end md:gap-x-[var(--gutter)]">
          <div className="md:col-span-7">
            <SplitReveal as="h2" id="tv-title" className="t-display text-ivory">
              {t.title}
            </SplitReveal>
          </div>
          <p className="t-lead text-ivory-dim md:col-span-5">{t.lead}</p>
        </div>

        {features.nextBroadcast ? <NextBroadcast /> : null}

        <div className="mt-16 grid grid-cols-1 gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          {/* Weekly schedule */}
          <div className="lg:col-span-8" data-timeline>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-ivory">
                <Television size={22} aria-hidden="true" />
                <h3 className="font-display text-2xl">{t.scheduleTitle}</h3>
              </div>
              <div data-onair className="onair" aria-hidden="true">
                <span className="onair-lamp" />
                ON AIR
              </div>
            </div>
            <p className="mt-2 max-w-[52ch] text-sm text-ivory-dim">{t.scheduleNote}</p>

            {/* Hour ruler (desktop) */}
            <div className="relative ml-[5.5rem] mt-10 hidden h-6 md:block" aria-hidden="true">
              {TICKS.map((h) => (
                <span key={h} className="tnum absolute -translate-x-1/2 text-xs text-ivory-dim" style={{ left: `${pos(`${h}:00`)}%` }}>
                  {h}:00
                </span>
              ))}
            </div>

            <ul className="mt-4 divide-y divide-[var(--line-dark)] md:mt-2 md:divide-y-0">
              {rows.map((r) => {
                const live = tv.facebookLive.dows.includes(r.dow);
                return (
                  <li key={r.day} className="grid grid-cols-[5.5rem_1fr] items-center py-3.5 md:py-3">
                    <span className="font-display text-lg text-ivory">
                      {r.dayLong}
                    </span>
                    {/* Phones: plain list */}
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-1 md:hidden">
                      {r.times.map((tm) => (
                        <time key={tm} className="tnum text-ivory">
                          {tm}
                        </time>
                      ))}
                      {live ? (
                        <span className="tnum text-magenta-glow">
                          <span className="sr-only">Diretta Facebook dalle </span>
                          {tv.facebookLive.from} Facebook
                        </span>
                      ) : null}
                    </span>
                    {/* Desktop: timeline */}
                    <span className="relative hidden h-9 md:block">
                      <span data-rail className="absolute inset-x-0 top-1/2 h-px bg-[var(--line-dark)]" aria-hidden="true" />
                      {r.times.map((tm) => (
                        <time key={tm} data-mark className="tv-mark tnum" style={{ left: `${pos(tm)}%` }}>
                          <span className="tv-dot" aria-hidden="true" />
                          <span className="tv-time">{tm}</span>
                        </time>
                      ))}
                      {live ? (
                        <span data-mark className="tv-mark is-live tnum" style={{ left: `${pos(tv.facebookLive.from)}%` }}>
                          <span className="tv-dot" aria-hidden="true" />
                          <span className="tv-time">
                            <span className="sr-only">Diretta Facebook dalle </span>
                            {tv.facebookLive.from}
                          </span>
                        </span>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ivory-dim" aria-hidden="true">
              <span className="inline-flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-ivory" /> In onda su TVM CH19
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-magenta-glow" /> Diretta Facebook
              </span>
            </p>
          </div>

          {/* Facebook live */}
          <div className="relative flex flex-col justify-between border border-[var(--line-dark)] p-7 lg:col-span-4 lg:p-9">
            <div>
              <FacebookLogo size={30} className="text-magenta-glow" aria-hidden="true" />
              <h3 className="mt-6 font-display text-3xl text-ivory">{t.facebookTitle}</h3>
              <p className="mt-3 font-display text-[clamp(2rem,1.4rem+2vw,3.2rem)] italic leading-[1.05] text-ivory">{t.facebookText}</p>
              <p className="mt-5 text-ivory-dim">Seguite le dirette, scegliete i capi che amate e ve li spediamo a casa.</p>
            </div>
            <div className="mt-10">
              <Button href={fb.href} variant="ghost" cursor="Guardate">
                {t.facebookCta}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
