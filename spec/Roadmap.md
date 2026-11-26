# Roadmap

v1 is Phases 0 to 3: the main site, live on nilaygautam.com, with placeholders where projects and essays will go.
No Azure credit is spent in v1, because Static Web Apps is free.

## Phase 0: Foundations

- [ ] Activate Azure for Students with my school email.
- [x] Set up the monorepo with pnpm workspaces, Turborepo, Biome, and strict TypeScript.
- [x] Add a CI workflow for lint, type checks, tests, and build.
- [x] Write Terraform for the resource group, budget alerts, Terraform state storage, and the Static Web App.
- [ ] Set up GitHub Actions OIDC access to Azure.

## Phase 1: Design system

- [x] Define tokens: dark palette, type scale, spacing, grid, borders, motion timings.
- [x] Self-host Geist Sans and Geist Mono.
- [x] Build core components: layout grid, header, footer, link, section label, list item, project card.
- [x] Define the motion primitives: reveal on scroll and hover states, with reduced-motion fallbacks.

## Phase 2: Main site v1

- [x] Write the short hero sentence in my own words.
- [x] Crop and optimize the hero photo.
- [x] Home page: hero with photo, name, sentence, and About and Contact buttons, then projects, then Now at the bottom.
- [x] Placeholder project card that links to the `/wip` page.
- [x] Top nav with Experience and Essays.
- [x] About page with a paragraph about me.
- [x] Experience page as a live resume.
- [x] Essays index and MDX essay pages with an RSS feed.
- [x] One placeholder essay that shows the essay page format, kept out of RSS and the sitemap.
- [x] Footer with email, GitHub, and LinkedIn.
- [x] Metadata, Open Graph images, sitemap, and a 404 page.
- [x] Playwright E2E tests for every page, plus a Lighthouse check in CI.

## Phase 3: Launch

- [ ] Point `nilaygautam.com` and `www` at Static Web Apps through Cloudflare DNS.
- [ ] Verify SSL, the redirects, and Lighthouse scores in production.

## Phase 4: Project platform (after v1)

- [ ] Write Terraform for the Container Apps environment, with scale to zero by default.
- [ ] Add a reusable GitHub Actions workflow that builds a project image, pushes it to ghcr.io, and deploys it.
- [ ] Ship a small hello-world project on a subdomain to prove the whole path end to end.
- [ ] Add a template for new projects: Dockerfile, health check, README, and project metadata for the site.

## Phase 5: Projects

- [ ] Ship real projects one at a time, each on its own subdomain.
- [ ] Each real project replaces the placeholder card on the home page.
- [ ] Publish the first real essay and remove the placeholder essay.

## Later

- An email newsletter, if writing takes off.
- Privacy-friendly analytics that need no cookie banner.
- A plan for moving off the student credit after graduation.
