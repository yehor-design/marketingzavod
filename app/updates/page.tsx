import { UpdatesIndex } from "@/components/updates/changelog";
import { isBg } from "@/lib/edition";
import { requireJetEdition } from "@/lib/edition-routes";
import { bgPageMetadata, pageMetadata } from "@/lib/seo";

export const metadata = isBg
  ? bgPageMetadata("notFound")
  : pageMetadata({
      title: "Updates – Jet",
      description:
        "The Jet changelog: new features, improvements and fixes, release by release.",
      path: "/updates",
    });

export default function Page() {
  requireJetEdition();
  return <UpdatesIndex />;
}
