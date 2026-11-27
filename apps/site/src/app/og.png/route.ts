import { renderOgImage } from "@/lib/og";
import { site } from "@/site";

export const dynamic = "force-static";

/** Served as a real `.png` file so every static host sends the right content type. */
export function GET() {
  return renderOgImage({ title: site.name, subtitle: site.tagline });
}
