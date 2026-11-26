"use client";

import { useState } from "react";
import { PostCard, type PostCardItem } from "@/components/blocks/post-card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cx } from "@/components/blocks/post-list/post-list-styles";

export type PostListProps = {
  items: readonly PostCardItem[];
  featured?: readonly PostCardItem[];
  kicker?: {
    title: string;
    subtitle?: string;
    asH1?: boolean;
  };
  heading?: string;
  headingId?: string;
  showFilters?: boolean;
  categories?: readonly string[];
  allCategory?: string;
  filtersAriaLabel?: string;
  pageSize?: number;
  loadMoreLabel?: string;
  className?: string;
  columnClassName?: string;
};

export function PostList({
  items,
  featured,
  kicker,
  heading,
  headingId = "all-posts",
  showFilters = false,
  categories,
  allCategory = "All",
  filtersAriaLabel = "Post categories",
  pageSize,
  loadMoreLabel = "Load\u00A0more",
  className,
  columnClassName,
}: PostListProps) {
  const [category, setCategory] = useState(allCategory);
  const [visible, setVisible] = useState(pageSize ?? items.length);

  const filterList = showFilters && categories && categories.length > 0 ? categories : null;
  const filtered =
    !filterList || category === allCategory
      ? items
      : items.filter((post) => post.category === category);
  const effectiveVisible = pageSize ? visible : filtered.length;
  const hasFeatured = Boolean(featured && featured.length > 0);
  const KickerTitle = kicker?.asH1 === false ? "h2" : "h1";
  const KickerSubtitle = kicker?.asH1 === false ? "span" : "h2";

  return (
    <div className={cx("blog", className)} data-block="post-list">
      {hasFeatured && featured ? (
        <div className={cx("column", "index", columnClassName)}>
          {kicker ? (
            <div className={cx("kicker")}>
              <KickerTitle>{kicker.title}</KickerTitle>
              {kicker.subtitle ? (
                <>
                  <span aria-hidden="true">/</span>
                  <KickerSubtitle>{kicker.subtitle}</KickerSubtitle>
                </>
              ) : null}
            </div>
          ) : null}
          <div className={cx("featureGrid")}>
            {featured.map((post, index) => (
              <PostCard key={post.href} item={post} variant={index === 0 ? "feature" : "small"} />
            ))}
          </div>
        </div>
      ) : null}

      <section
        className={cx("column", hasFeatured ? "all" : undefined, columnClassName)}
        aria-labelledby={heading ? headingId : undefined}
      >
        {heading || filterList ? (
          <div className={cx("allHead")}>
            {heading ? <h2 id={headingId}>{heading}</h2> : null}
            {filterList ? (
              <ToggleGroup
                value={[category]}
                onValueChange={(next) => {
                  const chosen = next[0];
                  if (chosen && filterList.includes(chosen)) {
                    setCategory(chosen);
                    if (pageSize) {
                      setVisible(pageSize);
                    }
                  }
                }}
                spacing={2}
                aria-label={filtersAriaLabel}
                className={cx("filters")}
              >
                {filterList.map((item) => (
                  <ToggleGroupItem
                    key={item}
                    value={item}
                    className={`${cx("filter")} aria-pressed:bg-brand aria-pressed:text-background hover:bg-secondary/80 aria-pressed:hover:bg-brand`}
                  >
                    {item}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            ) : null}
          </div>
        ) : null}

        <ul className={cx("grid")}>
          {filtered.map((post, index) => (
            <li key={post.href} hidden={index >= effectiveVisible}>
              <PostCard item={post} variant="small" />
            </li>
          ))}
        </ul>

        {pageSize && effectiveVisible < filtered.length ? (
          <div className={cx("more")}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setVisible((count) => count + pageSize)}
            >
              {loadMoreLabel}
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
