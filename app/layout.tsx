import type { Metadata, Viewport } from "next";
import { Fragment_Mono, Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionProvider } from "@/components/motion-provider";
import { SiteShell } from "@/components/site-shell";
import { GoogleTagManager, GoogleTagManagerNoscript } from "@/components/tracking/gtm";
import { TrackingProvider } from "@/components/tracking/tracking-provider";
import { IS_PRODUCTION_DEPLOY, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-geist-mono",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-fragment-mono",
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
      className={`${geist.variable} ${geistMono.variable} ${fragmentMono.variable}`}
    >
      <body>
        <GoogleTagManagerNoscript />
        <GoogleTagManager />
        <MotionProvider>
          <SiteShell>{children}</SiteShell>
        </MotionProvider>
        <TrackingProvider />
        {/* Cookieless and anonymous, so it does not wait for consent. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
