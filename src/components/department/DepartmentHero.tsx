import { WhatsappLogo } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { SpotlightReveal } from "@/components/motion/SpotlightReveal";
import { getMedia } from "@/lib/media";
import { whatsappHref } from "@/lib/site";
import type { Department } from "@/lib/departments";

/**
 * Department opening. Phones: the garment fills the first screen and the
 * playbill title sits on its darkened lower edge, as on the home; the copy
 * follows. Desktop: title and copy on the left, the lit photograph on the
 * right. One title, one photo: the grid areas move, the elements don't
 * (.dept-hero in globals.css).
 */
export function DepartmentHero({ d }: { d: Department }) {
  const img = getMedia(d.heroImage);
  const [first, ...rest] = d.title.split(" ");
  const unit = d.sizes.unit ?? "taglia";
  return (
    <section className="surface-ink grain relative overflow-hidden lg:pt-[calc(var(--header-h)+var(--announce-h))]" aria-labelledby="dept-title">
      <div className="wrap dept-hero pb-20 md:pb-28 lg:pt-20">
        <div className="dept-photo">
          <SpotlightReveal
            src={img.src}
            alt={img.alt}
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 40vw, 100vw"
            frameClassName="h-full w-full lg:h-auto lg:aspect-[3/4]"
            spot={1}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(13_7_10/0.6)_0%,transparent_24%,transparent_48%,rgb(13_7_10/0.9)_80%,var(--ink)_100%)] lg:hidden" aria-hidden="true" />
        </div>

        <SplitReveal as="h1" id="dept-title" trigger="stage" className="dept-title t-display text-ivory lg:text-[clamp(3rem,0.6rem+6vw,7.5rem)]">
          {first} <span className="italic text-magenta-glow">{rest.join(" ")}</span>
        </SplitReveal>

        <div className="dept-body">
          <p className="t-lead max-w-[44ch] text-ivory">{d.intro}</p>

          <div className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-6">
            <p className="flex items-end gap-4 text-ivory">
              <span className="sr-only">{unit === "anni" ? `Dai ${d.sizes.from} ai ${d.sizes.to} anni` : `Dalla taglia ${d.sizes.from} alla ${d.sizes.to}`}</span>
              <span className="opsz-auto font-display text-[clamp(3.5rem,2.4rem+4vw,6.5rem)] leading-[0.8]" aria-hidden="true">
                {d.sizes.from}
              </span>
              <span className="mb-2 h-px w-14 bg-magenta-glow md:w-24" aria-hidden="true" />
              <span className="opsz-auto font-display text-[clamp(3.5rem,2.4rem+4vw,6.5rem)] leading-[0.8]" aria-hidden="true">
                {d.sizes.to}
              </span>
              <span className="t-label mb-1 text-ivory-dim" aria-hidden="true">
                {unit === "anni" ? "anni" : "taglie"}
              </span>
            </p>
            <p className="max-w-[34ch] text-sm text-ivory-dim">{d.sizes.text}</p>
          </div>

          <div className="mt-10">
            <Button
              href={whatsappHref(`Ciao, vorrei informazioni sul reparto ${d.title.toLowerCase().replace("abbigliamento ", "")}.`)}
              variant="primary"
              magnetic
              cursor="Scriveteci"
              icon={<WhatsappLogo size={18} aria-hidden="true" />}
            >
              Chiedete su WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
