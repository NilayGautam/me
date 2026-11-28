import { describe, expect, it } from "vitest";
import type { Experience } from "./content";
import {
  experienceStatus,
  getAbout,
  getEssays,
  getExperience,
  getNow,
  groupExperience,
  parseFrontmatter,
  workLine,
} from "./content";
import { formatDate, formatDuration, formatMonth, formatPeriod } from "./format";

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
    expect(formatPeriod({ start: "2027-01", end: "2027-08" })).toBe("Jan 2027 - Aug 2027");
    expect(formatPeriod({ start: "2027-01", end: "2027-01" })).toBe("Jan 2027");
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

describe("formatDuration", () => {
  // LinkedIn counts both the first and the last month of a stint.
  const today = new Date("2026-11-26T12:00:00Z");

  it("counts both end months", () => {
    expect(formatDuration("2025-10", "2026-05", today)).toBe("8 mos");
    expect(formatDuration("2027-01", "2027-08", today)).toBe("8 mos");
    expect(formatDuration("2026-03", "2026-03", today)).toBe("1 mo");
  });

  it("runs an open stint to the current month", () => {
    expect(formatDuration("2025-10", undefined, today)).toBe("1 yr 2 mos");
    expect(formatDuration("2024-12", undefined, today)).toBe("2 yrs");
  });

  it("has nothing to measure for an open stint that has not started", () => {
    expect(formatDuration("2027-01", undefined, today)).toBeNull();
  });
});

describe("groupExperience", () => {
  const role = (org: string, start: string, end?: string, status: Experience["status"] = "past") =>
    ({
      org,
      role: `${org} ${start}`,
      location: "Ames, IA",
      start,
      end,
      slug: start,
      body: "",
      status,
    }) as Experience;

  it("puts roles at the same company together, keeping newest first", () => {
    const groups = groupExperience([
      role("B", "2027-01", "2027-08", "upcoming"),
      role("A", "2026-01", undefined, "current"),
      role("A", "2025-10", "2026-05"),
    ]);
    expect(groups.map((g) => [g.org, g.roles.map((r) => r.start)])).toEqual([
      ["B", ["2027-01"]],
      ["A", ["2026-01", "2025-10"]],
    ]);
  });

  it("spans the company from its first start to its last end", () => {
    const [closed] = groupExperience([
      role("A", "2024-06", "2025-01"),
      role("A", "2023-02", "2024-05"),
    ]);
    expect([closed?.start, closed?.end, closed?.status]).toEqual(["2023-02", "2025-01", "past"]);

    const [open] = groupExperience([
      role("A", "2026-01", undefined, "current"),
      role("A", "2025-10", "2026-05"),
    ]);
    expect([open?.start, open?.end, open?.status]).toEqual(["2025-10", undefined, "current"]);
  });
});

describe("workLine", () => {
  const role = (name: string, start: string, status: Experience["status"]) =>
    ({ org: "Org", role: name, location: "", start, slug: name, body: "", status }) as Experience;

  it("names the soonest upcoming role with its start month, ahead of current ones", () => {
    expect(
      workLine([
        role("Later", "2027-09", "upcoming"),
        role("Co-op", "2027-01", "upcoming"),
        role("Assistant", "2026-01", "current"),
      ]),
    ).toBe("Co-op at Org, starting Jan 2027");
  });

  it("falls back to the most recently started current role once nothing is upcoming", () => {
    expect(
      workLine([
        role("Co-op", "2027-01", "current"),
        role("Assistant", "2026-01", "current"),
        role("Old", "2025-01", "past"),
      ]),
    ).toBe("Co-op at Org");
  });

  it("is empty when every role is in the past", () => {
    expect(workLine([role("Old", "2025-01", "past")])).toBeNull();
  });
});
