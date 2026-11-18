import { site } from "@/lib/site";

/**
 * ClothingStore structured data. Only verified facts: no aggregateRating
 * (no average is published anywhere), opening hours as on the old site.
 */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${site.url}/#negozio`,
    name: site.name,
    legalName: site.legalName,
    vatID: `IT${site.vat}`,
    url: site.url,
    logo: `${site.url}/brand/logo-ingromoda.png`,
    image: [`${site.url}/og/ingromoda-palermo.jpg`],
    description:
      "Boutique di abbigliamento uomo e donna a Palermo da oltre 40 anni, specializzata in abiti da cerimonia e nella linea curvy. Personal shopper, videochiamate WhatsApp e spedizioni in Italia ed Europa.",
    slogan: "…elegante tutto l'anno…",
    telephone: site.phone.e164,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.maps.href,
    openingHoursSpecification: site.openingHours.weekdays.slots.map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens,
      closes,
    })),
    amenityFeature: [{ "@type": "LocationFeatureSpecification", name: "Parcheggio privato interno", value: true }],
    areaServed: ["Palermo", "Italia", "Europa"],
    sameAs: site.social.map((s) => s.href),
    contactPoint: [
      { "@type": "ContactPoint", telephone: site.phone.e164, contactType: "customer service", availableLanguage: ["it"] },
      { "@type": "ContactPoint", telephone: "+39" + site.whatsapp.number.slice(2), contactType: "sales", description: "Videochiamate WhatsApp", availableLanguage: ["it"] },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }} />;
}
