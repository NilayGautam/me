import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { PageHeader, Section, Tag } from "@/components/ui";
import { getExperience } from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { Markdown } from "@/lib/mdx";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/experience/",
  title: "Experience",
  description: "Where I have worked and what I built there.",
});

const statusLabel = { upcoming: "Upcoming", current: "Current", past: null } as const;

export default async function ExperiencePage() {
  const experience = await getExperience();

  return (
    <>
      <PageHeader label="/experience" title="Experience">
        <p>What I have worked on, kept up to date.</p>
      </PageHeader>
      <Section>
        <ol className="border-line border-t">
          {experience.map((entry) => {
            const status = statusLabel[entry.status];
            return (
              <li key={entry.slug} className="border-line border-b">
                <Reveal>
                  <article className="grid gap-4 py-10 lg:grid-cols-12 lg:gap-10">
                    <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:flex-col lg:items-start">
                      <p className="font-mono text-label text-muted uppercase">
                        {formatPeriod(entry)}
                      </p>
                      {status ? <Tag accent={entry.status === "current"}>{status}</Tag> : null}
                    </div>
                    <div className="lg:col-span-8">
                      <h2 className="font-medium text-2xl text-fg tracking-tight">{entry.role}</h2>
                      <p className="mt-1 text-muted">
                        {entry.org}
                        <span aria-hidden="true" className="mx-2 text-subtle">
                          /
                        </span>
                        <span className="sr-only">, </span>
                        {entry.location}
                      </p>
                      {entry.body ? (
                        <div className="prose mt-6">
                          <Markdown source={entry.body} />
                        </div>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Section>
    </>
  );
}
