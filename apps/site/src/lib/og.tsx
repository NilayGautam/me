import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/site";

export const ogSize = { width: 1200, height: 630 };

const fontDir = path.join(process.cwd(), "node_modules/geist/dist/fonts");

/** Shared Open Graph card: plain dark surface, big type, one rule. Rendered once at build time. */
export async function renderOgImage({ title, subtitle }: { title: string; subtitle: string }) {
  const [display, regular] = await Promise.all([
    readFile(
      path.join(
        process.cwd(),
        "node_modules/@fontsource/inter-tight/files/inter-tight-latin-700-normal.woff",
      ),
    ),
    readFile(path.join(fontDir, "geist-sans/Geist-Regular.ttf")),
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
        color: "#ededed",
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, fontWeight: 400, color: "#a3a3a3" }}>
        {new URL(site.url).host}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontFamily: "Inter Tight",
            fontSize: title.length > 28 ? 88 : 120,
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            paddingTop: 32,
            borderTop: "1px solid #333333",
            fontSize: 36,
            fontWeight: 400,
            color: "#a3a3a3",
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Inter Tight", data: display, weight: 700, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
