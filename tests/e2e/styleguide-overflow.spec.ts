import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1024, height: 900 },
  { width: 1440, height: 900 },
] as const;

for (const viewport of VIEWPORTS) {
  test(`DS-A7: ProcessSteps and CardGrid 4-5 item variants do not overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/dev/styleguide", { waitUntil: "networkidle" });

    const pageOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(pageOverflow.scrollWidth).toBeLessThanOrEqual(pageOverflow.clientWidth);

    const issues = await page.evaluate(() => {
      const problems: string[] = [];
      const sections = document.querySelectorAll("#block-process-steps, #block-card-grid");
      for (const section of sections) {
        if (section.scrollWidth > section.clientWidth + 1) {
          problems.push(
            `${section.id} horizontal overflow: scrollWidth=${section.scrollWidth} > clientWidth=${section.clientWidth}`,
          );
        }

        const cards = section.querySelectorAll("li");
        for (const card of cards) {
          const cardRect = card.getBoundingClientRect();
          const contentNodes = card.querySelectorAll("h2, h3, p, span:not(.corner-marks)");
          for (const el of contentNodes) {
            const style = getComputedStyle(el);
            if (style.display === "inline") {
              continue;
            }
            const rect = el.getBoundingClientRect();
            if (el.scrollWidth > el.clientWidth + 1) {
              problems.push(
                `${section.id} <${el.tagName.toLowerCase()}> "${(el.textContent ?? "").slice(0, 32)}" scrollWidth=${el.scrollWidth} > clientWidth=${el.clientWidth}`,
              );
            }
            if (
              (style.overflowY === "hidden" || style.overflow === "hidden") &&
              el.scrollHeight > el.clientHeight + 1
            ) {
              problems.push(
                `${section.id} <${el.tagName.toLowerCase()}> clipped vertically: scrollHeight=${el.scrollHeight} > clientHeight=${el.clientHeight}`,
              );
            }
            if (rect.right > cardRect.right + 1 || rect.bottom > cardRect.bottom + 1) {
              problems.push(
                `${section.id} <${el.tagName.toLowerCase()}> overflows card bounds (${Math.round(rect.right)}>${Math.round(cardRect.right)} or ${Math.round(rect.bottom)}>${Math.round(cardRect.bottom)})`,
              );
            }
          }
        }
      }
      return problems;
    });

    expect(issues, `Overflow issues at ${viewport.width}px:\n${issues.join("\n")}`).toEqual([]);

    // Verify DS-23 5-card grid geometry: 3 + 2 on >=1200, 2 + 2 + 1 on 810-1199, 1 col on <810
    const rowCounts = await page.evaluate(() => {
      const list = document.querySelector<HTMLElement>('#block-card-grid [data-card-count="5"]');
      if (!list) return null;
      const items = Array.from(list.querySelectorAll<HTMLElement>(":scope > li"));
      const rows = new Map<number, number>();
      for (const item of items) {
        const top = Math.round(item.getBoundingClientRect().top / 4) * 4;
        rows.set(top, (rows.get(top) ?? 0) + 1);
      }
      return Array.from(rows.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([, count]) => count);
    });

    if (viewport.width >= 1200) {
      expect(rowCounts).toEqual([3, 2]);
    } else if (viewport.width >= 810) {
      expect(rowCounts).toEqual([2, 2, 1]);
    } else {
      expect(rowCounts).toEqual([1, 1, 1, 1, 1]);
    }
  });
}
