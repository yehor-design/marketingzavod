import { SegmentPage } from "@/components/pages/segment-page";
import { IMOTI_SEGMENT } from "@/content/bg/segments/imoti";
import { ui } from "@/content/ui";
import { isBg } from "@/lib/edition";
import { requireBgEdition } from "@/lib/edition-routes";
import { bgPageMetadata } from "@/lib/seo";

export const metadata = isBg
  ? bgPageMetadata("nedvizhimiImoti")
  : { title: ui.notFound.metaTitle };

export default function NedvizhimiImotiPage() {
  requireBgEdition();
  return <SegmentPage data={IMOTI_SEGMENT} />;
}
