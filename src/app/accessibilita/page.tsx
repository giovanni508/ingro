import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Dichiarazione di accessibilità",
  description: "Dichiarazione di accessibilità del sito di Ingromoda srl e modalità di segnalazione.",
  alternates: { canonical: "/accessibilita" },
};

export default function Page() {
  return <LegalPage title="Accessibilità" file="accessibilita.md" intro="La nostra dichiarazione di accessibilità e come segnalarci un problema." />;
}
