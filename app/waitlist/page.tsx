import { WaitlistPage } from "@/components/waitlist/waitlist-page";
import { requireJetEdition } from "@/lib/edition-routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Waitlist – Jet",
  description:
    "Jet is launching soon. Join the waitlist to be among the first to get access.",
  path: "/waitlist",
});

export default function Page() {
  requireJetEdition();
  return <WaitlistPage />;
}
