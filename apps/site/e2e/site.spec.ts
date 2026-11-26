import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/about/", "/experience/", "/essays/", "/essays/sample-essay/", "/wip/"];

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("disables scroll reveals so content is fully visible", async ({ page }) => {
    await page.goto("/experience/");
    const opacities = await page
      .locator("[data-reveal]")
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
    expect(opacities.length).toBeGreaterThan(0);
    expect(opacities.every((o) => o === "1")).toBe(true);
  });
});

test.describe("home", () => {
  test("shows the hero, projects, and now", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Nilay Gautam");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Nilay\s*Gautam/);
    await expect(
      page.getByText("Always learning, solving, building, and loving it."),
    ).toBeVisible();
    await expect(page.getByRole("img", { name: /Nilay Gautam/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "mailto:hello@nilaygautam.com",
    );
    await expect(page.getByRole("region", { name: "Projects" })).toBeAttached();
    await expect(page.getByRole("region", { name: "Now" })).toContainText(
      "Replacing myself at my research job.",
    );
  });

  test("About button opens the about page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "About me" }).click();
    await expect(page).toHaveURL("/about/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("About me");
    await expect(page.getByText("I'm Nilay Gautam.")).toBeVisible();
  });

  test("placeholder project leads to the work in progress page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /First project/ }).click();
    await expect(page).toHaveURL("/wip/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Still being built.");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});

test.describe("navigation", () => {
  test("top nav reaches experience and essays and marks the current page", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav.getByRole("link")).toHaveText(["Experience", "Essays"]);

    await nav.getByRole("link", { name: "Experience" }).click();
    await expect(page).toHaveURL("/experience/");
    await expect(nav.getByRole("link", { name: "Experience" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await nav.getByRole("link", { name: "Essays" }).click();
    await expect(page).toHaveURL("/essays/");
    await expect(nav.getByRole("link", { name: "Essays" })).toHaveAttribute("aria-current", "page");
  });

  test("footer links to email, GitHub, and LinkedIn", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:hello@nilaygautam.com",
    );
    await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/NilayGautam/",
    );
    await expect(footer.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/1nilay/",
    );
  });
});

test("experience lists every role, newest first", async ({ page }) => {
  await page.goto("/experience/");
  await expect(page.getByRole("heading", { level: 2 })).toHaveText([
    "Data Governance Co-op",
    "Research Assistant",
    "Teaching Assistant",
  ]);
});

test("sample essay is listed, readable, and kept out of feeds", async ({ page, request }) => {
  await page.goto("/essays/");
  await page.getByRole("link", { name: /A sample essay/ }).click();
  await expect(page).toHaveURL("/essays/sample-essay/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A sample essay");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  const rss = await (await request.get("/rss.xml")).text();
  expect(rss).toContain("<channel>");
  expect(rss).not.toContain("sample-essay");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("sample-essay");
  expect(sitemap).not.toContain("/wip");
});

test("unknown pages show the 404 page", async ({ page }) => {
  const response = await page.goto("/does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found.");
});

for (const path of pages) {
  test(`${path} has no accessibility violations or horizontal overflow`, async ({ page }) => {
    // Reduced motion keeps every scroll reveal at full opacity, so contrast is measured on final colors.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}
