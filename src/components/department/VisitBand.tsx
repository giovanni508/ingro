import Link from "next/link";
import { ArrowUpRight, MapPin, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { site, whatsappHref } from "@/lib/site";

const ALL = [
  { href: "/donna", label: "Donna" },
  { href: "/uomo", label: "Uomo" },
  { href: "/bambino", label: "Bambino" },
];

/** Closing band of every department: come and try it on, or ask; then the other rooms. */
export function VisitBand({ current }: { current: string }) {
  const others = ALL.filter((a) => a.href !== `/${current}`);
  return (
    <section className="surface-dark grain section relative overflow-hidden" aria-labelledby="band-title">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
        <div className="lg:col-span-7">
          <SplitReveal as="h2" id="band-title" className="t-display text-ivory">
            Venite a provarli
          </SplitReveal>
          <p className="t-lead mt-6 max-w-[40ch] text-ivory-dim">
            {site.address.street}, {site.address.city}. Ampio parcheggio interno privato. Oppure scriveteci: vi mostriamo i capi in videochiamata.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={site.maps.href} variant="primary" magnetic cursor="Portami lì" icon={<MapPin size={18} aria-hidden="true" />}>
              Portami lì
            </Button>
            <Button href={whatsappHref("Ciao Loredana, vorrei una videochiamata per vedere alcuni capi.")} variant="ghost" cursor="Scriveteci" icon={<WhatsappLogo size={18} aria-hidden="true" />}>
              Videochiamata WhatsApp
            </Button>
          </div>
        </div>
        <nav aria-label="Gli altri reparti" className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="t-label text-ivory-dim">Gli altri reparti</p>
          <ul className="mt-4">
            {others.map((o) => (
              <li key={o.href} className="border-b border-[var(--line-dark)]">
                <Link href={o.href} className="group flex items-center justify-between py-5 font-display text-4xl text-ivory transition-colors hover:text-magenta-glow" data-cursor="Scoprite">
                  {o.label}
                  <ArrowUpRight size={26} className="transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
