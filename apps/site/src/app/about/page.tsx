import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui";
import { getAbout } from "@/lib/content";
import { Markdown } from "@/lib/mdx";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/about/",
  title: "About me",
  description: "A little about me and what I'm working toward.",
});

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <>
      <PageHeader title="About me" />
      <Section>
        <div className="prose text-lg">
          <Markdown source={about.body} />
        </div>
      </Section>
    </>
  );
}
