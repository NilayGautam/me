import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

/** Root of the repo-level `content/` folder. Next and Vitest both run from `apps/site`. */
export const contentDir = process.env.CONTENT_DIR ?? path.resolve(process.cwd(), "../../content");

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a date like 2026-11-26");
const isoMonth = z.string().regex(/^\d{4}-\d{2}$/, "Expected a month like 2026-01");

const nowSchema = z.object({ title: z.string().min(1), updated: isoDate });
const experienceSchema = z
  .object({
    role: z.string().min(1),
    org: z.string().min(1),
    location: z.string().min(1),
    start: isoMonth,
    end: isoMonth.optional(),
    period: z.string().min(1).optional(),
  })
  .refine((e) => !e.end || e.end >= e.start, { message: "end must not be before start" });
const essaySchema = z.object({
  title: z.string().min(1),
  date: isoDate,
  summary: z.string().min(1),
  sample: z.boolean().default(false),
});

export type Experience = z.infer<typeof experienceSchema> & {
  slug: string;
  body: string;
  status: "upcoming" | "current" | "past";
};
export type Essay = z.infer<typeof essaySchema> & { slug: string; body: string };

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function parseFrontmatter(source: string, file: string): { data: unknown; body: string } {
  const match = frontmatterPattern.exec(source);
  if (!match) throw new Error(`${file}: missing frontmatter`);
  return { data: parseYaml(match[1] ?? "") ?? {}, body: (match[2] ?? "").trim() };
}

async function loadFile<T extends z.ZodType>(relativePath: string, schema: T) {
  const file = path.join(contentDir, relativePath);
  const { data, body } = parseFrontmatter(await readFile(file, "utf8"), relativePath);
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`${relativePath}: invalid frontmatter\n${z.prettifyError(result.error)}`);
  }
  return { data: result.data as z.infer<T>, body };
}

async function listFiles(folder: string) {
  const entries = await readdir(path.join(contentDir, folder));
  return entries.filter((name) => /\.mdx?$/.test(name)).sort();
}

const slugOf = (file: string) => file.replace(/\.mdx?$/, "");

/** About page facts, also the source of the one-line summary under the home tagline. */
const aboutSchema = z.object({
  title: z.string().min(1),
  headline: z.string().min(1),
  study: z.string().min(1),
  graduating: z.string().min(1),
  based: z.string().min(1),
});

export async function getAbout() {
  return loadFile("about.md", aboutSchema);
}

export async function getNow() {
  return loadFile("now.md", nowSchema);
}

/** Month in `YYYY-MM` form for the given date, used to decide if a role is current. */
export function toMonth(date: Date) {
  return date.toISOString().slice(0, 7);
}

export function experienceStatus(
  entry: { start: string; end?: string | undefined },
  today: Date = new Date(),
): Experience["status"] {
  const month = toMonth(today);
  if (entry.start > month) return "upcoming";
  if (entry.end && entry.end < month) return "past";
  return "current";
}

export async function getExperience(today: Date = new Date()): Promise<Experience[]> {
  const files = await listFiles("experience");
  const entries = await Promise.all(
    files.map(async (file) => {
      const { data, body } = await loadFile(`experience/${file}`, experienceSchema);
      return { ...data, slug: slugOf(file), body, status: experienceStatus(data, today) };
    }),
  );
  return entries.sort((a, b) => b.start.localeCompare(a.start));
}

export type ExperienceGroup = {
  org: string;
  roles: Experience[];
  start: string;
  end: string | undefined;
  status: Experience["status"];
};

/**
 * Groups roles by company, the way LinkedIn shows several roles under one employer.
 * Companies keep the order of their newest role, and roles stay newest first.
 */
export function groupExperience(entries: Experience[]): ExperienceGroup[] {
  const groups = new Map<string, Experience[]>();
  for (const entry of entries) groups.set(entry.org, [...(groups.get(entry.org) ?? []), entry]);
  return [...groups].map(([org, roles]) => {
    const statuses = new Set(roles.map((role) => role.status));
    const ends = roles.flatMap((role) => (role.end ? [role.end] : [])).sort();
    return {
      org,
      roles,
      // Roles arrive newest first, so the last one started earliest.
      start: roles.at(-1)?.start ?? "",
      end: ends.length === roles.length ? ends.at(-1) : undefined,
      status: statuses.has("current") ? "current" : statuses.has("upcoming") ? "upcoming" : "past",
    };
  });
}

export async function getEssays(options: { includeSamples?: boolean } = {}): Promise<Essay[]> {
  const files = await listFiles("essays");
  const essays = await Promise.all(
    files.map(async (file) => {
      const { data, body } = await loadFile(`essays/${file}`, essaySchema);
      return { ...data, slug: slugOf(file), body };
    }),
  );
  return essays
    .filter((essay) => options.includeSamples !== false || !essay.sample)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getEssay(slug: string) {
  const essays = await getEssays();
  return essays.find((essay) => essay.slug === slug);
}
