import type { Metadata } from "next";
import { ButtonLink, Section, SectionLabel, Tag } from "@/components/ui";

export const metadata: Metadata = {
  title: "Work in progress",
  description: "This project is still being built.",
  robots: { index: false, follow: true },
};

export default function WorkInProgressPage() {
  return (
    <Section className="relative flex flex-1 flex-col justify-center overflow-hidden">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <SectionLabel>Project</SectionLabel>
          <Tag accent>In progress</Tag>
        </div>
        <h1 className="mt-6 max-w-[14ch] font-semibold text-title text-fg">Still being built.</h1>
        <p className="mt-6 max-w-reading text-lead text-muted">
          This project is not live yet. When it ships, it will run here on its own subdomain.
        </p>
        <div className="mt-10">
          <ButtonLink href="/" variant="secondary">
            Back home
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
