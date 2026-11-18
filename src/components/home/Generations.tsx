"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap";
import { getMedia } from "@/lib/media";
import home from "../../../content/home.json";

/*
 * Pattern drawn in the photo's own coordinates (1024 x 1536, the navy chiffon
 * gown), on the body landmarks of the dress: shoulder, bust, waist, hips, hem.
 */
const DRESS =
  "M398 252 C402 310 405 370 407 420 C410 452 415 482 420 505 C372 720 262 1100 172 1398 C400 1446 668 1446 902 1394 C800 1100 664 720 615 505 C621 482 632 452 638 420 C642 370 650 310 660 250 L622 254 C596 300 560 350 524 390 C490 350 458 300 432 254 Z";
const ALLOWANCE =
  "M378 240 C383 302 386 366 388 420 C391 452 396 482 400 507 C352 720 240 1100 148 1418 C400 1470 668 1470 926 1414 C822 1100 684 720 635 507 C640 482 651 452 657 420 C661 366 669 302 680 238";
const GUIDES = [
  { y: 252, label: "SPALLA" },
  { y: 420, label: "LINEA SENO" },
  { y: 505, label: "LINEA VITA" },
  { y: 648, label: "LINEA FIANCHI" },
  { y: 1400, label: "ORLO" },
];

/**
 * Scene 2. "Tradition and innovation" made visible: a tailor's pattern is
 * drafted line by line on pattern paper, then the light scans down and the
 * finished, contemporary dress appears inside it. On the right, the house
 * philosophy lights up word by word as you read.
 */
export function Generations() {
  const g = home.generations;
  const img = getMedia(g.image);
  const root = useRef<HTMLElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const words = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const v = visual.current;
        if (!v) return;
        const strokes = v.querySelectorAll<SVGGeometryElement>("[data-draw]");
        strokes.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len });
        });
        const photo = v.querySelector<HTMLElement>("[data-photo]");
        const scan = v.querySelector<HTMLElement>("[data-scan]");
        const labels = v.querySelectorAll("[data-label]");
        const grow = v.querySelectorAll("[data-grow]");
        const growY = v.querySelectorAll("[data-grow-y]");
        const fade = v.querySelectorAll("[data-fade]");
        gsap.set(grow, { transformBox: "fill-box", transformOrigin: "0% 50%" });
        gsap.set(growY, { transformBox: "fill-box", transformOrigin: "50% 0%" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: v, start: "top 78%", end: "bottom 35%", scrub: 0.8 },
        });
        tl.from(grow, { scaleX: 0, duration: 0.5, stagger: 0.08 }, 0)
          .from(growY, { scaleY: 0, duration: 0.7 }, 0.05)
          .to(strokes, { strokeDashoffset: 0, duration: 1, stagger: 0.03 }, 0.1)
          .from(fade, { opacity: 0, duration: 0.4 }, 0.6)
          .from(labels, { autoAlpha: 0, duration: 0.3, stagger: 0.05 }, 0.2)
          .fromTo(photo, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0.95)
          .fromTo(scan, { yPercent: -50, top: "0%", autoAlpha: 1 }, { top: "100%", duration: 1 }, 0.95)
          .to(scan, { autoAlpha: 0, duration: 0.15 }, 1.9)
          .to(v.querySelector("[data-pattern]"), { opacity: 0.38, duration: 0.6 }, 1.6);

        // Words light up as they are read.
        let split: SplitText | null = null;
        if (words.current) {
          split = SplitText.create(words.current, { type: "words", aria: "none" });
          gsap.fromTo(
            split.words,
            { opacity: 0.6 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.08,
              scrollTrigger: { trigger: words.current, start: "top 82%", end: "bottom 45%", scrub: true },
            },
          );
        }
        return () => split?.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="surface-light section relative overflow-hidden" aria-labelledby="gen-title">
      <div className="wrap grid grid-cols-1 items-center gap-14 md:grid-cols-12 md:gap-x-[var(--gutter)]">
        <div ref={visual} className="relative mx-auto w-full max-w-[34rem] md:col-span-6 lg:col-span-5 lg:col-start-2" style={{ aspectRatio: `${img.width} / ${img.height}` }}>
          <div data-photo className="absolute inset-0" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
            <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 40vw, 92vw" className="object-cover" placeholder="blur" blurDataURL={img.blur} />
          </div>
          <div data-scan className="pointer-events-none absolute inset-x-[-4%] h-24 opacity-0" aria-hidden="true" style={{ background: "radial-gradient(50% 50% at 50% 50%, rgb(255 236 214 / 0.9), transparent)" }} />
          <svg data-pattern viewBox={`0 0 ${img.width} ${img.height}`} className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden="true">
            <g stroke="var(--char)" strokeWidth="3" strokeLinecap="round">
              {/* tailor's ruler */}
              <path data-draw d="M60 140 V1500" strokeWidth="2.5" />
              {Array.from({ length: 28 }).map((_, i) => (
                <path key={i} data-draw d={`M60 ${150 + i * 50} h${i % 2 === 0 ? 26 : 14}`} strokeWidth="2.5" />
              ))}
              {GUIDES.map((l) => (
                <path key={l.y} data-grow d={`M90 ${l.y} H960`} strokeDasharray="14 10" strokeWidth="2.2" />
              ))}
              <path data-grow-y d="M522 230 V1480" strokeDasharray="36 12 6 12" strokeWidth="2.2" />
              <path data-draw d={DRESS} strokeWidth="5" />
              <path data-fade d={ALLOWANCE} strokeDasharray="10 10" strokeWidth="3" stroke="var(--magenta-text)" />
              <path data-draw d="M462 520 L472 640 L482 520 M562 520 L572 640 L582 520" strokeWidth="3" />
              <path data-draw d="M650 800 V1150 M636 826 L650 800 L664 826 M636 1124 L650 1150 L664 1124" strokeWidth="3" />
              <path data-draw d="M420 505 h-22 M615 505 h22 M386 648 h-22 M652 648 h22" strokeWidth="4" />
            </g>
            <g fill="var(--char)" fontFamily="var(--font-jost)" fontSize="26" letterSpacing="4">
              {GUIDES.map((l) => (
                <text key={l.y} data-label x="960" y={l.y - 12} textAnchor="end">
                  {l.label}
                </text>
              ))}
              <text data-label x="682" y="975" transform="rotate(-90 682 975)" fontSize="22">
                DRITTOFILO
              </text>
              <text data-label x="88" y="132" fontSize="20">
                CM
              </text>
            </g>
          </svg>
        </div>

        <div className="md:col-span-6 lg:col-span-5 lg:col-start-8">
          <h2 id="gen-title" className="t-display text-char">
            Dal cartamodello <span className="italic">alla tendenza</span>
          </h2>
          <p className="mt-8 font-display text-[clamp(1.45rem,1.1rem+1.2vw,2.15rem)] leading-[1.3] text-char">
            <span className="sr-only">{g.illuminated}</span>
            <span ref={words} aria-hidden="true" className="block">
              {g.illuminated}
            </span>
          </p>
          <p className="t-lead measure mt-8 text-char-dim">{g.body}</p>
        </div>
      </div>
    </section>
  );
}
