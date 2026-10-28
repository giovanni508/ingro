// Tiles a tall full-page screenshot into side-by-side columns for review.
// Usage: node scripts/tile.mjs <png> <out.jpg> [cols] [targetHeight]
import sharp from "sharp";
const [src, out, colsArg = "3", hArg = "1900"] = process.argv.slice(2);
const m = await sharp(src).metadata();
const cols = Number(colsArg);
const seg = Math.ceil(m.height / cols);
const parts = [];
for (let i = 0; i < cols; i++) {
  const top = i * seg;
  const h = Math.min(seg, m.height - top);
  if (h <= 0) break;
  parts.push({ input: await sharp(src).extract({ left: 0, top, width: m.width, height: h }).toBuffer(), left: i * (m.width + 20), top: 0 });
}
const big = await sharp({ create: { width: cols * (m.width + 20), height: seg, channels: 3, background: "#ffffff" } }).composite(parts).png().toBuffer();
await sharp(big).resize({ height: Number(hArg), withoutEnlargement: true }).jpeg({ quality: 72 }).toFile(out);
console.log(out, m.width, m.height);
