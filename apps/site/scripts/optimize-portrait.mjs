// Generates responsive AVIF, WebP, and JPEG versions of the hero portrait.
// Run with `pnpm --filter @nilaygautam/site images` after replacing assets/portrait-source.jpg.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(root, "assets/portrait-source.jpg");
const outDir = path.join(root, "public/images");
const widths = [480, 800, 1200];

await mkdir(outDir, { recursive: true });

for (const width of widths) {
  const base = sharp(source).resize(width);
  await Promise.all([
    base
      .clone()
      .avif({ quality: 55 })
      .toFile(path.join(outDir, `portrait-${width}.avif`)),
    base
      .clone()
      .webp({ quality: 75 })
      .toFile(path.join(outDir, `portrait-${width}.webp`)),
    base
      .clone()
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(path.join(outDir, `portrait-${width}.jpg`)),
  ]);
}

console.log(`Wrote ${widths.length * 3} images to ${path.relative(process.cwd(), outDir)}`);
