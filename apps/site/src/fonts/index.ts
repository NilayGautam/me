import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";

export const sans = GeistSans;

/** Mono only styles small labels, so it is not preloaded and never competes with the hero image. */
export const mono = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  preload: false,
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});
