import type { Metadata } from "next";
import { StyleGuide } from "./styleguide";

export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

export default function StyleGuideDevPage() {
  return <StyleGuide />;
}
