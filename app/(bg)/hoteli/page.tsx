import { notFound } from "next/navigation";
import { SegmentPage } from "@/components/pages/segment-page";
import { isGateOpen } from "@/content/bg/gates";
import { HOTELI_SEGMENT } from "@/content/bg/segments/hoteli";
import { ui } from "@/content/ui";
import { isBg } from "@/lib/edition";
import { requireBgEdition } from "@/lib/edition-routes";
import { bgPageMetadata } from "@/lib/seo";

export const metadata = isBg
  ? isGateOpen("hotels")
    ? bgPageMetadata("hoteli")
    : bgPageMetadata("notFound")
  : { title: ui.notFound.metaTitle };

export default function HoteliPage() {
  requireBgEdition();
  if (!isGateOpen("hotels")) {
    notFound();
  }
  return <SegmentPage data={HOTELI_SEGMENT} />;
}
