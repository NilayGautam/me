import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@/components/icons";
import { Section, Tag } from "@/components/ui";
import { getEssay, getEssays } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Markdown } from "@/lib/mdx";
import { openGraphBase, pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  const essays = await getEssays();
  return essays.map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({ params }: PageProps<"/essays/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const essay = await getEssay(slug);
  if (!essay) return {};
  const path = `/essays/${essay.slug}/`;
  return {
    ...pageMetadata({ path, title: essay.title, description: essay.summary }),
    openGraph: {
      ...openGraphBase,
      type: "article",
      url: path,
      title: essay.title,
      description: essay.summary,
      publishedTime: essay.date,
      images: [{ url: `/essays/${essay.slug}/og.png`, width: 1200, height: 630, alt: essay.title }],
    },
    ...(essay.sample ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function EssayPage({ params }: PageProps<"/essays/[slug]">) {
  const { slug } = await params;
  const essay = await getEssay(slug);
  if (!essay) notFound();

  return (
    <article>
      <header className="border-line border-b px-6 pt-12 pb-12 sm:px-10 sm:pt-16 sm:pb-16">
        <Link
          href="/essays"
          className="group inline-flex items-center gap-2 text-muted text-sm transition-colors duration-fast hover:text-fg"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-base ease-out-expo group-hover:-translate-x-0.5" />
          Essays
        </Link>
        <h1 className="mt-16 max-w-[20ch] text-balance font-bold font-display text-title text-fg">
          {essay.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <time dateTime={essay.date} className="font-mono text-muted text-sm tabular-nums">
            {formatDate(essay.date)}
          </time>
          {essay.sample ? <Tag>Sample</Tag> : null}
        </div>
        <p className="mt-6 max-w-reading text-lead text-muted">{essay.summary}</p>
      </header>
      <Section>
        <div className="prose">
          <Markdown source={essay.body} mdx />
        </div>
      </Section>
    </article>
  );
}
