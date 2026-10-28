import media from "../../content/media.json";

export type MediaItem = { src: string; width: number; height: number; alt: string; look: string; blur: string };
const all = media as Record<string, MediaItem>;

export function getMedia(id: string): MediaItem {
  const m = all[id];
  if (!m) throw new Error(`Immagine "${id}" non trovata in content/media.json`);
  return m;
}
