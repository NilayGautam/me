import type { Metadata } from "next";
import { Portrait } from "@/components/portrait";
import { ButtonLink, PageHeader, Section } from "@/components/ui";
import { getAbout, getExperience } from "@/lib/content";
import { Markdown } from "@/lib/mdx";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/about/",
  title: "About me",
  description: "A little about me and what I'm working toward.",
});

export default async function AboutPage() {
  const [about, experience] = await Promise.all([getAbout(), getExperience()]);
  const roleAt = (status: "current" | "upcoming") =>
    experience
      .filter((entry) => entry.status === status)
      .map((entry) => `${entry.role}, ${entry.org}`);
  // Now and Next come from the Experience entries, so they change on their own as dates pass.
  const facts = [
    { label: "Studying", values: [about.data.study] },
    { label: "Graduating", values: [about.data.graduating] },
    { label: "Now", values: roleAt("current") },
    { label: "Next", values: roleAt("upcoming") },
    { label: "Based in", values: [about.data.based] },
  ].filter((fact) => fact.values.length > 0);

  return (
    <>
      <PageHeader title="About me" />
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="prose text-lg">
              <Markdown source={about.body} />
            </div>
            <dl className="mt-12 max-w-reading border-line border-t">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid gap-1 border-line border-b py-4 sm:grid-cols-[9rem_1fr] sm:gap-6"
                >
                  <dt className="text-sm text-subtle">{fact.label}</dt>
                  <dd className="text-fg">
                    {fact.values.map((value) => (
                      <span key={value} className="block">
                        {value}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-12 flex flex-wrap gap-3">
              <ButtonLink href="/experience" arrow>
                Experience
              </ButtonLink>
              <ButtonLink href="/essays" variant="secondary">
                Essays
              </ButtonLink>
            </div>
          </div>
          <figure className="relative hidden aspect-4/5 overflow-hidden rounded-lg border border-line bg-surface lg:col-span-5 lg:block lg:self-start">
            <Portrait photo="night" sizes="(min-width: 1152px) 440px, 38vw" priority={false} />
          </figure>
        </div>
      </Section>
    </>
  );
}
