import { expect, test } from "@playwright/test";

test.describe("bg edition Cyrillic fonts (DS-A2, DS-A3)", () => {
  test("loads Google Sans Cyrillic and uses JetBrains Mono for eyebrow elements", async ({
    page,
  }) => {
    const fontResponses: Array<{ url: string; status: number }> = [];
    page.on("response", (response) => {
      const url = response.url();
      if (url.endsWith(".woff2") || url.includes("/_next/static/media/")) {
        fontResponses.push({ url, status: response.status() });
      }
    });

    await page.goto("/dev/styleguide", { waitUntil: "load" });
    await expect(page.locator("html")).toHaveAttribute("lang", "bg");
    await expect(page.locator("html")).toHaveAttribute("data-edition", "bg");

    const specimen = page.locator("#bg-typography-specimen");
    await expect(specimen).toBeVisible();

    const fontCheck = await page.evaluate(async () => {
      await document.fonts.ready;
      const bodyFamily = getComputedStyle(document.body).fontFamily;
      const primarySans = bodyFamily.split(",")[0]?.trim() ?? "";
      const eyebrow = document.querySelector<HTMLElement>(
        "#bg-typography-specimen [data-bg-eyebrow]",
      );
      const eyebrowFamily = eyebrow ? getComputedStyle(eyebrow).fontFamily : "";
      const primaryMono = eyebrowFamily.split(",")[0]?.trim() ?? "";

      const loadedFaces = Array.from(document.fonts)
        .filter((face) => face.status === "loaded")
        .map((face) => ({ family: face.family, unicodeRange: face.unicodeRange }));

      return {
        bodyFamily,
        eyebrowFamily,
        sansCheck: document.fonts.check(`16px ${primarySans}`, "Жщъ"),
        googleSansCheck:
          document.fonts.check('16px "Google Sans"', "Жщъ") ||
          document.fonts.check(`16px ${primarySans}`, "Жщъ"),
        monoCheck: document.fonts.check(`12px ${primaryMono}`, "Жщъ"),
        loadedFaces,
      };
    });

    expect(fontCheck.bodyFamily).toMatch(/Google[\s_]Sans/i);
    expect(fontCheck.sansCheck).toBe(true);
    expect(fontCheck.googleSansCheck).toBe(true);
    expect(fontCheck.eyebrowFamily).toMatch(/JetBrains[\s_]Mono/i);
    expect(fontCheck.monoCheck).toBe(true);

    // At least one loaded font face covers Cyrillic (U+0400–04FF)
    const hasCyrillicFace = fontCheck.loadedFaces.some((face) =>
      /U\+0?4[0-9a-f]{2}|U\+0301/i.test(face.unicodeRange),
    );
    expect(hasCyrillicFace, JSON.stringify(fontCheck.loadedFaces)).toBe(true);

    const woffResponses = fontResponses.filter((item) => item.status === 200);
    expect(woffResponses.length).toBeGreaterThan(0);
  });
});
