import { SegmentPage } from "@/components/pages/segment-page";
import { getMagaziniSegment } from "@/content/bg/segments/magazini";
import { ui } from "@/content/ui";
import { isBg } from "@/lib/edition";
import { requireBgEdition } from "@/lib/edition-routes";
import { bgPageMetadata } from "@/lib/seo";

export const metadata = isBg
  ? bgPageMetadata("onlaynMagazini")
  : { title: ui.notFound.metaTitle };

export default function OnlaynMagaziniPage() {
  requireBgEdition();
  return <SegmentPage data={getMagaziniSegment()} />;
}
