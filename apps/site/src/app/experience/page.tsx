import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader, Section, Tag } from "@/components/ui";
import { type Experience, getExperience, groupExperience } from "@/lib/content";
import { formatDuration, formatPeriod } from "@/lib/format";
import { Markdown } from "@/lib/mdx";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/experience/",
  title: "Experience",
  description: "Where I've worked and what I built there.",
});

const statusLabel = { upcoming: "Upcoming", current: "Current", past: null } as const;

/**
 * Logos shown in place of the typed company name. Heights are set so the lettering inside each
 * logo reads at about the size of the text beside it.
 * Iowa State: the official one-line wordmark from the university style guide, recolored white.
 * Sub-Zero Group: the Wolf, Sub-Zero, and Cove marks cut from an HR announcement image.
 */
const orgLogos: Record<
  string,
  { src: string; alt: string; width: number; height: number; className: string }
> = {
  "Iowa State University": {
    src: "/logos/iowa-state-university.svg",
    alt: "Iowa State University",
    width: 459,
    height: 34,
    className: "h-4",
  },
  "Sub-Zero Group": {
    src: "/logos/sub-zero-group.webp",
    alt: "Sub-Zero Group: Wolf, Sub-Zero, and Cove",
    width: 1063,
    height: 96,
    className: "h-7",
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
            const status = statusLabel[group.status];
            const duration = formatDuration(group.start, group.end, today);
            return (
              <li key={group.org} className="border-line border-b">
                <article className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-10">
                  <div className="flex flex-col items-start gap-3 lg:col-span-4 lg:pt-1.5">
                    <h2>
                      <OrgName org={group.org} />
                    </h2>
                    {duration || status ? (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        {duration ? (
                          <p className="text-muted text-sm tabular-nums">{duration}</p>
                        ) : null}
                        {status ? <Tag accent={group.status === "current"}>{status}</Tag> : null}
                      </div>
                    ) : null}
                  </div>
                  <div className="lg:col-span-8">
                    <ol>
                      {group.roles.map((entry, index) => (
                        <li key={entry.slug} className="relative pb-12 pl-7 last:pb-0">
                          {/* Timeline: a square marker per role, joined by a hairline when a company has several. */}
                          <span
                            aria-hidden="true"
                            className={`absolute top-[calc(1rem-3px)] left-0 size-1.5 ${
                              entry.status === "current" ? "bg-accent" : "bg-subtle"
                            }`}
                          />
                          {index < group.roles.length - 1 ? (
                            <span
                              aria-hidden="true"
                              className="absolute top-[calc(1rem+11px)] -bottom-[calc(1rem-5px)] left-[2.5px] w-px bg-line-strong"
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
      <h3 className="font-medium text-2xl text-fg tracking-tight">{entry.role}</h3>
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
      className={`${logo.className} w-auto max-w-full object-contain object-left`}
    />
  );
}
