// @vitest-environment jsdom
import fs from "node:fs";
import path from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ILLOS_CATALOG } from "@/components/illos";
import { SegmentPage } from "@/components/pages/segment-page";
import { appendSegmentTema, type SegmentPageData } from "@/content/bg/types";

vi.mock("@/components/motion", async () => {
  const actual = await vi.importActual<typeof import("@/components/motion")>("@/components/motion");
  return {
    ...actual,
    PulseGradient: () => <div data-testid="pulse-gradient" />,
    LineAnimator: () => <div data-testid="line-animator" />,
  };
});

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

const FIXTURE: SegmentPageData = {
  slug: "smyana-na-agentsiya",
  tema: "smyana",
  source: { file: "03-smyana-na-agentsiya.md", block: "Test fixture" },
  wave: 1,
  hero: {
    eyebrow: "Тестов сегмент",
    title: "Тестово заглавие на сегмента.",
    description: "Описание на сегмента за проверка на шаблона.",
    actions: [
      { text: "Проверете акаунтите", href: "/proverka-na-akaunti", variant: "primary" },
      { text: "Запазете разговор", href: "/kontakt", variant: "secondary" },
    ],
  },
  featureGrid: {
    title: "Какво получавате.",
    items: [
      { title: "Първа стойност", body: "Описание 1.", illo: "hud-monitoring" },
      { title: "Втора стойност", body: "Описание 2.", illo: "hud-audit-log" },
      { title: "Трета стойност", body: "Описание 3.", illo: "hud-traffic" },
      { title: "Четвърта стойност", body: "Описание 4.", illo: "hud-cost-meter" },
    ],
  },
  processSteps: {
    title: "Три стъпки.",
    steps: [
      { title: "Стъпка 1", body: "Първо действие." },
      { title: "Стъпка 2", body: "Второ действие." },
      { title: "Стъпка 3", body: "Трето действие." },
    ],
  },
  mirrorQuestions: {
    title: "Разпознавате ли се?",
    questions: [
      "Въпрос 1?",
      "Въпрос 2?",
      "Въпрос 3?",
      "Въпрос 4?",
      "Въпрос 5?",
    ],
  },
  featureSections: [
    {
      eyebrow: "Секция 1",
      title: "Заглавие 1.",
      body: "Подзаглавие 1.",
      points: ["Точка 1А", "Точка 1Б"],
      illo: "hud-alerts",
    },
    {
      eyebrow: "Секция 2",
      title: "Заглавие 2.",
      body: "Подзаглавие 2.",
      points: ["Точка 2А", "Точка 2Б"],
      illo: "hud-threat-detection",
    },
    {
      eyebrow: "Секция 3",
      title: "Заглавие 3.",
      body: "Подзаглавие 3.",
      points: [
        [
          { text: "Основните условия са на " },
          { text: "страницата за договора", href: "/kak-rabotim#dogovor" },
        ],
      ],
      illo: "interface-choose-plan",
    },
    {
      eyebrow: "Секция 4",
      title: "Заглавие 4.",
      body: "Подзаглавие 4.",
      points: ["Точка 4А"],
      illo: "hud-billing-stack",
    },
    {
      eyebrow: "Закрита секция",
      title: "Не трябва да се показва.",
      body: "Закрита с gate.",
      points: ["Скрита точка"],
      illo: "hud-search",
      gate: "hotels",
    },
  ],
  cardGrid: {
    items: [
      { title: "Бариера 1", body: "Отговор 1." },
      { title: "Бариера 2", body: "Отговор 2." },
      { title: "Бариера 3", body: "Отговор 3." },
      { title: "Бариера 4", body: "Отговор 4." },
      { title: "Скрита бариера", body: "Не се вижда.", gate: "forbes" },
    ],
  },
  faq: {
    items: [
      { question: "Първи въпрос?", answer: "Първи отговор." },
      {
        question: "Скрит въпрос?",
        answer: "Скрит отговор заради затворен gate.",
        gate: "forbes",
      },
    ],
  },
  ctaBand: {
    title: "Финален призив.",
    description: "Описание на призива.",
    actions: [
      { text: "Запазете безплатен разговор", href: "/kontakt" },
      { text: "Сезонна оферта", href: "/kontakt?tema=sezon", variant: "secondary" },
    ],
  },
};

