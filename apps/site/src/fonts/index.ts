import localFont from "next/font/local";

/**
 * Both Geist files are Latin subsets written by `scripts/subset-fonts.mjs`.
 * The full fonts are several times larger and delay the hero image on slow connections.
 */
export const sans = localFont({
  src: "./geist-sans-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

/**
 * Mono only styles small data text, so it is not preloaded and never competes with the hero image.
 * All mono text is weight 400, so only the static Regular face ships.
 */
export const mono = localFont({
  src: "./geist-mono-latin-400.woff2",
  variable: "--font-geist-mono",
  weight: "400",
  preload: false,
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

/** Display face for big headings: a free, tight grotesk close to the DevRev headline voice. */
export const display = localFont({
  src: "../../node_modules/@fontsource/inter-tight/files/inter-tight-latin-700-normal.woff2",
  variable: "--font-inter-tight",
  weight: "700",
  display: "swap",
});
