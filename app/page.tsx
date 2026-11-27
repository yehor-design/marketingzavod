import { HomePage } from "@/components/home/home-page";
import { JsonLd } from "@/components/json-ld";
import { BgHomePage } from "@/components/pages/bg-home-page";
import { buildBgWebSiteJsonLd } from "@/lib/bg-json-ld";
import { isBg } from "@/lib/edition";
import { bgPageMetadata, pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { socialLinks } from "@/lib/routes";

export const metadata = isBg
  ? bgPageMetadata("home")
  : pageMetadata({
      title: "Jet – Lightning-Fast Website Optimization",
      description:
        "Supercharge your website with Jet. Instantly optimize images, code, and speed with no code required. Boost SEO, improve user experience, and increase conversions—effortlessly.",
      path: "/",
    });

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/brand/logo.svg"),
  description: SITE_DESCRIPTION,
  sameAs: socialLinks.map((link) => link.href),
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function Page() {
  return (
    <>
      {isBg ? (
        <>
          <JsonLd data={buildBgWebSiteJsonLd()} />
          <BgHomePage />
        </>
      ) : (
        <>
          <JsonLd data={organization} />
          <JsonLd data={website} />
          <HomePage />
        </>
      )}
    </>
  );
}
