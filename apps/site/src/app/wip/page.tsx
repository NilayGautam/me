import type { Metadata } from "next";
import { ButtonLink, Section } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/wip/",
    title: "Work in progress",
    description: "This project is still being built.",
  }),
  robots: { index: false, follow: true },
};

export default function WorkInProgressPage() {
  return (
    <Section className="flex flex-1 flex-col justify-center">
      <div>
        <h1 className="max-w-[14ch] font-bold font-display text-title text-fg">
          Still being built.
        </h1>
        <p className="mt-6 max-w-reading text-lead text-muted">
          This project isn't live yet. When it ships, it will run live at its own address.
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
