import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, EnvelopeSimple, MapPin, Phone, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { PageShell } from "@/components/layout/PageShell";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { StoreMap } from "@/components/home/StoreMap";
import { OpeningHours } from "@/components/ui/OpeningHours";
import { site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contatti e orari del negozio a Palermo",
  description:
    "Ingromoda, Viale Regione Siciliana S.E. 4325, Palermo: telefono 091 445 150, WhatsApp e videochiamate con Loredana, email, orari del negozio e parcheggio privato.",
  alternates: { canonical: "/contatti" },
  openGraph: { title: "Contatti | Ingromoda Palermo", url: "/contatti" },
};

const DOORS = [
  { href: whatsappHref("Ciao Loredana, vorrei qualche informazione."), icon: WhatsappLogo, title: "WhatsApp", value: site.whatsapp.display, note: `Chat e videochiamate con ${site.whatsapp.contactName}`, external: true, primary: true },
  { href: site.phone.href, icon: Phone, title: "Telefono", value: site.phone.display, note: "Negli orari del negozio", external: false, primary: false },
  { href: `mailto:${site.email}`, icon: EnvelopeSimple, title: "Email", value: site.email, note: "Vi rispondiamo appena possibile", external: false, primary: false },
  { href: site.maps.href, icon: MapPin, title: "Portami lì", value: site.address.street, note: "Apre il percorso su Google Maps", external: true, primary: false },
];

export default function ContattiPage() {
  return (
    <PageShell>
      <section className="surface-ink grain relative overflow-hidden pt-header" aria-labelledby="ct-title">
        <div className="wrap pb-16 pt-12 md:pb-24 md:pt-20">
          <SplitReveal as="h1" id="ct-title" trigger="stage" className="t-hero text-ivory">
            Contatti
          </SplitReveal>
          <p className="t-lead mt-8 max-w-[40ch] text-ivory">
            Scriveteci, chiamateci o passate in negozio: siamo in {site.address.street}, a {site.address.city}.
          </p>

          <ul className="mt-14 grid grid-cols-1 gap-px border border-[var(--line-dark)] bg-[var(--line-dark)] sm:grid-cols-2 lg:grid-cols-4">
            {DOORS.map((d) => (
              <li key={d.title} className="bg-ink">
                <a
                  href={d.href}
                  {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`group flex h-full min-h-[11rem] flex-col justify-between p-6 transition-colors duration-500 md:p-7 ${d.primary ? "bg-magenta-deep text-[#fff8f3] hover:bg-[#a5065a]" : "text-ivory hover:bg-velvet-2"}`}
                  data-cursor={d.title === "Portami lì" ? "Portami lì" : "Scriveteci"}
                >
                  <span className="flex items-start justify-between">
                    <d.icon size={26} aria-hidden="true" />
                    <ArrowUpRight size={20} className="transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-display text-2xl">{d.title}</span>
                    <span className="tnum mt-1 block break-words">{d.value}</span>
                    <span className={`mt-1 block text-sm ${d.primary ? "text-[#fff8f3]/85" : "text-ivory-dim"}`}>{d.note}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-light section" aria-labelledby="form-title">
        <div className="wrap grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          <div className="lg:col-span-7">
            <h2 id="form-title" className="t-display text-char">
              Scriveteci <span className="italic">qui</span>
            </h2>
            <p className="t-lead mt-5 max-w-[40ch] text-char-dim">Raccontateci l&apos;occasione: vi rispondiamo con qualche proposta, o vi invitiamo in negozio.</p>
            <div className="mt-12">
              <ContactForm />
            </div>
          </div>
          <aside className="space-y-10 lg:col-span-4 lg:col-start-9" aria-label="Il negozio">
            <div>
              <h2 className="font-display text-3xl text-char">Il negozio</h2>
              <address className="mt-4 not-italic text-char">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </address>
              <p className="mt-2 text-char-dim">{site.parking}</p>
            </div>
            <OpeningHours tone="light" />
            <div className="border-t border-[var(--line-light)] pt-8">
              <h2 className="font-display text-3xl text-char">Ci trovate anche in TV</h2>
              <p className="mt-3 text-char-dim">Tutti i giorni su TVM CH19, e in diretta su Facebook il martedì e il venerdì dalle 17:00.</p>
              <Link href="/#tv" className="link-trace is-underlined mt-4 inline-block text-char">
                Il palinsesto delle messe in onda
              </Link>
            </div>
            <div className="border-t border-[var(--line-light)] pt-8 text-sm text-char-dim">
              <p>
                {site.legalName}, P. IVA {site.vat}
              </p>
              <p className="mt-1">
                Accessibilità:{" "}
                <a href={`mailto:${site.accessibilityEmail}`} className="inline-link">
                  {site.accessibilityEmail}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="surface-dark grain section" aria-labelledby="map-title">
        <div className="wrap">
          <h2 id="map-title" className="t-display text-ivory">
            Come <span className="italic">arrivare</span>
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
            <div className="lg:col-span-7">
              <StoreMap />
            </div>
            <div className="lg:col-span-5">
              <MapEmbed />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
