import { WaitlistPage } from "@/components/waitlist/waitlist-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Waitlist – Jet",
  description:
    "Jet is launching soon. Join the waitlist to be among the first to get access.",
  path: "/waitlist",
});

export default function Page() {
  return <WaitlistPage />;
}
