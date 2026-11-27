# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences carry equal weight, and no single one leads:

- Recruiters and hiring managers deciding whether to reach out to Nilay.
- Engineers judging how Nilay thinks and builds.
- Friends, collaborators, and curious visitors checking what Nilay is working on.

Each should be able to say who Nilay is within one screen and reach real work in one click.

## Product Purpose

nilaygautam.com is Nilay Gautam's personal site: a short introduction, a live list of projects, a running record of experience, and essays.
Its job is to show the person and let visitors use the work directly.
Success means a visitor understands who Nilay is from the first screen, every listed project opens and works, and the site stays fast and cheap to run.

## Positioning

The projects are not screenshots or repo links.
Each one runs live on its own subdomain (`<name>.nilaygautam.com`), and the work it shows is tools that automate real jobs for non-technical people, including Nilay's own.
The current example is a research tool meant to replace Nilay's own role by turning a professor's inputs and desired outputs into a script that does the work.

## Operating Context

- Nilay is a senior in computer science at Iowa State University, graduating in fall 2027.
- Current role: research assistant at Iowa State, building a reusable data-matching pipeline (fuzzy and lexical matching, then JEV, a decision model by Typesafe).
- Upcoming: Data Governance co-op at Sub-Zero Group in Madison, WI, spring and summer 2027.
- Past: teaching assistant for a new graduate Supply Chain Analytics course (SCM 5300).
- Visitors mostly arrive from applications, LinkedIn, and GitHub, on desktop and phone.

## Capabilities and Constraints

- Pages: home (hero, projects, Now), About (reached from a hero button, not the nav), Experience, Essays with RSS, and a work-in-progress page.
- Top nav holds only Experience and Essays.
- Contact: the footer shows "Contact: hello@nilaygautam.com", and clicking the address copies it. The hero Contact button jumps to that line. No mailto links and no contact form.
- No copyright line: copyright applies automatically without a notice.
- Experience is a live resume written as paragraphs. No PDF and no resume page.
- Projects run on Azure Container Apps that scale to zero, so a cold start of a few seconds is accepted. Nothing runs 24/7.
- The main site is a static export on Cloudflare Workers. DNS and email are on Cloudflare too.
- Stack and engineering rules live in `spec/Tech.md`. Copy lives in `content/` and `apps/site/src/site.ts`.
- No CMS, no comments, no cookie-banner analytics, and no newsletter in v1.
- Undecided: the first real project, the first real essay, and the personal line in About.

## Brand Commitments

- Name: Nilay Gautam. Domain: nilaygautam.com.
- Hero sentence: "Always learning, solving, building, and loving it."
- All copy is in the first person.
- The user set these visual constraints as binding: minimalist and not slop, dark only, and heavily inspired by devrev.ai and amargautam.com.

## Evidence on Hand

- Hero photo: `apps/site/assets/portrait-source.jpg`, showing Nilay on a beach with two beagles.
- Copy: `content/about.md` (placeholder), `content/now.md`, and `content/experience/*.md` (three roles).
- Essays: only `content/essays/sample-essay.mdx`, a format sample marked `sample: true`.
- Projects: none shipped yet. The home page shows one placeholder that links to `/wip`.
- No testimonials, metrics, press, or logos exist. Do not invent them.

## Product Principles

1. Real over pretend: list a project only when it runs, and label placeholders as placeholders.
2. Show the person first, then the work, then the record.
3. Fast by default and cheap to keep alive.
4. The codebase is a portfolio piece too, built with tools teams hire for.
5. Owned content: writing lives as files in the repo.

## Accessibility & Inclusion

- WCAG 2.2 AA, full keyboard navigation, and visible focus states.
- `prefers-reduced-motion` is respected, and content is never hidden behind JavaScript or animation.
