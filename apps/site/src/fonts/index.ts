import localFont from "next/font/local";

/**
 * A Latin subset written by `scripts/subset-fonts.mjs`.
 * The full font is several times larger and delays the hero image on slow connections.
 */
export const sans = localFont({
  src: "./geist-sans-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

/** Display face for big headings: a free, tight grotesk close to the DevRev headline voice. */
export const display = localFont({
  src: "../../node_modules/@fontsource/inter-tight/files/inter-tight-latin-700-normal.woff2",
  variable: "--font-inter-tight",
  weight: "700",
  display: "swap",
});
