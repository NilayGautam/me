# Mission

## Why this exists

nilaygautam.com is my home on the internet.
It is a short, honest introduction to who I am and a place where my projects actually run, not just screenshots of them.
Anyone who lands here should understand who I am in under ten seconds and be one click away from using something I built.

## Who it is for

- Recruiters and hiring managers deciding whether to talk to me.
- Engineers who want to see how I think and build.
- Friends, collaborators, and anyone curious about what I am working on.

## Voice

All copy is in the first person.
Site copy lives in `content/`: `about.md`, `now.md`, one file per role in `experience/`, and essays in `essays/`.
The name, hero sentence, email, and links live in `apps/site/src/site.ts`.

## Structure

### Home (`/`)

One page that reads top to bottom:

1. **Hero.**
   A photo of me, my name, and one short sentence.
   Two buttons sit under the sentence: **About** and **Contact**.
2. **Projects.**
   A slight scroll below the hero.
   Each project shows a name, a one-line description, and a link to where it runs.
3. **Now.**
   The last section of the page.
   What I am focused on right now, with the date it was last updated.

### Top nav

- **Experience**
- **Essays**

About is not in the nav.
It is reached from the button in the hero.

### Pages

| Page             | Path             | Purpose                                                                                   |
| ---------------- | ---------------- | ----------------------------------------------------------------------------------------- |
| Home             | `/`              | Hero, projects, and Now.                                                                  |
| About            | `/about`         | A paragraph about me.                                                                     |
| Experience       | `/experience`    | A list of my experiences that works as a live resume. No PDF and no separate resume page. |
| Essays           | `/essays`        | A dated list of essays, with an RSS feed at `/rss.xml`.                                   |
| Essay            | `/essays/<slug>` | A single essay.                                                                           |
| Work in progress | `/wip`           | Where placeholder project links lead until real projects ship.                            |

### Contact

- The **Contact** button in the hero opens an email to me.
- The footer on every page lists email, GitHub, and LinkedIn.
- No contact form.

### Projects

Each project runs live on its own subdomain, for example `project.nilaygautam.com`.
Until the first project ships, the projects section shows a placeholder card that links to `/wip`.

### Photo

The hero photo is `apps/site/assets/portrait-source.jpg`, a 4:5 crop of my beach photo with my dogs, with location metadata stripped.
Run `pnpm --filter @nilaygautam/site images` after replacing it.
A portrait without a cap and sunglasses may replace it later.

## Design direction

Heavily inspired by devrev.ai and amargautam.com.

- **Minimalist and not slop.**
  Every element earns its place.
  No stock illustrations, no gradient blobs, no generic AI-template hero, no filler copy.
- **Dark only.**
  One carefully tuned dark theme, near-black background, off-white text, a single restrained accent.
- **Bold typography.**
  Large, confident headlines in a geometric grotesk.
  Typography does the work that imagery does on other sites.
- **Grid and technical feel.**
  Thin rules, visible structure, mono labels for metadata like dates, tags, and section numbers.
- **Subtle motion.**
  Small reveals and hover states that feel precise, never decorative.
  All motion respects `prefers-reduced-motion`.
- **Text-first layout.**
  A single readable column for content, with the grid used for structure, not clutter.
- **Pixel perfect.**
  Alignment, spacing, and type scale follow a system with no one-off values.

## Principles

- **Real over pretend.**
  A project is only listed when it runs.
- **Fast by default.**
  The site should feel instant on a slow phone.
- **Owned content.**
  Writing lives as files in this repo, not in a third-party platform.
- **Cheap to keep alive.**
  Nothing runs 24/7.
  Projects scale to zero when no one is using them.
- **Modern, employable craft.**
  The codebase itself is a portfolio piece and uses tools that teams hire for.

## Non-goals

- No CMS, no admin panel, no comments.
- No analytics that need a cookie banner.
- No email newsletter in v1.
  RSS is enough.
- No light mode.

## Success looks like

- A visitor can name who I am and what I do after one screen.
- Every listed project opens and works from its subdomain.
- Lighthouse scores of 100 for accessibility, best practices, and SEO, and at least 95 for performance on simulated mobile.
- Monthly Azure spend stays within the student credit.
