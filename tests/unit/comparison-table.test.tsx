// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  ComparisonTable,
  type ComparisonColumn,
  type ComparisonGroup,
} from "@/components/blocks/comparison-table";
import { BG_DRAFTS } from "@/content/bg/drafts";

afterEach(cleanup);

const BG_COLUMNS: readonly ComparisonColumn[] = [
  { id: "employee", name: "Служител" },
  { id: "freelancer", name: "Фрилансер" },
  { id: "diy-ai", name: "Сами с AI" },
  { id: "marketing-zavod", name: "Маркетинг Завод", highlight: true },
];

const BG_GROUPS: readonly ComparisonGroup[] = [
  {
    rows: [
      {
        feature: "Цена",
        tone: "grey",
        cells: [
          { text: "≈1 640 € бруто на месец + осигуровки (средна заплата на маркетолог във Варна)" },
          { text: "150–400 € на месец за канал" },
          { text: "от ≈16 € на месец за инструмент + вашето време" },
          { text: "от 290 € за канал, от 690 € за 2–3 канала" },
        ],
      },
      {
        feature: "Стратегия",
        tone: "black",
        cells: [
          { text: "Зависи от човека" },
          { text: "Рядко" },
          { text: "Вие" },
          { text: "Стратег в пакета" },
        ],
      },
      {
        feature: "Реклама, съдържание и анализи",
        tone: "grey",
        cells: [
          { text: "Един човек трудно покрива всичко" },
          { text: "Обикновено един канал" },
          { text: "Колкото време имате" },
          { text: "2–3 канала: стратег и проверени изпълнители" },
        ],
      },
      {
        feature: "Ако човекът си тръгне",
        tone: "black",
        cells: [
          { text: "Започвате отначало" },
          { text: "Търсите нов" },
          { text: "—" },
          { text: "Процесите и достъпите остават у вас" },
        ],
      },
    ],
  },
];

describe("ComparisonTable 4-column text-cell variant (ZAV-115 / HM-06)", () => {
  it("renders 4 columns and 4 rows with verbatim text cells, zero icons, highlighted primary column, and localized tablist aria-label", () => {
    const { container } = render(
      <ComparisonTable
        title="Маркетинг Завод или…?"
        columns={BG_COLUMNS}
        groups={BG_GROUPS}
        tabsAriaLabel={BG_DRAFTS.alternativesTabsAria.value}
        compactRows={false}
      />,
    );

    const section = container.querySelector('[data-block="comparison-table"][data-columns="4"]');
    expect(section).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Маркетинг Завод или…?" })).toBeTruthy();

    // No check/cross/plan-mark SVGs in text-cell variant.
    expect(container.querySelectorAll("svg")).toHaveLength(0);

    // Tablist carries the registered BG draft aria-label.
    const tablist = screen.getByRole("tablist", { name: "Изберете вариант" });
    expect(tablist).toBeTruthy();
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      "Служител",
      "Фрилансер",
      "Сами с AI",
      "Маркетинг Завод",
    ]);

    // Highlighted column uses primary accent styling on both header and cells.
    expect(container.querySelectorAll('[role="columnheader"][data-highlighted="true"]')).toHaveLength(1);
    expect(container.querySelectorAll('[role="cell"][data-highlighted="true"]')).toHaveLength(4);

    // Switching mobile tab activates the chosen column's cells.
    fireEvent.click(screen.getByRole("tab", { name: "Маркетинг Завод" }));
    const activeCells = Array.from(container.querySelectorAll(".valueActive")).map(
      (node) => node.textContent,
    );
    expect(activeCells).toEqual([
      "от 290 € за канал, от 690 € за 2–3 канала",
      "Стратег в пакета",
      "2–3 канала: стратег и проверени изпълнители",
      "Процесите и достъпите остават у вас",
    ]);
  });
});
