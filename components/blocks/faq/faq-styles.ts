/** Tailwind utility map for the Faq block (animated accordion in dashed split grid). */
const styles = {
  section:
    "section text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [padding:100px_0_0]",
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto min-[1200px]:[width:min(1200px,_calc(100%_-_32px))]",
  dash:
    "dash [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:no-repeat] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] motion-reduce:animate-none",
  faqGrid:
    "faqGrid [&_>_h2]:[font-size:1.6rem] [&_>_h2]:font-[1000] [&_>_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_>_h2]:tracking-[-0.01em] [&_>_h2]:leading-[1.2] relative grid [&_>_h2]:self-center [&_>_h2]:flex [&_>_h2]:items-center [&_>_h2]:justify-center [&_>_h2]:w-full [&_>_h2]:h-[155px] [&_>_h2]:m-0 [&_>_h2]:text-center min-[810px]:[&_>_h2]:self-start min-[810px]:[&_>_h2]:block min-[810px]:[&_>_h2]:[width:min(286px,_calc(100%_-_48px))] min-[810px]:[&_>_h2]:h-auto min-[810px]:[&_>_h2]:[margin:34px_0_0_24px] min-[810px]:[&_>_h2]:text-left min-[810px]:[grid-template-columns:470fr_730fr] min-[1200px]:relative min-[1200px]:[grid-template-columns:470px_730px] min-[1200px]:min-h-[410px] min-[1200px]:[&_>_h2]:w-[286px] min-[1200px]:[&_>_h2]:[margin:34px_0_0_24px] min-[1200px]:before:content-[''] min-[1200px]:before:absolute min-[1200px]:before:top-0 min-[1200px]:before:bottom-0 min-[1200px]:before:w-[1px] min-[1200px]:before:[background:repeating-linear-gradient(var(--color-rule)_0_12px,_transparent_12px_18px)] min-[1200px]:before:pointer-events-none min-[1200px]:before:[animation:dash-y_1s_linear_infinite] min-[1200px]:before:left-[470px] motion-reduce:before:animate-none max-[809.98px]:[&_>_h2]:w-[286px] max-[809.98px]:[&_>_h2]:h-auto max-[809.98px]:[&_>_h2]:mr-auto max-[809.98px]:[&_>_h2]:ml-auto max-[809.98px]:[&_>_h2]:justify-center max-[809.98px]:[&_>_h2]:p-0 max-[809.98px]:[&_>_h2]:text-center max-[809.98px]:[&_>_h2_span]:w-[286px] max-[809.98px]:[&_>_h2_span]:text-center max-[809.98px]:[&_>_h2_span]:[text-wrap:wrap] max-[809.98px]:[&_>_h2_span]:[transform:none]",
  faqItem:
    "faqItem [&_button:focus-visible]:[outline:1px_solid_var(--color-foreground)] [&_button:focus-visible]:[outline-offset:3px] relative [border-top:0] bg-transparent after:content-[''] after:absolute after:right-0 after:bottom-0 after:left-0 after:z-[2] after:h-[1px] after:[background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] after:[background-size:18px_1px] after:[animation:dash-x_1s_linear_infinite] after:pointer-events-none [&_h3]:m-0 [&_h3]:[font-size:16px] [&_h3]:font-[1000] [&_h3]:leading-[24px] [&_button]:flex [&_button]:items-start [&_button]:gap-[24px] [&_button]:w-full [&_button]:h-auto [&_button]:min-h-[82px] [&_button]:[padding:28px_24px_28px_34px] [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-foreground [&_button]:font-display [&_button]:[font-size:16px] [&_button]:font-[1000] [&_button]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_button]:leading-[24px] [&_button]:text-left [&_button]:cursor-pointer [&_button_>_span:first-child]:[flex:1_0_0] [&_button_>_span:first-child]:min-w-0 motion-reduce:after:animate-none",
  faqOpen: "faqOpen [&_button]:min-h-0",
  faqAnswer:
    "faqAnswer [&_p]:m-0 [&_p]:text-muted-foreground [&_p]:font-[1000] [&_p]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] overflow-hidden [&_p]:max-w-[440px] [&_p]:ml-[34px] [&_p]:[padding:0_44px_28px_0] [&_p]:[font-size:16px] [&_p]:leading-[24px] [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2",
  plus:
    "plus relative flex-none w-[26px] h-[26px] before:content-[''] before:absolute before:top-[12px] before:left-[6px] before:w-[14px] before:h-[1px] before:bg-muted-foreground after:content-[''] after:absolute after:top-[12px] after:left-[6px] after:w-[14px] after:h-[1px] after:bg-muted-foreground after:[transform:rotate(90deg)]",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
