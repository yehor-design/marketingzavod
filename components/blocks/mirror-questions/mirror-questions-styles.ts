/** Tailwind utility map for the MirrorQuestions block (3-card and 5-card non-testimonial question grids). */
const styles = {
  section:
    "section text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [padding:100px_0_0]",
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto min-[1200px]:[width:min(1200px,_calc(100%_-_32px))]",
  dash:
    "dash [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:no-repeat] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] motion-reduce:animate-none",
  bandHead:
    "bandHead relative flex items-center justify-center min-h-[112px] [padding:32px_24px] after:content-[''] after:absolute after:right-0 after:left-0 after:h-[1px] after:[background:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] after:pointer-events-none after:[animation:dash-x-rev_1s_linear_infinite] after:bottom-0 motion-reduce:after:animate-none",
  heading:
    "heading [width:min(1000px,_100%)] m-0 [font-size:1.6rem] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] tracking-[-0.01em] leading-[1.2] text-center text-foreground",
  grid:
    "grid relative grid [grid-template-columns:1fr] m-0 p-0 list-none [&_li]:relative [&_li]:min-w-0 [&_li]:flex [&_li]:flex-col [&_li]:h-auto max-[809.98px]:[&_li_+_li]:[border-top:1px_dashed_var(--color-rule)]",
  grid3:
    "grid3 min-[810px]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] min-[810px]:[&_li_+_li]:[border-left:1px_dashed_var(--color-rule)]",
  grid4:
    "grid4 min-[810px]:max-[1199.98px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] min-[810px]:max-[1199.98px]:[&_li:nth-child(n_+_3)]:[border-top:1px_dashed_var(--color-rule)] min-[810px]:max-[1199.98px]:[&_li:nth-child(even)]:[border-left:1px_dashed_var(--color-rule)] min-[1200px]:[grid-template-columns:repeat(4,_minmax(0,_1fr))] min-[1200px]:[&_li_+_li]:[border-left:1px_dashed_var(--color-rule)]",
  grid5:
    "grid5 min-[810px]:max-[1199.98px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] min-[810px]:max-[1199.98px]:[&_li:nth-child(n_+_3)]:[border-top:1px_dashed_var(--color-rule)] min-[810px]:max-[1199.98px]:[&_li:nth-child(even)]:[border-left:1px_dashed_var(--color-rule)] min-[810px]:max-[1199.98px]:[&_li:nth-child(5)]:[grid-column:1_/_-1] min-[1200px]:[grid-template-columns:repeat(6,_minmax(0,_1fr))] min-[1200px]:[&_li:nth-child(-n_+_3)]:[grid-column:span_2] min-[1200px]:[&_li:nth-child(n_+_4)]:[grid-column:span_3] min-[1200px]:[&_li:nth-child(n_+_4)]:[border-top:1px_dashed_var(--color-rule)] min-[1200px]:[&_li:nth-child(2)]:[border-left:1px_dashed_var(--color-rule)] min-[1200px]:[&_li:nth-child(3)]:[border-left:1px_dashed_var(--color-rule)] min-[1200px]:[&_li:nth-child(5)]:[border-left:1px_dashed_var(--color-rule)]",
  card:
    "card relative flex flex-1 flex-col items-start justify-center w-full [padding:28px_24px] text-left min-[810px]:[padding:32px_28px]",
  question:
    "question w-full min-w-0 m-0 text-foreground font-display [font-size:16px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_500] tracking-[-0.01em] leading-[24px] [overflow-wrap:break-word]",
  footer:
    "footer flex flex-col items-center justify-center gap-[8px] [padding:20px_24px] [border-top:1px_dashed_var(--color-rule)] text-center min-[810px]:[padding:24px_34px]",
  note:
    "note m-0 text-muted-foreground font-display [font-size:14px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] leading-[21px] [overflow-wrap:break-word]",
  ctaLink:
    "ctaLink inline-flex items-center justify-center min-h-[28px] [padding:4px_8px] text-foreground font-display [font-size:14px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] tracking-[-0.01em] leading-[21px] transition-colors hover:text-brand focus-visible:outline-1 focus-visible:outline-foreground focus-visible:outline-offset-2 motion-reduce:transition-none [overflow-wrap:break-word]",
} as const;

export type MirrorQuestionsClassKey = keyof typeof styles;

export function cx(...keys: Array<MirrorQuestionsClassKey | string | false | null | undefined>) {
  return keys
    .filter((key): key is string => Boolean(key))
    .map((key) => (key in styles ? styles[key as MirrorQuestionsClassKey] : key))
    .join(" ");
}

export default styles;
