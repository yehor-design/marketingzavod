const styles = {
  blog: "blog [--rule:var(--color-rule)] text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h1]:font-[inherit] [&_h2]:font-[inherit] [&_h3]:font-[inherit] [&_p]:font-[inherit] [&_button]:font-[1000] [&_button]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_button]:cursor-pointer",
  column: "column [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto",
  index: "index pt-[25px]",
  kicker:
    "kicker flex gap-[16px] items-center [margin:0_0_24px] [padding:0_34px] [&_h1]:m-0 [&_h1]:font-[1000] [&_h1]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:m-0 [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h1]:[font-size:2.2rem] [&_h1]:tracking-[-0.02em] [&_h1]:leading-[1.2] [&_h2]:[font-size:2.2rem] [&_h2]:tracking-[-0.02em] [&_h2]:leading-[1.2] [&_h2]:text-muted-foreground [&_span]:[font-size:2.2rem] [&_span]:tracking-[-0.02em] [&_span]:leading-[1.2] max-[809.98px]:pr-[20px] max-[809.98px]:pl-[24px]",
  featureGrid:
    "featureGrid [outline:1px_dashed_var(--color-rule)] [outline-offset:-1px] grid [grid-template-columns:1fr] m-0 p-0 list-none [&_>_.small]:[border-top:1px_dashed_var(--color-rule)] min-[810px]:[grid-template-columns:1fr_1fr] min-[810px]:[&_>_.small]:relative min-[810px]:[&_>_.small]:[border-top:0] min-[810px]:[&_>_.small::before]:content-[''] min-[810px]:[&_>_.small::before]:absolute min-[810px]:[&_>_.small::before]:top-0 min-[810px]:[&_>_.small::before]:right-0 min-[810px]:[&_>_.small::before]:left-0 min-[810px]:[&_>_.small::before]:[border-top:1px_dashed_var(--color-rule)] min-[810px]:[&_>_.small::before]:pointer-events-none min-[810px]:[&_>_.small:last-child::after]:content-[''] min-[810px]:[&_>_.small:last-child::after]:absolute min-[810px]:[&_>_.small:last-child::after]:top-0 min-[810px]:[&_>_.small:last-child::after]:bottom-0 min-[810px]:[&_>_.small:last-child::after]:left-0 min-[810px]:[&_>_.small:last-child::after]:[border-left:1px_dashed_var(--color-rule)] min-[810px]:[&_>_.small:last-child::after]:pointer-events-none max-[809.98px]:[&_>_.small]:relative max-[809.98px]:[&_>_.small]:[border-top:0] max-[809.98px]:[&_>_.small::before]:content-[''] max-[809.98px]:[&_>_.small::before]:absolute max-[809.98px]:[&_>_.small::before]:top-0 max-[809.98px]:[&_>_.small::before]:right-0 max-[809.98px]:[&_>_.small::before]:left-0 max-[809.98px]:[&_>_.small::before]:[border-top:1px_dashed_var(--color-rule)] max-[809.98px]:[&_>_.small::before]:pointer-events-none",
  all: "all mt-[89px]",
  allHead:
    "allHead flex gap-[16px] items-center [margin:0_0_24px] [padding:0_34px] [&_h2]:m-0 [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:[font-size:2.2rem] [&_h2]:tracking-[-0.02em] [&_h2]:leading-[1.2] justify-between max-[809.98px]:pr-[20px] max-[809.98px]:pl-[24px] max-[809.98px]:flex-col max-[809.98px]:items-start",
  filters: "filters flex flex-wrap gap-[8px] justify-end max-[809.98px]:justify-start",
  filter:
    "filter inline-flex items-center h-[28px] [padding:0_8px] border-0 rounded-field bg-secondary text-foreground [font-size:12px] leading-[1.6] [&[aria-pressed=\"true\"]]:bg-brand [&[aria-pressed=\"true\"]]:text-background tracking-normal",
  grid:
    "grid [outline:1px_dashed_var(--color-rule)] [outline-offset:-1px] grid [grid-template-columns:1fr] m-0 p-0 list-none [&_li]:[border-top:1px_dashed_var(--color-rule)] [&_li:first-child]:[border-top:0] [&_li[hidden]]:hidden min-[810px]:[grid-template-columns:1fr_1fr] min-[810px]:[&_li]:relative min-[810px]:[&_li]:[border-top:0] min-[810px]:[&_li:nth-child(n_+_3)::before]:content-[''] min-[810px]:[&_li:nth-child(n_+_3)::before]:absolute min-[810px]:[&_li:nth-child(n_+_3)::before]:top-0 min-[810px]:[&_li:nth-child(n_+_3)::before]:right-0 min-[810px]:[&_li:nth-child(n_+_3)::before]:left-0 min-[810px]:[&_li:nth-child(n_+_3)::before]:[border-top:1px_dashed_var(--color-rule)] min-[810px]:[&_li:nth-child(n_+_3)::before]:pointer-events-none min-[810px]:[&_li:nth-child(even)::after]:content-[''] min-[810px]:[&_li:nth-child(even)::after]:absolute min-[810px]:[&_li:nth-child(even)::after]:top-0 min-[810px]:[&_li:nth-child(even)::after]:bottom-0 min-[810px]:[&_li:nth-child(even)::after]:left-0 min-[810px]:[&_li:nth-child(even)::after]:[border-left:1px_dashed_var(--color-rule)] min-[810px]:[&_li:nth-child(even)::after]:pointer-events-none min-[810px]:[&_li:nth-child(-n_+_2)]:[border-top:0] min-[810px]:[&_li:nth-child(n_+_3)]:[border-top:0] max-[809.98px]:[&_li]:relative max-[809.98px]:[&_li]:[border-top:0] max-[809.98px]:[&_li_+_li::before]:content-[''] max-[809.98px]:[&_li_+_li::before]:absolute max-[809.98px]:[&_li_+_li::before]:top-0 max-[809.98px]:[&_li_+_li::before]:right-0 max-[809.98px]:[&_li_+_li::before]:left-0 max-[809.98px]:[&_li_+_li::before]:[border-top:1px_dashed_var(--color-rule)] max-[809.98px]:[&_li_+_li::before]:pointer-events-none",
  more: "more flex justify-center mt-[24px]",
} as const;

export type PostListClassKey = keyof typeof styles;

export function cx(...keys: Array<PostListClassKey | string | false | null | undefined>) {
  return keys
    .filter((key): key is string => Boolean(key))
    .map((key) => (key in styles ? styles[key as PostListClassKey] : key))
    .join(" ");
}

export default styles;
