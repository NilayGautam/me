import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/about/", "/experience/", "/essays/", "/essays/sample-essay/", "/wip/"];

test.describe("home", () => {
  test("shows the hero, projects, and now", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Nilay Gautam");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Nilay\s*Gautam/);
    await expect(
      page.getByText("Always learning, solving, building, and loving it."),
    ).toBeVisible();
    await expect(page.getByRole("img", { name: /Nilay Gautam/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "#contact");
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
    await expect(page.getByText(/I'm a senior studying computer science/)).toBeVisible();
  });

  test("placeholder project leads to the work in progress page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Research script builder/ }).click();
    await expect(page).toHaveURL("/wip/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Still being built.");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});

test.describe("contact", () => {
  test("hero Contact button jumps to the footer contact line", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("clicking the email copies it to the clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/about/");
    const button = page.getByRole("button", { name: "Copy email address hello@nilaygautam.com" });
    await button.click();
    await expect(page.getByText("Email address copied")).toBeAttached();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("hello@nilaygautam.com");
  });
});

test.describe("navigation", () => {
  test("header home link reads Home on the home page and the name elsewhere", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByRole("banner");
    await expect(banner.getByRole("link").first()).toHaveText("Home");
    await expect(banner.getByRole("link").first()).toHaveAttribute("href", "/");

    await page.goto("/experience/");
    await expect(banner.getByRole("link").first()).toHaveText("Nilay Gautam");
    await banner.getByRole("link", { name: "Nilay Gautam" }).click();
    await expect(page).toHaveURL("/");
    await expect(banner.getByRole("link").first()).toHaveText("Home");
  });

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

  test("footer shows the contact email and links to GitHub and LinkedIn", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByText("Contact:")).toBeVisible();
    await expect(footer.getByText("hello@nilaygautam.com")).toBeVisible();
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
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

test("experience groups roles by company, newest first", async ({ page }) => {
  await page.goto("/experience/");
  // Each company is a heading named by its logo's alt text, with its roles as subheadings.
  const companies = page.getByRole("heading", { level: 2 });
  await expect(companies).toHaveCount(2);
  await expect(companies.nth(0).getByRole("img")).toHaveAccessibleName(
    "Sub-Zero Group: Wolf, Sub-Zero, and Cove",
  );
  await expect(companies.nth(1).getByRole("img")).toHaveAccessibleName("Iowa State University");
  await expect(page.getByRole("heading", { level: 3 })).toHaveText([
    "Data Governance Co-op",
    "Research Assistant",
    "Teaching Assistant",
  ]);
  const iowaState = page
    .getByRole("article")
    .filter({ has: page.getByAltText("Iowa State University") });
  await expect(iowaState.getByText("Oct 2025 - May 2026")).toBeVisible();
  await expect(iowaState.getByText("Jan 2026 - Present")).toBeVisible();
  await expect(iowaState.getByText("1 yr", { exact: false })).toBeVisible();

  // An upcoming company shows its dates and tag, but no time there yet.
  const subZero = page.getByRole("article").filter({ has: page.getByAltText(/Sub-Zero Group/) });
  await expect(subZero.getByText("Jan 2027 - Aug 2027")).toBeVisible();
  await expect(subZero.getByText("Upcoming")).toBeVisible();
  await expect(subZero.getByText(/\b\d+ (mos?|yrs?)\b/)).toHaveCount(0);
});

test("sample essay is listed, readable, and kept out of the sitemap", async ({ page, request }) => {
  await page.goto("/essays/");
  await page.getByRole("link", { name: /A sample essay/ }).click();
  await expect(page).toHaveURL("/essays/sample-essay/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A sample essay");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

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

const sharePreviews = [
  { path: "/", title: "Nilay Gautam", type: "website", image: "/og.png" },
  { path: "/about/", title: "About me | Nilay Gautam", type: "website", image: "/og.png" },
  { path: "/experience/", title: "Experience | Nilay Gautam", type: "website", image: "/og.png" },
  { path: "/essays/", title: "Essays | Nilay Gautam", type: "website", image: "/og.png" },
  {
    path: "/essays/sample-essay/",
    title: "A sample essay",
    type: "article",
    image: "/essays/sample-essay/og.png",
  },
  { path: "/wip/", title: "Work in progress | Nilay Gautam", type: "website", image: "/og.png" },
];

for (const preview of sharePreviews) {
  test(`${preview.path} has its own share preview`, async ({ page }) => {
    await page.goto(preview.path);
    const og = (property: string) => page.locator(`meta[property="og:${property}"]`);
    const url = `https://nilaygautam.com${preview.path}`;
    await expect(og("url")).toHaveAttribute("content", url);
    await expect(og("title")).toHaveAttribute("content", preview.title);
    await expect(og("type")).toHaveAttribute("content", preview.type);
    await expect(og("site_name")).toHaveAttribute("content", "Nilay Gautam");
    await expect(og("locale")).toHaveAttribute("content", "en_US");
    await expect(og("image")).toHaveAttribute("content", `https://nilaygautam.com${preview.image}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", url);
  });
}
