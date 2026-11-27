# Deploy

The site is a static export served by a Cloudflare Worker on `nilaygautam.com`.
Merging to `main` runs CI, then deploys with `wrangler deploy` from `apps/site`.

## How it fits together

- `apps/site/wrangler.jsonc` defines the Worker, the static files it serves from `out/`, and the `nilaygautam.com` and `www.nilaygautam.com` custom domains.
- Custom domains create their own DNS records and certificates, so there is nothing to set up in the DNS dashboard.
- `apps/site/src/worker.ts` redirects `www` to the apex with a 301, serves every other request from the static files, and adds the security and cache headers described in [`spec/Tech.md`](../spec/Tech.md#main-site).
- CI runs `wrangler deploy --dry-run` on every pull request, so a broken Worker config fails before it reaches `main`.

## One-time setup

This is already done for the live site.
It is here in case the token or the account ever changes.

1. Create a Cloudflare API token from the **Edit Cloudflare Workers** template.
   Scope it to your account and to the `nilaygautam.com` zone, and add **DNS: Edit**.
2. Save it as a secret on the `production` environment, pasting the token when asked:

   ```sh
   gh secret set CLOUDFLARE_API_TOKEN --env production --repo NilayGautam/me
   ```

3. The `production` environment only allows deployments from `main`, so other branches cannot read the token.
4. If the Cloudflare account changes, update `account_id` in `apps/site/wrangler.jsonc`.
5. In Cloudflare DNS, there must be no existing `A`, `AAAA`, or `CNAME` records for `nilaygautam.com` or `www`, or the custom domains cannot attach.
   Leave the `MX` and `TXT` records that Email Routing uses alone.

## Deploy by hand

```sh
gh workflow run deploy-site.yml
```

## Verify

```sh
curl -I https://nilaygautam.com                  # 200
curl -I https://www.nilaygautam.com/about/       # 301 to https://nilaygautam.com/about/
curl -I https://nilaygautam.com/missing/         # 404 with the site's 404 page
```

Send a test email to hello@nilaygautam.com to confirm Email Routing still works.

## Why not Azure

The Azure for Students subscription only allows a few European regions, and Azure Static Web Apps is not offered in any of them.
The university directory also blocks the app registration that GitHub Actions would use to sign in.
The site should also keep working after the student credit ends, so it lives on Cloudflare's free plan.
Azure is still the plan for projects, which run in an allowed region on their own subdomains.
