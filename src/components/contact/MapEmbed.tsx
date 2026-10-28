"use client";

import { MapTrifold } from "@phosphor-icons/react";
import { saveConsent, useConsent } from "@/lib/consent";
import { site } from "@/lib/site";

const SRC = `https://www.google.com/maps?q=${encodeURIComponent("Ingromoda, Viale Regione Siciliana Sud Est 4325, Palermo")}&z=16&output=embed`;

/**
 * Google Maps, only with consent. Until then a quiet card explains what
 * loading it means; one click both consents and loads it.
 */
export function MapEmbed() {
  const consent = useConsent();
  if (consent?.external) {
    return (
      <iframe
        src={SRC}
        title={`Mappa Google di ${site.name}, ${site.address.street}, ${site.address.city}`}
        className="aspect-[4/3] w-full border-0 grayscale-[0.4] invert-[0.88] hue-rotate-[180deg]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }
  return (
    <div className="flex aspect-[4/3] w-full flex-col items-start justify-end gap-4 border border-[var(--line-dark)] bg-ink p-6 md:p-8">
      <MapTrifold size={30} className="text-magenta-glow" aria-hidden="true" />
      <p className="font-display text-2xl text-ivory">Mappa interattiva di Google</p>
      <p className="max-w-[40ch] text-sm text-ivory-dim">
        Caricandola, Google riceve alcuni dati di navigazione e può impostare i suoi cookie. Se preferite, usate &quot;Portami lì&quot;: si apre direttamente Google Maps.
      </p>
      <button type="button" onClick={() => saveConsent(true)} className="btn btn-ghost !min-h-11">
        <span className="btn-fill" aria-hidden="true" />
        <span className="btn-label">Carica la mappa</span>
      </button>
    </div>
  );
}
