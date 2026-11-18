import type { Metadata } from "next";

export const OG_IMAGE = { url: "/og/ingromoda-palermo.jpg", width: 1200, height: 630, alt: "Ingromoda, Palermo: donna sorridente in abito nero accanto al logo del negozio" };

/**
 * Page metadata with canonical and a complete Open Graph block. Next replaces
 * (not merges) the layout's openGraph when a page defines one, so every page
 * goes through here to keep the share image, locale and site name.
 */
export function pageMeta({ title, description, path, image, absoluteTitle = false, index = true }: { title: string; description: string; path: string; image?: { url: string; width: number; height: number; alt: string }; absoluteTitle?: boolean; index?: boolean }): Metadata {
  const ogTitle = absoluteTitle ? title : `${title} | Ingromoda`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: index ? undefined : { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "it_IT",
      siteName: "Ingromoda",
      title: ogTitle,
      description,
      url: path,
      images: [image ?? OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [(image ?? OG_IMAGE).url] },
  };
}
