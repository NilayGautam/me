import type { Metadata } from "next";
import { site } from "@/site";

export const openGraphBase = { siteName: site.name, locale: "en_US" } as const;

export const rssAlternate = {
  "application/rss+xml": [{ url: "/rss.xml", title: `${site.name} essays` }],
};

const siteImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: `${site.name}: ${site.tagline}`,
};

/** Per-page metadata, since Next.js replaces nested fields like `openGraph` instead of merging them. */
export function pageMetadata({
  path,
  title,
  description = site.tagline,
}: {
  path: string;
  title?: string;
  description?: string;
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path, types: rssAlternate },
    openGraph: {
      ...openGraphBase,
      type: "website",
      url: path,
      title: title ? `${title} | ${site.name}` : site.name,
      description,
      images: [siteImage],
    },
  };
}
