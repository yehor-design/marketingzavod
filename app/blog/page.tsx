import { BlogIndex } from "@/components/blog/blog-index";
import { isBg } from "@/lib/edition";
import { bgPageMetadata, pageMetadata } from "@/lib/seo";

export const metadata = isBg
  ? bgPageMetadata("blog")
  : pageMetadata({
      title: "Blog – Jet",
      description:
        "Guides and field notes from the Jet team on Core Web Vitals, image optimization, CDNs and making websites load faster.",
      path: "/blog",
    });

export default function Page() {
  return <BlogIndex />;
}
