/** Tailwind utility map for the PricingCards block. */
const styles = {
  plans:
    "plans text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [width:calc(100%_-_32px)] mr-auto ml-auto flex flex-col items-center pt-[34px] min-[1200px]:[width:min(1200px,_calc(100%_-_48px))]",
  toggle:
    "toggle relative inline-flex gap-[4px] items-center h-[40px] mb-[34px] [padding:4px] rounded-track bg-card [box-shadow:inset_0_1px_0_var(--color-secondary),_inset_0_-1px_0_var(--color-background)]",
  togglePill:
    "togglePill absolute top-[4px] left-[4px] h-[32px] rounded-toggle bg-brand-20 pointer-events-none [transition:transform_0.35s_cubic-bezier(0.22,_1,_0.36,_1),_width_0.35s_cubic-bezier(0.22,_1,_0.36,_1)] motion-reduce:transition-none",
  toggleOn:
    "toggleOn relative z-[1] inline-flex gap-[9px] items-center justify-center w-[74px] h-[32px] [padding:0_10px] border-0 rounded-toggle bg-transparent font-display [font-size:14px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] leading-[1.5] cursor-pointer last:w-[107px] last:[padding:0_4px_0_10px] text-brand [&_.discount]:opacity-100",
  toggleOff:
    "toggleOff relative z-[1] inline-flex gap-[9px] items-center justify-center w-[74px] h-[32px] [padding:0_10px] border-0 rounded-toggle bg-transparent font-display [font-size:14px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] leading-[1.5] cursor-pointer last:w-[107px] last:[padding:0_4px_0_10px] text-muted-foreground",
  discount:
    "discount inline-flex items-center justify-center w-[42px] h-[24px] [padding:0_6px] rounded-nav bg-brand text-background [font-size:12px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [opacity:0.1] leading-[19.2px] [transition:opacity_350ms_linear] motion-reduce:transition-none",
  cards:
    "cards [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(180deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(180deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:repeat-x,_repeat-x,_repeat-y,_repeat-y] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] grid w-full bg-background max-[809.98px]:mb-[4px] min-[810px]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] motion-reduce:animate-none",
  card:
    "card relative flex min-h-[500px] [padding:34px] text-foreground no-underline [&_+_.card]:[border-top:1px_dashed_var(--color-rule)] [&_+_.cardPopular]:[border-top:1px_dashed_var(--color-rule)] [&:hover_.wash]:opacity-100 [&:hover_.corner]:opacity-100 [&:focus-visible_.wash]:opacity-100 [&:focus-visible_.corner]:opacity-100 focus-visible:[outline:1px_solid_var(--color-foreground)] focus-visible:[outline-offset:3px] max-[809.98px]:[&_+_.card]:pt-[33px] max-[809.98px]:[&_+_.cardPopular]:pt-[33px] max-[809.98px]:min-h-0 min-[810px]:min-h-[500px] min-[810px]:[padding:34px] min-[810px]:[&_+_.card]:[border-top:0] min-[810px]:[&_+_.card]:[border-left:1px_dashed_var(--color-rule)] min-[810px]:[&_+_.cardPopular]:[border-top:0] min-[810px]:[&_+_.cardPopular]:[border-left:1px_dashed_var(--color-rule)]",
  cardPopular:
    "cardPopular relative flex min-h-[500px] [padding:34px] text-foreground no-underline [&_+_.card]:[border-top:1px_dashed_var(--color-rule)] [&_+_.cardPopular]:[border-top:1px_dashed_var(--color-rule)] [&:hover_.wash]:opacity-100 [&:hover_.corner]:opacity-100 [&:focus-visible_.wash]:opacity-100 [&:focus-visible_.corner]:opacity-100 focus-visible:[outline:1px_solid_var(--color-foreground)] focus-visible:[outline-offset:3px] max-[809.98px]:[&_+_.card]:pt-[33px] max-[809.98px]:[&_+_.cardPopular]:pt-[33px] max-[809.98px]:min-h-0 min-[810px]:min-h-[500px] min-[810px]:[padding:34px] min-[810px]:[&_+_.card]:[border-top:0] min-[810px]:[&_+_.card]:[border-left:1px_dashed_var(--color-rule)] min-[810px]:[&_+_.cardPopular]:[border-top:0] min-[810px]:[&_+_.cardPopular]:[border-left:1px_dashed_var(--color-rule)]",
  wash: "wash absolute pointer-events-none opacity-0 [transition:opacity_0.4s_cubic-bezier(0.4,_0,_0.2,_1)] inset-0 bg-wash motion-reduce:transition-none",
  corner:
    "corner absolute pointer-events-none opacity-0 [transition:opacity_0.4s_cubic-bezier(0.4,_0,_0.2,_1)] z-[2] w-[6px] h-[6px] bg-foreground motion-reduce:transition-none",
  nw: "nw top-[-3px] left-[-3px]",
  ne: "ne top-[-3px] right-[-3px]",
  sw: "sw bottom-[-3px] left-[-3px]",
  se: "se right-[-3px] bottom-[-3px]",
  cardBody: "cardBody relative z-[1] flex flex-1 flex-col w-full",
  nameRow: "nameRow flex gap-[12px] items-center justify-between min-h-[30px]",
  planTitle: "planTitle inline-flex gap-[8px] items-center",
  planName: "planName [font-size:20px] leading-[30px] tracking-[-0.01em]",
  badge:
    "badge inline-flex items-center h-[24px] [padding:0_6px] rounded-nav bg-brand text-background [font-size:12px] leading-[19.2px] whitespace-nowrap",
  description:
    "description mt-[20px] text-muted-foreground [font-size:14px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] leading-[1.5] max-[809.98px]:max-w-[240px] min-[810px]:max-w-[240px]",
  free: "free inline-flex items-center self-start h-[40px] mt-[26px] [padding:0_16px] border-0 rounded-pill [outline:1px_dashed_var(--color-stroke)] [outline-offset:-1px] text-muted-foreground [font-size:16px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] leading-[1.5]",
  price: "price flex flex-wrap gap-[8px] items-center min-h-[39px] mt-[26px] max-[809.98px]:gap-[4px]",
  amount:
    "amount inline-flex items-baseline text-foreground [font-size:30px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [font-feature-settings:\"tnum\"_1] tracking-[-0.01em] leading-[1.3] max-[809.98px]:[&_>_span:last-child]:font-[550] max-[809.98px]:[&_>_span:last-child]:[font-feature-settings:\"tnum\"]",
  currency: "currency mr-[1px] max-[809.98px]:mr-0",
  digits: "digits [font-feature-settings:\"tnum\"_1]",
  digitScramble: "digitScramble text-muted-foreground",
  suffix:
    "suffix pb-[4px] text-muted-foreground [font-size:14px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] leading-[1.5] max-[809.98px]:relative max-[809.98px]:top-[6px]",
  divider: "divider h-[2px] [margin:27px_0_34px] bg-border max-[809.98px]:mt-[26px]",
  dividerAccent: "dividerAccent h-[2px] [margin:27px_0_34px] bg-brand max-[809.98px]:mt-[26px]",
  features:
    "features flex flex-col gap-[8px] m-0 p-0 list-none [&_li]:flex [&_li]:gap-[8px] [&_li]:items-start [&_li]:text-foreground [&_li]:[font-size:14px] [&_li]:font-[1000] [&_li]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_li]:leading-[1.5] max-[809.98px]:[&_svg]:w-[20px] max-[809.98px]:[&_svg]:h-[20px] max-[809.98px]:[&_svg]:mt-0",
  push: "push mt-auto",
  mark: "mark flex-none text-foreground",
  markAccent: "markAccent mt-[2px] flex-none text-brand",
  markMuted: "markMuted flex-none mt-[2px] text-muted-foreground",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
