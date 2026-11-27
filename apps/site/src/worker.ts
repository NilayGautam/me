// Cloudflare Worker in front of the static export in `out/`.
// Cloudflare serves the files; this sends www to the canonical host and adds security and cache headers.
import { site } from "./site";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const canonical = new URL(site.url);

export const securityHeaders: Record<string, string> = {
  "content-security-policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "strict-transport-security": "max-age=63072000; includeSubDomains",
  "cross-origin-opener-policy": "same-origin",
};

function cacheControl(pathname: string): string | undefined {
  // Next.js puts a content hash in every file name under /_next/static/.
  if (pathname.startsWith("/_next/static/")) return "public, max-age=31536000, immutable";
  if (pathname.startsWith("/images/")) return "public, max-age=604800";
  return undefined;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === `www.${canonical.hostname}`) {
      return Response.redirect(`${canonical.origin}${url.pathname}${url.search}`, 301);
    }

    const asset = await env.ASSETS.fetch(request);
    const response = new Response(asset.body, asset);
    for (const [name, value] of Object.entries(securityHeaders)) {
      response.headers.set(name, value);
    }
    const cache = response.ok ? cacheControl(url.pathname) : undefined;
    if (cache) response.headers.set("cache-control", cache);
    return response;
  },
};
