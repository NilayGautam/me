import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader, Section, Tag } from "@/components/ui";
import { getExperience } from "@/lib/content";
import { formatPeriod } from "@/lib/format";
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
  const experience = await getExperience();

  return (
    <>
      <PageHeader title="Experience" />
      <Section className="pt-0 sm:pt-0">
        <ol>
          {experience.map((entry) => {
            const status = statusLabel[entry.status];
            return (
              <li key={entry.slug} className="border-line border-b">
                <article className="grid gap-4 py-10 lg:grid-cols-12 lg:gap-10">
                  <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:flex-col lg:items-start lg:pt-1.5">
                    <p className="text-muted text-sm tabular-nums">{formatPeriod(entry)}</p>
                    {status ? <Tag accent={entry.status === "current"}>{status}</Tag> : null}
                  </div>
                  <div className="lg:col-span-8">
                    <h2 className="font-medium text-2xl text-fg tracking-tight">{entry.role}</h2>
                    <p className="mt-2 flex flex-wrap items-center gap-y-2 text-muted">
                      <OrgName org={entry.org} />
                      {/* On phones the location gets its own line, so no slash is left at a line end. */}
                      <span aria-hidden="true" className="mx-2 hidden text-subtle sm:inline">
                        /
                      </span>
                      <span className="sr-only">, </span>
                      <span className="w-full sm:w-auto">{entry.location}</span>
                    </p>
                    {entry.body ? (
                      <div className="prose mt-6">
                        <Markdown source={entry.body} />
                      </div>
                    ) : null}
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

function OrgName({ org }: { org: string }) {
  const logo = orgLogos[org];
  if (!logo) return <>{org}</>;
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      className={`${logo.className} w-auto`}
    />
  );
}
