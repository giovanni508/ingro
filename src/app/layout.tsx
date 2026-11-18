import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { LogoDefs } from "@/components/brand/Logo";
import { Preloader } from "@/components/layout/Preloader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { StickyWhatsApp } from "@/components/layout/StickyWhatsApp";
import { RouteCurtain } from "@/components/layout/RouteCurtain";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { JsonLd } from "@/components/seo/JsonLd";
import { features, site } from "@/lib/site";
import { OG_IMAGE } from "@/lib/seo";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-bodoni",
});

const jost = Jost({
  subsets: ["latin"],
  // Body text: if the (preloaded) font is not ready for the first paint, keep the
  // metric-matched fallback for that view instead of swapping mid-read (no layout shift).
  display: "optional",
  variable: "--font-jost",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Abiti da cerimonia e linea curvy a Palermo | Ingromoda",
    template: "%s | Ingromoda Palermo",
  },
  description:
    "Da oltre 40 anni a Palermo: abiti da cerimonia e casual per uomo e donna, specializzati nella linea curvy. Personal shopper e videochiamate WhatsApp.",
  applicationName: "Ingromoda",
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Ingromoda",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#160a10",
  colorScheme: "dark light",
};

/**
 * Runs before first paint: decides whether the preloader plays (once per
 * session, never with reduced motion) and whether the announcement bar is
 * inside its dates, so neither causes a layout shift after hydration.
 */
const a = features.announcement;
const bootScript = `(function(){var d=document.documentElement;try{var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;if(sessionStorage.getItem('ingromoda-pl')||rm){d.classList.add('pl-off');d.dataset.stage='ready';}else{sessionStorage.setItem('ingromoda-pl','1');}}catch(e){}try{if(!localStorage.getItem('ingromoda-consent'))d.classList.add('needs-consent');}catch(e){d.classList.add('needs-consent');}try{var on=${a.enabled ? "true" : "false"},n=Date.now(),s=Date.parse('${a.start}'),e=Date.parse('${a.end}');if(on&&n>=s&&n<=e&&sessionStorage.getItem('ingromoda-announce')!=='closed'){d.classList.add('has-announce');}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${bodoni.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a href="#contenuto" className="sr-only-focusable fixed left-3 top-3 z-[100] rounded-full bg-ivory px-5 py-3 text-sm font-medium text-char">
          Vai al contenuto
        </a>
        <LogoDefs />
        <JsonLd />
        <SmoothScroll>
          <Header />
          <main id="contenuto" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <StickyWhatsApp />
          <CookieBanner />
          <RouteCurtain />
          <Cursor />
        </SmoothScroll>
        <Preloader />
      </body>
    </html>
  );
}
