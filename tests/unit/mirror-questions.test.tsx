// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MirrorQuestions } from "@/components/blocks/mirror-questions";

afterEach(cleanup);

describe("MirrorQuestions (ZAV-112 / HM-05 / SG-03)", () => {
  it("renders 3 question cards with optional CTA link and zero testimonial markup", () => {
    const { container } = render(
      <MirrorQuestions
        title="Звучи ли ви познато?"
        titleId="home-mirror-title"
        questions={[
          "Знаете, че маркетингът не работи както трябва, но не знаете откъде да започнете?",
          "Не можете да намерите човек, който да го подреди?",
          "Плащате за реклама, а цифрите не мърдат?",
        ]}
        cta={{
          label: "Започнете с безплатен разговор →",
          href: "/kontakt",
          location: "home_mirror_questions",
        }}
      />,
    );

    const section = container.querySelector('[data-block="mirror-questions"]');
    expect(section).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Звучи ли ви познато?" })).toBeTruthy();

    const list = container.querySelector("ul[data-question-count='3']");
    expect(list).not.toBeNull();
    expect(list?.querySelectorAll("li")).toHaveLength(3);

    // HM-05: must never resemble quotes/testimonials.
    expect(container.querySelector("blockquote")).toBeNull();
    expect(container.querySelector("cite")).toBeNull();
    expect(container.querySelector("img")).toBeNull();

    const cta = screen.getByRole("link", { name: "Започнете с безплатен разговор →" });
    expect(cta.getAttribute("href")).toBe("/kontakt");
    expect(cta.getAttribute("data-track")).toBe("cta_click");
    expect(cta.getAttribute("data-track-cta-location")).toBe("home_mirror_questions");
  });

  it("renders 5 question cards using the 3+2 / 2+2+1 / 1 grid layout with optional note", () => {
    const { container } = render(
      <MirrorQuestions
        title="Разпознавате ли се?"
        headingAs="h3"
        questions={[
          "Искате маркетинг, на който да имате доверие?",
          "Плащате от 3–6 месеца, а продажбите стоят?",
          "Цената на клиент расте, а отчетът показва кликове?",
          "Страх ви е да не сгрешите отново с избора?",
          "Агенцията държи акаунтите ви?",
        ]}
        note="Ако познавате поне две от тези ситуации, започнете с проверка на акаунтите."
      />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Разпознавате ли се?" })).toBeTruthy();
    const list = container.querySelector("ul[data-question-count='5']");
    expect(list).not.toBeNull();
    expect(list?.className).toContain("grid5");
    expect(list?.querySelectorAll("li")).toHaveLength(5);
    expect(
      screen.getByText("Ако познавате поне две от тези ситуации, започнете с проверка на акаунтите."),
    ).toBeTruthy();
    expect(container.querySelector("blockquote")).toBeNull();
    expect(container.querySelector("cite")).toBeNull();
  });

  it("returns null when questions array is empty", () => {
    const { container } = render(<MirrorQuestions title="Empty" questions={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
