// Cloudflare Worker in front of the static export in `out/`.
// Cloudflare serves the files; this only sends www to the canonical host.
import { site } from "./site";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const canonical = new URL(site.url);

export default {
  fetch(request: Request, env: Env): Response | Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === `www.${canonical.hostname}`) {
      return Response.redirect(`${canonical.origin}${url.pathname}${url.search}`, 301);
    }

    return env.ASSETS.fetch(request);
  },
};
