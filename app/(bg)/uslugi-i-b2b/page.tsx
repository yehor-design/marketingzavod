import { SegmentPage } from "@/components/pages/segment-page";
import { B2B_SEGMENT } from "@/content/bg/segments/b2b";
import { ui } from "@/content/ui";
import { isBg } from "@/lib/edition";
import { requireBgEdition } from "@/lib/edition-routes";
import { bgPageMetadata } from "@/lib/seo";

export const metadata = isBg ? bgPageMetadata("uslugiIB2b") : { title: ui.notFound.metaTitle };

export default function UslugiIB2bPage() {
  requireBgEdition();
  return <SegmentPage data={B2B_SEGMENT} />;
}
