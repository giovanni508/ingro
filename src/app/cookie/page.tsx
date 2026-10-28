import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Cookie policy", description: "Quali cookie e strumenti usa il sito di Ingromoda e come gestire le vostre preferenze.", path: "/cookie" });

export default function Page() {
  return <LegalPage title="Cookie Policy" file="cookie.md" intro="Niente profilazione, niente pubblicità: usiamo solo ciò che serve al sito." cookies />;
}
