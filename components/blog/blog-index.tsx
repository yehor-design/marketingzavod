"use client";

import { PostList } from "@/components/blocks/post-list";
import { postToCardItem } from "@/components/blog/post-card";
import { blogCategories, posts } from "@/lib/blog";

const PAGE_SIZE = 2;
const NBSP = "\u00A0";

const postItems = posts.map(postToCardItem);
const featuredItems = postItems.slice(0, 3);

export function BlogIndex() {
  return (
    <PostList
      kicker={{ title: "Blog", subtitle: "Featured" }}
      featured={featuredItems}
      heading="All posts"
      headingId="all-posts"
      items={postItems}
      showFilters
      categories={blogCategories}
      allCategory="All"
      filtersAriaLabel="Post categories"
      pageSize={PAGE_SIZE}
      loadMoreLabel={`Load${NBSP}more`}
    />
  );
}
