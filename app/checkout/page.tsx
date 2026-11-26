import { CheckoutPage } from "@/components/checkout/checkout-page";
import { requireJetEdition } from "@/lib/edition-routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
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
