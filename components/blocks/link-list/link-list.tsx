"use client";

import Link from "next/link";
import { CornerMarks } from "@/components/motion/corner-marks";
import { cx } from "@/components/blocks/link-list/link-list-styles";

export type LinkListItem = {
  readonly label: string;
  readonly description?: string;
  readonly href: string;
  readonly location?: string;
};

export type LinkListProps = {
  id?: string;
  title?: string;
  titleId?: string;
  headingAs?: "h2" | "h3";
  variant?: "list" | "cards";
  items: readonly LinkListItem[];
  /** When true, renders without outer section padding/container so it can sit inside 404 or page layouts. */
  embedded?: boolean;
  className?: string;
};

export function LinkList({
  id,
  title,
  titleId,
  headingAs = "h2",
  variant = "list",
  items,
  embedded = false,
  className,
}: LinkListProps) {
  if (items.length === 0) {
    return null;
  }

  const Heading = headingAs;
  const resolvedTitleId = title ? (titleId ?? (id ? `${id}-title` : undefined)) : undefined;

  const content =
    variant === "cards" ? (
      <div className={cx("cardsWrap", embedded && className)} data-block="link-list" data-variant="cards">
        {title ? (
          <Heading id={resolvedTitleId} className={cx("cardsTitle")}>
            {title}
          </Heading>
        ) : null}
        <ul className={cx("cardsGrid")}>
          {items.map((item) => (
            <li key={`${item.href}-${item.label}`} className={cx("cardLi")}>
              <Link
                href={item.href}
                className={`${cx("cardLink")} corner-host`}
                data-track={item.location ? "cta_click" : undefined}
                data-track-cta-text={item.location ? item.label : undefined}
                data-track-cta-location={item.location}
              >
                <CornerMarks />
                <span className={cx("cardLabel")}>{item.label}</span>
                {item.description ? <span className={cx("cardDesc")}>{item.description}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className={cx("listGroup", embedded && className)} data-block="link-list" data-variant="list">
        {title ? (
          <Heading id={resolvedTitleId} className={cx("listTitle")}>
            {title}
          </Heading>
        ) : null}
        <ul className={cx("listUl")}>
          {items.map((item) => (
            <li key={`${item.href}-${item.label}`} className={cx("listLi")}>
              <Link
                href={item.href}
                className={cx("listLink")}
                data-track={item.location ? "cta_click" : undefined}
                data-track-cta-text={item.location ? item.label : undefined}
                data-track-cta-location={item.location}
              >
                <span className={cx("listLabel")}>{item.label}</span>
                {item.description ? <span className={cx("listDesc")}>{item.description}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );

  if (embedded) {
    return content;
  }

  return (
    <section
      id={id}
      className={cx("section", className)}
      aria-labelledby={resolvedTitleId}
    >
      <div className={cx("frame")}>{content}</div>
    </section>
  );
}
