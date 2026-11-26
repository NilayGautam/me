import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Portrait } from "@/components/portrait";
import { Reveal } from "@/components/reveal";
import { ButtonAnchor, ButtonLink, Section, SectionLabel, Tag } from "@/components/ui";
import { getNow } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Markdown } from "@/lib/mdx";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/site";

export const metadata: Metadata = pageMetadata({ path: "/" });

/** Until the first project ships, the projects list holds one placeholder that leads to /wip. */
const projects = [
  {
    name: "First project",
    description: "Being built right now. It will run live on its own subdomain.",
    href: "/wip",
    status: "In progress",
  },
] as const;

export default async function HomePage() {
  const now = await getNow();
  const [firstName, ...rest] = site.name.split(" ");

  return (
    <>
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden border-line border-b"
      >
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative grid gap-12 px-6 pt-10 pb-16 sm:px-10 sm:pt-16 lg:min-h-[calc(100svh-4rem-7rem)] lg:grid-cols-12 lg:items-end lg:gap-10 lg:pt-20 lg:pb-20">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <h1 id="hero-title" className="font-semibold text-display text-fg">
              {firstName}
              <br />
              {rest.join(" ")}
            </h1>
            <p className="mt-8 max-w-[28ch] text-balance text-lead text-muted">{site.tagline}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/about" arrow>
                About me
              </ButtonLink>
              <ButtonAnchor href={`mailto:${site.email}`} variant="secondary">
                Contact
              </ButtonAnchor>
            </div>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-5">
            <figure className="relative aspect-4/5 w-full max-w-60 overflow-hidden rounded-lg border border-line bg-surface sm:max-w-72 lg:max-w-none">
              <Portrait sizes="(min-width: 1152px) 440px, (min-width: 1024px) 38vw, (min-width: 640px) 288px, 240px" />
            </figure>
          </div>
        </div>
      </section>

      <Section labelledBy="projects-title" className="border-line border-b">
        <Reveal>
          <SectionLabel index="01">Projects</SectionLabel>
          <h2 id="projects-title" className="sr-only">
            Projects
          </h2>
        </Reveal>
        <ul className="mt-10 border-line border-t">
          {projects.map((project, i) => (
            <li key={project.name} className="border-line border-b">
              <Reveal>
                <Link
                  href={project.href}
                  className="group grid gap-3 py-8 transition-colors duration-fast sm:grid-cols-12 sm:items-center sm:gap-6"
                >
                  <span className="font-mono text-label text-subtle sm:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium text-2xl text-fg tracking-tight sm:col-span-4">
                    {project.name}
                  </span>
                  <span className="text-muted sm:col-span-5">{project.description}</span>
                  <span className="flex items-center justify-between gap-4 sm:col-span-2 sm:justify-end">
                    <Tag accent>{project.status}</Tag>
                    <ArrowRight className="size-5 text-muted transition-all duration-base ease-out-expo group-hover:translate-x-1 group-hover:text-fg" />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="now-title">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionLabel index="02">Now</SectionLabel>
            <h2 id="now-title" className="sr-only">
              Now
            </h2>
            <p className="mt-3 font-mono text-label text-subtle uppercase">
              Updated <time dateTime={now.data.updated}>{formatDate(now.data.updated)}</time>
            </p>
          </div>
          <div className="max-w-reading text-lead text-fg lg:col-span-8 [&_p+p]:mt-4 [&_p+p]:text-muted [&_p:first-child]:font-medium">
            <Markdown source={now.body} />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
