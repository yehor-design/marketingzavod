/** Tailwind utility map for the CardGrid block (horizontal icon tiles). */
const styles = {
  section:
    "section text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [padding:100px_0_0]",
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto min-[1200px]:[width:min(1200px,_calc(100%_-_32px))]",
  dash:
    "dash [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:no-repeat] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] motion-reduce:animate-none",
  bandHead:
    "bandHead relative flex items-center justify-center h-[154px] after:content-[''] after:absolute after:right-0 after:left-0 after:h-[1px] after:[background:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] after:pointer-events-none after:[animation:dash-x-rev_1s_linear_infinite] after:bottom-0 [&_h2]:[width:min(1000px,_calc(100%_-_48px))] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] [&_h2]:text-center min-[810px]:h-[138px] min-[810px]:max-[1199.98px]:h-[134.56px] motion-reduce:after:animate-none max-[809.98px]:[&_h2]:[width:min(240px,_calc(100%_-_48px))]",
  tiles:
    "tiles [&_p]:m-0 [&_p]:text-muted-foreground [&_p]:font-[1000] [&_p]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] relative flex flex-col items-stretch justify-center gap-[24px] m-0 [padding:50px_34px] list-none [&_li]:flex [&_li]:flex-col [&_li]:items-center [&_li]:gap-[4px] [&_li]:w-full [&_li]:p-0 [&_li]:text-center [&_h2]:w-full [&_h2]:m-0 [&_h2]:[font-size:16px] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[24px] [&_h3]:w-full [&_h3]:m-0 [&_h3]:[font-size:16px] [&_h3]:font-[1000] [&_h3]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h3]:tracking-[-0.01em] [&_h3]:leading-[24px] [&_p]:w-[190px] [&_p]:max-w-full [&_p]:[font-size:14px] [&_p]:leading-[21px] min-[810px]:flex-row min-[810px]:items-center min-[810px]:h-[220px] min-[810px]:[padding:50px_34px] min-[810px]:gap-[16px] min-[810px]:[&_li]:[flex:1_1_0] min-[810px]:[&_li]:w-auto min-[810px]:[&_li]:max-w-[271px] min-[810px]:[&_li]:p-0 min-[1200px]:relative min-[1200px]:flex min-[1200px]:h-[220px] min-[1200px]:[padding:50px_34px] min-[1200px]:[&_li]:w-[271px]",
  tilesDivider:
    "tilesDivider before:content-[''] before:absolute before:right-0 before:left-0 before:h-[1px] before:[background:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] before:pointer-events-none before:[animation:dash-x_1s_linear_infinite] before:top-0 before:bottom-auto motion-reduce:before:animate-none",
  tileIcon: "tileIcon inline-flex items-center justify-center w-[34px] h-[34px] mb-[12px] text-foreground",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
