const styles = {
  body: "body [&_h2]:m-0 [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h3]:m-0 [&_h3]:font-[1000] [&_h3]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_p]:text-muted-foreground [&_p]:font-[1000] [&_p]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_li]:text-muted-foreground [&_li]:font-[1000] [&_li]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_h2]:mt-[40px] [&_h2]:[font-size:1.6rem] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] [&_h2:first-child]:mt-0 [&_h3]:mt-[40px] [&_h3]:[font-size:1.4rem] [&_h3]:tracking-[-0.01em] [&_h3]:leading-[1.3] [&_>_:first-child]:mt-0 [&_p]:[margin:24px_0_0] [&_p]:[font-size:16px] [&_p]:leading-[1.5] [&_ul]:[margin:20px_0_0] [&_ul]:[padding:0_0_0_20px] [&_ul]:text-muted-foreground [&_ul]:[font-size:16px] [&_ul]:leading-[1.5] [&_li]:m-0 [&_li]:p-0 [&_li::marker]:text-muted-foreground [&_table]:w-full [&_table]:min-w-[520px] [&_table]:[border-collapse:collapse] [&_table]:text-muted-foreground [&_table]:[font-size:12px] [&_table]:font-[1000] [&_table]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_table]:leading-[1.2] [&_th]:h-[44px] [&_th]:[padding:10px] [&_th]:text-left [&_th]:[vertical-align:middle] [&_td]:h-[44px] [&_td]:[padding:10px] [&_td]:text-left [&_td]:[vertical-align:middle] [&_th]:bg-card [&_td]:bg-panel [&_tr_+_tr_th]:[border-top:1px_solid_var(--color-rule)] [&_tr_+_tr_td]:[border-top:1px_solid_var(--color-rule)] max-[809.98px]:[&_table]:min-w-0 max-[809.98px]:[&_td]:h-[68px]",
  cover: "cover mb-[24px]",
  quote:
    "quote [margin:20px_0_0] [padding:20px_20px_20px_22px] [border:1px_dashed_var(--color-rule)] [border-radius:0_8px_8px_0] bg-card text-muted-foreground font-sans [font-size:16px] font-medium [font-variation-settings:normal] leading-[1.5] [&_p]:m-0 [&_p]:text-inherit [&_p]:[font:inherit] [&_p]:[font-variation-settings:normal]",
  tableWrap: "tableWrap [margin:20px_0_0] overflow-x-auto border-0 bg-transparent",
  code: "code [margin:20px_0_0] [border:1px_solid_var(--color-rule)] [border-style:dashed] bg-card [&_pre]:m-0 [&_pre]:[padding:30px] [&_pre]:overflow-auto [&_pre]:text-foreground [&_pre]:font-mono [&_pre]:[font-size:14px] [&_pre]:font-normal [&_pre]:[font-variation-settings:normal] [&_pre]:leading-[1.5] [&_pre]:whitespace-pre",
} as const;

export type ArticleBodyClassKey = keyof typeof styles;

export function cx(...keys: Array<ArticleBodyClassKey | string | false | null | undefined>) {
  return keys
    .filter((key): key is string => Boolean(key))
    .map((key) => (key in styles ? styles[key as ArticleBodyClassKey] : key))
    .join(" ");
}

export default styles;
