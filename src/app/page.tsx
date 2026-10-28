import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/home/Hero";
import { Generations } from "@/components/home/Generations";
import { Occasions } from "@/components/home/Occasions";
import { Ceremony } from "@/components/home/Ceremony";
import { Departments } from "@/components/home/Departments";
import { PersonalShopper } from "@/components/home/PersonalShopper";
import { OnAir } from "@/components/home/OnAir";
import { Reviews } from "@/components/home/Reviews";
import { Visit } from "@/components/home/Visit";
import home from "../../content/home.json";

export const metadata: Metadata = {
  title: { absolute: home.seo.title },
  description: home.seo.description,
  alternates: { canonical: "/" },
  openGraph: { title: home.seo.title, description: home.seo.description, url: "/" },
};

export default function HomePage() {
  return (
    <PageShell>
      <Hero />
      <Generations />
      <Occasions />
      <Ceremony />
      <Departments />
      <PersonalShopper />
      <OnAir />
      <Reviews />
      <Visit />
    </PageShell>
  );
}
