import type { Metadata } from "next";
import { ButtonLink, Section, SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section className="relative flex flex-1 flex-col justify-center overflow-hidden">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative">
        <SectionLabel>Error 404</SectionLabel>
        <h1 className="mt-6 font-semibold text-title text-fg">Page not found.</h1>
        <p className="mt-6 max-w-reading text-lead text-muted">
          The page you are looking for does not exist or has moved.
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
