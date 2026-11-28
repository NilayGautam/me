import type { Metadata } from "next";
import { ButtonLink, Section, Tag } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/wip/",
    title: "Research script builder",
    description:
      "A tool that turns the data you have and the result you want into a script. Still being built.",
  }),
  robots: { index: false, follow: true },
};

/** The in-progress project's page until it ships on its own subdomain. */
export default function WorkInProgressPage() {
  return (
    <Section className="flex flex-1 flex-col justify-center">
      <div>
        <Tag accent>In progress</Tag>
        <h1 className="mt-6 max-w-[16ch] font-bold font-display text-title text-fg">
          Research script builder
        </h1>
        <p className="mt-6 max-w-reading text-lead text-muted">
          Describe the data you have and the result you want, and get back a script that does the
          work. I'm building it first for my professor at Iowa State, so researchers can link and
          enrich datasets without writing code.
        </p>
        <p className="mt-4 max-w-reading text-muted">
          It isn't live yet. When it ships, it will run on its own subdomain of nilaygautam.com.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/experience" arrow>
            How I'm building it
          </ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Back home
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
