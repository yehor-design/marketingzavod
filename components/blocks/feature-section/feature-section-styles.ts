/** Tailwind utility map for the FeatureSection block (split text + optional visual). */
const styles = {
  section:
    "section text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [padding:100px_0_0]",
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto min-[1200px]:[width:min(1200px,_calc(100%_-_32px))]",
  dash:
    "dash [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:no-repeat] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] motion-reduce:animate-none",
  feature:
    "feature [&_+_.feature::after]:content-[''] [&_+_.feature::after]:absolute [&_+_.feature::after]:right-0 [&_+_.feature::after]:left-0 [&_+_.feature::after]:h-[1px] [&_+_.feature::after]:[background:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] [&_+_.feature::after]:pointer-events-none [&_+_.feature::after]:[animation:dash-x_1s_linear_infinite] [&_+_.feature::after]:top-0 [&_+_.feature::after]:bottom-auto relative grid [&_h2]:max-w-[438px] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] min-[810px]:[grid-template-columns:634fr_566fr] min-[810px]:min-h-[650px] min-[810px]:max-[1199.98px]:[grid-template-columns:530fr_462fr] min-[1200px]:h-[650px] min-[1200px]:min-h-[650px] min-[1200px]:before:content-[''] min-[1200px]:before:absolute min-[1200px]:before:top-0 min-[1200px]:before:bottom-0 min-[1200px]:before:w-[1px] min-[1200px]:before:[background:repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] min-[1200px]:before:pointer-events-none min-[1200px]:before:[animation:dash-y_1s_linear_infinite] min-[1200px]:before:left-[52.833%] motion-reduce:[&_+_.feature::after]:animate-none motion-reduce:before:animate-none",
  featureFlip:
    "featureFlip relative grid [&_h2]:max-w-[438px] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] min-[810px]:min-h-[650px] min-[810px]:[grid-template-columns:566fr_634fr] min-[810px]:[&_.featureCopy]:order-[2] min-[810px]:max-[1199.98px]:[grid-template-columns:462fr_530fr] min-[1200px]:h-[650px] min-[1200px]:min-h-[650px] min-[1200px]:before:content-[''] min-[1200px]:before:absolute min-[1200px]:before:top-0 min-[1200px]:before:bottom-0 min-[1200px]:before:w-[1px] min-[1200px]:before:[background:repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] min-[1200px]:before:pointer-events-none min-[1200px]:before:[animation:dash-y_1s_linear_infinite] min-[1200px]:before:left-[47.166%] motion-reduce:before:animate-none",
  featureNoArt:
    "featureNoArt relative grid [&_h2]:max-w-[680px] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2]",
  anchored: "scroll-mt-[calc(var(--header-height)_+_24px)]",
  featureCopy: "featureCopy flex flex-col justify-center [padding:24px] min-[810px]:[padding:48px_34px]",
  eyebrow:
    "eyebrow [margin:0_0_18px] font-mono [font-size:12px] font-medium [font-variation-settings:normal] tracking-[0.24px] leading-[19.2px] uppercase",
  featureBody:
    "featureBody m-0 text-muted-foreground font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] max-w-[330px] mt-[18px] [font-size:16px] leading-[24px]",
  featureBodyWide: "max-w-[640px]",
  checks:
    "checks flex flex-col gap-[6px] [margin:34px_0_0] p-0 list-none [&_li]:flex [&_li]:gap-[8px] [&_li]:items-center [&_li]:min-h-[34px] [&_li]:text-foreground [&_li]:[font-size:16px] [&_li]:font-[1000] [&_li]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_li]:leading-[24px] [&_li_span]:flex-1 [&_li_span]:min-w-0 [&_a]:underline [&_a]:underline-offset-2",
  check: "check block flex-none",
  link: "link inline-flex items-center mt-[24px] [font-size:14px] leading-[21px] text-brand underline underline-offset-4 hover:text-foreground",
  featureArt:
    "featureArt relative grid place-items-center min-h-[280px] min-[810px]:max-[1199.98px]:min-w-0 min-[810px]:max-[1199.98px]:[padding:34px] min-[1200px]:min-h-0 min-[1200px]:h-[650px]",
  featureDots:
    "featureDots absolute inset-0 z-[2] pointer-events-none [background-image:url(/home/feature-dots.png)] [background-repeat:repeat] [background-position:left_top] [background-size:35px_auto] [opacity:0.15] [mask-image:linear-gradient(0deg,_var(--color-transparent)_0%,_var(--color-background)_100%)] [-webkit-mask-image:linear-gradient(0deg,_var(--color-transparent)_0%,_var(--color-background)_100%)]",
  featureFrame:
    "featureFrame relative z-[1] w-[280px] h-[280px] [mask-image:linear-gradient(0deg,_var(--color-veil-10)_0%,_var(--color-veil-80)_100%)] [-webkit-mask-image:linear-gradient(0deg,_var(--color-veil-10)_0%,_var(--color-veil-80)_100%)] [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full [&_canvas]:object-cover [&_canvas]:[image-rendering:pixelated] min-[810px]:[width:min(440px,_86%)] min-[810px]:h-auto min-[810px]:[aspect-ratio:1] min-[810px]:max-[1199.98px]:w-full min-[810px]:max-[1199.98px]:min-w-0 min-[810px]:max-[1199.98px]:h-auto min-[810px]:max-[1199.98px]:[aspect-ratio:394_/_397.05] min-[1200px]:w-[440px] min-[1200px]:h-[443px]",
  featureCustomFrame:
    "featureCustomFrame relative z-[1] flex items-center justify-center w-[280px] h-[280px] min-[810px]:[width:min(440px,_86%)] min-[810px]:h-auto min-[810px]:[aspect-ratio:1] min-[1200px]:w-[440px] min-[1200px]:h-[443px]",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
