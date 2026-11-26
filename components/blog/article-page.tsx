import Link from "next/link";
import { getPost, posts, type Post } from "@/lib/blog";
import { ArticleBody } from "@/components/blocks/article-body";
import { CoverImage, PostCard } from "@/components/blog/post-card";
import { SiteCta } from "@/components/site-cta";
import { Badge } from "@/components/ui/badge";
import styles from "@/components/blog/blog-styles";

export function ArticlePage({ slug }: { slug: string }) {
  const post = getPost(slug) as Post;
  const related = post.related.map((item) => posts.find((entry) => entry.slug === item) as Post);

  return (
    <article className={styles.blog}>
      <header className={styles.info}>
        <div className={styles.meta}>
          <Link href="/blog" className={styles.back}>
            <span className={styles.backIcon} aria-hidden="true">
              <svg viewBox="0 0 12 12" width="12" height="12">
                <path
                  d="M7.8 2.2 L4.2 6 L7.8 9.8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Back
          </Link>
          <Badge className={styles.category}>{post.category}</Badge>
          <time className={styles.metaDate} dateTime={post.dateTime}>
            {post.date}
          </time>
        </div>
        <CoverImage src={post.image} label={post.imageAlt} />
        <div className={styles.intro}>
          <p className={styles.mobileDate}>{post.date}</p>
          <h1>{post.title}</h1>
          <p className={styles.lede}>{post.description}</p>
          <ul className={styles.authors}>
            {post.authors.map((author) => (
              <li key={author.name} className={styles.author}>
                <img src={author.image} alt="" width={36} height={36} />
                <span>
                  <p className={styles.authorName}>{author.name}</p>
                  <p className={styles.authorRole}>{author.role}</p>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className={styles.content} aria-label="Article">
        <ArticleBody blocks={post.body} />
      </section>

      <section className={styles.relatedSection} aria-labelledby="read-more">
        <div className={styles.relatedHead}>
          <h2 id="read-more">Read more</h2>
          <Link href="/blog" className={styles.viewAll}>
            View all
            <span className={styles.viewIcon} aria-hidden="true">
              <svg viewBox="0 0 12 12" width="12" height="12">
                <path
                  d="M4.2 2.2 L7.8 6 L4.2 9.8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>
        <ul className={styles.related}>
          {related.map((item) => (
            <li key={item.slug}>
              <PostCard post={item} variant="small" />
            </li>
          ))}
        </ul>
      </section>

      <SiteCta titleId="blog-cta" />
    </article>
  );
}
