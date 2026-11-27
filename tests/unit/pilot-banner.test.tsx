// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PilotBanner } from "@/components/blocks/pilot-banner";

Range.prototype.getBoundingClientRect = () =>
  ({ x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0, toJSON: () => ({}) }) as DOMRect;
window.matchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent: () => false,
});
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

afterEach(cleanup);

describe("PilotBanner (ZAV-114 / HM-04 / FL-30)", () => {
  it("renders verbatim pilot copy, tracked CtaLink to /keysi with home_pilot_banner, and no dismiss control", () => {
    const text =
      "Първите ни кейси се пишат сега. Пилот 30 дни: одит, първи кампании и отчет „преди / след“ — от 690 € общо. Приемаме 3 фирми до февруари 2027.";
    const { container } = render(
      <PilotBanner text={text} ctaLabel="Вижте пилота →" href="/keysi" />,
    );

    const section = container.querySelector('[data-block="pilot-banner"]');
    expect(section).not.toBeNull();
    expect(section?.textContent).toContain(text);

    // Non-dismissible: no close button.
    expect(container.querySelector("button")).toBeNull();

    const link = container.querySelector<HTMLAnchorElement>('a[href="/keysi"]');
    expect(link).not.toBeNull();
    expect(link?.getAttribute("data-track")).toBe("cta_click");
    expect(link?.getAttribute("data-track-cta-text")).toBe("Вижте пилота →");
    expect(link?.getAttribute("data-track-cta-location")).toBe("home_pilot_banner");
  });
});
