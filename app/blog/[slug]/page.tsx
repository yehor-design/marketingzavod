import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/blog/article-page";
import { JsonLd } from "@/components/json-ld";
import { getPost, posts } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return {};
  }

  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.image,
    type: "article",
    publishedTime: post.dateTime,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    notFound();
  }

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: [absoluteUrl(post.image)],
    datePublished: post.dateTime,
    dateModified: post.dateTime,
    articleSection: post.category,
    author: post.authors.map((author) => ({
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
    })),
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo-mark.svg") },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };

  return (
    <>
      <JsonLd data={article} />
      <ArticlePage slug={slug} />
    </>
  );
}
