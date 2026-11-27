import { CheckoutPage } from "@/components/checkout/checkout-page";
import { isBg } from "@/lib/edition";
import { requireJetEdition } from "@/lib/edition-routes";
import { bgPageMetadata, pageMetadata } from "@/lib/seo";

export const metadata = isBg
  ? bgPageMetadata("notFound")
  : pageMetadata({
      title: "Checkout – Jet",
      description:
        "Choose a payment option and get access to the Jet template with the bonus SaaS launch kit.",
      path: "/checkout",
      index: false,
    });

export default function Page() {
  requireJetEdition();
  return <CheckoutPage />;
}
