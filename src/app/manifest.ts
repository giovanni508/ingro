import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ingromoda, abiti da cerimonia a Palermo",
    short_name: "Ingromoda",
    start_url: "/",
    display: "browser",
    background_color: "#160a10",
    theme_color: "#160a10",
    lang: "it",
    icons: [
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
