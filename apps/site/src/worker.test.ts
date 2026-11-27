import { describe, expect, it, vi } from "vitest";
import worker from "./worker";

function env() {
  return { ASSETS: { fetch: vi.fn(async () => new Response("asset")) } };
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
});
