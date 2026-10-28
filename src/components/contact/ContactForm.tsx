"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle, WarningCircle, WhatsappLogo } from "@phosphor-icons/react";
import { site, whatsappHref } from "@/lib/site";

type Field = "name" | "email" | "phone" | "message" | "consent";
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: { name: string; email: string; message: string; consent: boolean }) {
  const e: Partial<Record<Field, string>> = {};
  if (v.name.trim().length < 2) e.name = "Scrivete il vostro nome.";
  if (!v.email.trim()) e.email = "Ci serve un indirizzo email per rispondervi.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "L'indirizzo email sembra incompleto: controllate la chiocciola e il dominio.";
  if (v.message.trim().length < 10) e.message = "Raccontateci qualcosa in più (almeno 10 caratteri).";
  if (!v.consent) e.consent = "Per rispondervi ci serve il consenso al trattamento dei dati.";
  return e;
}

/**
 * Contact form. Labels above fields, errors under them and linked with
 * aria-describedby, focus moves to the first error. Honeypot + minimum fill
 * time against bots. States: idle, sending (a light runs across the button),
 * sent (the form is replaced by a confirmation), error (with WhatsApp/phone
 * as a way out).
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const started = useRef<number>(0);
  const form = useRef<HTMLFormElement>(null);

  const onFocus = () => {
    if (!started.current) started.current = Date.now();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      company: String(fd.get("company") ?? ""),
    };
    const errs = validate(values);
    setErrors(errs);
    setServerError(null);
    const first = (Object.keys(errs) as Field[])[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, startedAt: started.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: Partial<Record<Field, string>> };
      if (res.ok && data.ok) {
        setStatus("sent");
        return;
      }
      if (data.errors) setErrors(data.errors);
      setServerError(data.error ?? "Qualcosa non ha funzionato. Riprovate tra poco, oppure scriveteci su WhatsApp.");
      setStatus("error");
    } catch {
      setServerError("Sembra che la connessione si sia interrotta. Riprovate, oppure scriveteci su WhatsApp.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="form-sent border border-[var(--line-light)] bg-cipria p-8 md:p-12" role="status" aria-live="polite">
        <CheckCircle size={40} weight="light" className="text-magenta-text" aria-hidden="true" />
        <p className="mt-6 font-display text-4xl text-char">Grazie, messaggio ricevuto.</p>
        <p className="mt-4 max-w-[44ch] text-char-dim">
          Vi rispondiamo al più presto all&apos;indirizzo che ci avete lasciato. Se avete fretta, scriveteci su WhatsApp: vi rispondiamo prima.
        </p>
        <a href={whatsappHref("Ciao, vi ho appena scritto dal sito.")} target="_blank" rel="noopener noreferrer" className="link-trace is-underlined mt-6 inline-flex items-center gap-2 text-char">
          <WhatsappLogo size={18} aria-hidden="true" /> WhatsApp {site.whatsapp.display}
        </a>
      </div>
    );
  }

  const fieldCls = (f: Field) =>
    `field mt-2 w-full border-0 border-b bg-transparent px-0 py-3 text-lg text-char placeholder:text-char-dim/70 focus:outline-none ${errors[f] ? "border-magenta-text" : "border-[rgb(28_16_22/0.35)]"}`;
  const describe = (f: Field) => (errors[f] ? `${f}-error` : undefined);

  return (
    <form ref={form} onSubmit={onSubmit} onFocus={onFocus} noValidate className="space-y-8" aria-describedby={serverError ? "form-error" : undefined}>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-[0.9375rem] font-medium text-char">
            Nome e cognome
          </label>
          <input id="name" name="name" type="text" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={describe("name")} className={fieldCls("name")} />
          {errors.name ? (
            <p id="name-error" className="field-error">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="email" className="text-[0.9375rem] font-medium text-char">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required aria-invalid={!!errors.email} aria-describedby={describe("email")} className={fieldCls("email")} />
          {errors.email ? (
            <p id="email-error" className="field-error">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="text-[0.9375rem] font-medium text-char">
          Telefono <span className="font-normal text-char-dim">(facoltativo)</span>
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" className={fieldCls("phone")} />
      </div>
      <div>
        <label htmlFor="message" className="text-[0.9375rem] font-medium text-char">
          Messaggio
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={!!errors.message}
          aria-describedby={describe("message") ?? "message-help"}
          className={`${fieldCls("message")} resize-y`}
        />
        {errors.message ? (
          <p id="message-error" className="field-error">
            {errors.message}
          </p>
        ) : (
          <p id="message-help" className="mt-2 text-sm text-char-dim">
            Per esempio l&apos;occasione, la taglia, il colore che avete in mente.
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people, irresistible to bots */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Azienda</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input id="consent" name="consent" type="checkbox" aria-invalid={!!errors.consent} aria-describedby={describe("consent")} className="consent-box mt-1" />
          <label htmlFor="consent" className="text-[0.9375rem] leading-relaxed text-char-dim">
            Ho letto la{" "}
            <Link href="/privacy" className="inline-link text-char">
              privacy policy
            </Link>{" "}
            e acconsento al trattamento dei miei dati per ricevere una risposta.
          </label>
        </div>
        {errors.consent ? (
          <p id="consent-error" className="field-error">
            {errors.consent}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <div id="form-error" role="alert" className="flex gap-3 border-l-0 bg-[rgb(179_7_95/0.08)] p-4 text-char">
          <WarningCircle size={22} className="mt-0.5 shrink-0 text-magenta-text" aria-hidden="true" />
          <div>
            <p>{serverError}</p>
            <p className="mt-2 text-sm">
              <a href={whatsappHref("Ciao, volevo scrivervi dal sito ma il modulo non ha funzionato.")} target="_blank" rel="noopener noreferrer" className="inline-link">
                WhatsApp {site.whatsapp.display}
              </a>{" "}
              oppure{" "}
              <a href={site.phone.href} className="inline-link">
                {site.phone.display}
              </a>
            </p>
          </div>
        </div>
      ) : null}

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "sending"} aria-disabled={status === "sending"} data-sending={status === "sending"}>
        <span className="btn-fill" aria-hidden="true" />
        <span className="btn-label">
          {status === "sending" ? "Invio in corso" : "Inviate il messaggio"}
          <ArrowRight size={18} aria-hidden="true" />
        </span>
      </button>
      <p className="sr-only" aria-live="polite">
        {status === "sending" ? "Invio del messaggio in corso" : ""}
      </p>
    </form>
  );
}
