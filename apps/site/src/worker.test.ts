import { describe, expect, it, vi } from "vitest";
import worker from "./worker";

function env(status = 200) {
  return {
    ASSETS: {
      fetch: vi.fn(
        async () => new Response("asset", { status, headers: { "content-type": "text/html" } }),
      ),
    },
  };
}

describe("worker", () => {
  it("redirects www to the apex, keeping the path and query", async () => {
    const assets = env();
    const response = await worker.fetch(
      new Request("https://www.nilaygautam.com/essays/hello/?ref=x"),
      assets,
    );

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe("https://nilaygautam.com/essays/hello/?ref=x");
    expect(assets.ASSETS.fetch).not.toHaveBeenCalled();
  });

  it("serves static assets on the apex", async () => {
    const assets = env();
    const request = new Request("https://nilaygautam.com/about/");
    const response = await worker.fetch(request, assets);

    expect(await response.text()).toBe("asset");
    expect(assets.ASSETS.fetch).toHaveBeenCalledWith(request);
  });

  it("adds security headers to every asset, including 404s", async () => {
    for (const status of [200, 404]) {
      const response = await worker.fetch(new Request("https://nilaygautam.com/"), env(status));

      expect(response.status).toBe(status);
      expect(response.headers.get("content-type")).toBe("text/html");
      expect(response.headers.get("content-security-policy")).toContain("default-src 'self'");
      expect(response.headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
      expect(response.headers.get("x-content-type-options")).toBe("nosniff");
      expect(response.headers.get("strict-transport-security")).toContain("max-age=");
    }
  });

  it("caches hashed build files for a year and leaves pages to revalidate", async () => {
    const built = await worker.fetch(
      new Request("https://nilaygautam.com/_next/static/chunks/app-1a2b3c.js"),
      env(),
    );
    const page = await worker.fetch(new Request("https://nilaygautam.com/about/"), env());
    const missing = await worker.fetch(
      new Request("https://nilaygautam.com/_next/static/chunks/gone.js"),
      env(404),
    );

    expect(built.headers.get("cache-control")).toBe("public, max-age=31536000, immutable");
    expect(page.headers.get("cache-control")).toBeNull();
    expect(missing.headers.get("cache-control")).toBeNull();
  });
});
