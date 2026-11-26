/** Tailwind utility map for the ProcessSteps block (3-, 4-, and 5-step dashed bands). */
const styles = {
  section:
    "section text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [padding:100px_0_0]",
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto min-[1200px]:[width:min(1200px,_calc(100%_-_32px))]",
  dash:
    "dash [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:no-repeat] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] motion-reduce:animate-none",
  bandHead:
    "bandHead relative flex items-center justify-center h-[154px] after:content-[''] after:absolute after:right-0 after:left-0 after:h-[1px] after:[background:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] after:pointer-events-none after:[animation:dash-x-rev_1s_linear_infinite] after:bottom-0 [&_h2]:[width:min(1000px,_calc(100%_-_48px))] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] [&_h2]:text-center min-[810px]:h-[138px] min-[810px]:max-[1199.98px]:h-[134.56px] motion-reduce:after:animate-none max-[809.98px]:[&_h2]:[width:min(240px,_calc(100%_-_48px))]",
  bandHeadAuto:
    "bandHeadAuto relative flex items-center justify-center min-h-[112px] [padding:32px_24px] after:content-[''] after:absolute after:right-0 after:left-0 after:h-[1px] after:[background:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] after:pointer-events-none after:[animation:dash-x-rev_1s_linear_infinite] after:bottom-0 [&_h2]:[width:min(1000px,_100%)] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] [&_h2]:text-center motion-reduce:after:animate-none",
  steps:
    "steps grid m-0 p-0 list-none [&_li]:flex [&_li]:flex-row [&_li]:items-center [&_li]:justify-start [&_li]:h-[92px] [&_li]:[padding:24px] [&_li]:gap-[14px] [&_li]:text-left min-[810px]:[grid-template-columns:1fr_1fr] min-[810px]:[&_li]:flex-col min-[810px]:[&_li]:justify-start min-[810px]:[&_li]:h-[174px] min-[810px]:[&_li]:[padding:35px_0_0] min-[810px]:[&_li]:gap-0 min-[810px]:[&_li]:text-center min-[1200px]:relative min-[1200px]:h-[174px] min-[1200px]:[grid-template-columns:repeat(3,_1fr)] min-[1200px]:[animation:dash-cols_1s_linear_infinite] min-[1200px]:[background-image:repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] min-[1200px]:[background-repeat:no-repeat] min-[1200px]:[background-size:1px_100%] min-[1200px]:[background-position:33.333%_0,_66.666%_0] motion-reduce:animate-none",
  stepsAuto:
    "stepsAuto grid [grid-template-columns:1fr] m-0 p-0 list-none [&_li]:min-w-0 [&_li]:flex [&_li]:flex-row [&_li]:items-start [&_li]:justify-start [&_li]:h-auto [&_li]:[padding:24px] [&_li]:gap-[14px] [&_li]:text-left max-[809.98px]:[&_li_+_li]:[border-top:1px_dashed_var(--color-rule)] min-[810px]:max-[1199.98px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] min-[810px]:[&_li]:flex-col min-[810px]:[&_li]:items-center min-[810px]:[&_li]:justify-start min-[810px]:[&_li]:[padding:32px_20px] min-[810px]:[&_li]:gap-0 min-[810px]:[&_li]:text-center min-[810px]:max-[1199.98px]:[&_li:nth-child(n_+_3)]:[border-top:1px_dashed_var(--color-rule)] min-[810px]:max-[1199.98px]:[&_li:nth-child(even)]:[border-left:1px_dashed_var(--color-rule)] min-[1200px]:[&_li_+_li]:[border-left:1px_dashed_var(--color-rule)]",
  stepsCols3:
    "stepsCols3 min-[810px]:max-[1199.98px]:[&_li:nth-child(3)]:[grid-column:1_/_-1] min-[1200px]:[grid-template-columns:repeat(3,_minmax(0,_1fr))]",
  stepsCols4: "stepsCols4 min-[1200px]:[grid-template-columns:repeat(4,_minmax(0,_1fr))]",
  stepsCols5:
    "stepsCols5 min-[810px]:max-[1199.98px]:[&_li:nth-child(5)]:[grid-column:1_/_-1] min-[1200px]:[grid-template-columns:repeat(5,_minmax(0,_1fr))]",
  stepIcon:
    "stepIcon shrink-0 inline-flex items-center justify-center w-[44px] h-[44px] mb-0 [border-radius:188px] bg-rule text-foreground min-[810px]:mb-[20px]",
  stepNumber: "stepNumber font-mono [font-size:12px] font-medium [font-variation-settings:normal]",
  stepText:
    "stepText flex flex-col items-start [width:min(252px,_calc(100%_-_82px))] min-[810px]:items-center min-[810px]:w-auto",
  stepTextAuto:
    "stepTextAuto flex flex-col items-start gap-[6px] min-w-0 flex-1 min-[810px]:items-center min-[810px]:w-full",
  stepTitle:
    "stepTitle w-full m-0 [font-size:14px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] leading-[21px] min-[810px]:[width:min(322px,_calc(100%_-_32px))]",
  stepTitleAuto:
    "stepTitleAuto w-full min-w-0 m-0 [font-size:14px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] leading-[21px] [overflow-wrap:break-word]",
  stepBody:
    "stepBody m-0 text-muted-foreground font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] w-full [font-size:14px] leading-[21px] min-[810px]:[width:min(240px,_calc(100%_-_48px))]",
  stepBodyAuto:
    "stepBodyAuto m-0 w-full min-w-0 text-muted-foreground font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] [font-size:14px] leading-[21px] [overflow-wrap:break-word]",
  note: "note m-0 [padding:20px_24px] [border-top:1px_dashed_var(--color-rule)] text-center text-muted-foreground font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] [font-size:14px] leading-[21px] min-[810px]:[padding:24px_34px]",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
