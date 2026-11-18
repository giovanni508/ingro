"use client";

import { useRef } from "react";
import { Broadcast, FacebookLogo, InstagramLogo, Television, TiktokLogo } from "@phosphor-icons/react";
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
 * as broadcast times, never as shop hours). Social lives have no fixed days:
 * the box beside it sends people to Facebook, Instagram and TikTok to find out
 * when the next one is. The "next broadcast" line exists but stays off
 * (content/features.json) until the format is confirmed.
 */
export function OnAir() {
  const t = home.tv;
  const root = useRef<HTMLElement>(null);
  const LIVE = [
    { id: "facebook", Icon: FacebookLogo },
    { id: "instagram", Icon: InstagramLogo },
    { id: "tiktok", Icon: TiktokLogo },
  ].map((l) => ({ ...l, ...site.social.find((x) => x.id === l.id)! }));
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
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ivory-dim" aria-hidden="true">
              <span className="inline-flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-ivory" /> In onda su TVM CH19
              </span>
            </p>
          </div>

          {/* Social lives: no fixed days, follow the profiles */}
          <div id="dirette" className="relative flex scroll-mt-28 flex-col justify-between border border-[var(--line-dark)] p-7 lg:col-span-4 lg:p-9">
            <div>
              <Broadcast size={30} className="text-magenta-glow" aria-hidden="true" />
              <h3 className="mt-6 font-display text-3xl text-ivory">{t.liveTitle}</h3>
              <p className="mt-3 font-display text-[clamp(1.8rem,1.3rem+1.6vw,2.7rem)] italic leading-[1.08] text-ivory">{t.liveText}</p>
              <p className="mt-5 text-ivory-dim">{t.liveNote}</p>
            </div>
            <ul className="mt-10 grid gap-3">
              {LIVE.map(({ id, Icon, href, label }) => (
                <li key={id}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 rounded-full border border-[var(--line-dark)] px-5 py-3 text-ivory transition-colors duration-300 hover:border-magenta-glow hover:bg-magenta-deep focus-visible:bg-magenta-deep" data-cursor="Seguiteci">
                    <span className="inline-flex items-center gap-3">
                      <Icon size={22} aria-hidden="true" />
                      {label}
                    </span>
                    <span className="text-sm text-ivory-dim group-hover:text-ivory">Seguiteci</span>
                    <span className="sr-only">(si apre in una nuova scheda)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
