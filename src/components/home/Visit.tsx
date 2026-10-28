import { Car, EnvelopeSimple, MapPin, Phone, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/Button";
import { OpeningHours } from "@/components/ui/OpeningHours";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { StoreMap } from "./StoreMap";
import { site, whatsappHref } from "@/lib/site";
import home from "../../../content/home.json";

/** Scene 9. Where the shop is: address, parking, hours, every way to reach us, and the lit map. */
export function Visit() {
  const v = home.visit;
  return (
    <section className="surface-dark grain section relative overflow-hidden" aria-labelledby="visit-title">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
        <div className="lg:col-span-5">
          <SplitReveal as="h2" id="visit-title" className="t-display text-ivory">
            {v.title}
          </SplitReveal>
          <p className="t-lead mt-6 max-w-[34ch] text-ivory-dim">{v.lead}</p>

          <address className="mt-10 space-y-5 not-italic">
            <p className="flex gap-4">
              <MapPin size={22} className="mt-0.5 shrink-0 text-magenta-glow" aria-hidden="true" />
              <span className="text-lg text-ivory">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </span>
            </p>
            <p className="flex gap-4 text-ivory-dim">
              <Car size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{site.parking}</span>
            </p>
            <p className="flex gap-4">
              <Phone size={22} className="mt-0.5 shrink-0 text-ivory-dim" aria-hidden="true" />
              <a href={site.phone.href} className="link-trace is-underlined tnum text-ivory">
                {site.phone.display}
              </a>
            </p>
            <p className="flex gap-4">
              <WhatsappLogo size={22} className="mt-0.5 shrink-0 text-ivory-dim" aria-hidden="true" />
              <span>
                <a href={whatsappHref("Ciao Loredana, vorrei qualche informazione.")} target="_blank" rel="noopener noreferrer" className="link-trace is-underlined tnum text-ivory">
                  {site.whatsapp.display}
                </a>
                <span className="block text-sm text-ivory-dim">WhatsApp e videochiamate con {site.whatsapp.contactName}</span>
              </span>
            </p>
            <p className="flex gap-4">
              <EnvelopeSimple size={22} className="mt-0.5 shrink-0 text-ivory-dim" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="link-trace is-underlined text-ivory">
                {site.email}
              </a>
            </p>
          </address>

          <OpeningHours className="mt-10" tone="dark" />

          <div className="mt-10">
            <Button href={site.maps.href} variant="primary" magnetic cursor="Portami lì" icon={<MapPin size={18} aria-hidden="true" />}>
              {v.cta}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7">
          <StoreMap />
        </div>
      </div>
    </section>
  );
}
