const styles = {
  body:
    "body w-full max-w-[650px] " +
    "[&_h2]:mt-[40px] [&_h2]:[font-size:1.6rem] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:leading-[1.2] [&_h2]:tracking-[-0.01em] [&_h2]:text-balance " +
    "[&_p]:mt-[24px] [&_p]:text-muted-foreground [&_p]:[font-size:16px] [&_p]:font-[1000] [&_p]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_p]:leading-[1.5] [&_p]:tracking-normal " +
    "[&_>_p:first-child]:mt-0 [&_>_h2:first-child]:mt-0 " +
    "[&_a:not([data-slot=button])]:text-foreground [&_a:not([data-slot=button])]:no-underline [&_a:not([data-slot=button])]:hover:underline " +
    "[&_ul]:[margin:20px_0_0] [&_ul]:p-0 [&_ul]:list-none " +
    "[&_li]:relative [&_li]:[padding-inline-start:2ch] [&_li]:text-muted-foreground [&_li]:[font-size:16px] [&_li]:font-[1000] [&_li]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_li]:leading-[1.5] " +
    "[&_li::before]:[content:\"\u2022\"] [&_li::before]:absolute [&_li::before]:[inset-inline-start:0] [&_li_p]:m-0 " +
    "[&_h2[id]]:[scroll-margin-top:calc(var(--header-height)_+_24px)] " +
    "[&_h3]:mt-[32px] [&_h3]:[font-size:1.3rem] [&_h3]:font-[1000] [&_h3]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h3]:leading-[1.3] [&_h3]:tracking-[-0.01em] [&_h3[id]]:[scroll-margin-top:calc(var(--header-height)_+_24px)] " +
    "[&_>_p.lead]:text-foreground [&_>_p.lead]:[font-size:18px] [&_>_p.lead]:leading-[1.5] " +
    "[&_strong]:text-foreground [&_strong]:font-[1000] [&_strong]:[font-variation-settings:\"opsz\"_14,_\"wght\"_600] " +
    "[&_ol]:[margin:20px_0_0] [&_ol]:[padding-inline-start:22px] [&_ol]:list-decimal " +
    "[&_ol_li]:[padding-inline-start:0] [&_ol_li+li]:mt-[8px] [&_ol_li::before]:content-none [&_ol_li::marker]:text-foreground " +
    "[&_table]:w-full [&_table]:min-w-[520px] [&_table]:[border-collapse:collapse] [&_table]:text-muted-foreground [&_table]:[font-size:13px] [&_table]:font-[1000] [&_table]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_table]:leading-[1.4] " +
    "[&_th]:h-[44px] [&_th]:[padding:10px] [&_th]:text-left [&_th]:[vertical-align:middle] [&_th]:bg-card " +
    "[&_td]:[padding:10px] [&_td]:text-left [&_td]:[vertical-align:top] [&_td]:bg-panel " +
    "[&_tr_+_tr_th]:[border-top:1px_solid_var(--color-rule)] [&_tr_+_tr_td]:[border-top:1px_solid_var(--color-rule)] " +
    "max-[809.98px]:[&_table]:min-w-0 " +
    "[&_.cta_p]:mt-0 [&_.ctaTitle]:mb-[10px] [&_.ctaTitle]:text-foreground [&_.ctaTitle]:[font-size:18px] [&_.ctaTitle]:leading-[1.3] " +
    "[&_.metaHeading]:mt-0 [&_.metaHeading]:mb-[12px] [&_.metaHeading]:text-foreground [&_.metaHeading]:font-mono [&_.metaHeading]:[font-size:12px] [&_.metaHeading]:font-normal [&_.metaHeading]:[font-variation-settings:normal] [&_.metaHeading]:uppercase [&_.metaHeading]:tracking-[0.06em] [&_.metaHeading]:leading-[1.4] " +
    "[&_.metaText]:mt-0 [&_.metaText]:[font-size:13px] [&_.metaText]:leading-[1.6] " +
    "[&_.metaList]:m-0 [&_.metaList]:[padding:0_0_0_18px] [&_.metaList]:list-disc [&_.metaList_li]:[padding-inline-start:0] [&_.metaList_li]:[font-size:13px] [&_.metaList_li]:leading-[1.6] [&_.metaList_li+li]:mt-[6px] [&_.metaList_li::before]:content-none [&_.metaList_li::marker]:text-muted-foreground",
  lead: "lead",
  tableWrap: "tableWrap [margin:20px_0_0] overflow-x-auto border-0 bg-transparent",
  cta: "cta [margin:32px_0_0] [padding:24px] [border:1px_dashed_var(--color-rule)] [border-radius:8px] bg-card",
  ctaTitle: "ctaTitle",
  ctaText: "ctaText",
  ctaActions: "ctaActions flex flex-wrap items-center gap-[10px] mt-[20px]",
  methodology:
    "methodology [margin:32px_0_0] [padding-top:20px] [border-top:1px_solid_var(--color-rule)]",
  sources:
    "sources [margin:32px_0_0] [padding-top:20px] [border-top:1px_solid_var(--color-rule)]",
  metaHeading: "metaHeading",
  metaText: "metaText",
  metaList: "metaList",
} as const;

export type LegalBodyClassKey = keyof typeof styles;

export function cx(...keys: Array<LegalBodyClassKey | string | false | null | undefined>) {
  return keys
    .filter((key): key is string => Boolean(key))
    .map((key) => (key in styles ? styles[key as LegalBodyClassKey] : key))
    .join(" ");
}

export default styles;
