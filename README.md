# me

Source for [nilaygautam.com](https://nilaygautam.com).

The plan lives in [`spec/`](spec): [Mission](spec/Mission.md), [Tech](spec/Tech.md), and [Roadmap](spec/Roadmap.md).

## Develop

Requires Node 24 and pnpm 12.

```sh
pnpm install
pnpm dev          # http://localhost:3000
```

## Edit content

- `content/about.md`, `content/now.md`: About page and the Now section.
- `content/experience/*.md`: one file per role.
- `content/essays/*.mdx`: essays.
- `apps/site/src/site.ts`: name, hero sentence, email, and links.

## Check

```sh
pnpm lint         # Biome
pnpm typecheck
pnpm test         # Vitest
pnpm e2e          # build, then Playwright
```

## Deploy

Pushes to `main` run CI, then deploy to Azure Static Web Apps.
First-time setup is in [`docs/deploy.md`](docs/deploy.md).
