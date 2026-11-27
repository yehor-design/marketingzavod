/** Tailwind utility map for the CtaBand block (closing CTA card with PulseGradient + LineAnimator). */
const styles = {
  cta: "cta [padding:100px_0_0] text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:[width:min(500px,_100%)] [&_h2]:m-0 [&_h2]:[font-size:3.5rem] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:tracking-[-0.04em] [&_h2]:leading-[1.1] [&_p]:[width:min(344px,_100%)] [&_p]:[margin:24px_0_0] [&_p]:text-muted-foreground [&_p]:[font-size:16px] [&_p]:font-[1000] [&_p]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_p]:tracking-normal [&_p]:leading-[24px]",
  ctaAuto:
    "ctaAuto max-[809.98px]:[&_h2]:[font-size:2.4rem] [&_h2]:[width:min(680px,_100%)] [&_p]:[width:min(520px,_100%)]",
  ctaPageSpacing: "max-[809.98px]:pt-[46px]",
  ctaHomeSpacing: "max-[809.98px]:mt-[2px]",
  card: "card relative flex flex-col items-center [width:min(1200px,_calc(100%_-_32px))] h-[350px] mr-auto ml-auto [padding:24px_24px_0] overflow-hidden text-center [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:no-repeat] [background-position:0_0,_0_100%,_0_0,_100%_0] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] [animation:dash-frame_1s_linear_infinite] min-[810px]:h-[382px] min-[810px]:[padding:44px_44px_0] min-[810px]:max-[1199.98px]:h-[366.6px] motion-reduce:animate-none",
  cardAuto:
    "cardAuto h-auto! min-h-[350px] justify-center [padding:48px_24px]! min-[810px]:min-h-[382px] min-[810px]:[padding:56px_44px]! min-[810px]:max-[1199.98px]:min-h-[366.6px]",
  cardPageSpacing: "max-[809.98px]:pt-[78px]",
  media:
    "media absolute inset-0 overflow-hidden [filter:brightness(1.5)_contrast(0.85)_hue-rotate(1deg)] pointer-events-none [mask-image:url(/home/rays-mask.svg),_linear-gradient(0deg,_var(--color-transparent)_46%,_var(--color-veil-70)_100%)] [mask-repeat:no-repeat,_no-repeat] [mask-position:bottom_center,_center] [mask-size:cover,_100%_100%] [mask-composite:add,_add] [-webkit-mask-image:url(/home/rays-mask.svg),_linear-gradient(0deg,_var(--color-transparent)_46%,_var(--color-veil-70)_100%)] [-webkit-mask-repeat:no-repeat,_no-repeat] [-webkit-mask-position:bottom_center,_center] [-webkit-mask-size:cover,_100%_100%] [&_>_:first-child]:w-full [&_>_:first-child]:h-full [&_>_:first-child]:[aspect-ratio:auto]",
  grain:
    "grain absolute inset-0 [background-image:url(/home/grain.png)] [background-repeat:repeat] [background-size:40px_auto] opacity-50 pointer-events-none",
  copy: "copy relative z-[3] flex flex-col items-center",
  actions: "actions flex flex-wrap items-center justify-center gap-[10px] mt-[28px]",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
