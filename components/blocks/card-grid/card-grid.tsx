"use client";

import type { ReactNode } from "react";
import { PhosphorIcon, type PhosphorIconName } from "@/components/home/phosphor-icon";
import { cx } from "@/components/blocks/card-grid/card-grid-styles";

export type CardGridItem = {
  title: string;
  body: string;
  icon?: PhosphorIconName | ReactNode;
};

export type CardGridProps = {
  id?: string;
  titleId?: string;
  title?: string;
  items: readonly CardGridItem[];
  /** When true, renders the tile list without outer section/frame (embedded inside another framed section). */
  embedded?: boolean;
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
  headingAs,
  className,
}: CardGridProps) {
  const ItemHeading = headingAs ?? (title ? "h3" : "h2");
  const list = (
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
          <div className={cx("bandHead")}>
            <h2 id={titleId}>{title}</h2>
          </div>
        ) : null}
        {list}
      </div>
    </section>
  );
}
