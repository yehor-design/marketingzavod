/** Tailwind utility map for the PilotBanner block (non-dismissible accent callout banner in dashed frame). */
const styles = {
  section:
    "section text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [padding:100px_0_0]",
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto min-[1200px]:[width:min(1200px,_calc(100%_-_32px))]",
  dash:
    "dash [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:no-repeat] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] motion-reduce:animate-none",
  inner:
    "inner relative flex flex-col items-start justify-between gap-[20px] [padding:28px_24px] bg-accent-tint min-[810px]:flex-row min-[810px]:items-center min-[810px]:gap-[32px] min-[810px]:[padding:32px_34px]",
  copy: "copy flex flex-col gap-[8px] min-w-0 flex-1",
  eyebrow:
    "eyebrow m-0 font-mono [font-size:12px] font-medium [font-variation-settings:normal] tracking-[0.02em] leading-[1.6] uppercase text-brand",
  text:
    "text m-0 text-foreground font-display [font-size:16px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_500] tracking-[-0.01em] leading-[24px] max-w-[74ch] [overflow-wrap:break-word]",
  action: "action flex-none",
} as const;

export type PilotBannerClassKey = keyof typeof styles;

export function cx(...keys: Array<PilotBannerClassKey | string | false | null | undefined>) {
  return keys
    .filter((key): key is string => Boolean(key))
    .map((key) => (key in styles ? styles[key as PilotBannerClassKey] : key))
    .join(" ");
}

export default styles;
