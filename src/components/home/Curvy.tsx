import Link from "next/link";
import { ArrowUpRight, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { SpotlightReveal } from "@/components/motion/SpotlightReveal";
import { FadeUp } from "@/components/motion/FadeUp";
import { getMedia } from "@/lib/media";
import { whatsappHref } from "@/lib/site";
import home from "../../../content/home.json";

/**
 * Scene 3. The house speciality, said plainly: the curvy line, for women and
 * for men. The size ranges are set like a playbill (from / to) and each one
 * leads to its department; the photo sits under its own small spotlight.
 */
export function Curvy() {
  const c = home.curvy;
  const img = getMedia(c.image);
  return (
    <section id="curvy" className="surface-ink grain section relative scroll-mt-16 overflow-hidden" aria-labelledby="curvy-title">
      <div className="wrap grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
        <div className="mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:col-span-5 lg:max-w-none">
          <SpotlightReveal src={img.src} alt={img.alt} sizes="(min-width: 1024px) 34vw, 26rem" frameClassName="aspect-[4/5] w-full" placeholder="blur" blurDataURL={img.blur} spot={0.9} />
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="t-label text-magenta-glow">{c.eyebrow}</p>
          <SplitReveal as="h2" id="curvy-title" className="t-display mt-5 text-ivory">
            Specializzati nella linea <span className="italic text-magenta-glow">curvy</span>
          </SplitReveal>
          <p className="mt-8 max-w-[26ch] font-display text-[clamp(1.5rem,1.15rem+1.2vw,2.2rem)] italic leading-tight text-ivory">{c.lead}</p>
          <p className="t-lead measure mt-6 text-ivory-dim">{c.body}</p>

          <FadeUp as="ul" stagger className="mt-12 grid grid-cols-1 gap-px border border-[var(--line-dark)] bg-[var(--line-dark)] sm:grid-cols-2">
            {c.sizes.map((s) => (
              <li key={s.label} className="bg-ink">
                <Link href={s.href} className="group flex h-full flex-col justify-between gap-6 p-6 transition-colors duration-500 hover:bg-velvet-2 focus-visible:bg-velvet-2 lg:p-8" data-cursor="Scoprite">
                  <span className="flex items-center justify-between gap-4">
                    <span className="t-label text-ivory-dim">{s.label}</span>
                    <ArrowUpRight size={20} className="text-ivory transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
                  </span>
                  <span className="opsz-auto font-display text-[clamp(3rem,2rem+3.4vw,5rem)] leading-[0.9] text-ivory" aria-hidden="true">
                    {s.from}
                    <span className="mx-[0.12em] inline-block h-[0.04em] w-[0.6em] translate-y-[-0.24em] bg-magenta-glow align-middle" />
                    <span className="italic">{s.to}</span>
                  </span>
                  <span className="sr-only">
                    Linea curvy {s.label.toLowerCase()}: dalla taglia {s.from} alla {s.to}. Vai al reparto {s.label}.
                  </span>
                </Link>
              </li>
            ))}
          </FadeUp>

          <div className="mt-10">
            <Button href={whatsappHref(c.cta.message)} variant="light" magnetic cursor="Scriveteci" icon={<WhatsappLogo size={18} aria-hidden="true" />}>
              {c.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
