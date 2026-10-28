import { PageShell } from "@/components/layout/PageShell";
import { DepartmentHero } from "./DepartmentHero";
import { Catalog } from "./Catalog";
import { Showcase } from "./Showcase";
import { VisitBand } from "./VisitBand";
import { DEPARTMENTS, type DepartmentKey } from "@/lib/departments";
import { getMedia } from "@/lib/media";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export function departmentMetadata(key: DepartmentKey): Metadata {
  const d = DEPARTMENTS[key];
  const img = getMedia(d.heroImage);
  return pageMeta({ title: d.seo.title, description: d.seo.description, path: `/${d.slug}`, image: { url: img.src, width: img.width, height: img.height, alt: img.alt } });
}

export function DepartmentPage({ k }: { k: DepartmentKey }) {
  const d = DEPARTMENTS[k];
  return (
    <PageShell>
      <DepartmentHero d={d} />
      <Catalog d={d} />
      {d.videos ? <Showcase videos={d.videos} youtube={d.youtube} brands={d.brands} /> : null}
      <VisitBand current={d.slug} />
    </PageShell>
  );
}
