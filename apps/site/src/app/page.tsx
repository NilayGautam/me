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
 * The hero is sized from the viewport so the Projects heading always shows above the fold, which tells
 * visitors there is more below. On desktop the fold cuts through the first project row (13.75rem of
 * Projects showing); on smaller screens the portrait shrinks with the viewport so the heading stays in view.
 */
export default async function HomePage() {
  const now = await getNow();
  const [firstName, ...rest] = site.name.split(" ");

  return (
    <>
      <section aria-labelledby="hero-title" className="border-line border-b">
        <div className="grid gap-12 px-6 pt-10 pb-16 sm:px-10 sm:pt-16 lg:min-h-[calc(100svh-4rem-13.75rem)] lg:grid-cols-12 lg:items-end lg:gap-10 lg:pt-12 lg:pb-14">
          <div className="order-2 lg:order-1 lg:col-span-7">
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
            <figure className="relative aspect-4/5 h-[clamp(12.5rem,calc(100svh-38.5rem),18.75rem)] overflow-hidden rounded-lg border border-line bg-surface sm:h-[clamp(15rem,calc(100svh-45.5rem),22.5rem)] lg:ml-auto lg:h-[clamp(20rem,calc(100svh-24.25rem),125cqw)]">
              <Portrait sizes="(min-width: 1152px) 440px, (min-width: 1024px) 38vw, (min-width: 640px) 288px, 240px" />
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
