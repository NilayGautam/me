// Generates responsive AVIF, WebP, and JPEG versions of every photo listed in src/photos.json.
// Run with `pnpm --filter @nilaygautam/site images` after adding or replacing a source in assets/.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import photos from "../src/photos.json" with { type: "json" };

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, "public/images");

await mkdir(outDir, { recursive: true });

let count = 0;
for (const [name, photo] of Object.entries(photos)) {
  for (const width of photo.widths) {
    // sharp drops EXIF by default, so no location or camera data reaches the site.
    const base = sharp(path.join(root, photo.source)).resize(width);
    const file = (format) => path.join(outDir, `${name}-${width}.${format}`);
    await Promise.all([
      base.clone().avif({ quality: 55 }).toFile(file("avif")),
      base.clone().webp({ quality: 75 }).toFile(file("webp")),
      base.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(file("jpg")),
    ]);
    count += 3;
  }
}

console.log(`Wrote ${count} images to ${path.relative(process.cwd(), outDir)}`);
