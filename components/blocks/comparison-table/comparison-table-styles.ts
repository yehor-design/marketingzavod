/** Tailwind utility map for the ComparisonTable block (3- or 4-column feature matrix). */
const styles = {
  compare:
    "compare text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [width:calc(100%_-_32px)] mr-auto ml-auto box-border [padding:1px_1px_0] min-[1200px]:[width:min(1200px,_calc(100%_-_48px))]",
  sectionTitle:
    "sectionTitle m-0 mb-[24px] [font-size:1.6rem] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] tracking-[-0.01em] leading-[1.2] text-center",
  switcher:
    "switcher flex gap-[12px] items-center justify-between w-full h-[90px] mb-0 max-[809.98px]:items-start max-[809.98px]:h-[86px] max-[809.98px]:pt-[26px] max-[809.98px]:pr-[20px] max-[809.98px]:pl-[20px] min-[1200px]:hidden",
  switcherAuto:
    "switcherAuto h-auto! min-h-[64px] items-center [padding:16px_12px] max-[809.98px]:h-auto! max-[809.98px]:items-center max-[809.98px]:[padding:16px_12px]",
  tabs: "tabs flex flex-wrap gap-[4px] items-center min-h-[30px] max-[809.98px]:gap-0 max-[809.98px]:ml-0",
  tabsAuto:
    "tabsAuto group-data-horizontal/tabs:h-auto! h-auto! w-full justify-start gap-[6px] max-[809.98px]:gap-[6px]",
  tab: "tab h-[30px] [padding:0_12px] border-0 rounded-toggle bg-transparent font-display [font-size:12px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_500] leading-[1.6] cursor-pointer text-muted-foreground",
  tabOn:
    "tabOn h-[30px] [padding:0_12px] border-0 rounded-toggle font-display [font-size:12px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_500] leading-[1.6] cursor-pointer bg-brand text-background",
  tabOnProse:
    "motion-reduce:transition-none text-background! hover:text-background! dark:hover:text-background! dark:data-active:text-background!",
  tabProse: "motion-reduce:transition-none",
  table:
    "table [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(180deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(180deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:repeat-x,_repeat-x,_repeat-y,_repeat-y] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] w-full bg-background motion-reduce:animate-none",
  head: "head hidden min-[1200px]:grid min-[1200px]:items-center min-[1200px]:min-h-[90px] min-[1200px]:[border-bottom:1px_dashed_var(--color-rule)]",
  headProse: "min-[1200px]:items-stretch",
  cols3: "min-[1200px]:[grid-template-columns:repeat(4,_minmax(0,_1fr))]",
  cols4: "min-[1200px]:[grid-template-columns:minmax(180px,_0.9fr)_repeat(4,_minmax(0,_1fr))]",
  headPlan:
    "headPlan flex gap-[6px] items-center justify-start [padding:20px] [&_h3]:flex-none [&_h3]:m-0 [&_h3]:[font-size:16px] [&_h3]:font-[1000] [&_h3]:tracking-[-0.01em] [&_h3]:leading-[1.2] [&_h3]:[transform:translateY(1.16px)]",
  headPlanProse:
    "headPlanProse min-w-0 min-[1200px]:[border-left:1px_dashed_var(--color-rule)] [&_h3]:flex-initial [&_h3]:[transform:none]",
  headPlanHighlight: "text-brand",
  headPlanHighlightProse: "bg-accent-tint",
  category:
    "category flex items-center h-[90px] min-h-0 m-0 [padding:0_20px] overflow-hidden [border-top:1px_dashed_var(--color-rule)] [font-size:16px] font-[1000] tracking-normal leading-[24px] max-[809.98px]:pl-[12px] min-[1200px]:pr-[20px] min-[1200px]:pl-[20px]",
  rowGrey:
    "rowGrey grid [grid-template-columns:1fr_1fr] items-center min-h-[64px] [border-top:1px_dashed_var(--color-rule)] bg-card [&_h5]:flex [&_h5]:gap-[8px] [&_h5]:items-center [&_h5]:min-h-0 [&_h5]:m-0 [&_h5]:[padding:0_20px] [&_h5]:overflow-hidden [&_h5]:[font-size:14px] [&_h5]:font-[1000] [&_h5]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h5]:tracking-normal [&_h5]:leading-[1.5] min-[1200px]:[&_h5]:pr-[20px] min-[1200px]:[&_h5]:pl-[20px]",
  rowBlack:
    "rowBlack grid [grid-template-columns:1fr_1fr] items-center min-h-[64px] [border-top:1px_dashed_var(--color-rule)] bg-background [&_h5]:flex [&_h5]:gap-[8px] [&_h5]:items-center [&_h5]:min-h-0 [&_h5]:m-0 [&_h5]:[padding:0_20px] [&_h5]:overflow-hidden [&_h5]:[font-size:14px] [&_h5]:font-[1000] [&_h5]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h5]:tracking-normal [&_h5]:leading-[1.5] min-[1200px]:[&_h5]:pr-[20px] min-[1200px]:[&_h5]:pl-[20px]",
  rowCompact: "h-[64px] min-h-0 overflow-hidden",
  rowProse:
    "rowProse items-stretch [grid-template-columns:minmax(0,_0.85fr)_minmax(0,_1.15fr)] [&_h5]:[padding:16px_14px] [&_h5]:overflow-visible [&_h5]:[overflow-wrap:break-word] min-[1200px]:[&_h5]:[padding:18px_20px]",
  value:
    "value justify-center [padding:12px_16px] [font-size:14px] leading-[1.5] text-center hidden min-[1200px]:flex",
  valueActive:
    "valueActive justify-center [padding:12px_16px] [font-size:14px] leading-[1.5] text-center flex min-[1200px]:flex",
  valueProse:
    "valueProse items-center justify-start min-w-0 [padding:16px_14px] text-left font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] text-muted-foreground [border-left:1px_dashed_var(--color-rule)] [overflow-wrap:break-word] min-[1200px]:[padding:18px_20px]",
  valueHighlight: "text-brand",
  valueHighlightProse:
    "valueHighlightProse bg-accent-tint text-foreground! [font-variation-settings:\"opsz\"_14,_\"wght\"_550]",
  cellIcon: "cellIcon inline-flex items-center justify-center",
  markAccent: "markAccent mt-[2px] flex-none text-brand",
  markCross: "markCross text-faint-35",
  tipButton:
    "tipButton inline-flex items-center justify-center w-[18px] h-[18px] p-0 [border:1px_solid_var(--color-line-25)] rounded-full bg-transparent text-muted-foreground font-display [font-size:11px] leading-[1] cursor-pointer",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
