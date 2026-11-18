import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const ROUTES: Array<[string, number, MetadataRoute.Sitemap[number]["changeFrequency"]]> = [
  ["", 1, "weekly"],
  ["/donna", 0.9, "weekly"],
  ["/uomo", 0.9, "weekly"],
  ["/chi-siamo", 0.7, "monthly"],
  ["/contatti", 0.8, "monthly"],
  ["/privacy", 0.2, "yearly"],
  ["/cookie", 0.2, "yearly"],
  ["/accessibilita", 0.2, "yearly"],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-28");
  return ROUTES.map(([path, priority, changeFrequency]) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
