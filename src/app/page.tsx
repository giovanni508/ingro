import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/home/Hero";
import { Generations } from "@/components/home/Generations";
import { Curvy } from "@/components/home/Curvy";
import { Occasions } from "@/components/home/Occasions";
import { Ceremony } from "@/components/home/Ceremony";
import { Departments } from "@/components/home/Departments";
import { Spot } from "@/components/home/Spot";
import { PersonalShopper } from "@/components/home/PersonalShopper";
import { OnAir } from "@/components/home/OnAir";
import { Reviews } from "@/components/home/Reviews";
import { Visit } from "@/components/home/Visit";
import home from "../../content/home.json";

export const metadata: Metadata = pageMeta({ title: home.seo.title, description: home.seo.description, path: "/", absoluteTitle: true });

export default function HomePage() {
  return (
    <PageShell>
      <Hero />
      <Generations />
      <Curvy />
      <Occasions />
      <Ceremony />
      <Departments />
      <Spot />
      <PersonalShopper />
      <OnAir />
      <Reviews />
      <Visit />
    </PageShell>
  );
}
