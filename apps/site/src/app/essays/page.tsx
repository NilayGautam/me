import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { PageHeader, Section, Tag } from "@/components/ui";
import { getEssays } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/essays/",
  title: "Essays",
  description: "What I'm learning and building.",
});

export default async function EssaysPage() {
  const essays = await getEssays();

  return (
    <>
      <PageHeader title="Essays">
        <p>Notes on what I'm learning and building.</p>
      </PageHeader>
      <Section className="pt-0 sm:pt-0">
        <ul>
          {essays.map((essay) => (
            <li key={essay.slug} className="border-line border-b">
              <Link
                href={`/essays/${essay.slug}`}
                className="group grid gap-3 py-8 lg:grid-cols-12 lg:gap-10"
              >
                <div className="flex items-center gap-3 lg:col-span-4 lg:self-start lg:pt-1.5">
                  <time dateTime={essay.date} className="text-muted text-sm tabular-nums">
                    {formatDate(essay.date)}
                  </time>
                  {essay.sample ? <Tag>Sample</Tag> : null}
                </div>
                <div className="flex items-start justify-between gap-6 lg:col-span-8">
                  <div>
                    <h2 className="font-medium text-2xl text-fg tracking-tight">{essay.title}</h2>
                    <p className="mt-2 max-w-reading text-muted">{essay.summary}</p>
                  </div>
                  <ArrowRight className="mt-2 size-5 shrink-0 text-muted transition-[translate,color] duration-base ease-out-expo group-hover:translate-x-1 group-hover:text-fg" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
