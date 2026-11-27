import { Google_Sans, Google_Sans_Code } from "next/font/google";

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

export const fontVariables = `${googleSans.variable} ${googleSansCode.variable}`;
