import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { PageHeader, Section, Tag } from "@/components/ui";
import { getEssays } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Essays",
  description: "Essays and notes by Nilay Gautam.",
  alternates: { canonical: "/essays" },
};

export default async function EssaysPage() {
  const essays = await getEssays();

  return (
    <>
      <PageHeader label="/essays" title="Essays">
        <p>
          Notes on what I am learning and building. Also available as an{" "}
          <a
            href="/rss.xml"
            className="text-fg underline decoration-line-strong underline-offset-4 transition-colors duration-fast hover:decoration-accent"
          >
            RSS feed
          </a>
          .
        </p>
      </PageHeader>
      <Section>
        <ul className="border-line border-t">
          {essays.map((essay) => (
            <li key={essay.slug} className="border-line border-b">
              <Reveal>
                <Link
                  href={`/essays/${essay.slug}`}
                  className="group grid gap-3 py-8 lg:grid-cols-12 lg:gap-10"
                >
                  <div className="flex items-center gap-3 lg:col-span-4">
                    <time
                      dateTime={essay.date}
                      className="font-mono text-label text-muted uppercase"
                    >
                      {formatDate(essay.date)}
                    </time>
                    {essay.sample ? <Tag>Sample</Tag> : null}
                  </div>
                  <div className="flex items-start justify-between gap-6 lg:col-span-8">
                    <div>
                      <h2 className="font-medium text-2xl text-fg tracking-tight">{essay.title}</h2>
                      <p className="mt-2 max-w-reading text-muted">{essay.summary}</p>
                    </div>
                    <ArrowRight className="mt-2 size-5 shrink-0 text-muted transition-all duration-base ease-out-expo group-hover:translate-x-1 group-hover:text-fg" />
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
