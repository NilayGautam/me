import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui";
import { getAbout } from "@/lib/content";
import { Markdown } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "About",
  description: "A little about me and what I am working toward.",
  alternates: { canonical: "/about/" },
};

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <>
      <PageHeader label="/about" title="About me" />
      <Section>
        <div className="prose text-lg">
          <Markdown source={about.body} />
        </div>
      </Section>
    </>
  );
}
