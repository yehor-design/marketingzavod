/** Tailwind utility map for the LinkList block (list and CardGrid-style link-card variants). */
const styles = {
  section:
    "section text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [padding:64px_0_0]",
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto",
  listGroup:
    "listGroup flex flex-col gap-[12px] text-left",
  listTitle:
    "listTitle m-0 text-foreground font-mono [font-size:12px] font-medium [font-variation-settings:normal] uppercase tracking-[0.06em] leading-[1.4]",
  listUl:
    "listUl m-0 p-0 list-none flex flex-col gap-[4px]",
  listLi:
    "listLi m-0 p-0",
  listLink:
    "listLink box-border inline-flex flex-col items-start gap-[2px] min-h-[28px] [padding:4px_12px_4px_0] text-muted-foreground font-display [font-size:14px] font-medium [font-variation-settings:\"opsz\"_14,_\"wght\"_500] leading-[1.5] tracking-normal [transition:padding_0.4s_cubic-bezier(0.22,_1,_0.36,_1),_color_0.2s_linear] hover:pl-[4px] hover:text-foreground focus-visible:pl-[4px] focus-visible:text-foreground motion-reduce:transition-none",
  listLabel:
    "listLabel text-current [overflow-wrap:break-word]",
  listDesc:
    "listDesc text-muted-foreground [font-size:13px] font-normal [font-variation-settings:normal] leading-[1.4] [overflow-wrap:break-word]",
  cardsWrap:
    "cardsWrap flex flex-col gap-[20px] text-left",
  cardsTitle:
    "cardsTitle m-0 text-foreground font-display [font-size:1.4rem] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] tracking-[-0.01em] leading-[1.3]",
  cardsGrid:
    "cardsGrid relative grid [grid-template-columns:1fr] m-0 p-0 list-none [border:1px_dashed_var(--color-rule)] min-[810px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[809.98px]:[&_li_+_li]:[border-top:1px_dashed_var(--color-rule)] min-[810px]:[&_li:nth-child(n_+_3)]:[border-top:1px_dashed_var(--color-rule)] min-[810px]:[&_li:nth-child(even)]:[border-left:1px_dashed_var(--color-rule)]",
  cardLi:
    "cardLi relative min-w-0 flex flex-col",
  cardLink:
    "cardLink relative flex flex-1 flex-col items-start gap-[8px] w-full [padding:28px_24px] text-left text-foreground min-[810px]:[padding:32px_28px] transition-colors hover:bg-wash focus-visible:outline-1 focus-visible:outline-foreground focus-visible:-outline-offset-2 motion-reduce:transition-none",
  cardLabel:
    "cardLabel w-full min-w-0 text-foreground font-display [font-size:16px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] tracking-[-0.01em] leading-[1.4] [overflow-wrap:break-word]",
  cardDesc:
    "cardDesc w-full min-w-0 text-muted-foreground font-display [font-size:14px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] leading-[1.5] [overflow-wrap:break-word]",
} as const;

export type LinkListClassKey = keyof typeof styles;

export function cx(...keys: Array<LinkListClassKey | string | false | null | undefined>) {
  return keys
    .filter((key): key is string => Boolean(key))
    .map((key) => (key in styles ? styles[key as LinkListClassKey] : key))
    .join(" ");
}

export default styles;
