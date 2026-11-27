import { SegmentPage } from "@/components/pages/segment-page";
import { SMYANA_SEGMENT } from "@/content/bg/segments/smyana";
import { ui } from "@/content/ui";
import { isBg } from "@/lib/edition";
import { requireBgEdition } from "@/lib/edition-routes";
import { bgPageMetadata } from "@/lib/seo";

export const metadata = isBg
  ? bgPageMetadata("smyanaNaAgentsiya")
  : { title: ui.notFound.metaTitle };

export default function SmyanaNaAgentsiyaPage() {
  requireBgEdition();
  return <SegmentPage data={SMYANA_SEGMENT} />;
}
