import type { Metadata, Viewport } from "next";
import { Google_Sans, Google_Sans_Code } from "next/font/google";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { ConsentSettings } from "@/components/consent/consent-settings";
import { MotionProvider } from "@/components/motion-provider";
import { SiteShell } from "@/components/site-shell";
import { GoogleTagManager } from "@/components/tracking/gtm";
import { ConsentedSpeedInsights } from "@/components/tracking/speed-insights";
import { TrackingProvider } from "@/components/tracking/tracking-provider";
import { IS_PRODUCTION_DEPLOY, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const googleSans = Google_Sans({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  display: "swap",
  variable: "--font-google-sans",
});

const googleSansCode = Google_Sans_Code({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-google-sans-code",
});

const TITLE = "Jet – Lightning-Fast Website Optimization";
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION?.trim();

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
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  // Only the production deployment may be indexed. Previews answer noindex.
  robots: IS_PRODUCTION_DEPLOY ? { index: true, follow: true } : { index: false, follow: false },
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
      lang="en"
      className={`dark bg-background text-[125%] scheme-dark max-[809.98px]:text-[87.5%] min-[810px]:max-[1199.98px]:text-[112.5%] ${googleSans.variable} ${googleSansCode.variable}`}
    >
      <body>
        <GoogleTagManager />
        <MotionProvider>
          {/* First in the tab order, though it sits at the bottom of the screen. */}
          <ConsentBanner />
          <SiteShell>{children}</SiteShell>
          <ConsentSettings />
        </MotionProvider>
        <TrackingProvider />
        <ConsentedSpeedInsights />
      </body>
    </html>
  );
}
