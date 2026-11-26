"use client";

import { CtaBand } from "@/components/blocks/cta-band";

const NBSP = "\u00A0";

const JET_CTA_ACTIONS = [
  { href: "/waitlist", text: `Join${NBSP}waitlist`, location: "footer_cta" },
] as const;

/** Homepage footer CTA, reused on every other page that closes with this block. */
export function SiteCta({
  titleId = "site-cta",
  spacing = "page",
}: {
  titleId?: string;
  spacing?: "page" | "home";
}) {
  return (
    <CtaBand
      titleId={titleId}
      title="Boost your site speed today."
      description="Try Jet now—one click, instant performance. No risk, cancel anytime."
      actions={JET_CTA_ACTIONS}
      spacing={spacing}
    />
  );
}
