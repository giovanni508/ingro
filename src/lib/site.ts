import site from "../../content/site.json";
import tv from "../../content/tv.json";
import features from "../../content/features.json";

export { site, tv, features };

/** wa.me link with an optional pre-filled message. */
export function whatsappHref(message?: string) {
  const base = site.whatsapp.href;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const NAV = [
  { href: "/donna", label: "Donna" },
  { href: "/uomo", label: "Uomo" },
  { href: "/bambino", label: "Bambino" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/contatti", label: "Contatti" },
] as const;

export const LEGAL_NAV = [
  { href: "/privacy", label: "Privacy" },
  { href: "/cookie", label: "Cookie" },
  { href: "/accessibilita", label: "Accessibilità" },
] as const;

export const fullAddress = `${site.address.street}, ${site.address.city}`;
