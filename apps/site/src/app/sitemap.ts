import type { MetadataRoute } from "next";
import { getEssays } from "@/lib/content";
import { site } from "@/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const essays = await getEssays({ includeSamples: false });
  const paths = ["/", "/about/", "/experience/", ...(essays.length > 0 ? ["/essays/"] : [])];
  const pages = paths.map((path) => ({
    url: `${site.url}${path}`,
  }));
  return [
    ...pages,
    ...essays.map((essay) => ({
      url: `${site.url}/essays/${essay.slug}/`,
      lastModified: essay.date,
    })),
  ];
}
