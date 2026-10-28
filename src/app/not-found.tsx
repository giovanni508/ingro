import type { Metadata } from "next";
import { NotFoundStage } from "@/components/NotFoundStage";

export const metadata: Metadata = {
  title: "Pagina non trovata",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundStage />;
}
