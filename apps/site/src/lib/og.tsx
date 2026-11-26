import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/site";

export const ogSize = { width: 1200, height: 630 };

const fontDir = path.join(process.cwd(), "node_modules/geist/dist/fonts");

/** Shared Open Graph card: dark, gridded, big type. Rendered once at build time. */
export async function renderOgImage({ title, eyebrow }: { title: string; eyebrow: string }) {
  const [sans, mono] = await Promise.all([
    readFile(path.join(fontDir, "geist-sans/Geist-SemiBold.ttf")),
    readFile(path.join(fontDir, "geist-mono/GeistMono-Regular.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "72px 80px",
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        color: "#ededed",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: "Geist Mono",
          fontSize: 22,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#a3a3a3",
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: "#c6f36b" }} />
        {eyebrow}
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Geist",
          fontSize: title.length > 28 ? 88 : 120,
          lineHeight: 0.95,
          letterSpacing: "-0.045em",
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "Geist Mono",
          fontSize: 22,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#7a7a7a",
        }}
      >
        <span>{site.name}</span>
        <span>{new URL(site.url).host}</span>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: sans, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