describe("SegmentPage template and illos.dev/library assets (ZAV-117 / SG-A1 / DS-27)", () => {
  it("appends ?tema= only to /kontakt links without overwriting existing tema (SG-06)", () => {
    expect(appendSegmentTema("/kontakt", "smyana")).toBe("/kontakt?tema=smyana");
    expect(appendSegmentTema("/kontakt?utm_source=google", "magazin")).toBe(
      "/kontakt?utm_source=google&tema=magazin",
    );
    expect(appendSegmentTema("/kontakt#form", "b2b")).toBe("/kontakt?tema=b2b#form");
    expect(appendSegmentTema("/kontakt?tema=sezon", "hotel")).toBe("/kontakt?tema=sezon");
    expect(appendSegmentTema("/proverka-na-akaunti", "smyana")).toBe("/proverka-na-akaunti");
    expect(appendSegmentTema("/kontakt-extra", "imoti")).toBe("/kontakt-extra");
  });

  it("renders all 9 sections in exact SG-01 order with extraSlot, ?tema= CTAs, hidden closed gates, and illos visuals", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    const { container } = render(
      <SegmentPage
        data={FIXTURE}
        extraSlot={<section data-block="pricing-cards">Сезон 2027</section>}
      />,
    );

    const blocks = Array.from(container.querySelectorAll(":scope > [data-block]")).map((el) =>
      el.getAttribute("data-block"),
    );
    expect(blocks).toEqual([
      "hero",
      "feature-grid",
      "process-steps",
      "mirror-questions",
      "feature-section",
      "feature-section",
      "feature-section",
      "feature-section",
      "card-grid",
      "pricing-cards",
      "faq",
      "cta-band",
    ]);

    // SG-06: /kontakt links receive ?tema=smyana without altering visible button text or explicit tema=sezon.
    const heroContact = container.querySelector<HTMLAnchorElement>(
      '[data-block="hero"] a[href="/kontakt?tema=smyana"]',
    );
    expect(heroContact).not.toBeNull();
    expect(heroContact?.textContent).toContain("Запазете разговор");
    expect(heroContact?.getAttribute("rel")).toBeNull();

    const heroAudit = container.querySelector<HTMLAnchorElement>(
      '[data-block="hero"] a[href="/proverka-na-akaunti"]',
    );
    expect(heroAudit).not.toBeNull();

    const ctaContact = container.querySelector<HTMLAnchorElement>(
      '[data-block="cta-band"] a[href="/kontakt?tema=smyana"]',
    );
    expect(ctaContact).not.toBeNull();
    expect(ctaContact?.textContent).toContain("Запазете безплатен разговор");

    const ctaSezon = container.querySelector<HTMLAnchorElement>(
      '[data-block="cta-band"] a[href="/kontakt?tema=sezon"]',
    );
    expect(ctaSezon).not.toBeNull();

    // Rich inline link inside FeatureSection points.
    expect(container.querySelector('a[href="/kak-rabotim#dogovor"]')).not.toBeNull();

    // PG-06: closed-gate section, barrier card, and FAQ item are hidden.
    expect(screen.queryByText("Не трябва да се показва.")).toBeNull();
    expect(screen.queryByText("Скрита бариера")).toBeNull();
    expect(screen.queryByText("Скрит въпрос?")).toBeNull();

    // DS-27 / PG-07: illos.dev/library visuals render in FeatureGrid (4) and FeatureSections (4).
    const illos = container.querySelectorAll("img[data-illo]");
    expect(illos).toHaveLength(8);

    // SG-07: template writes nothing to browser storage.
    expect(setItemSpy).not.toHaveBeenCalled();
    setItemSpy.mockRestore();
  });

  it("ships every ILLOS_CATALOG SVG in public/illos with prefers-reduced-motion and only globals.css dark tokens", () => {
    const allowedColors = new Set([
      "#000000",
      "#080808",
      "#0c0c0c",
      "#171717",
      "#1c1c1c",
      "#333333",
      "#ffffff",
      "#00e6c5",
      "#d85ce0",
      "#29c2ff",
      "#e0cd3a",
      "#db2c2c",
    ]);

    for (const [name, entry] of Object.entries(ILLOS_CATALOG)) {
      const filePath = path.join(process.cwd(), "public", entry.src.replace(/^\//, ""));
      expect(fs.existsSync(filePath), `${name} missing at ${filePath}`).toBe(true);
      const svg = fs.readFileSync(filePath, "utf8");
      expect(svg, `${name} must honor prefers-reduced-motion`).toContain("prefers-reduced-motion");
      const hexColors = svg.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
      for (const hex of hexColors) {
        expect(allowedColors.has(hex.toLowerCase()), `${name} uses off-palette color ${hex}`).toBe(
          true,
        );
      }
    }
  });
});
