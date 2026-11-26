"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { PhosphorIcon, type PhosphorIconName } from "@/components/home/phosphor-icon";
import { CornerMarks } from "@/components/motion/corner-marks";
import { cx } from "@/components/blocks/card-grid/card-grid-styles";

export type CardGridItem = {
  title: string;
  body: string;
  icon?: PhosphorIconName | ReactNode;
  href?: string;
  ctaLabel?: string;
};

export type CardGridProps = {
  id?: string;
  titleId?: string;
  title?: string;
  items: readonly CardGridItem[];
  /** When true, renders the tile list without outer section/frame (embedded inside another framed section). */
  embedded?: boolean;
  /** Variable-height dashed grid supporting 4–5 cards and link cards. Jet home keeps the fixed-height 4-tile default. */
  autoHeight?: boolean;
  /** Optional summary line underneath the grid inside the dashed frame. */
  note?: string;
  headingAs?: "h2" | "h3";
  className?: string;
};

const PHOSPHOR_NAMES = new Set<string>(["link", "wand", "rocket", "bolt", "broom", "chart", "bell"]);

function renderTileIcon(icon: CardGridItem["icon"]) {
  if (typeof icon === "string" && PHOSPHOR_NAMES.has(icon)) {
    return <PhosphorIcon name={icon as PhosphorIconName} />;
  }
  return icon ?? null;
}

export function CardGrid({
  id,
  titleId = "card-grid-title",
  title,
  items,
  embedded = false,
  autoHeight = false,
  note,
  headingAs,
  className,
}: CardGridProps) {
  const ItemHeading = headingAs ?? (title ? "h3" : "h2");
  const hasLinks = items.some((item) => Boolean(item.href));
  const flexible = autoHeight || items.length === 5 || hasLinks;
  const gridClass = items.length === 5 ? "tilesGrid5" : "tilesGrid4";

  const list = flexible ? (
    <ul
      className={cx("tilesAuto", gridClass, embedded && "tilesDivider", embedded && className)}
      data-block={embedded ? "card-grid" : undefined}
      data-card-count={items.length}
    >
      {items.map((item) => {
        const inner = (
          <>
            {item.icon !== undefined ? (
              <span className={cx("tileIcon")}>{renderTileIcon(item.icon)}</span>
            ) : null}
            <ItemHeading>{item.title}</ItemHeading>
            <p>{item.body}</p>
            {item.ctaLabel ? <span className={cx("tileCta")}>{item.ctaLabel}</span> : null}
          </>
        );

        return (
          <li key={item.title}>
            {item.href ? (
              <Link href={item.href} className={`${cx("tileLink")} corner-host`}>
                <CornerMarks />
                {inner}
              </Link>
            ) : (
              <div className={cx("tileCell")}>{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  ) : (
    <ul
      className={cx("tiles", embedded && "tilesDivider", embedded && className)}
      data-block={embedded ? "card-grid" : undefined}
    >
      {items.map((item) => (
        <li key={item.title}>
          {item.icon !== undefined ? (
            <span className={cx("tileIcon")}>{renderTileIcon(item.icon)}</span>
          ) : null}
          <ItemHeading>{item.title}</ItemHeading>
          <p>{item.body}</p>
        </li>
      ))}
    </ul>
  );

  if (embedded) {
    return list;
  }

  return (
    <section
      className={cx("section", className)}
      id={id}
      aria-labelledby={title ? titleId : undefined}
      data-block="card-grid"
    >
      <div className={cx("frame", "dash")}>
        {title ? (
          <div className={cx(flexible ? "bandHeadAuto" : "bandHead")}>
            <h2 id={titleId}>{title}</h2>
          </div>
        ) : null}
        {list}
        {note ? <p className={cx("footerNote")}>{note}</p> : null}
      </div>
    </section>
  );
}
