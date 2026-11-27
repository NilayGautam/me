import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";

export const sans = GeistSans;

/**
 * Mono only styles small data text, so it is not preloaded and never competes with the hero image.
 * All mono text is weight 400, so the static Regular face ships instead of the larger variable font.
 */
export const mono = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2",
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
