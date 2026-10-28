import { NextResponse } from "next/server";

type Payload = { name?: unknown; email?: unknown; phone?: unknown; message?: unknown; consent?: unknown; company?: unknown; startedAt?: unknown };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Contact form endpoint.
 * - Honeypot field `company` and a minimum fill time drop bots silently.
 * - Recipient comes ONLY from CONTACT_TO (never hard-coded).
 * - Delivery: if RESEND_API_KEY + CONTACT_FROM are set, the message is sent
 *   through Resend's HTTP API. In development without a provider it is logged
 *   to the server console. In production without a provider it returns 503 so
 *   the visitor is pointed to WhatsApp / phone instead of losing the message.
 */
export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Richiesta non valida." }, { status: 400 });
  }

  // Bots: pretend success, do nothing.
  const started = typeof body.startedAt === "number" ? body.startedAt : 0;
  if (clean(body.company, 200) !== "" || (started > 0 && Date.now() - started < 2500)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);
  const message = clean(body.message, 4000);
  const consent = body.consent === true;

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Scrivete il vostro nome.";
  if (!EMAIL_RE.test(email)) errors.email = "L'indirizzo email sembra incompleto: controllate la chiocciola e il dominio.";
  if (message.length < 10) errors.message = "Raccontateci qualcosa in più (almeno 10 caratteri).";
  if (!consent) errors.consent = "Per rispondervi ci serve il consenso al trattamento dei dati.";
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  const apiKey = process.env.RESEND_API_KEY;
  const text = `Nuovo messaggio dal sito ingromoda.com\n\nNome: ${name}\nEmail: ${email}\nTelefono: ${phone || "non indicato"}\n\n${message}`;

  if (to && from && apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), reply_to: email, subject: `Messaggio dal sito: ${name}`, text }),
      });
      if (!res.ok) throw new Error(`Provider ${res.status}`);
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[contact] invio fallito", err);
      return NextResponse.json({ ok: false, error: "Non siamo riusciti a inviare il messaggio. Riprovate tra poco o scriveteci su WhatsApp." }, { status: 502 });
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[contact] (sviluppo, nessun invio reale) destinatario: ${to ?? "CONTACT_TO non impostato"}\n${text}`);
    return NextResponse.json({ ok: true, dev: true });
  }

  return NextResponse.json(
    { ok: false, error: "Il modulo non è ancora attivo. Nel frattempo scriveteci su WhatsApp o chiamateci: rispondiamo volentieri." },
    { status: 503 },
  );
}
