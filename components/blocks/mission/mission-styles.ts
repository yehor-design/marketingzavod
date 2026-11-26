/** Tailwind utility map for the Mission block (split heading + narrative copy). */
const styles = {
  block:
    "block pt-[100px] text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:font-[inherit] [&_p]:font-[inherit]",
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(180deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(180deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:repeat-x,_repeat-x,_repeat-y,_repeat-y] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] motion-reduce:animate-none",
  mission:
    "mission font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:[font-size:1.6rem] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] flex flex-col gap-[20px] [padding:50px_24px] [&_h2]:m-0 min-[810px]:flex-row min-[810px]:gap-0 min-[810px]:items-start min-[810px]:[padding:50px_0] min-[810px]:[&_h2]:[flex:1.06] min-[810px]:[&_h2]:[padding:0_34px]",
  missionCopy:
    "missionCopy font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] flex flex-col gap-[24px] [&_p]:m-0 [&_p]:text-muted-foreground [&_p]:[font-size:16px] [&_p]:tracking-[-0.01em] [&_p]:leading-[1.5] min-[810px]:flex-1 min-[810px]:[padding:6px_34px_0_0]",
  bright: "bright text-foreground",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
