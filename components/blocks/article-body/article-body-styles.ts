const styles = {
  body:
    "body " +
    "[&_>_h2]:m-0 [&_>_h2]:font-[1000] [&_>_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_>_h2]:mt-[40px] [&_>_h2]:[font-size:1.6rem] [&_>_h2]:tracking-[-0.01em] [&_>_h2]:leading-[1.2] [&_>_h2:first-child]:mt-0 [&_>_h2[id]]:[scroll-margin-top:calc(var(--header-height)_+_24px)] " +
    "[&_>_h3]:m-0 [&_>_h3]:font-[1000] [&_>_h3]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_>_h3]:mt-[40px] [&_>_h3]:[font-size:1.4rem] [&_>_h3]:tracking-[-0.01em] [&_>_h3]:leading-[1.3] [&_>_h3[id]]:[scroll-margin-top:calc(var(--header-height)_+_24px)] " +
    "[&_>_p]:text-muted-foreground [&_>_p]:font-[1000] [&_>_p]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_>_p]:[margin:24px_0_0] [&_>_p]:[font-size:16px] [&_>_p]:leading-[1.5] " +
    "[&_>_p.lead]:text-foreground [&_>_p.lead]:[font-size:18px] [&_>_p.lead]:leading-[1.5] " +
    "[&_>_:first-child]:mt-0 " +
    "[&_a:not([data-slot=button])]:text-foreground [&_a:not([data-slot=button])]:underline [&_a:not([data-slot=button])]:underline-offset-4 [&_a:not([data-slot=button])]:decoration-stroke [&_a:not([data-slot=button])]:hover:decoration-foreground " +
    "[&_strong]:text-foreground [&_strong]:font-[1000] [&_strong]:[font-variation-settings:\"opsz\"_14,_\"wght\"_600] " +
    "[&_>_ul]:[margin:20px_0_0] [&_>_ul]:[padding:0_0_0_20px] [&_>_ul]:text-muted-foreground [&_>_ul]:[font-size:16px] [&_>_ul]:leading-[1.5] " +
    "[&_>_ul_>_li]:m-0 [&_>_ul_>_li]:p-0 [&_>_ul_>_li]:text-muted-foreground [&_>_ul_>_li]:font-[1000] [&_>_ul_>_li]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_>_ul_>_li::marker]:text-muted-foreground " +
    "[&_>_ol]:[margin:20px_0_0] [&_>_ol]:[padding:0_0_0_22px] [&_>_ol]:list-decimal [&_>_ol]:text-muted-foreground [&_>_ol]:[font-size:16px] [&_>_ol]:leading-[1.5] " +
    "[&_>_ol_>_li]:m-0 [&_>_ol_>_li]:p-0 [&_>_ol_>_li]:text-muted-foreground [&_>_ol_>_li]:font-[1000] [&_>_ol_>_li]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_>_ol_>_li+li]:mt-[8px] [&_>_ol_>_li::marker]:text-foreground " +
    "[&_table]:w-full [&_table]:min-w-[520px] [&_table]:[border-collapse:collapse] [&_table]:text-muted-foreground [&_table]:[font-size:12px] [&_table]:font-[1000] [&_table]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_table]:leading-[1.2] " +
    "[&_th]:h-[44px] [&_th]:[padding:10px] [&_th]:text-left [&_th]:[vertical-align:middle] [&_th]:bg-card " +
    "[&_td]:h-[44px] [&_td]:[padding:10px] [&_td]:text-left [&_td]:[vertical-align:middle] [&_td]:bg-panel " +
    "[&_tr_+_tr_th]:[border-top:1px_solid_var(--color-rule)] [&_tr_+_tr_td]:[border-top:1px_solid_var(--color-rule)] " +
    "max-[809.98px]:[&_table]:min-w-0 max-[809.98px]:[&_td]:h-[68px]",
  cover: "cover mb-[24px]",
  lead: "lead",
  quote:
    "quote [margin:20px_0_0] [padding:20px_20px_20px_22px] [border:1px_dashed_var(--color-rule)] [border-radius:0_8px_8px_0] bg-card text-muted-foreground font-sans [font-size:16px] font-medium [font-variation-settings:normal] leading-[1.5] [&_p]:m-0 [&_p]:text-inherit [&_p]:[font:inherit] [&_p]:[font-variation-settings:normal]",
  tableWrap: "tableWrap [margin:20px_0_0] overflow-x-auto border-0 bg-transparent",
  code:
    "code [margin:20px_0_0] [border:1px_solid_var(--color-rule)] [border-style:dashed] bg-card [&_pre]:m-0 [&_pre]:[padding:30px] [&_pre]:overflow-auto [&_pre]:text-foreground [&_pre]:font-mono [&_pre]:[font-size:14px] [&_pre]:font-normal [&_pre]:[font-variation-settings:normal] [&_pre]:leading-[1.5] [&_pre]:whitespace-pre",
  cta: "cta [margin:32px_0_0] [padding:24px] [border:1px_dashed_var(--color-rule)] [border-radius:8px] bg-card",
  ctaTitle:
    "ctaTitle m-0 mb-[10px] text-foreground [font-size:18px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] leading-[1.3]",
  ctaText:
    "ctaText m-0 text-muted-foreground [font-size:16px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] leading-[1.5]",
  ctaActions: "ctaActions flex flex-wrap items-center gap-[10px] mt-[20px]",
  methodology:
    "methodology [margin:32px_0_0] [padding-top:20px] [border-top:1px_solid_var(--color-rule)]",
  sources:
    "sources [margin:32px_0_0] [padding-top:20px] [border-top:1px_solid_var(--color-rule)]",
  metaHeading:
    "metaHeading m-0 mb-[12px] text-foreground font-mono [font-size:12px] font-normal [font-variation-settings:normal] uppercase tracking-[0.06em] leading-[1.4]",
  metaText:
    "metaText m-0 text-muted-foreground [font-size:13px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] leading-[1.6]",
  metaList:
    "metaList m-0 [padding:0_0_0_18px] list-disc text-muted-foreground [font-size:13px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] leading-[1.6] [&_li+li]:mt-[6px] [&_li::marker]:text-muted-foreground",
} as const;

export type ArticleBodyClassKey = keyof typeof styles;

export function cx(...keys: Array<ArticleBodyClassKey | string | false | null | undefined>) {
  return keys
    .filter((key): key is string => Boolean(key))
    .map((key) => (key in styles ? styles[key as ArticleBodyClassKey] : key))
    .join(" ");
}

export default styles;
