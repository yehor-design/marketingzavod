import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { BG_HEADER_NAV, getPublishedBgSolutionsLinks } from "@/content/bg/navigation";
import { bgUi } from "@/content/bg/ui";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("BG header navigation and «Решения» dropdown (GL-05..GL-07, GL-A2)", () => {
  test("desktop (1440px): renders verbatim BG menu, single primary CTA, opens «Решения» by mouse & keyboard, Esc returns focus, and passes axe", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "load" });

    const header = page.locator("header.site-header");
    await expect(header).toBeVisible();

    const logoLink = header.locator("a.logo");
    await expect(logoLink).toHaveAttribute("href", "/");
    await expect(logoLink.locator("img")).toHaveAttribute("alt", bgUi.header.logoAlt);

    const desktopNav = header.locator(`nav[aria-label="${bgUi.header.primaryNavAria}"]`);
    await expect(desktopNav).toBeVisible();

    const trigger = desktopNav.getByRole("button", { name: BG_HEADER_NAV.solutionsLabel });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    const topLinks = desktopNav.locator("a");
    await expect(topLinks).toHaveCount(BG_HEADER_NAV.links.length);
    for (let i = 0; i < BG_HEADER_NAV.links.length; i += 1) {
      await expect(topLinks.nth(i)).toHaveAttribute("href", BG_HEADER_NAV.links[i].href);
      await expect(topLinks.nth(i)).toContainText(BG_HEADER_NAV.links[i].label);
    }

    // Single primary CTA in desktop header — no Jet links or secondary button
    const desktopActions = header.locator(".desktop-actions a");
    await expect(desktopActions).toHaveCount(1);
    const primaryCta = desktopActions.first();
    await expect(primaryCta).toHaveAttribute("href", BG_HEADER_NAV.primaryCta.href);
    await expect(primaryCta).toHaveAttribute("data-track", "cta_click");
    await expect(primaryCta).toHaveAttribute("data-track-cta-location", "header");
    await expect(primaryCta).toContainText(BG_HEADER_NAV.primaryCta.label);

    const headerText = await header.innerText();
    for (const forbidden of ["Contact", "Join waitlist", "Careers", "Updates", "Pricing"]) {
      expect(headerText).not.toContain(forbidden);
    }

    // Open «Решения» with mouse click and check published items & gate hiding
    const publishedSolutions = getPublishedBgSolutionsLinks();
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const popup = page.locator('[data-slot="navigation-menu-content"]');
    await expect(popup).toBeVisible();
    const dropdownLinks = popup.locator("a");
    await expect(dropdownLinks).toHaveCount(publishedSolutions.length);
    for (let i = 0; i < publishedSolutions.length; i += 1) {
      await expect(dropdownLinks.nth(i)).toHaveAttribute("href", publishedSolutions[i].href);
      await expect(dropdownLinks.nth(i)).toContainText(publishedSolutions[i].label);
    }
    await expect(popup).not.toContainText("Хотели");

    // Axe check on header + open dropdown popup (exclude Base UI internal portal focus-redirection sentinels)
    const axeResults = await new AxeBuilder({ page })
      .include("header.site-header")
      .include('[data-slot="navigation-menu-content"]')
      .exclude("[data-base-ui-focus-guard]")
      .withTags(WCAG_TAGS)
      .analyze();
    expect(axeResults.violations, JSON.stringify(axeResults.violations, null, 2)).toEqual([]);

    // Escape closes dropdown and returns focus to trigger
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(popup).toBeHidden();
    await expect(trigger).toBeFocused();

    // Open again via keyboard Enter and navigate to first dropdown item via Tab
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(popup).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();

    // Zero horizontal overflow at 1440px
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test("mobile (390px) & tablet (1024px): drawer opens with collapsed «Решения», expands links, closes on Esc with focus return, passes axe", async ({
    page,
  }) => {
    for (const width of [390, 1024]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/", { waitUntil: "load" });

      const header = page.locator("header.site-header");
      const openButton = header.getByRole("button", { name: bgUi.header.openMenuAria });
      await expect(openButton).toBeVisible();
      await expect(openButton).toHaveAttribute("aria-expanded", "false");

      await openButton.click();

      const closeButton = header.getByRole("button", { name: bgUi.header.closeMenuAria });
      await expect(closeButton).toHaveAttribute("aria-expanded", "true");

      const mobilePanel = page.locator("#mobile-menu");
      await expect(mobilePanel).toBeVisible();

      const solutionsTrigger = mobilePanel.getByRole("button", {
        name: BG_HEADER_NAV.solutionsLabel,
      });
      await expect(solutionsTrigger).toBeVisible();
      await expect(solutionsTrigger).toHaveAttribute("aria-expanded", "false");

      // Expand «Решения» collapsible
      await solutionsTrigger.click();
      await expect(solutionsTrigger).toHaveAttribute("aria-expanded", "true");

      const publishedSolutions = getPublishedBgSolutionsLinks();
      for (const link of publishedSolutions) {
        const item = mobilePanel.locator(`a[href="${link.href}"]`);
        await expect(item).toBeVisible();
        await expect(item).toContainText(link.label);
      }
      await expect(mobilePanel).not.toContainText("Хотели");

      for (const link of BG_HEADER_NAV.links) {
        const item = mobilePanel.locator(`a[href="${link.href}"]`);
        await expect(item).toBeVisible();
        await expect(item).toContainText(link.label);
      }

      const mobileCta = mobilePanel.locator(`a[href="${BG_HEADER_NAV.primaryCta.href}"]`);
      await expect(mobileCta).toHaveCount(1);
      await expect(mobileCta).toHaveAttribute("data-track", "cta_click");
      await expect(mobileCta).toHaveAttribute("data-track-cta-location", "mobile_menu");
      await expect(mobileCta).toContainText(BG_HEADER_NAV.primaryCta.label);

      // Axe check with mobile menu & «Решения» open
      const axeResults = await new AxeBuilder({ page })
        .include("header.site-header")
        .withTags(WCAG_TAGS)
        .analyze();
      expect(axeResults.violations, JSON.stringify(axeResults.violations, null, 2)).toEqual([]);

      // Zero horizontal overflow
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);

      // Escape closes mobile drawer and returns focus to menu toggle
      await page.keyboard.press("Escape");
      await expect(mobilePanel).toBeHidden();
      await expect(openButton).toHaveAttribute("aria-expanded", "false");
      await expect(openButton).toBeFocused();
    }
  });
});
