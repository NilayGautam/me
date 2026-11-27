// Cuts the Geist fonts down to the Latin characters and OpenType features the site uses.
// The full files cover Cyrillic and many alternates, and their weight delays the hero image on slow connections.
// Run with `pnpm --filter @nilaygautam/site fonts` after upgrading the `geist` package or changing the lists below.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sourceDir = path.join(root, "node_modules/geist/dist/fonts");
const outDir = path.join(root, "src/fonts");

/** Same coverage as the Google Fonts "latin" subset, plus the four arrows. Other characters fall back to system fonts. */
const ranges = [
  [0x20, 0x7e],
  [0xa0, 0xff],
  [0x131, 0x131],
  [0x152, 0x153],
  [0x2c6, 0x2c6],
  [0x2da, 0x2da],
  [0x2dc, 0x2dc],
  [0x2000, 0x206f],
  [0x20ac, 0x20ac],
  [0x2122, 0x2122],
  [0x2190, 0x2193],
  [0x2212, 0x2212],
  [0x2215, 0x2215],
];

/** `ss01` is switched on in globals.css. The rest are browser defaults or reachable through CSS utilities. */
const keepFeatures = [
  "ccmp",
  "locl",
  "liga",
  "kern",
  "mark",
  "mkmk",
  "case",
  "frac",
  "numr",
  "dnom",
  "pnum",
  "tnum",
  "ss01",
];

const fonts = [
  { source: "geist-sans/Geist-Variable.woff2", output: "geist-sans-latin.woff2" },
  { source: "geist-mono/GeistMono-Regular.woff2", output: "geist-mono-latin-400.woff2" },
];

const text = ranges
  .flatMap(([first, last]) =>
    Array.from({ length: last - first + 1 }, (_, i) => String.fromCodePoint(first + i)),
  )
  .join("");

await mkdir(outDir, { recursive: true });

for (const { source, output } of fonts) {
  const original = await readFile(path.join(sourceDir, source));
  const subset = await subsetFont(original, text, {
    targetFormat: "woff2",
    keepFeatures,
    // Without glyph names, Chromium on macOS anti-aliases the same outlines differently at 1x device scale.
    glyphNames: true,
  });
  await writeFile(path.join(outDir, output), subset);
  console.log(`${output}: ${original.length} -> ${subset.length} bytes`);
}
