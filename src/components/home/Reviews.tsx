import { Star } from "@phosphor-icons/react/ssr";
import { CountUp } from "@/components/motion/CountUp";
import { FadeUp } from "@/components/motion/FadeUp";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/lib/site";
import reviews from "../../../content/reviews.json";
import home from "../../../content/home.json";

const PLACE = ["md:col-span-8", "md:col-span-7 md:col-start-6", "md:col-span-7 md:col-start-2", "md:col-span-6 md:col-start-7", "md:col-span-8 md:col-start-3"];
const MONTHS = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

/**
 * Scene 8. Real Google reviews set as editorial pull quotes. Text untouched
 * (shortened only with "…"), author and source shown. The count is the one
 * printed by the old widget; no average is shown because none is published.
 */
export function Reviews() {
  const r = home.reviews;
  return (
    <section className="surface-light section relative overflow-hidden" aria-labelledby="rev-title">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end md:gap-x-[var(--gutter)]">
          <SplitReveal as="h2" id="rev-title" className="t-display text-char md:col-span-6">
            {r.title}
          </SplitReveal>
          <div className="md:col-span-5 md:col-start-8">
            <p className="flex items-baseline gap-4 text-char">
              <CountUp value={reviews.count} className="font-display text-[clamp(4rem,2.6rem+5vw,7.5rem)] leading-none" />
              <span className="text-lg leading-tight">{r.countLabel}</span>
            </p>
            <p className="mt-3 flex items-center gap-3 text-char-dim">
              <span className="flex gap-0.5 text-magenta-text" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} weight="fill" />
                ))}
              </span>
              {r.ratingLabel}
            </p>
          </div>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-14 md:mt-24 md:grid-cols-12 md:gap-x-[var(--gutter)] md:gap-y-20">
          {reviews.items.map((q, i) => {
            const d = new Date(q.date);
            return (
              <li key={q.author} className={PLACE[i % PLACE.length]}>
                <FadeUp as="figure" className="relative">
                  <span className="absolute -left-1 -top-14 font-display text-[7.5rem] leading-none text-magenta-text md:-left-16 md:-top-10 md:text-[9rem]" aria-hidden="true">
                    “
                  </span>
                  <blockquote className="t-quote text-char">
                    <p>{q.excerpt}</p>
                  </blockquote>
                  <figcaption className="mt-5 flex flex-wrap items-center gap-x-3 text-[0.9375rem] text-char-dim">
                    <span className="font-medium text-char">{q.author}</span>
                    <span aria-hidden="true">/</span>
                    <span>
                      Recensione Google, {MONTHS[d.getUTCMonth()]} {d.getUTCFullYear()}
                    </span>
                  </figcaption>
                </FadeUp>
              </li>
            );
          })}
        </ul>

        <div className="mt-16 md:mt-24">
          <TextLink href={site.maps.href} className="font-display text-2xl italic text-char md:text-3xl" cursor="Leggete">
            {r.cta}
          </TextLink>
        </div>
      </div>
    </section>
  );
}
