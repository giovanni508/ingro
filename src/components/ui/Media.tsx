import Image, { type ImageProps } from "next/image";
import { getMedia } from "@/lib/media";

type Props = Omit<ImageProps, "src" | "alt" | "width" | "height"> & { id: string; alt?: string; fill?: boolean };

/** next/image fed by content/media.json (dimensions, Italian alt, blur placeholder). */
export function Media({ id, alt, fill, ...rest }: Props) {
  const m = getMedia(id);
  const text = alt ?? m.alt;
  const common = { src: m.src, placeholder: "blur" as const, blurDataURL: m.blur, ...rest };
  return fill ? <Image {...common} alt={text} fill /> : <Image {...common} alt={text} width={m.width} height={m.height} />;
}
