import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { COMPANY } from "@/content/bg/company";
import { BG_DRAFTS } from "@/content/bg/drafts";
import { BG_FOOTER, getPublishedBgFooterColumns } from "@/content/bg/navigation";
import { bgUi } from "@/content/bg/ui";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("BG 4-column footer (GL-08..GL-12, DS-23, GL-A3)", () => {
  for (const width of [1440, 1024, 390] as const) {
    test(`renders 4 verbatim columns, Varna + mailto only, legal line, LinkedIn only, and passes axe at ${width}px`, async ({
      page,
    }) => {
      const publishedColumns = getPublishedBgFooterColumns();

      await page.setViewportSize({ width, height: 900 });
      await page.goto("/blog", { waitUntil: "load" });

      // Dismiss consent banner if visible so it does not cover footer controls during interaction
      const necessaryOnly = page.locator("[data-consent-banner]").getByRole("button", {
        name: bgUi.consent.necessaryOnly,
      });
      if (await necessaryOnly.isVisible()) {
        await necessaryOnly.click();
      }

      const footer = page.locator("footer.site-footer");
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();

      // Logo link + tagline under logo
      const logo = footer.locator("a.footer-logo");
      await expect(logo).toHaveAttribute("href", "/");
      await expect(logo).toHaveAttribute("aria-label", bgUi.footer.logoAria);
      await expect(footer).toContainText(COMPANY.tagline);

      // 4 columns in exact file 01 order
      const columns = footer.locator("[data-footer-column]");
      await expect(columns).toHaveCount(4);
      for (let i = 0; i < publishedColumns.length; i += 1) {
        const expectedCol = publishedColumns[i];
        const col = columns.nth(i);
        await expect(col.locator(".footer-title")).toHaveText(expectedCol.title);

        for (const item of expectedCol.items) {
          if (item.kind === "text") {
            await expect(col).toContainText(item.text);
          } else {
            const link = col.locator(`a[href="${item.href}"]`);
            await expect(link).toBeVisible();
            await expect(link).toContainText(item.label);
          }
        }
      }

      // Closed gate item hidden
      await expect(footer).not.toContainText("Хотели");

      // Contact column: Varna text + mailto only (no tel:/phone/Viber)
      const contactCol = footer.locator('[data-footer-column="contact"]');
      await expect(contactCol).toContainText(COMPANY.meetingsLine);
      await expect(contactCol.locator(`a[href="${COMPANY.emailHref}"]`)).toContainText(
        COMPANY.email,
      );
      await expect(contactCol.locator('a[href^="tel:"]')).toHaveCount(0);
      await expect(contactCol).not.toContainText(/viber/i);

      // Legal column: 3 legal links + consent settings button (reopens own consent panel)
      const legalCol = footer.locator('[data-footer-column="legal"]');
      const cookieBtn = legalCol.getByRole("button", { name: bgUi.consent.cookieSettingsButton });
      await expect(cookieBtn).toBeVisible();

      // Temporary individual-trader requisites line + copyright, zero placeholders or Jet leaks
      await expect(footer).toContainText(COMPANY.footerLegalLine);
      await expect(footer).toContainText(COMPANY.copyright);
      const footerText = await footer.innerText();
      expect(footerText).not.toMatch(/[\[\]]/);
      expect(footerText).not.toContain("Jet");
      expect(footerText).not.toContain("HIRING");

      // Only founder LinkedIn in socials
      const socialAnchors = footer.locator("ul.socials a");
      await expect(socialAnchors).toHaveCount(1);
      await expect(socialAnchors.first()).toHaveAttribute("href", BG_FOOTER.socials[0].href);
      await expect(socialAnchors.first()).toHaveAttribute("target", "_blank");
      await expect(socialAnchors.first()).toContainText(BG_DRAFTS.founderLinkedinAria.value);

      // Zero horizontal overflow
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);

      // Axe check on footer
      const axeResults = await new AxeBuilder({ page })
        .include("footer.site-footer")
        .withTags(WCAG_TAGS)
        .analyze();
      expect(axeResults.violations, JSON.stringify(axeResults.violations, null, 2)).toEqual([]);

      // Verify «Настройки за бисквитки» opens the consent settings panel
      if (width === 1440) {
        await cookieBtn.click();
        const settingsPanel = page.locator("[data-consent-settings]");
        await expect(settingsPanel).toBeVisible();
        await expect(settingsPanel).toContainText(bgUi.consent.settingsTitle);
      }
    });
  }
});
