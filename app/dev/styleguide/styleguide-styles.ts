const styles = {
  "typeList": "typeList flex flex-col m-0 [&_>_div]:grid [&_>_div]:[grid-template-columns:1fr] [&_>_div]:gap-[8px] [&_>_div]:[padding:20px_0] [&_>_div]:[border-top:1px_dashed_var(--color-rule)] [&_dt]:flex [&_dt]:flex-col [&_dt]:gap-[2px] [&_dd]:min-w-0 [&_dd]:m-0 [&_dd]:wrap-anywhere min-[810px]:[&_>_div]:[grid-template-columns:280px_minmax(0,_1fr)] min-[810px]:[&_>_div]:gap-[24px] min-[810px]:[&_>_div]:items-center",
  "navLink": "navLink inline-flex gap-[5px] items-center h-[30px] [padding:0_12px] [transition:padding_0.4s_cubic-bezier(0.22,_1,_0.36,_1)] hover:[padding:0_12px_4px] focus-visible:[padding:0_12px_4px] [&:hover_.count-badge]:bg-brand [&:hover_.count-badge]:text-background [&:focus-visible_.count-badge]:bg-brand [&:focus-visible_.count-badge]:text-background",
  "frame": "frame grid [grid-template-columns:repeat(3,_1fr)] [border:1px_dashed_var(--color-rule)]",
  "images": "images grid [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:24px_16px] [&_figure]:min-w-0 [&_figure]:m-0 min-[810px]:[grid-template-columns:repeat(4,_minmax(0,_1fr))]",
  "cell": "cell relative grid place-items-center h-[160px] [&_+_.cell]:[border-left:1px_dashed_var(--color-rule)]",
  "chip": "chip h-[64px] mb-[8px] [box-shadow:inset_0_0_0_1px_var(--color-border)]",
  "tokenUse": "tokenUse text-muted-foreground font-mono [font-size:12px] font-medium [font-variation-settings:normal] tracking-[0.02em] leading-[1.5]",
  "note": "note [max-width:68ch] [margin:0_0_24px] text-muted-foreground [font-size:14px] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] leading-[1.5] [&_a]:text-foreground [&_a:hover]:underline [&_code]:text-foreground [&_code]:font-mono [&_code]:[font-size:12px] [&_code]:font-normal [&_code]:[font-variation-settings:normal]",
  "tokenValue": "tokenValue text-muted-foreground font-mono [font-size:12px] font-medium [font-variation-settings:normal] tracking-[0.02em] leading-[1.5]",
  "portrait": "portrait relative [aspect-ratio:1] overflow-hidden",
  "caption": "caption text-muted-foreground font-mono [font-size:12px] font-medium [font-variation-settings:normal] tracking-[0.02em] leading-[1.5] [max-width:76ch] [margin:16px_0_0]",
  "row": "row flex flex-wrap gap-[16px] items-center",
  "tokenName": "tokenName [font-size:14px] leading-[1.5]",
  "radii": "radii m-0 p-0 list-none [&_li]:flex [&_li]:flex-col [&_li]:gap-[2px] [&_li]:min-w-0 grid [grid-template-columns:repeat(auto-fill,_minmax(120px,_1fr))] [gap:24px_16px]",
  "section": "section [&_h2]:[margin:0_0_20px] [&_h2]:text-muted-foreground [&_h2]:font-mono [&_h2]:[font-size:12px] [&_h2]:font-medium [&_h2]:[font-variation-settings:normal] [&_h2]:tracking-[0.06em]",
  "guide": "guide flex flex-col gap-[72px] max-w-[1168px] mx-auto my-0 text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h1]:[margin:0_0_8px] [&_h1]:[font-size:32px] [&_h1]:tracking-[-0.03em]",
  "swatches": "swatches m-0 p-0 list-none grid [grid-template-columns:repeat(auto-fill,_minmax(210px,_1fr))] [gap:24px_16px] [&_li]:flex [&_li]:flex-col [&_li]:gap-[2px] [&_li]:min-w-0",
  "form": "form grid [grid-template-columns:1fr] gap-[20px] max-w-[560px] min-[810px]:[grid-template-columns:1fr_1fr]",
  "spacing": "spacing m-0 p-0 list-none flex flex-wrap gap-[16px] items-end mt-[32px] [&_li]:flex [&_li]:flex-col [&_li]:gap-[6px] [&_li]:items-start",
  "tableWrap": "tableWrap overflow-x-auto",
  "radiusBox": "radiusBox w-[64px] h-[40px] mb-[8px] bg-secondary",
  "spaceBar": "spaceBar h-[24px] bg-brand",
  "table": "table w-full min-w-[640px] [border-collapse:collapse] [font-size:12px] leading-[1.4] [&_th]:[padding:12px_16px_12px_0] [&_th]:text-left [&_th]:[vertical-align:top] [&_td]:[padding:12px_16px_12px_0] [&_td]:[border-top:1px_dashed_var(--color-rule)] [&_td]:text-left [&_td]:[vertical-align:top] [&_th]:[border-top:0] [&_th]:text-muted-foreground [&_th]:font-mono [&_th]:font-medium [&_th]:[font-variation-settings:normal] [&_th]:tracking-[0.02em] [&_td]:text-muted-foreground [&_td]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_td:first-child]:text-foreground [&_td:first-child]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_td:first-child]:whitespace-nowrap"
};

export default styles;
