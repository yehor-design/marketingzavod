"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { blogCategories, posts } from "@/lib/blog";
import { PostCard } from "@/components/blog/post-card";
import styles from "@/components/blog/blog-styles";

const PAGE_SIZE = 2;
const NBSP = "\u00A0";

export function BlogIndex() {
  const [category, setCategory] = useState<(typeof blogCategories)[number]>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const filtered = category === "All" ? posts : posts.filter((post) => post.category === category);
  const featured = posts.slice(0, 3);

  return (
    <div className={styles.blog}>
      <div className={`${styles.column} ${styles.index}`}>
        <div className={styles.kicker}>
          <h1>Blog</h1>
          <span aria-hidden="true">/</span>
          <h2>Featured</h2>
        </div>
        <div className={styles.featureGrid}>
          <PostCard post={featured[0]} variant="feature" />
          <PostCard post={featured[1]} variant="small" />
          <PostCard post={featured[2]} variant="small" />
        </div>
      </div>

      <section className={`${styles.column} ${styles.all}`} aria-labelledby="all-posts">
        <div className={styles.allHead}>
          <h2 id="all-posts">All posts</h2>
          <ToggleGroup
            value={[category]}
            onValueChange={(next) => {
              const chosen = next[0] as (typeof blogCategories)[number] | undefined;
              if (chosen && blogCategories.includes(chosen)) {
                setCategory(chosen);
                setVisible(PAGE_SIZE);
              }
            }}
            spacing={2}
            aria-label="Post categories"
            className={styles.filters}
          >
            {blogCategories.map((item) => (
              <ToggleGroupItem
                key={item}
                value={item}
                className={`${styles.filter} aria-pressed:bg-brand aria-pressed:text-background hover:bg-secondary/80 aria-pressed:hover:bg-brand`}
              >
                {item}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <ul className={styles.grid}>
          {filtered.map((post, index) => (
            <li key={post.slug} hidden={index >= visible}>
              <PostCard post={post} variant="small" />
            </li>
          ))}
        </ul>
        {visible < filtered.length ? (
          <div className={styles.more}>
            <Button type="button" variant="secondary" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
              {`Load${NBSP}more`}
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
