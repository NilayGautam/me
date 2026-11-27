import type { Metadata } from "next";
import { ButtonLink, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section className="flex flex-1 flex-col justify-center">
      <div>
        <h1 className="font-bold font-display text-title text-fg">Page not found.</h1>
        <p className="mt-6 max-w-reading text-lead text-muted">
          The page you're looking for doesn't exist or has moved.
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
