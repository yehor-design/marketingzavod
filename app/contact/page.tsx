import { ContactPage } from "@/components/contact/contact-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact – Jet",
  description:
    "Get in touch with the Jet team. Ask a question, request support or talk to sales, and we will get back to you as soon as possible.",
  path: "/contact",
});

export default function Page() {
  return <ContactPage />;
}
