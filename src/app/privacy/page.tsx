import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Informativa sul trattamento dei dati personali di Ingromoda srl, Palermo.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <LegalPage title="Privacy Policy" file="privacy.md" intro="Come trattiamo i vostri dati personali, nel rispetto del GDPR." />;
}
