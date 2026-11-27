import { Google_Sans, JetBrains_Mono } from "next/font/google";

const googleSansCyrillic = Google_Sans({
  subsets: ["latin", "cyrillic"],
  weight: "variable",
  axes: ["opsz"],
  display: "swap",
  variable: "--font-google-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: "variable",
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const fontVariables = `${googleSansCyrillic.variable} ${jetbrainsMono.variable}`;
