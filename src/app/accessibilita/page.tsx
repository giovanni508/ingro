import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Dichiarazione di accessibilità", description: "Dichiarazione di accessibilità del sito di Ingromoda srl e modalità di segnalazione.", path: "/accessibilita" });

export default function Page() {
  return <LegalPage title="Accessibilità" file="accessibilita.md" intro="La nostra dichiarazione di accessibilità e come segnalarci un problema." />;
}
