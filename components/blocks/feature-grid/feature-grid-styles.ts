/** Tailwind utility map for the FeatureGrid block (2x2 dashed benefit cards). */
const styles = {
  section:
    "section text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [padding:100px_0_0]",
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto min-[1200px]:[width:min(1200px,_calc(100%_-_32px))]",
  dash:
    "dash [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:no-repeat] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] motion-reduce:animate-none",
  bandHead:
    "bandHead relative flex flex-col items-center justify-center gap-[16px] h-[154px] after:content-[''] after:absolute after:right-0 after:left-0 after:h-[1px] after:[background:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] after:pointer-events-none after:[animation:dash-x-rev_1s_linear_infinite] after:bottom-0 [&_h2]:[width:min(1000px,_calc(100%_-_48px))] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] [&_h2]:text-center min-[810px]:h-[138px] min-[810px]:max-[1199.98px]:h-[134.56px] motion-reduce:after:animate-none max-[809.98px]:[&_h2]:[width:min(240px,_calc(100%_-_48px))]",
  bandHeadAuto:
    "bandHeadAuto relative flex flex-col items-center justify-center gap-[16px] min-h-[112px] [padding:32px_24px] after:content-[''] after:absolute after:right-0 after:left-0 after:h-[1px] after:[background:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] after:pointer-events-none after:[animation:dash-x-rev_1s_linear_infinite] after:bottom-0 [&_h2]:[width:min(1000px,_100%)] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] [&_h2]:text-center motion-reduce:after:animate-none",
  bandDesc:
    "bandDesc m-0 [width:min(593px,_calc(100%_-_48px))] text-center text-muted-foreground [font-size:16px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] leading-[1.5]",
  benefitGrid:
    "benefitGrid relative grid min-[810px]:[grid-template-columns:1fr_1fr] min-[810px]:max-[1199.98px]:[width:calc(100%_-_2px)] min-[810px]:max-[1199.98px]:mt-[1px] min-[810px]:max-[1199.98px]:mb-[1px] min-[810px]:max-[1199.98px]:ml-[1px] min-[810px]:max-[1199.98px]:gap-[2px] min-[1200px]:relative min-[1200px]:h-[800px] min-[1200px]:[grid-template-columns:1fr_1fr] min-[1200px]:[grid-template-rows:400px_400px] min-[1200px]:[animation:dash-cross_1s_linear_infinite] min-[1200px]:[background-image:repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] min-[1200px]:[background-repeat:no-repeat] min-[1200px]:[background-position:center_top,_left_center] min-[1200px]:[background-size:1px_100%,_100%_1px] motion-reduce:animate-none",
  benefitGridAuto:
    "benefitGridAuto relative grid grid-cols-1 min-[810px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[809.98px]:[&_article_+_article]:[border-top:1px_dashed_var(--color-rule)] min-[810px]:[&_article:nth-child(n_+_3)]:[border-top:1px_dashed_var(--color-rule)] min-[810px]:[&_article:nth-child(even)]:[border-left:1px_dashed_var(--color-rule)]",
  benefit:
    "benefit relative h-[400px] overflow-visible [&:hover_.benefitReveal]:h-[42px] [&:hover_.benefitReveal]:mt-[6px] [&:focus-within_.benefitReveal]:h-[42px] [&:focus-within_.benefitReveal]:mt-[6px] [&_h3]:m-0 [&_h3]:[font-size:1.2rem] [&_h3]:font-[1000] [&_h3]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h3]:tracking-[-0.01em] [&_h3]:leading-[1.4] [&_p]:m-0 [&_p]:text-muted-foreground [&_p]:font-[1000] [&_p]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_p]:[font-size:14px] [&_p]:leading-[21px] [&_p]:whitespace-pre-wrap min-[810px]:max-[1199.98px]:h-[398px]",
  benefitAuto:
    "benefitAuto relative flex flex-col justify-between gap-[20px] min-w-0 h-auto [padding:28px_24px] min-[810px]:[padding:32px_34px] [&_h3]:m-0 [&_h3]:[font-size:1.2rem] [&_h3]:font-[1000] [&_h3]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h3]:tracking-[-0.01em] [&_h3]:leading-[1.4] [&_h3]:[overflow-wrap:break-word] [&_p]:m-0 [&_p]:text-muted-foreground [&_p]:font-[1000] [&_p]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_p]:[font-size:14px] [&_p]:leading-[21px] [&_p]:[overflow-wrap:break-word]",
  benefitHot:
    "benefitHot [&_.benefitField]:opacity-100 [&_.benefitAccent]:[filter:none] min-[810px]:[&_.corner-marks_i]:opacity-100 min-[810px]:[&_.corner-marks::before]:opacity-100 [&_.benefitReveal]:h-[42px] [&_.benefitReveal]:mt-[6px]",
  benefitField:
    "benefitField absolute inset-0 overflow-hidden opacity-80 [mask-image:linear-gradient(24deg,_var(--color-veil-10)_17%,_var(--color-veil-70)_61%)] [-webkit-mask-image:linear-gradient(24deg,_var(--color-veil-10)_17%,_var(--color-veil-70)_61%)] max-[809.98px]:opacity-100",
  benefitOrdered:
    "benefitOrdered absolute inset-0 z-[1] [&_canvas]:absolute [&_canvas]:inset-0 [&_canvas]:w-full [&_canvas]:h-full [&_canvas]:object-cover [&_canvas]:[image-rendering:pixelated]",
  benefitAccent:
    "benefitAccent absolute inset-0 z-[3] [filter:grayscale(1)] opacity-80 [&_canvas]:absolute [&_canvas]:inset-0 [&_canvas]:w-full [&_canvas]:h-full [&_canvas]:object-cover [&_canvas]:[image-rendering:pixelated] max-[809.98px]:[filter:none]",
  benefitCustom:
    "benefitCustom absolute inset-0 z-[1] flex items-center justify-center p-[34px] pb-[112px] pointer-events-none",
  benefitCustomAuto:
    "benefitCustomAuto relative z-[1] flex items-center justify-center w-full aspect-[720/460] max-h-[220px] overflow-hidden",
  benefitIconWrap:
    "benefitIconWrap relative z-[1] inline-flex items-center justify-center w-[44px] h-[44px] m-[34px] [border-radius:188px] bg-rule text-foreground max-[809.98px]:m-[24px]",
  benefitCopy:
    "benefitCopy [--reveal-ease:linear(_0,_0.011,_0.0399,_0.0811,_0.1305,_0.1849,_0.2418,_0.2993,_0.3561,_0.4111,_0.4637,_0.5134,_0.56,_0.6032,_0.6432,_0.6799,_0.7135,_0.7441,_0.7718,_0.7969,_0.8194,_0.8397,_0.858,_0.8743,_0.8888,_0.9018,_0.9133,_0.9236,_0.9327,_0.9408,_0.9479,_0.9543,_0.9598,_0.9648,_0.9691,_0.9729,_0.9763,_0.9792,_0.9818,_0.9841,_0.9861,_0.9879,_0.9894,_0.9908,_0.9919,_0.993,_0.9939,_0.9947,_0.9953,_0.9959,_0.9965,_0.9969,_0.9973,_0.9977,_0.998,_0.9982,_0.9985,_0.9987,_0.9988,_1_)] absolute right-[34px] bottom-[34px] left-[34px] z-[1] flex flex-col overflow-hidden [&_p]:static [&_p]:min-h-0 [&_p]:m-0 [&_p]:overflow-hidden max-[809.98px]:right-[24px] max-[809.98px]:bottom-[24px] max-[809.98px]:left-[24px] max-[809.98px]:h-auto max-[809.98px]:[&_p]:static max-[809.98px]:[&_p]:mt-0",
  benefitCopyAuto:
    "benefitCopyAuto relative z-[1] flex flex-col gap-[8px]",
  benefitReveal:
    "benefitReveal h-0 mt-0 overflow-hidden [transition:height_600ms_var(--reveal-ease),_margin-top_600ms_var(--reveal-ease)] motion-reduce:transition-none max-[809.98px]:h-auto max-[809.98px]:mt-[6px] max-[809.98px]:transition-none",
  iconSection:
    "iconSection pt-[100px] text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:font-[inherit] [&_p]:font-[inherit]",
  iconFrame:
    "iconFrame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(180deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(180deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:repeat-x,_repeat-x,_repeat-y,_repeat-y] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] motion-reduce:animate-none",
  powersHead:
    "powersHead font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] [&_p]:m-0 [&_p]:text-muted-foreground [&_p]:[font-size:16px] [&_p]:leading-[1.5] flex flex-col items-center gap-[24px] [padding:50px_24px] [border-bottom:1px_dashed_var(--color-rule)] text-center [&_p]:max-w-[593px] [&_p]:tracking-[-0.01em] min-[810px]:[padding:50px_24px]",
  powers:
    "powers flex flex-col m-0 p-0 list-none [&_li]:grid [&_li]:[grid-template-columns:44px_1fr] [&_li]:[gap:4px_14px] [&_li]:items-center [&_li]:min-h-[92px] [&_li]:[padding:16px_24px] [&_li]:[border-top:1px_dashed_var(--color-rule)] [&_li:first-child]:[border-top:0] min-[720px]:max-[809.98px]:flex-row min-[720px]:max-[809.98px]:flex-wrap min-[720px]:max-[809.98px]:[&_li]:flex min-[720px]:max-[809.98px]:[&_li]:flex-row min-[720px]:max-[809.98px]:[&_li]:items-center min-[720px]:max-[809.98px]:[&_li]:w-[240px] min-[720px]:max-[809.98px]:[&_li]:min-h-[111px] min-[720px]:max-[809.98px]:[&_li]:h-[111px] min-[720px]:max-[809.98px]:[&_li]:[padding:24px] min-[720px]:max-[809.98px]:[&_li]:gap-[14px] min-[720px]:max-[809.98px]:[&_li]:[border-top:0] min-[720px]:max-[809.98px]:[&_li:last-child]:w-full min-[720px]:max-[809.98px]:[&_li:last-child]:h-[92px] min-[720px]:max-[809.98px]:[&_li:last-child]:min-h-[92px] min-[810px]:grid min-[810px]:[grid-template-columns:repeat(4,_1fr)] min-[810px]:[&_li]:flex min-[810px]:[&_li]:flex-col min-[810px]:[&_li]:gap-0 min-[810px]:[&_li]:items-center min-[810px]:[&_li]:min-h-[174px] min-[810px]:[&_li]:[padding:34px_16px] min-[810px]:[&_li]:[border-top:0] min-[810px]:[&_li]:[border-left:1px_dashed_var(--color-rule)] min-[810px]:[&_li]:text-center min-[810px]:[&_li:first-child]:[border-left:0]",
  powerIcon:
    "powerIcon inline-flex [grid-row:1_/_span_2] items-center justify-center w-[44px] h-[44px] [border-radius:188px] bg-rule text-foreground min-[810px]:mb-[20px]",
  powerTitle:
    "powerTitle font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] m-0 [font-size:14px] tracking-normal leading-[1.5] text-foreground",
  powerBody:
    "powerBody font-[1000] m-0 [font-size:14px] tracking-normal leading-[1.5] text-muted-foreground [font-variation-settings:\"opsz\"_14,_\"wght\"_450]",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
