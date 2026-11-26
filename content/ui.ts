import { bgUi } from "@/content/bg/ui";
import { jetUi } from "@/content/jet/ui";
import type { UiDictionary } from "@/content/ui-types";
import { isBg } from "@/lib/edition";

/** Active edition UI dictionary selected at build time from NEXT_PUBLIC_SITE_EDITION. */
export const ui: UiDictionary = isBg ? bgUi : jetUi;
