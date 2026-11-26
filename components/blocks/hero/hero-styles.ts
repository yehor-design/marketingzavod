/** Tailwind utility map for the Hero block (animated home & static page heading variants). */
const styles = {
  hero: "hero text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [padding:65px_0_0] [&_h1]:m-0 [&_h1]:[font-size:3.5rem] [&_h1]:font-[1000] [&_h1]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h1]:tracking-[-0.04em] [&_h1]:leading-[1.1] [&_h1]:[width:min(400px,_100%)] [&_h1]:mx-auto [&_h1]:[font-feature-settings:\"tnum\"_on] [&_h2]:m-0 [&_h2]:[font-size:3.5rem] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:tracking-[-0.04em] [&_h2]:leading-[1.1] [&_h2]:[width:min(400px,_100%)] [&_h2]:mx-auto [&_h2]:[font-feature-settings:\"tnum\"_on] [&_p.heroDesc]:text-muted-foreground [&_p.heroDesc]:[font-size:16px] [&_p.heroDesc]:font-[1000] [&_p.heroDesc]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_p.heroDesc]:tracking-normal [&_p.heroDesc]:leading-[24px] [&_p.heroDesc]:[width:min(340px,_100%)] [&_p.heroDesc]:m-0 min-[810px]:[&_h1]:[width:min(700px,_100%)] min-[1200px]:[&_h1]:[width:min(1000px,_100%)] min-[810px]:[&_h2]:[width:min(700px,_100%)] min-[1200px]:[&_h2]:[width:min(1000px,_100%)]",
  staticHero:
    "staticHero text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h1]:m-0 [&_h1]:[font-size:3.5rem] [&_h1]:font-[1000] [&_h1]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h1]:tracking-[-0.04em] [&_h1]:leading-[1.1] [&_h1]:[width:min(700px,_100%)] [&_h1]:mx-auto [&_h1]:[font-feature-settings:\"tnum\"_on] [&_h2]:m-0 [&_h2]:[font-size:3.5rem] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:tracking-[-0.04em] [&_h2]:leading-[1.1] [&_h2]:[width:min(700px,_100%)] [&_h2]:mx-auto [&_h2]:[font-feature-settings:\"tnum\"_on] [&_p.heroDesc]:text-muted-foreground [&_p.heroDesc]:[font-size:16px] [&_p.heroDesc]:font-[1000] [&_p.heroDesc]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_p.heroDesc]:tracking-normal [&_p.heroDesc]:leading-[24px] [&_p.heroDesc]:[width:min(540px,_100%)] [&_p.heroDesc]:m-0 min-[1200px]:[&_h1]:[width:min(900px,_100%)] min-[1200px]:[&_h2]:[width:min(900px,_100%)]",
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto min-[1200px]:[width:min(1200px,_calc(100%_-_32px))]",
  dash:
    "dash [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:no-repeat] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] motion-reduce:animate-none",
  heroFrame:
    "heroFrame [&_.announcement-wrap]:relative [&_.announcement-wrap]:z-[1] [&_.announcement-wrap]:flex [&_.announcement-wrap]:justify-center [&_.announcement-wrap]:p-0 [&_.announcement]:box-border [&_.announcement]:h-[26px] relative flex flex-col items-center justify-center gap-[34px] h-[810px] [padding:100px_20px_130px] overflow-hidden min-[810px]:h-[810px] min-[1200px]:h-[810px]",
  staticFrame:
    "staticFrame relative flex flex-col items-center justify-center gap-[28px] [padding:56px_24px] overflow-hidden min-[810px]:[padding:72px_34px]",
  heroVeil:
    "heroVeil absolute inset-0 overflow-hidden pointer-events-none bg-background [mask-image:radial-gradient(_58.8%_105%_at_50%_100%,_var(--color-background)_0%,_var(--color-veil-10)_26.295%,_var(--color-veil-30)_71.0146%,_var(--color-background)_100%_)] [-webkit-mask-image:radial-gradient(_58.8%_105%_at_50%_100%,_var(--color-background)_0%,_var(--color-veil-10)_26.295%,_var(--color-veil-30)_71.0146%,_var(--color-background)_100%_)]",
  heroMedia:
    "heroMedia absolute inset-0 overflow-hidden pointer-events-none bg-background [mask-image:radial-gradient(_58.8%_105%_at_50%_100%,_var(--color-background)_0%,_var(--color-veil-10)_26.295%,_var(--color-veil-30)_71.0146%,_var(--color-background)_100%_)] [-webkit-mask-image:radial-gradient(_58.8%_105%_at_50%_100%,_var(--color-background)_0%,_var(--color-veil-10)_26.295%,_var(--color-veil-30)_71.0146%,_var(--color-background)_100%_)]",
  heroShafts:
    "heroShafts absolute inset-0 [filter:hue-rotate(1deg)] [mask-image:url(/home/rays-mask.svg),_linear-gradient(0deg,_var(--color-transparent)_46%,_var(--color-veil-70)_100%)] [mask-repeat:no-repeat,_no-repeat] [mask-position:bottom_center,_center] [mask-size:cover,_100%_100%] [mask-composite:add,_add] [-webkit-mask-image:url(/home/rays-mask.svg),_linear-gradient(0deg,_var(--color-transparent)_46%,_var(--color-veil-70)_100%)] [-webkit-mask-repeat:no-repeat,_no-repeat] [-webkit-mask-position:bottom_center,_center] [-webkit-mask-size:cover,_100%_100%]",
  heroGlow:
    "heroGlow absolute inset-0 [filter:brightness(1.5)_contrast(0.85)] [&_>_:first-child]:w-full [&_>_:first-child]:h-full [&_>_:first-child]:[aspect-ratio:auto]",
  grain:
    "grain absolute inset-0 [background-image:url(/home/grain.png)] [background-repeat:repeat] [background-size:40px_auto] opacity-50 pointer-events-none",
  heroCopy:
    "heroCopy relative z-[1] flex flex-col items-center gap-[24px] w-full p-0 text-center",
  heroDesc: "heroDesc",
  eyebrow:
    "eyebrow m-0 font-mono [font-size:12px] font-medium [font-variation-settings:normal] tracking-[0.24px] leading-[19.2px] uppercase text-brand",
  actions: "actions relative z-[1] flex flex-wrap gap-[10px] justify-center mt-0",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
