import type { Metadata } from "next";
import Link from "next/link";
import { ContactButton } from "@/components/contact-button";
import { ArrowRight } from "@/components/icons";
import { Portrait } from "@/components/portrait";
import { ButtonLink, Section, SectionHeading, Tag } from "@/components/ui";
import { getAbout, getExperience, getNow, workLine } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Markdown } from "@/lib/mdx";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/site";

export const metadata: Metadata = pageMetadata({ path: "/" });

/** Until the first project ships, the projects list holds one placeholder that leads to /wip. */
const projects = [
  {
    name: "Research script builder",
    description:
      "Describe the data you have and the result you want. Get back a script that does the work.",
    href: "/wip",
    status: "In progress",
  },
] as const;

/**
 * Below lg the portrait runs edge to edge across most of the first screen and fades into the page,
 * with the name set on the fade, so the first screen reads photo, name, tagline, then the buttons.
 * From lg the same idea turns sideways: the portrait fills the hero's right side at full height,
 * bleeding to the frame edge and fading left behind the name (see `.hero-photo`). The hero leaves
 * 9.75rem of the first screen so the Projects heading shows below it, which says there is more.
 */
export default async function HomePage() {
  const [now, about, experience] = await Promise.all([getNow(), getAbout(), getExperience()]);
  const facts = [about.data.headline, workLine(experience)].filter(Boolean);
  const [firstName, ...rest] = site.name.split(" ");

  return (
    <>
      <section aria-labelledby="hero-title" className="border-line border-b">
        <div className="grid pb-16 lg:relative lg:min-h-[calc(100svh-4rem-9.75rem)] lg:grid-cols-12 lg:items-end lg:px-10 lg:pt-12 lg:pb-16">
          <div className="relative z-10 order-2 -mt-24 px-6 sm:-mt-28 sm:px-10 lg:order-1 lg:col-span-6 lg:mt-0 lg:px-0">
            <h1 id="hero-title" className="font-bold font-display text-display text-fg">
              {firstName}
              <br />
              {rest.join(" ")}
            </h1>
            <p className="mt-8 max-w-[28ch] text-balance text-lead text-muted">{site.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/about" arrow>
                About me
              </ButtonLink>
              <ContactButton email={site.email} />
            </div>
            {/* Facts sit under the buttons so the buttons stay on a phone's first screen, one per line. */}
            <p className="mt-6 text-muted text-sm">
              {facts.map((fact) => (
                <span key={fact} className="block text-balance">
                  {fact}
                </span>
              ))}
            </p>
          </div>
          <figure className="hero-photo relative order-1 h-[clamp(20rem,58svh,44rem)] w-full overflow-hidden bg-surface after:pointer-events-none after:absolute after:inset-x-0 after:top-1/2 after:bottom-0 after:bg-linear-to-b after:from-transparent after:to-bg lg:absolute lg:inset-y-0 lg:right-0 lg:order-2 lg:h-auto lg:w-[60%] lg:bg-transparent lg:after:hidden">
            <Portrait
              sizes="(min-width: 1152px) 700px, (min-width: 1024px) 60vw, 100vw"
              className="lg:object-[50%_90%]"
            />
          </figure>
        </div>
      </section>

      <Section labelledBy="projects-title" className="border-line border-b">
        <SectionHeading id="projects-title">Projects</SectionHeading>
        <ul className="mt-10 border-line border-t">
          {projects.map((project) => (
            <li key={project.name} className="border-line border-b">
              <Link
                href={project.href}
                className="group grid gap-3 py-8 sm:grid-cols-12 sm:items-baseline sm:gap-6"
              >
                <span className="font-medium text-2xl text-fg tracking-tight transition-colors duration-fast sm:col-span-4">
                  {project.name}
                </span>
                <span className="text-muted sm:col-span-6">{project.description}</span>
                <span className="flex items-center justify-between gap-4 sm:col-span-2 sm:justify-end">
                  <Tag accent>{project.status}</Tag>
                  <ArrowRight className="size-5 text-muted transition-[translate,color] duration-base ease-out-expo group-hover:translate-x-1 group-hover:text-fg" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="now-title">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHeading id="now-title">Now</SectionHeading>
            <p className="mt-3 text-sm text-subtle">
              Updated{" "}
              <time dateTime={now.data.updated} className="tabular-nums">
                {formatDate(now.data.updated)}
              </time>
            </p>
          </div>
          <div className="max-w-reading text-lead text-fg lg:col-span-8 [&_p+p]:mt-4 [&_p+p]:text-muted [&_p:first-child]:font-medium">
            <Markdown source={now.body} />
          </div>
        </div>
      </Section>
    </>
  );
}
