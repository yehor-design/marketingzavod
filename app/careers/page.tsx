import { CareersPage } from "@/components/careers/careers-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers – Jet",
  description:
    "Join Jet, a remote-first team making the web faster. See our benefits and open roles in engineering, design, marketing and customer success.",
  path: "/careers",
});

export default function Page() {
  return <CareersPage />;
}
