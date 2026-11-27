/** Tailwind utility map for the FounderCard block (1:1 or 4:5 portrait, bio, and contact actions). */
const styles = {
  section:
    "section text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [padding:100px_0_0]",
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto min-[1200px]:[width:min(1200px,_calc(100%_-_32px))]",
  dash:
    "dash [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:no-repeat] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] motion-reduce:animate-none",
  grid:
    "grid grid-cols-1 min-[810px]:[grid-template-columns:minmax(260px,_380px)_minmax(0,_1fr)]",
  photoFrame:
    "photoFrame relative overflow-hidden bg-panel [border-bottom:1px_dashed_var(--color-rule)] min-[810px]:[border-right:1px_dashed_var(--color-rule)] min-[810px]:[border-bottom:0]",
  ratio11: "aspect-square",
  ratio45: "aspect-[4/5]",
  photoImg: "photoImg block w-full h-full object-cover object-top",
  copy:
    "copy flex flex-col justify-center gap-[20px] min-w-0 [padding:28px_24px] min-[810px]:[padding:48px_34px]",
  eyebrow:
    "eyebrow m-0 font-mono [font-size:12px] font-medium [font-variation-settings:normal] tracking-[0.24px] leading-[1.6] uppercase text-brand",
  heading:
    "heading m-0 text-foreground font-display [font-size:1.6rem] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] tracking-[-0.01em] leading-[1.2] [overflow-wrap:break-word]",
  bioWrap: "bioWrap flex flex-col gap-[12px]",
  bio:
    "bio m-0 text-muted-foreground font-display [font-size:16px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] leading-[1.5] max-w-[60ch] [overflow-wrap:break-word]",
  actions: "actions flex flex-wrap items-center gap-[10px] pt-[8px]",
} as const;

export type FounderCardClassKey = keyof typeof styles;

export function cx(...keys: Array<FounderCardClassKey | string | false | null | undefined>) {
  return keys
    .filter((key): key is string => Boolean(key))
    .map((key) => (key in styles ? styles[key as FounderCardClassKey] : key))
    .join(" ");
}

export default styles;
