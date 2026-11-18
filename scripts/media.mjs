// Builds optimized images from assets/ into public/media and writes content/media.json.
// Usage: npm run media   (requires the dev dependency `sharp`)
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const map = JSON.parse(fs.readFileSync(path.join(root, "content/media-map.json"), "utf8"));
const out = {};

/** Bounding box of the non-black area (screenshots with black bars). */
async function contentBox(file) {
  const { data, info } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const rowMean = (y) => { let s = 0; for (let x = 0; x < W; x++) s += data[y * W + x]; return s / W; };
  const colMean = (x, y0, y1) => { let s = 0; for (let y = y0; y < y1; y++) s += data[y * W + x]; return s / (y1 - y0); };
  const rows = Array.from({ length: H }, (_, y) => rowMean(y) > 22);
  // longest run of content rows
  let best = [0, H], cur = null;
  for (let y = 0; y <= H; y++) {
    if (y < H && rows[y]) { if (cur === null) cur = y; }
    else if (cur !== null) { if (y - cur > best[1] - best[0] || best[1] - best[0] === H) best = [cur, y]; cur = null; }
  }
  let [top, bottom] = best;
  let left = 0, right = W;
  while (left < W - 1 && colMean(left, top, bottom) < 22) left++;
  while (right > left + 1 && colMean(right - 1, top, bottom) < 22) right--;
  // trim a few px of antialiasing
  return { left: left + 2, top: top + 2, width: right - left - 4, height: bottom - top - 4 };
}

for (const it of map.items) {
  const src = path.join(root, "assets", it.from);
  const dest = path.join(root, "public/media", it.to);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let img = sharp(src).rotate();
  if (it.crop) img = sharp(src).rotate().extract(await contentBox(src));
  // One panel of a composite (triptych): { left, top, width, height } in source pixels.
  if (it.extract) img = sharp(src).rotate().extract(it.extract);
  const buf = await img
    .resize({ width: it.max, height: Math.round(it.max * 1.6), fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer({ resolveWithObject: true });
  fs.writeFileSync(dest, buf.data);
  const blur = await sharp(buf.data).resize(12).webp({ quality: 40 }).toBuffer();
  out[it.id] = {
    src: "/media/" + it.to,
    width: buf.info.width,
    height: buf.info.height,
    alt: it.alt,
    look: it.look,
    blur: "data:image/webp;base64," + blur.toString("base64"),
  };
  process.stdout.write(".");
}
fs.writeFileSync(path.join(root, "content/media.json"), JSON.stringify(out, null, 1));
console.log(`\n${Object.keys(out).length} immagini`);
