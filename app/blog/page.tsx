import { BlogIndex } from "@/components/blog/blog-index";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog – Jet",
  description:
    "Guides and field notes from the Jet team on Core Web Vitals, image optimization, CDNs and making websites load faster.",
  path: "/blog",
});

export default function Page() {
  return <BlogIndex />;
}
