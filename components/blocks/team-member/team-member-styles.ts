/**
 * Tailwind utility map for TeamMember and shared Portrait styles.
 * Reused by both Jet's team grid and BG's single-person FounderCard / TeamMember (4:5).
 */
const styles = {
  block:
    "block pt-[100px] text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:font-[inherit] [&_h3]:font-[inherit] [&_p]:font-[inherit] [&_a:focus-visible]:[outline:1px_solid_var(--color-foreground)] [&_a:focus-visible]:[outline-offset:3px]",
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(180deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(180deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:repeat-x,_repeat-x,_repeat-y,_repeat-y] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] motion-reduce:animate-none",
  teamHead:
    "teamHead font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] [&_p]:m-0 [&_p]:text-muted-foreground [&_p]:[font-size:16px] [&_p]:leading-[1.5] flex flex-col items-center gap-[24px] [padding:50px_24px] [border-bottom:1px_dashed_var(--color-rule)] text-center [&_p]:max-w-[593px] [&_p]:tracking-[-0.01em] [&_h2]:max-w-[1000px] max-[809.98px]:pb-[49px] min-[810px]:[padding:50px_24px] min-[1200px]:pb-[48px] min-[1200px]:[&_h2]:[transform:translateY(-1px)]",
  team:
    "team grid [grid-template-columns:1fr_1fr] m-0 p-0 list-none [&_a]:relative [&_a]:block [&_a]:[aspect-ratio:1] [&_a]:overflow-visible [&_a]:[border-right:1px_dashed_var(--color-rule)] [&_a]:[border-bottom:1px_dashed_var(--color-rule)] [&_a]:text-foreground [&_li:nth-child(2n)_a]:[border-right:0] [&_a:hover_.photo]:[filter:none] [&_a:focus-visible_.photo]:[filter:none] [&_h3]:m-0 [&_h3]:[font-size:16px] [&_h3]:tracking-[-0.01em] [&_h3]:leading-[1.5] [&_a:hover_.role]:[grid-template-rows:1fr] [&_a:focus-visible_.role]:[grid-template-rows:1fr] [&_a:hover_.slash]:opacity-100 [&_a:hover_.slash]:[transition-delay:0.15s] [&_a:focus-visible_.slash]:opacity-100 [&_a:focus-visible_.slash]:[transition-delay:0.15s] [&_a:hover_.roleText]:opacity-100 [&_a:hover_.roleText]:[transition-delay:0.175s] [&_a:focus-visible_.roleText]:opacity-100 [&_a:focus-visible_.roleText]:[transition-delay:0.175s] max-[809.98px]:[&_h3]:[font-size:12px] max-[809.98px]:[&_h3]:tracking-normal max-[809.98px]:[&_h3]:leading-[19.2px] min-[810px]:[grid-template-columns:repeat(3,_1fr)] min-[810px]:[&_a]:[border-right:1px_dashed_var(--color-rule)] min-[810px]:[&_li:nth-child(2n)_a]:[border-right:1px_dashed_var(--color-rule)] min-[810px]:[&_li:nth-child(3n)_a]:[border-right:0]",
  photo:
    "photo absolute [inset:10px] overflow-hidden [filter:grayscale(1)] [transition:filter_0.4s_cubic-bezier(0.22,_1,_0.36,_1)] [mask-image:linear-gradient(15deg,_transparent_10%,_var(--color-background)_62%)] [-webkit-mask-image:linear-gradient(15deg,_transparent_10%,_var(--color-background)_62%)] [&_canvas]:w-full [&_canvas]:h-full [&_canvas]:object-cover [&_canvas]:object-center motion-reduce:transition-none",
  caption:
    "caption absolute right-[34px] bottom-[34px] left-[34px] z-[1] max-[809.98px]:right-[16px] max-[809.98px]:bottom-[16px] max-[809.98px]:left-[16px] min-[810px]:right-[34px] min-[810px]:bottom-[34px] min-[810px]:left-[34px]",
  role:
    "role grid [grid-template-rows:0fr] m-0 overflow-hidden text-muted-foreground [font-size:16px] tracking-[-0.01em] leading-[1.5] [transition:grid-template-rows_0.4s_cubic-bezier(0.22,_1,_0.36,_1)] max-[809.98px]:flex max-[809.98px]:[grid-template-rows:none] max-[809.98px]:items-start max-[809.98px]:gap-[4px] max-[809.98px]:static max-[809.98px]:w-auto max-[809.98px]:[max-height:none] max-[809.98px]:h-auto max-[809.98px]:m-0 max-[809.98px]:overflow-visible max-[809.98px]:text-muted-foreground max-[809.98px]:[font-size:12px] max-[809.98px]:tracking-normal max-[809.98px]:leading-[19.2px] max-[809.98px]:whitespace-normal max-[809.98px]:opacity-100 max-[809.98px]:[transform:none] motion-reduce:transition-none",
  roleLine: "roleLine flex gap-[4px] items-start min-h-0 overflow-hidden max-[809.98px]:contents",
  slash:
    "slash flex-none text-foreground opacity-0 [transition:opacity_0.4s_cubic-bezier(0.22,_1,_0.36,_1)] max-[809.98px]:opacity-100 max-[809.98px]:flex-none max-[809.98px]:text-foreground motion-reduce:transition-none",
  roleText:
    "roleText opacity-0 [transition:opacity_0.4s_cubic-bezier(0.22,_1,_0.36,_1)] max-[809.98px]:opacity-100 max-[809.98px]:[flex:1_1_0] max-[809.98px]:min-w-0 motion-reduce:transition-none",
  hiring:
    "hiring font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] flex flex-col gap-[24px] items-start [padding:24px] [&_h2]:max-w-[18em] [&_h2]:text-muted-foreground min-[720px]:max-[809.98px]:[&_h2]:max-w-[554px] min-[810px]:flex-row min-[810px]:items-center min-[810px]:justify-between min-[810px]:[padding:34px] min-[810px]:[&_h2]:max-w-[554px]",
  bright: "bright text-foreground",
  // Single-person portrait card (CR-41: 4:5 or 1:1 <picture> with webp + jpg fallback)
  singleGrid:
    "singleGrid grid [grid-template-columns:1fr] min-[810px]:[grid-template-columns:minmax(260px,_380px)_minmax(0,_1fr)]",
  portraitFrame:
    "portraitFrame relative overflow-hidden bg-panel [border-bottom:1px_dashed_var(--color-rule)] min-[810px]:[border-right:1px_dashed_var(--color-rule)] min-[810px]:[border-bottom:0]",
  portraitRatio45: "aspect-[4/5]",
  portraitRatio11: "aspect-square",
  portraitImg: "portraitImg block w-full h-full object-cover object-top",
  singleCopy:
    "singleCopy flex flex-col justify-center gap-[20px] [padding:24px] min-[810px]:[padding:48px_34px] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] [&_p]:m-0 [&_p]:text-muted-foreground [&_p]:[font-size:16px] [&_p]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_p]:leading-[1.5]",
  singleMeta:
    "singleMeta m-0 font-mono [font-size:12px] font-medium [font-variation-settings:normal] tracking-[0.24px] leading-[1.6] uppercase text-brand",
  singleActions: "singleActions flex flex-wrap gap-[10px] pt-[8px]",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
