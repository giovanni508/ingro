import type { Metadata } from "next";
import { ArrowUpRight, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { PageShell } from "@/components/layout/PageShell";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { FadeUp } from "@/components/motion/FadeUp";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { SpotlightReveal } from "@/components/motion/SpotlightReveal";
import { CountUp } from "@/components/motion/CountUp";
import { Pin } from "@/components/motion/Pin";
import { Marquee } from "@/components/motion/Marquee";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getMedia } from "@/lib/media";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const COLORS = [
  ["--ink", "#0D070A"],
  ["--velvet", "#160A10"],
  ["--velvet-2", "#221019"],
  ["--plum", "#4A0F2C"],
  ["--cipria", "#F6EEEA"],
  ["--cipria-2", "#EDE1DB"],
  ["--ivory", "#F3EAE2"],
  ["--char", "#1C1016"],
  ["--magenta", "#E5097F"],
  ["--magenta-deep", "#C4086B"],
  ["--magenta-text", "#B3075F"],
  ["--magenta-glow", "#FF5AAE"],
];

export default function StyleguidePage() {
  const a = getMedia("u-bordeaux");
  const b = getMedia("d-pizzo-gonna");
  return (
    <PageShell>
      <section className="surface-ink grain pt-header">
        <div className="wrap py-20">
          <Logo className="h-24 w-auto text-ivory" />
          <h1 className="t-display mt-10">Styleguide</h1>
          <p className="t-lead mt-4 max-w-[52ch] text-ivory-dim">
            Pagina interna, non indicizzata. Token, tipografia, componenti e utility di movimento del sistema &quot;Sotto i riflettori&quot;. Documentazione completa in DESIGN.md.
          </p>
        </div>
      </section>

      <section className="surface-dark section">
        <div className="wrap">
          <h2 className="t-title">Colore</h2>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {COLORS.map(([name, hex]) => (
              <li key={name}>
                <span className="block aspect-square border border-[var(--line-dark)]" style={{ background: hex }} />
                <span className="mt-2 block text-sm">{name}</span>
                <span className="tnum block text-sm text-ivory-dim">{hex}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-light section">
        <div className="wrap space-y-8">
          <h2 className="t-title">Tipografia</h2>
          <p className="t-hero">Bodoni Moda</p>
          <p className="t-display">
            Titolo di sezione <span className="italic">in corsivo</span>
          </p>
          <p className="t-title">Sottotitolo</p>
          <p className="t-quote max-w-[30ch]">Una citazione editoriale, in corsivo Didone.</p>
          <p className="t-lead measure">Attacco in Jost: il testo di apertura di una sezione, più grande del corpo.</p>
          <p className="measure text-char-dim">
            Corpo del testo in Jost, 17px, interlinea 1,6, misura massima 62 caratteri. <TextLink href="/chi-siamo" className="inline-link">Link nel testo</TextLink>.
          </p>
          <p className="t-label text-char-dim">Etichetta funzionale</p>
        </div>
      </section>

      <section className="surface-dark section">
        <div className="wrap space-y-10">
          <h2 className="t-title">Bottoni e link</h2>
          <div className="flex flex-wrap gap-4">
            <Button href="/contatti" variant="primary" magnetic cursor="Scoprite">
              Primario magnetico
            </Button>
            <Button href="/contatti" variant="ghost" icon={<ArrowUpRight size={18} aria-hidden="true" />}>
              Ghost con icona
            </Button>
            <Button href="/contatti" variant="light" icon={<WhatsappLogo size={18} aria-hidden="true" />}>
              Chiaro
            </Button>
            <Button type="button" variant="ghost" disabled>
              Disabilitato
            </Button>
          </div>
          <p>
            <TextLink href="/donna" className="font-display text-3xl italic">
              Link con traccia di luce
            </TextLink>
          </p>
        </div>
      </section>

      <section className="surface-ink grain section">
        <div className="wrap grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="t-title">SplitReveal</h2>
            <SplitReveal as="p" className="t-display mt-6">
              Le righe salgono dal buio
            </SplitReveal>
            <h2 className="t-title mt-16">CountUp</h2>
            <p className="mt-4 font-display text-7xl">
              <CountUp value={513} />
            </p>
            <h2 className="t-title mt-16">FadeUp</h2>
            <FadeUp stagger className="mt-6 space-y-3 text-ivory-dim">
              <p>Primo elemento</p>
              <p>Secondo elemento</p>
              <p>Terzo elemento</p>
            </FadeUp>
          </div>
          <div className="space-y-12">
            <div>
              <h2 className="t-title">SpotlightReveal</h2>
              <p className="mt-2 text-ivory-dim">Con il mouse il faro segue il puntatore; su touch scorre con la pagina.</p>
              <SpotlightReveal src={b.src} alt={b.alt} sizes="(min-width: 768px) 45vw, 92vw" frameClassName="mt-6 aspect-[4/3]" />
            </div>
            <div>
              <h2 className="t-title">ParallaxImage</h2>
              <ParallaxImage src={a.src} alt={a.alt} sizes="(min-width: 768px) 45vw, 92vw" frameClassName="mt-6 aspect-[4/3]" />
            </div>
          </div>
        </div>
      </section>

      <section className="surface-light section">
        <div className="wrap">
          <SectionTitle tone="light" italic="con coda in corsivo">SectionTitle</SectionTitle>
        </div>
      </section>

      <section className="surface-ink">
        <Pin length={1} className="grid min-h-[100svh] place-items-center">
          <div className="wrap text-center">
            <p className="t-display">Pin</p>
            <p className="mt-4 text-ivory-dim">Questa scena resta ferma per una schermata su desktop; su telefono e con movimento ridotto scorre normalmente.</p>
          </div>
        </Pin>
      </section>

      <section className="surface-dark py-10">
        <Marquee label="Esempio di marquee" speed={30}>
          {["Matrimonio", "Comunione", "Laurea", "18 anni", "Elegante", "Casual"].map((w) => (
            <span key={w} className="px-8 font-display text-5xl italic text-ivory">
              {w}
            </span>
          ))}
        </Marquee>
      </section>

      <section className="surface-dark section">
        <div className="wrap">
          <h2 className="t-title">Velluto</h2>
          <div className="velvet mt-8 h-56" />
        </div>
      </section>
    </PageShell>
  );
}
