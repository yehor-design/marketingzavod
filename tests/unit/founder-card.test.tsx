// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FounderCard } from "@/components/blocks/founder-card";
import { FOUNDER_PHOTOS } from "@/content/bg/types";

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

describe("FounderCard (ZAV-113 / HM-03 / CR-40 / CR-41)", () => {
  it("renders 1:1 founder photo from public/founders, bio, primary mailto, and secondary LinkedIn link", () => {
    const { container } = render(
      <FounderCard
        title="Кой отговаря за резултата."
        bio="Егор Гончаренко, основател на Маркетинг Завод. Над 8 години в продуктов дизайн и проучвания: започвам от данните, записвам базовата линия и меря всяка промяна. Отговарям лично за всеки пилот."
        photo={{
          webp: FOUNDER_PHOTOS.square.webp,
          jpg: FOUNDER_PHOTOS.square.jpg,
          alt: FOUNDER_PHOTOS.square.alt,
          aspect: "1/1",
        }}
        actions={[
          {
            label: "Пишете ми на имейл",
            href: "mailto:zavodzamarketing@gmail.com",
            variant: "primary",
          },
          {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/yehor-honcharenko",
            variant: "secondary",
            external: true,
          },
        ]}
      />,
    );

    expect(container.querySelector('[data-block="founder-card"]')).not.toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "Кой отговаря за резултата." }),
    ).toBeTruthy();

    const img = screen.getByRole("img", { name: "Егор Гончаренко, основател на Маркетинг Завод" });
    expect(img.getAttribute("src")).toContain("egor-goncharenko-1x1-800.webp");
    expect(img.getAttribute("width")).toBe("800");
    expect(img.getAttribute("height")).toBe("800");

    // Falls back to the same-size JPG if webp fails to load (CR-41).
    fireEvent.error(img);
    expect(img.getAttribute("src")).toContain("egor-goncharenko-1x1-800.jpg");

    const emailLink = container.querySelector<HTMLAnchorElement>(
      'a[href="mailto:zavodzamarketing@gmail.com"]',
    );
    expect(emailLink).not.toBeNull();
    expect(emailLink?.textContent).toContain("Пишете ми на имейл");
    expect(emailLink?.getAttribute("target")).toBeNull();

    const linkedinLink = container.querySelector<HTMLAnchorElement>(
      'a[href="https://www.linkedin.com/in/yehor-honcharenko"]',
    );
    expect(linkedinLink).not.toBeNull();
    expect(linkedinLink?.textContent).toContain("LinkedIn");
    expect(linkedinLink?.getAttribute("target")).toBe("_blank");
    expect(linkedinLink?.getAttribute("rel")).toBe("noopener");
  });

  it("rejects the uncropped -original founder image (CR-40)", () => {
    expect(() =>
      render(
        <FounderCard
          title="Кой отговаря за резултата."
          bio="Текст"
          photo={{
            jpg: "/founders/egor-goncharenko-original.jpg",
            alt: "Егор Гончаренко",
          }}
        />,
      ),
    ).toThrow(/original/i);
  });
});
