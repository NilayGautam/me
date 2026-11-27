# Tech

## Guiding choices

- Pick tools that are widely asked for in job listings, leaning slightly toward the modern option when the gap is small.
- Favor quality, simplicity, and long term maintainability over development speed.
- Nothing runs 24/7.
  Every server-side workload must scale to zero.

## Stack

| Layer                  | Choice                                                 |
| ---------------------- | ------------------------------------------------------ |
| Language               | TypeScript (strict)                                    |
| Main site framework    | Next.js (App Router, React 19, static export)          |
| Styling                | Tailwind CSS v4                                        |
| Motion                 | CSS scroll-driven animations, no JavaScript            |
| Writing                | MDX files in the repo                                  |
| Fonts                  | Geist Sans and Geist Mono, self-hosted via `next/font` |
| Package manager        | pnpm                                                   |
| Monorepo               | pnpm workspaces and Turborepo                          |
| Lint and format        | Biome                                                  |
| Unit tests             | Vitest                                                 |
| E2E tests              | Playwright                                             |
| Project APIs           | Hono, unless a project needs something else            |
| ORM                    | Drizzle, only when a project needs a database          |
| Containers             | Docker                                                 |
| Infrastructure as code | Terraform                                              |
| CI/CD                  | GitHub Actions                                         |
| Site hosting           | Cloudflare Workers static assets, free plan            |
| Project cloud          | Azure, paid for by the Azure for Students credit       |
| DNS and registrar      | Cloudflare                                             |

## Repo layout

```
me/
  apps/
    site/              # nilaygautam.com, Next.js static export
  projects/
    <name>/            # one folder per project, each with its own Dockerfile
  packages/
    ui/                # shared design tokens and components
    config/            # shared TypeScript and Biome config
  content/             # site copy and essays as Markdown/MDX
  infra/               # Terraform for Azure project resources (Phase 4)
  spec/                # this constitution
  .github/workflows/   # CI and deploys
```

Projects may use any stack inside their folder, as long as they ship as a container.

## Hosting architecture

### Main site

- **Cloudflare Workers static assets, free plan.**
  Always free, includes custom domains and managed SSL, and does not depend on being a student.
- Azure Static Web Apps was the first plan, but the Azure for Students subscription only allows a few European regions and Static Web Apps is not offered in any of them.
- Next.js builds with `output: "export"` to plain static files.
- `apps/site/wrangler.jsonc` defines the Worker and its custom domains.
- `nilaygautam.com` is the canonical host.
  `www.nilaygautam.com` redirects to it with a 301 from `apps/site/src/worker.ts`.

### Projects

- **Azure Container Apps, Consumption plan**, one Container App per project in a single shared environment.
- Everything Azure goes in a region the subscription allows, currently Sweden Central.
- `minReplicas = 0` on every app.
  Cold starts of a few seconds are an accepted tradeoff.
- Each project gets its own subdomain, `<name>.nilaygautam.com`, with a free Azure managed certificate.
- Images are stored in **GitHub Container Registry (ghcr.io)**, not Azure Container Registry, because ACR Basic costs money every month.
- Data, only when needed, in this order of preference: SQLite inside the container or Azure Storage, the Cosmos DB free tier, then anything paid as a last resort.

### DNS

- DNS stays on Cloudflare.
- Records pointing at Azure start as **DNS only** (not proxied) so Azure domain validation and certificate issuance succeed.
- The apex and `www` records are created and owned by the Worker's custom domains.
- `hello@nilaygautam.com` uses Cloudflare Email Routing, which is free and forwards to my personal inbox.

### Cost guardrails

- An Azure budget with alerts at 50%, 80%, and 100% of the monthly share of the credit.
- No VMs, no always-on databases, and no GPU workloads.
- Container Apps logging set to minimal retention, because Log Analytics ingestion is billed.
- Terraform state in a small Azure Storage account.
- Everything stays portable.
  Standard containers and static files can move to another cloud when the student credit ends.

## CI/CD

- Every pull request runs Biome, type checks, Vitest, a build, and Playwright against the built site.
- Merging to `main` deploys the site to Cloudflare Workers with `wrangler deploy`.
- Changes to a project folder build its image, push it to ghcr.io, and roll out its Container App.
- Changes to `infra/` run `terraform plan` on PRs and `terraform apply` on `main`.
- GitHub Actions authenticates to Azure with OIDC federated credentials on a user-assigned managed identity, because the university directory blocks app registrations.
  No long-lived Azure secrets.
- The Cloudflare API token is a secret on the `production` environment, which only `main` can use.

## Quality bars

- **Performance:** Lighthouse performance of at least 95 on simulated mobile, enforced in CI.
  LCP under 1 second on a fast connection.
  No JavaScript beyond the Next.js runtime unless a feature truly needs it.
  Content is never hidden behind JavaScript, so animations must not delay the first paint.
- **Lighthouse:** 100 in accessibility, best practices, and SEO on every indexed page.
- **Accessibility:** WCAG 2.2 AA, full keyboard navigation, visible focus states, `prefers-reduced-motion` respected.
- **SEO and sharing:** per-page metadata, Open Graph images, a sitemap, and RSS.
- **Design system:** colors, spacing, and type scale come only from tokens in `packages/ui`.
- **Zero tolerance:** no lint warnings, no failing or flaky tests on `main`.
