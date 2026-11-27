import type { Metadata, Viewport } from "next";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { ConsentSettings } from "@/components/consent/consent-settings";
import { JsonLd } from "@/components/json-ld";
import { MotionProvider } from "@/components/motion-provider";
import { SiteShell } from "@/components/site-shell";
import { GoogleTagManager } from "@/components/tracking/gtm";
import { ConsentedSpeedInsights } from "@/components/tracking/speed-insights";
import { TrackingProvider } from "@/components/tracking/tracking-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BG_SITE_METADATA } from "@/content/bg/metadata";
import { buildBgOrganizationJsonLd } from "@/lib/bg-json-ld";
import { EDITION, isBg } from "@/lib/edition";
import { fontVariables } from "@/lib/fonts/active";
import { ALLOW_INDEXING, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const TITLE = isBg
  ? BG_SITE_METADATA.defaultTitle
  : "Jet – Lightning-Fast Website Optimization";
const LOCALE = isBg ? BG_SITE_METADATA.locale : "en_US";
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION?.trim();

const BLOCK_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  noarchive: true,
  nosnippet: true,
  noimageindex: true,
  googleBot: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    "max-video-preview": -1,
    "max-image-preview": "none",
    "max-snippet": -1,
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_DESCRIPTION,
    locale: LOCALE,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  // Hidden from search engines until NEXT_PUBLIC_ALLOW_INDEXING=true in production.
  robots: ALLOW_INDEXING ? { index: true, follow: true } : BLOCK_ROBOTS,
  // Fallback for Search Console when DNS verification is not available.
  verification: gscVerification ? { google: gscVerification } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={isBg ? "bg" : "en"}
      data-edition={EDITION}
      className={`dark bg-background text-[125%] scheme-dark max-[809.98px]:text-[87.5%] min-[810px]:max-[1199.98px]:text-[112.5%] ${fontVariables}`}
    >
      <body>
        {isBg ? <JsonLd data={buildBgOrganizationJsonLd()} /> : null}
        <GoogleTagManager />
        <MotionProvider>
          <TooltipProvider>
            {/* First in the tab order, though it sits at the bottom of the screen. */}
            <ConsentBanner />
            <SiteShell>{children}</SiteShell>
            <ConsentSettings />
          </TooltipProvider>
        </MotionProvider>
        <TrackingProvider />
        <ConsentedSpeedInsights />
      </body>
    </html>
  );
}
