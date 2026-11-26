"use client";

import { useState, type ReactNode } from "react";
import { PlanMark, type BuiltinPlanMark } from "@/components/blocks/pricing-cards";
import { CtaLink } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cx } from "@/components/blocks/comparison-table/comparison-table-styles";

export type ComparisonMark = "check" | "x";
export type ComparisonCell = { text?: string; mark?: ComparisonMark };

export type ComparisonColumnCta = {
  text: string;
  href: string;
  tone?: "primary" | "secondary";
  location: string;
};

export type ComparisonColumn = {
  id: string;
  name: string;
  highlight?: boolean;
  icon?: BuiltinPlanMark | ReactNode;
  cta?: ComparisonColumnCta;
};

export type ComparisonRow = {
  feature: string;
  tip?: string;
  tone: "grey" | "black";
  cells: readonly ComparisonCell[];
};

export type ComparisonGroup = {
  title?: string;
  rows: readonly ComparisonRow[];
};

export type ComparisonTableProps = {
  columns: readonly ComparisonColumn[];
  groups: readonly ComparisonGroup[];
  title?: string;
  titleId?: string;
  ariaLabel?: string;
  tabsAriaLabel?: string;
  includedLabel?: string;
  notIncludedLabel?: string;
  moreInfoLabel?: string;
  /** Matches Jet's fixed 64px row height; set false when cells contain multi-line prose. */
  compactRows?: boolean;
  className?: string;
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={cx("markAccent")}>
      <path
        d="M3.2 8.3 6.3 11.4 12.8 4.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className={cx("markCross")}>
      <path
        d="M4 4l8 8M12 4l-8 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CellValue({
  cell,
  includedLabel,
  notIncludedLabel,
}: {
  cell: ComparisonCell;
  includedLabel: string;
  notIncludedLabel: string;
}) {
  if (cell.text) {
    return <span>{cell.text}</span>;
  }
  if (cell.mark === "check") {
    return (
      <span className={cx("cellIcon")}>
        <CheckIcon />
        <span className="sr-only">{includedLabel}</span>
      </span>
    );
  }
  return (
    <span className={cx("cellIcon")}>
      <CrossIcon />
      <span className="sr-only">{notIncludedLabel}</span>
    </span>
  );
}

function Tip({ text, moreInfoLabel }: { text: string; moreInfoLabel: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button type="button" className={cx("tipButton")} aria-label={moreInfoLabel} />
        }
      >
        ?
      </TooltipTrigger>
      <TooltipContent className="max-w-[240px] bg-secondary text-foreground">{text}</TooltipContent>
    </Tooltip>
  );
}

export function ComparisonTable({
  columns,
  groups,
  title,
  titleId = "comparison-table-title",
  ariaLabel = "Plan comparison",
  tabsAriaLabel = "Plan",
  includedLabel = "Included",
  notIncludedLabel = "Not included",
  moreInfoLabel = "More information",
  compactRows = true,
  className,
}: ComparisonTableProps) {
  const [columnIndex, setColumnIndex] = useState(0);
  const activeColumn = columns[columnIndex] ?? columns[0];
  const gridColsClass = columns.length >= 4 ? "cols4" : "cols3";

  return (
    <section
      className={cx("compare", className)}
      aria-labelledby={title ? titleId : undefined}
      aria-label={!title ? ariaLabel : undefined}
      data-block="comparison-table"
    >
      {title ? (
        <h2 id={titleId} className={cx("sectionTitle")}>
          {title}
        </h2>
      ) : null}

      <div className={cx("switcher")}>
        <Tabs
          value={activeColumn.id}
          onValueChange={(next) => {
            const index = columns.findIndex((item) => item.id === next);
            if (index >= 0) {
              setColumnIndex(index);
            }
          }}
        >
          <TabsList
            aria-label={tabsAriaLabel}
            className={`${cx("tabs")} h-auto rounded-none bg-transparent p-0`}
          >
            {columns.map((column, index) => (
              <TabsTrigger
                key={column.id}
                value={column.id}
                className={
                  columnIndex === index
                    ? `${cx("tabOn")} flex-none dark:data-active:border-transparent dark:data-active:bg-brand dark:data-active:text-background`
                    : `${cx("tab")} flex-none`
                }
              >
                {column.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {activeColumn.cta ? (
          <CtaLink
            href={activeColumn.cta.href}
            text={activeColumn.cta.text}
            variant={activeColumn.cta.tone}
            location={activeColumn.cta.location}
          />
        ) : null}
      </div>

      <div className={cx("table")}>
        <div className={cx("head", gridColsClass)} role="row">
          <div />
          {columns.map((column) => (
            <div
              className={cx("headPlan", column.highlight && "headPlanHighlight")}
              key={column.id}
            >
              <PlanMark icon={column.icon} size={20} accent={column.highlight} />
              <h3>{column.name}</h3>
              {column.cta ? (
                <CtaLink
                  href={column.cta.href}
                  text={column.cta.text}
                  variant={column.cta.tone}
                  location={column.cta.location}
                  className="ml-auto"
                />
              ) : null}
            </div>
          ))}
        </div>

        {groups.map((group, groupIndex) => (
          <div key={group.title ?? `group-${groupIndex}`}>
            {group.title ? <h4 className={cx("category")}>{group.title}</h4> : null}
            {group.rows.map((row) => (
              <div
                className={cx(
                  row.tone === "grey" ? "rowGrey" : "rowBlack",
                  compactRows && "rowCompact",
                  gridColsClass,
                )}
                key={row.feature}
                role="row"
              >
                <h5>
                  {row.feature}
                  {row.tip ? <Tip text={row.tip} moreInfoLabel={moreInfoLabel} /> : null}
                </h5>
                {row.cells.map((cell, index) => {
                  const col = columns[index];
                  return (
                    <div
                      className={cx(
                        columnIndex === index ? "valueActive" : "value",
                        col?.highlight && !cell.mark && "valueHighlight",
                      )}
                      key={col?.id ?? index}
                      role="cell"
                    >
                      <CellValue
                        cell={cell}
                        includedLabel={includedLabel}
                        notIncludedLabel={notIncludedLabel}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
