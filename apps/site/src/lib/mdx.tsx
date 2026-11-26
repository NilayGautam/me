import { evaluate } from "@mdx-js/mdx";
import rehypeShiki from "@shikijs/rehype";
import * as runtime from "react/jsx-runtime";

/** Compiles Markdown or MDX from `content/` to React at build time. No MDX code ships to the browser. */
export async function Markdown({ source, mdx = false }: { source: string; mdx?: boolean }) {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    format: mdx ? "mdx" : "md",
    rehypePlugins: [[rehypeShiki, { theme: "vesper" }]],
  });
  return <Content />;
}
