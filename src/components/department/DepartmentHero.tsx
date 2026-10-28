import { WhatsappLogo } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { SpotlightReveal } from "@/components/motion/SpotlightReveal";
import { getMedia } from "@/lib/media";
import { whatsappHref } from "@/lib/site";
import type { Department } from "@/lib/departments";

/** Department opening: the playbill title, the sizes as a fact, one lit photograph. */
export function DepartmentHero({ d }: { d: Department }) {
  const img = getMedia(d.heroImage);
  const [first, ...rest] = d.title.split(" ");
  const unit = d.sizes.unit ?? "taglia";
  return (
    <section className="surface-ink grain relative overflow-hidden pt-header" aria-labelledby="dept-title">
      <div className="wrap grid grid-cols-1 gap-12 pb-20 pt-12 md:pb-28 md:pt-20 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
        <div className="lg:col-span-7 lg:self-end">
          <SplitReveal as="h1" id="dept-title" trigger="stage" className="t-display text-ivory lg:text-[clamp(3rem,0.6rem+6vw,7.5rem)]">
            {first} <span className="italic text-magenta-glow">{rest.join(" ")}</span>
          </SplitReveal>
          <p className="t-lead mt-8 max-w-[44ch] text-ivory">{d.intro}</p>

          <div className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-6">
            <p className="flex items-end gap-4 text-ivory">
              <span className="sr-only">{unit === "anni" ? `Dai ${d.sizes.from} ai ${d.sizes.to} anni` : `Dalla taglia ${d.sizes.from} alla ${d.sizes.to}`}</span>
              <span className="font-display text-[clamp(3.5rem,2.4rem+4vw,6.5rem)] leading-[0.8]" aria-hidden="true">
                {d.sizes.from}
              </span>
              <span className="mb-2 h-px w-14 bg-magenta-glow md:w-24" aria-hidden="true" />
              <span className="font-display text-[clamp(3.5rem,2.4rem+4vw,6.5rem)] leading-[0.8]" aria-hidden="true">
                {d.sizes.to}
              </span>
              <span className="t-label mb-1 text-ivory-dim" aria-hidden="true">
                {unit === "anni" ? "anni" : "taglie"}
              </span>
            </p>
            <p className="max-w-[34ch] text-sm text-ivory-dim">{d.sizes.text}</p>
          </div>

          <div className="mt-10">
            <Button href={whatsappHref(`Ciao, vorrei informazioni sul reparto ${d.title.toLowerCase().replace("abbigliamento ", "")}.`)} variant="primary" magnetic cursor="Scriveteci" icon={<WhatsappLogo size={18} aria-hidden="true" />}>
              Chiedete disponibilità su WhatsApp
            </Button>
          </div>
        </div>
        <div className="w-full max-w-[34rem] lg:col-span-5 lg:max-w-none">
          <SpotlightReveal
            src={img.src}
            alt={img.alt}
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 34rem, 92vw"
            frameClassName="aspect-[4/5] w-full lg:aspect-[3/4]"
            spot={1}
          />
        </div>
      </div>
    </section>
  );
}
