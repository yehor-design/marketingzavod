import { AboutPage } from "@/components/about/about-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About – Jet",
  description:
    "Meet the team behind Jet and the principles we build by: speed for every website, no code required, and honest performance numbers.",
  path: "/about",
});

export default function Page() {
  return <AboutPage />;
}
