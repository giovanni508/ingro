import Link from "next/link";
import { FacebookLogo, InstagramLogo, TiktokLogo, YoutubeLogo } from "@phosphor-icons/react/ssr";
import { Logo } from "@/components/brand/Logo";
import { Marquee } from "@/components/motion/Marquee";
import { OpeningHours } from "@/components/ui/OpeningHours";
import { LEGAL_NAV, NAV, site, whatsappHref } from "@/lib/site";
import { ManageCookies } from "./ManageCookies";

const ICONS = { facebook: FacebookLogo, instagram: InstagramLogo, tiktok: TiktokLogo, youtube: YoutubeLogo } as const;

export function Footer() {
  return (
    <footer className="surface-ink grain relative overflow-hidden pt-16 md:pt-24" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Ingromoda: informazioni e contatti
      </h2>

      <Marquee label="La firma di Ingromoda" className="relative z-[2] select-none border-y border-[var(--line-dark)] py-5 md:py-7" speed={46}>
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className="flex items-center whitespace-nowrap pr-[0.6em] opsz-auto font-display text-[clamp(3rem,9vw,8.5rem)] italic leading-none text-transparent [-webkit-text-stroke:1px_rgb(243_234_226/0.5)]">
            …elegante tutto l&apos;anno…
            <span className="mx-[0.4em] inline-block size-[0.16em] rotate-45 bg-magenta not-italic" aria-hidden="true" />
          </span>
        ))}
      </Marquee>

      <div className="wrap relative z-[2] grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 sm:gap-x-[var(--gutter)] lg:grid-cols-12 md:py-24">
        <div className="sm:col-span-2 lg:col-span-4">
          <Link href="/" aria-label="Ingromoda, torna alla home" className="inline-block text-ivory">
            <Logo className="h-[4.5rem] w-auto" decorative />
          </Link>
          <p className="mt-6 max-w-[34ch] text-ivory-dim">
            Boutique di abbigliamento uomo e donna a Palermo da oltre 40 anni. Abiti da cerimonia e casual, specializzati nella linea curvy.
          </p>
        </div>

        <div className="lg:col-span-3">
          <h3 className="t-label text-ivory-dim">Il negozio</h3>
          <address className="mt-4 not-italic leading-relaxed">
            <a href={site.maps.href} target="_blank" rel="noopener noreferrer" className="link-trace is-underlined">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </a>
          </address>
          <p className="mt-3 text-sm text-ivory-dim">{site.parking}</p>
          <OpeningHours className="mt-6" tone="dark" />
        </div>

        <div className="lg:col-span-3">
          <h3 className="t-label text-ivory-dim">Contatti</h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a href={site.phone.href} className="link-trace is-underlined">
                {site.phone.display}
              </a>
            </li>
            <li>
              <a href={whatsappHref("Ciao, vorrei qualche informazione.")} target="_blank" rel="noopener noreferrer" className="link-trace is-underlined">
                WhatsApp {site.whatsapp.display}
              </a>
              <span className="block text-sm text-ivory-dim">Videochiamate con {site.whatsapp.contactName}</span>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="link-trace is-underlined">
                {site.email}
              </a>
            </li>
          </ul>
          <h3 className="t-label mt-10 text-ivory-dim">Pagine</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-trace">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="t-label text-ivory-dim">Seguiteci</h3>
          <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-2.5">
            {site.social.map((s) => {
              const Icon = ICONS[s.id as keyof typeof ICONS];
              return (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-11 items-center gap-3 lg:min-h-0" aria-label={`${s.label} (si apre in una nuova scheda)`}>
                    <span className="grid size-10 place-items-center rounded-full border border-[var(--line-dark)] transition-colors group-hover:border-magenta-glow group-hover:text-magenta-glow">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="hidden lg:inline">{s.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="relative z-[2] border-t border-[var(--line-dark)]">
        <div className="wrap flex flex-col gap-4 py-6 text-sm text-ivory-dim md:flex-row md:items-center md:justify-between">
          <p>
            {site.legalName} | P. IVA {site.vat}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-trace">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <ManageCookies />
            </li>
            <li>{site.copyright}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
