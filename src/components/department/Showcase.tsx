"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, YoutubeLogo } from "@phosphor-icons/react";
import { REDUCED } from "@/lib/gsap";

type Video = { src: string; poster: string; title: string; ratio: string };

function ShowcaseVideo({ v }: { v: Video }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  // Muted autoplay only while visible, never under reduced motion.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia(REDUCED).matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused.current) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      el.play().catch(() => {});
    } else {
      userPaused.current = true;
      el.pause();
    }
  };

  return (
    <figure>
      <div className="relative overflow-hidden bg-ink" style={{ aspectRatio: v.ratio }}>
        <video
          ref={ref}
          src={v.src}
          poster={v.poster}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-label={v.title}
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-4 left-4 grid size-12 place-items-center rounded-full bg-ink/70 text-ivory backdrop-blur transition-colors hover:bg-ivory hover:text-char"
          aria-label={playing ? `Metti in pausa: ${v.title}` : `Riproduci: ${v.title}`}
        >
          {playing ? <Pause size={20} weight="fill" aria-hidden="true" /> : <Play size={20} weight="fill" aria-hidden="true" />}
        </button>
      </div>
      <figcaption className="mt-3 font-display text-xl italic text-ivory">{v.title}</figcaption>
    </figure>
  );
}

/** "In vetrina": short clips sent by the shop, muted and with a pause control. */
export function Showcase({ videos, youtube, brands }: { videos: Video[]; youtube?: { href: string; label: string }; brands?: string }) {
  return (
    <section className="surface-ink grain section relative overflow-hidden" aria-labelledby="showcase-title">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end md:gap-x-[var(--gutter)]">
          <h2 id="showcase-title" className="t-display text-ivory md:col-span-6">
            In <span className="italic">vetrina</span>
          </h2>
          {brands ? <p className="t-lead text-ivory-dim md:col-span-5 md:col-start-8">{brands}</p> : null}
        </div>
        <div className="mt-14 grid grid-cols-1 items-end gap-10 md:grid-cols-12 md:gap-x-[var(--gutter)]">
          {videos.map((v, i) => (
            <div key={v.src} className={videos.length > 2 ? "md:col-span-4" : i === 0 ? "md:col-span-7" : "md:col-span-4 md:col-start-9"}>
              <ShowcaseVideo v={v} />
            </div>
          ))}
        </div>
        {youtube ? (
          <a href={youtube.href} target="_blank" rel="noopener noreferrer" className="link-trace mt-12 inline-flex items-center gap-3 text-ivory" data-cursor="Guardate">
            <YoutubeLogo size={22} aria-hidden="true" />
            {youtube.label}
          </a>
        ) : null}
      </div>
    </section>
  );
}
