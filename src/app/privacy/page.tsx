import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Privacy policy", description: "Informativa sul trattamento dei dati personali di Ingromoda srl, Palermo.", path: "/privacy" });

export default function Page() {
  return <LegalPage title="Privacy Policy" file="privacy.md" intro="Come trattiamo i vostri dati personali, nel rispetto del GDPR." />;
}
