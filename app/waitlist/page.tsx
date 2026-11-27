import { WaitlistPage } from "@/components/waitlist/waitlist-page";
import { isBg } from "@/lib/edition";
import { requireJetEdition } from "@/lib/edition-routes";
import { bgPageMetadata, pageMetadata } from "@/lib/seo";

export const metadata = isBg
  ? bgPageMetadata("notFound")
  : pageMetadata({
      title: "Waitlist – Jet",
      description:
        "Jet is launching soon. Join the waitlist to be among the first to get access.",
      path: "/waitlist",
    });

export default function Page() {
  requireJetEdition();
  return <WaitlistPage />;
}
