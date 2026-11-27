import { describe, expect, it } from "vitest";
import {
  experienceStatus,
  getAbout,
  getEssays,
  getExperience,
  getNow,
  parseFrontmatter,
} from "./content";
import { formatDate, formatMonth, formatPeriod } from "./format";

describe("parseFrontmatter", () => {
  it("splits YAML frontmatter from the body", () => {
    const { data, body } = parseFrontmatter("---\ntitle: Hi\n---\n\nHello\n", "x.md");
    expect(data).toEqual({ title: "Hi" });
    expect(body).toBe("Hello");
  });

  it("rejects files without frontmatter", () => {
    expect(() => parseFrontmatter("Hello", "x.md")).toThrow("x.md: missing frontmatter");
  });
});

describe("experienceStatus", () => {
  const today = new Date("2026-11-26T12:00:00Z");

  it("marks roles that have not started as upcoming", () => {
    expect(experienceStatus({ start: "2027-01" }, today)).toBe("upcoming");
  });

  it("marks open-ended roles as current", () => {
    expect(experienceStatus({ start: "2026-01" }, today)).toBe("current");
  });

  it("keeps a role current through its final month", () => {
    expect(experienceStatus({ start: "2026-01", end: "2026-11" }, today)).toBe("current");
  });

  it("marks finished roles as past", () => {
    expect(experienceStatus({ start: "2025-10", end: "2026-05" }, today)).toBe("past");
  });
});

describe("format", () => {
  it("formats dates without time zone drift", () => {
    expect(formatDate("2026-01-01")).toBe("1 Jan 2026");
    expect(formatMonth("2025-10")).toBe("Oct 2025");
  });

  it("prefers an explicit period label", () => {
    expect(formatPeriod({ start: "2027-01", period: "Spring - Summer 2027" })).toBe(
      "Spring - Summer 2027",
    );
    expect(formatPeriod({ start: "2026-01" })).toBe("Jan 2026 - Present");
    expect(formatPeriod({ start: "2025-10", end: "2026-05" })).toBe("Oct 2025 - May 2026");
    expect(formatPeriod({ start: "2027-01", end: "2027-08" })).toBe("Jan - Aug 2027");
  });
});

describe("content folder", () => {
  it("has valid about and now pages", async () => {
    expect((await getAbout()).body.length).toBeGreaterThan(0);
    expect((await getNow()).data.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("has valid experience and essays", async () => {
    expect((await getExperience()).length).toBeGreaterThan(0);
    expect((await getEssays()).length).toBeGreaterThan(0);
  });
});
