import path from "node:path";
import { describe, expect, it } from "vitest";

process.env.CONTENT_DIR = path.join(import.meta.dirname, "fixtures/content");
const { getEssays, getExperience } = await import("./content");

describe("content from fixtures", () => {
  it("lists experience newest first, not in file name order", async () => {
    const entries = await getExperience(new Date("2026-11-26T12:00:00Z"));
    expect(entries.map((e) => [e.slug, e.status])).toEqual([
      ["b-newest", "current"],
      ["c-middle", "past"],
      ["a-oldest", "past"],
    ]);
  });

  it("includes sample essays by default, newest first", async () => {
    const essays = await getEssays();
    expect(essays.map((e) => e.slug)).toEqual(["a-sample", "c-second", "b-first"]);
  });

  it("leaves sample essays out when asked", async () => {
    const essays = await getEssays({ includeSamples: false });
    expect(essays.map((e) => e.slug)).toEqual(["c-second", "b-first"]);
  });
});
