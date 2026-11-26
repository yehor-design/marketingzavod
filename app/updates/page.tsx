import { UpdatesIndex } from "@/components/updates/changelog";
import { requireJetEdition } from "@/lib/edition-routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Updates – Jet",
  description:
    "The Jet changelog: new features, improvements and fixes, release by release.",
  path: "/updates",
});

export default function Page() {
  requireJetEdition();
  return <UpdatesIndex />;
}
