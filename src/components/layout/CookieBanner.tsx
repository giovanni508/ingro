"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { onConsentPanelOpen, saveConsent, useConsent } from "@/lib/consent";

/**
 * GDPR banner. The site sets no analytics or profiling cookies, so the only
 * choice is whether to load third-party content (Google Maps). "Rifiuta" and
 * "Accetta" have exactly the same weight, size and position importance.
 * Non-modal: the page stays usable while it is shown.
 */
export function CookieBanner() {
  const consent = useConsent();
  const [forced, setForced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // undefined = not hydrated yet: the boot script (html.needs-consent) decides.
  const visible = consent === null || forced;
  const state = consent === undefined && !forced ? undefined : visible ? "true" : "false";

  useEffect(() => onConsentPanelOpen(() => setForced(true)), []);

  useEffect(() => {
    if (consent === undefined && !forced) return;
    document.documentElement.classList.toggle("has-cookie-banner", visible);
    document.documentElement.classList.toggle("needs-consent", visible);
    if (visible && forced) ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [visible, forced, consent]);

  const choose = (external: boolean) => {
    saveConsent(external);
    setForced(false);
  };

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Preferenze sui cookie"
      data-open={state}
      className="cookie-banner fixed inset-x-3 bottom-3 z-[var(--z-cookie)] max-w-[30rem] border border-[var(--line-dark)] bg-ink/95 p-5 text-ivory shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)] backdrop-blur-md sm:inset-x-auto sm:left-5 sm:bottom-5 md:p-6"
    >
      <p className="font-display text-xl leading-tight">Prima che si alzi il sipario</p>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ivory-dim">
        Usiamo solo cookie tecnici, necessari al sito. Con il vostro consenso carichiamo anche contenuti di terze parti, come la mappa di Google Maps. Niente pubblicità, niente profilazione.{" "}
        <Link href="/cookie" className="inline-link text-ivory">
          Cookie policy
        </Link>
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => choose(false)} className="btn btn-ghost !min-h-12 !px-4">
          <span className="btn-fill" aria-hidden="true" />
          <span className="btn-label">Rifiuta</span>
        </button>
        <button type="button" onClick={() => choose(true)} className="btn btn-ghost !min-h-12 !px-4">
          <span className="btn-fill" aria-hidden="true" />
          <span className="btn-label">Accetta</span>
        </button>
      </div>
    </div>
  );
}
