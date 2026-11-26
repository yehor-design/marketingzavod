import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.resetModules();
});

async function loadSeoRoutes() {
  vi.resetModules();
  const [{ default: robots }, { default: sitemap }, { ALLOW_INDEXING }] = await Promise.all([
    import("@/app/robots"),
    import("@/app/sitemap"),
    import("@/lib/site"),
  ]);
  return { robots, sitemap, ALLOW_INDEXING };
}

describe("search indexing gate", () => {
  it("hides the site from crawlers by default even on production", async () => {
    process.env.NEXT_PUBLIC_SITE_ENV = "production";
    delete process.env.NEXT_PUBLIC_ALLOW_INDEXING;

    const { robots, sitemap, ALLOW_INDEXING } = await loadSeoRoutes();
    expect(ALLOW_INDEXING).toBe(false);
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    expect(sitemap()).toEqual([]);
  });

  it("never enables indexing outside production even if the opt-in flag is set", async () => {
    process.env.NEXT_PUBLIC_SITE_ENV = "preview";
    process.env.NEXT_PUBLIC_ALLOW_INDEXING = "true";

    const { robots, sitemap, ALLOW_INDEXING } = await loadSeoRoutes();
    expect(ALLOW_INDEXING).toBe(false);
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    expect(sitemap()).toEqual([]);
  });

  it("exposes robots rules and all public URLs when explicitly enabled in production", async () => {
    process.env.NEXT_PUBLIC_SITE_ENV = "production";
    process.env.NEXT_PUBLIC_ALLOW_INDEXING = "true";

    const { robots, sitemap, ALLOW_INDEXING } = await loadSeoRoutes();
    expect(ALLOW_INDEXING).toBe(true);
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/dev/", "/checkout"] },
      sitemap: "https://www.marketingzavod.com/sitemap.xml",
      host: "https://www.marketingzavod.com/",
    });

    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(urls).toContain("https://www.marketingzavod.com/");
    expect(urls).toContain("https://www.marketingzavod.com/pricing");
    expect(urls.some((url) => url.includes("/blog/"))).toBe(true);
    expect(urls.some((url) => url.includes("/updates/"))).toBe(true);
    expect(urls.some((url) => url.includes("/careers/"))).toBe(true);
    expect(urls.some((url) => /\/checkout|\/dev\//.test(url))).toBe(false);
  });
});
