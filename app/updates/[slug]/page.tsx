import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UpdateArticle } from "@/components/updates/changelog";
import { isBg } from "@/lib/edition";
import { requireJetEdition } from "@/lib/edition-routes";
import { pageMetadata } from "@/lib/seo";
import { getUpdate, updates } from "@/lib/updates";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  if (isBg) {
    return [];
  }
  return updates.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (isBg) {
    return {};
  }
  const { slug } = await params;
  const note = getUpdate(slug);
  if (!note) {
    return {};
  }

  return pageMetadata({
    title: note.title,
    description: note.description,
    path: `/updates/${note.slug}`,
    image: note.socialImage,
    type: "article",
    publishedTime: note.dateTime,
  });
}

export default async function Page({ params }: PageProps) {
  requireJetEdition();
  const { slug } = await params;
  const note = getUpdate(slug);
  if (!note) {
    notFound();
  }

  return <UpdateArticle note={note} />;
}
