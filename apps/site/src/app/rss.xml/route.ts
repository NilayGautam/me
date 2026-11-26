import { getEssays } from "@/lib/content";
import { buildRss } from "@/lib/rss";

export const dynamic = "force-static";

export async function GET() {
  const essays = await getEssays({ includeSamples: false });
  return new Response(buildRss(essays), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
