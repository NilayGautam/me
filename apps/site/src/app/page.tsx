import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Portrait } from "@/components/portrait";
import { ButtonAnchor, ButtonLink, Section, SectionHeading, Tag } from "@/components/ui";
import { getNow } from "@/lib/content";
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
 * with the name set on the fade, so the first screen reads photo, name, tagline.
 * From lg the hero is sized from the viewport so the fold cuts through the first project row
 * (13.75rem of Projects showing), which tells visitors there is more below. The portrait shrinks
 * with the viewport height to make room.
 */
export default async function HomePage() {
  const now = await getNow();
  const [firstName, ...rest] = site.name.split(" ");

  return (
    <>
      <section aria-labelledby="hero-title" className="border-line border-b">
        <div className="grid pb-16 lg:min-h-[calc(100svh-4rem-13.75rem)] lg:grid-cols-12 lg:items-end lg:gap-10 lg:px-10 lg:pt-12 lg:pb-14">
          <div className="relative order-2 -mt-24 px-6 sm:-mt-28 sm:px-10 lg:order-1 lg:col-span-7 lg:mt-0 lg:px-0">
            <h1 id="hero-title" className="font-bold font-display text-display text-fg">
              {firstName}
              <br />
              {rest.join(" ")}
            </h1>
            <p className="mt-8 max-w-[28ch] text-balance text-lead text-muted">{site.tagline}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/about" arrow>
                About me
              </ButtonLink>
              <ButtonAnchor href="#contact" variant="secondary">
                Contact
              </ButtonAnchor>
            </div>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-5 lg:@container">
            <figure className="relative h-[clamp(22rem,70svh,44rem)] w-full overflow-hidden bg-surface after:pointer-events-none after:absolute after:inset-x-0 after:top-1/2 after:bottom-0 after:bg-linear-to-b after:from-transparent after:to-bg lg:ml-auto lg:aspect-4/5 lg:h-[clamp(20rem,calc(100svh-24.25rem),125cqw)] lg:w-auto lg:rounded-lg lg:border lg:border-line lg:after:hidden">
              <Portrait sizes="(min-width: 1152px) 440px, (min-width: 1024px) 38vw, 100vw" />
            </figure>
          </div>
        </div>
      </section>

      <Section labelledBy="projects-title" className="border-line border-b">
        <SectionHeading id="projects-title">Projects</SectionHeading>
        <ul className="mt-10 border-line border-t">
          {projects.map((project) => (
            <li key={project.name} className="border-line border-b">
              <Link
                href={project.href}
                className="group grid gap-3 py-8 sm:grid-cols-12 sm:items-center sm:gap-6"
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
