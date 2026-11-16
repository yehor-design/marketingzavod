import { PricingPage } from "@/components/pricing/pricing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pricing – Jet",
  description:
    "Compare Jet plans: Starter, Pro and Agency. Monthly or yearly billing, with a full feature comparison for every plan.",
  path: "/pricing",
});

export default function Page() {
  return <PricingPage />;
}
