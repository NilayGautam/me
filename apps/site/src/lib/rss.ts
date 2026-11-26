import { site } from "@/site";
import type { Essay } from "./content";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

/** RFC 822 date at noon UTC, so the day never shifts across time zones. */
const toRfc822 = (iso: string) => new Date(`${iso}T12:00:00Z`).toUTCString();

export function buildRss(essays: Essay[]) {
  const items = essays
    .map((essay) => {
      const url = `${site.url}/essays/${essay.slug}/`;
      return `    <item>
      <title>${escapeXml(essay.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(essay.summary)}</description>
      <pubDate>${toRfc822(essay.date)}</pubDate>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}/essays/</link>
    <description>${escapeXml(`Essays by ${site.name}`)}</description>
    <language>en</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}
