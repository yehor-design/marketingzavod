import { CareersPage } from "@/components/careers/careers-page";
import { isBg } from "@/lib/edition";
import { requireJetEdition } from "@/lib/edition-routes";
import { bgPageMetadata, pageMetadata } from "@/lib/seo";

export const metadata = isBg
  ? bgPageMetadata("notFound")
  : pageMetadata({
      title: "Careers – Jet",
      description:
        "Join Jet, a remote-first team making the web faster. See our benefits and open roles in engineering, design, marketing and customer success.",
      path: "/careers",
    });

export default function Page() {
  requireJetEdition();
  return <CareersPage />;
}
