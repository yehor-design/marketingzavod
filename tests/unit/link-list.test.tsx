// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LinkList } from "@/components/blocks/link-list";

afterEach(() => {
  cleanup();
});

describe("LinkList block (DS-21, NF-01, TY-01)", () => {
  it("renders nothing when items is empty (NF-01)", () => {
    const { container } = render(
      <LinkList title="Решения" variant="list" items={[]} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders the list variant with heading and next/link items", () => {
    render(
      <LinkList
        embedded
        variant="list"
        title="Може би търсите"
        items={[
          { label: "Цени на пакетите →", href: "/tseni", location: "not_found" },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Може би търсите" })).toBeTruthy();
    const link = screen.getByRole("link", { name: "Цени на пакетите →" });
    expect(link.getAttribute("href")).toBe("/tseni");
    expect(link.getAttribute("data-track")).toBe("cta_click");
    expect(link.getAttribute("data-track-cta-location")).toBe("not_found");
  });

  it("renders the cards variant with one focusable link per card", () => {
    render(
      <LinkList
        embedded
        variant="cards"
        title="Докато чакате"
        items={[
          {
            label: "Проверете кой притежава рекламните ви акаунти →",
            href: "/proverka-na-akaunti",
          },
          {
            label: "Вижте пакетите и цените →",
            description: "Публични цени",
            href: "/tseni",
          },
        ]}
      />,
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toBe("/proverka-na-akaunti");
    expect(links[1].getAttribute("href")).toBe("/tseni");
    expect(links[1].textContent).toContain("Публични цени");
  });
});
