import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader, Section } from "@/components/ui";
import { type Experience, getExperience, groupExperience } from "@/lib/content";
import { formatDuration, formatPeriod } from "@/lib/format";
import { Markdown } from "@/lib/mdx";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/experience/",
  title: "Experience",
  description: "Where I've worked and what I built there.",
});

/**
 * Logos stand in for the company name and name the company heading through their alt text.
 * Every logo is drawn at the same width, so a long one-line wordmark and a row of boxed marks
 * carry about the same weight; heights follow.
 * Iowa State: the official one-line wordmark from the university style guide, recolored white.
 * Sub-Zero Group: the Wolf, Sub-Zero, and Cove marks cut from an HR announcement image.
 */
const orgLogos: Record<
  string,
  {
    src: string;
    alt: string;
    width: number;
    height: number;
  }
> = {
  "Iowa State University": {
    src: "/logos/iowa-state-university.svg",
    alt: "Iowa State University",
    width: 459,
    height: 34,
  },
  "Sub-Zero Group": {
    src: "/logos/sub-zero-group.webp",
    alt: "Sub-Zero Group",
    width: 1063,
    height: 96,
  },
};

export default async function ExperiencePage() {
  const today = new Date();
  const groups = groupExperience(await getExperience(today));

  return (
    <>
      <PageHeader title="Experience" />
      <Section className="pt-0 sm:pt-0">
        <ol>
          {groups.map((group) => {
            // Time there counts only once it has started, and grows with each rebuild (see deploy-site.yml).
            const duration = formatDuration(group.start, group.end, today);
            return (
              <li key={group.org} className="border-line border-b">
                <article className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-10">
                  {/* From lg the company block is centered in its column; stacked on phones it keeps the left edge. */}
                  <div className="flex flex-col items-start gap-3 lg:col-span-4 lg:items-center lg:pt-1.5 lg:text-center">
                    <h2>
                      <OrgName org={group.org} />
                    </h2>
                    {duration ? (
                      <p className="text-muted text-sm tabular-nums">{duration}</p>
                    ) : null}
                  </div>
                  <div className="lg:col-span-8">
                    <ol>
                      {group.roles.map((entry, index) => (
                        <li key={entry.slug} className="relative pb-12 pl-7 last:pb-0">
                          {/* Timeline: a square marker per role, joined by a hairline when a company has several.
                              The hairline stops 8px short of each marker: it starts 8px below this one and ends
                              8px above the next, whose marker sits 1rem - 3px into its own item. */}
                          <span
                            aria-hidden="true"
                            className={`absolute top-[calc(1rem-3px)] left-0 size-1.5 ${
                              {
                                current: "bg-accent",
                                upcoming: "border border-subtle",
                                past: "bg-subtle",
                              }[entry.status]
                            }`}
                          />
                          {index < group.roles.length - 1 ? (
                            <span
                              aria-hidden="true"
                              className="absolute top-[calc(1rem+11px)] -bottom-[5px] left-[2.5px] w-px bg-line-strong"
                            />
                          ) : null}
                          <Role entry={entry} />
                        </li>
                      ))}
                    </ol>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </Section>
    </>
  );
}

function Role({ entry }: { entry: Experience }) {
  return (
    <>
      <h3 className="font-medium text-2xl text-fg tracking-tight">
        {entry.status === "upcoming" ? `Incoming ${entry.role}` : entry.role}
      </h3>
      <p className="mt-2 text-muted">
        <span className="tabular-nums">{formatPeriod(entry)}</span>
        <span aria-hidden="true" className="mx-2.5 text-subtle">
          |
        </span>
        <span className="sr-only">, </span>
        {entry.location}
      </p>
      {entry.body ? (
        <div className="prose mt-6">
          <Markdown source={entry.body} />
        </div>
      ) : null}
    </>
  );
}

function OrgName({ org }: { org: string }) {
  const logo = orgLogos[org];
  if (!logo) return <span className="font-medium text-fg text-lg">{org}</span>;
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      className="h-auto w-72 max-w-full"
    />
  );
}
