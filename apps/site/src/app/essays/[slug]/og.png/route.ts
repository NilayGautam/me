import { getEssay, getEssays } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { renderOgImage } from "@/lib/og";
import { site } from "@/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const essays = await getEssays();
  return essays.map((essay) => ({ slug: essay.slug }));
}

export async function GET(_request: Request, { params }: RouteContext<"/essays/[slug]/og.png">) {
  const { slug } = await params;
  const essay = await getEssay(slug);
  if (!essay) return new Response("Not found", { status: 404 });
  return renderOgImage({ title: essay.title, subtitle: `${site.name}, ${formatDate(essay.date)}` });
}
