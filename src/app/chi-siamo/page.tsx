import type { Metadata } from "next";
import Link from "next/link";
import { FacebookLogo, Package, Television, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { PageShell } from "@/components/layout/PageShell";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { FadeUp } from "@/components/motion/FadeUp";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { SpotlightReveal } from "@/components/motion/SpotlightReveal";
import { Reviews } from "@/components/home/Reviews";
import { Visit } from "@/components/home/Visit";
import { getMedia } from "@/lib/media";
import { pageMeta } from "@/lib/seo";
import c from "../../../content/chi-siamo.json";

export const metadata: Metadata = pageMeta({ title: c.seo.title, description: c.seo.description, path: "/chi-siamo" });

const FACT_ICONS = [Television, FacebookLogo, WhatsappLogo, Package];
const GALLERY = [
  "col-span-2 md:col-span-5 aspect-[4/5]",
  "md:col-span-4 aspect-[4/5] md:mt-16",
  "md:col-span-3 aspect-[3/4] md:mt-32",
  "md:col-span-3 aspect-[3/4]",
  "md:col-span-4 aspect-[4/3] md:-mt-10",
  "md:col-span-4 aspect-[4/5]",
  "md:col-span-3 aspect-[3/4] md:mt-20",
  "col-span-2 md:col-span-5 aspect-[3/2]",
];

export default function ChiSiamoPage() {
  const hero = getMedia(c.hero.image);
  const story = getMedia(c.story.image);
  return (
    <PageShell>
      {/* Opening */}
      <section className="surface-ink grain relative overflow-hidden pt-header" aria-labelledby="cs-title">
        <div className="wrap grid grid-cols-1 gap-10 pb-16 pt-12 md:grid-cols-12 md:gap-x-[var(--gutter)] md:pb-24 md:pt-20">
          <div className="md:col-span-6 md:self-end">
            <SplitReveal as="h1" id="cs-title" trigger="stage" className="t-hero text-ivory">
              Chi <span className="italic text-magenta-glow">siamo</span>
            </SplitReveal>
            <p className="mt-8 max-w-[24ch] font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] italic leading-tight text-ivory">{c.hero.lead}</p>
            <p className="t-lead mt-6 max-w-[44ch] text-ivory-dim">{c.hero.intro}</p>
          </div>
          <div className="ml-auto w-1/2 md:col-span-6 md:w-full">
            <SpotlightReveal src={hero.src} alt={hero.alt} loading="eager" fetchPriority="high" sizes="(min-width: 768px) 46vw, 50vw" frameClassName="aspect-[4/5] w-full" spot={1} />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="surface-light section" aria-labelledby="story-title">
        <div className="wrap grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-x-[var(--gutter)]">
          <div className="md:col-span-5">
            <ParallaxImage src={story.src} alt={story.alt} sizes="(min-width: 768px) 40vw, 92vw" frameClassName="aspect-[3/4] w-full" amount={14} />
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-center">
            <SplitReveal as="h2" id="story-title" className="t-display text-char">
              {c.story.title}
            </SplitReveal>
            <FadeUp stagger className="mt-8 space-y-5 text-char-dim">
              {c.story.paragraphs.map((p) => (
                <p key={p.slice(0, 20)} className="measure">
                  {p}
                </p>
              ))}
            </FadeUp>
            <p className="mt-10 font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] italic leading-tight text-char">{c.story.quote}</p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="surface-dark grain section relative overflow-hidden" aria-label="La nostra filosofia">
        <div className="wrap">
          <SplitReveal as="p" className="t-display mx-auto max-w-[20ch] text-center text-ivory">
            {c.philosophy.quote}
          </SplitReveal>
          <p className="t-lead mx-auto mt-10 max-w-[46ch] text-center text-ivory-dim">{c.philosophy.text}</p>
        </div>
      </section>

      {/* Team */}
      <section className="surface-light section" aria-labelledby="team-title">
        <div className="wrap grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-[var(--gutter)]">
          <SplitReveal as="h2" id="team-title" className="t-display text-char md:col-span-5">
            {c.team.title}
          </SplitReveal>
          <FadeUp stagger className="space-y-5 text-char-dim md:col-span-6 md:col-start-7">
            {c.team.paragraphs.map((p) => (
              <p key={p.slice(0, 20)} className="t-lead measure text-char-dim">
                {p}
              </p>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* Online and TV */}
      <section className="surface-ink grain section relative overflow-hidden" aria-labelledby="online-title">
        <div className="wrap grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-x-[var(--gutter)]">
          <div className="md:col-span-6">
            <SplitReveal as="h2" id="online-title" className="t-display text-ivory">
              {c.online.title}
            </SplitReveal>
            <FadeUp stagger className="mt-8 space-y-5">
              {c.online.paragraphs.map((p) => (
                <p key={p.slice(0, 20)} className="measure text-ivory-dim">
                  {p}
                </p>
              ))}
            </FadeUp>
            <p className="mt-8">
              <Link href="/#tv" className="link-trace is-underlined text-ivory">
                Il palinsesto TV e le dirette
              </Link>
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-px self-end border border-[var(--line-dark)] bg-[var(--line-dark)] sm:grid-cols-2 md:col-span-5 md:col-start-8">
            {c.online.facts.map((f, i) => {
              const Icon = FACT_ICONS[i];
              return (
                <li key={f.title} className="bg-ink p-6">
                  <Icon size={26} className="text-magenta-glow" aria-hidden="true" />
                  <p className="mt-6 font-display text-2xl text-ivory">{f.title}</p>
                  <p className="mt-1 text-sm text-ivory-dim">{f.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      <section className="surface-light section" aria-labelledby="gal-title">
        <div className="wrap">
          <SplitReveal as="h2" id="gal-title" className="t-display text-char">
            {c.gallery.title}
          </SplitReveal>
          <ul className="mt-14 grid grid-cols-2 gap-[var(--gutter)] md:grid-cols-12">
            {c.gallery.images.map((id, i) => {
              const m = getMedia(id);
              return (
                <li key={id} className={GALLERY[i % GALLERY.length]}>
                  <ParallaxImage src={m.src} alt={m.alt} sizes="(min-width: 768px) 36vw, 46vw" frameClassName="h-full w-full" amount={10} />
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Reviews />
      <Visit />
    </PageShell>
  );
}
