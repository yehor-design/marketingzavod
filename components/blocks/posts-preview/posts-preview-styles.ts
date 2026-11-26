/** Tailwind utility map for the PostsPreview block (2-card blog preview band). */
const styles = {
  block:
    "block pt-[100px] text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:font-[inherit] [&_h3]:font-[inherit] [&_p]:font-[inherit] [&_a:focus-visible]:[outline:1px_solid_var(--color-foreground)] [&_a:focus-visible]:[outline-offset:3px]",
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto [animation:dash-frame_1s_linear_infinite] [background-image:repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(90deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(180deg,_var(--color-rule)_0_12px,_transparent_12px_18px),_repeating-linear-gradient(180deg,_var(--color-rule)_0_12px,_transparent_12px_18px)] [background-repeat:repeat-x,_repeat-x,_repeat-y,_repeat-y] [background-position:top_left,_bottom_left,_top_left,_top_right] [background-size:100%_1px,_100%_1px,_1px_100%,_1px_100%] motion-reduce:animate-none",
  postsHead:
    "postsHead font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] flex gap-[16px] items-center justify-between min-h-[72px] [padding:20px_24px] [border-bottom:1px_dashed_var(--color-rule)] max-[809.98px]:min-h-[82px] max-[809.98px]:[padding:24px] min-[810px]:min-h-[86px] min-[810px]:[padding:24px_34px]",
  viewAll:
    "viewAll font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] inline-flex flex-none gap-[8px] items-center text-muted-foreground [font-size:12px] tracking-normal leading-[1.6]",
  viewIcon:
    "viewIcon inline-flex items-center justify-center w-[20px] h-[20px] rounded-full bg-secondary text-muted-foreground",
  posts:
    "posts grid m-0 p-0 list-none [&_a]:relative [&_a]:flex [&_a]:flex-col [&_a]:h-full [&_a]:overflow-visible [&_a]:text-foreground [&_a]:[border-bottom:1px_dashed_var(--color-rule)] [&_li:last-child_a]:[border-bottom:0] max-[809.98px]:[&_li:not(:last-child)]:mb-[-1px] min-[810px]:[grid-template-columns:1fr_1fr] min-[810px]:[&_a]:[border-bottom:0] min-[810px]:[&_a]:[border-left:1px_dashed_var(--color-rule)] min-[810px]:[&_li:last-child_a]:[border-bottom:0] min-[810px]:[&_li:last-child_a]:[border-left:1px_dashed_var(--color-rule)] min-[810px]:[&_li:first-child_a]:[border-left:0] min-[810px]:[&_a:hover]:bg-panel min-[810px]:[&_a:focus-visible]:bg-panel min-[810px]:[&_a:hover_.postArt]:[filter:none] min-[810px]:[&_a:focus-visible_.postArt]:[filter:none] min-[810px]:[&_a:hover_.tag]:bg-brand min-[810px]:[&_a:hover_.tag]:text-background min-[810px]:[&_a:focus-visible_.tag]:bg-brand min-[810px]:[&_a:focus-visible_.tag]:text-background",
  postArt:
    "postArt block [aspect-ratio:16_/_9] overflow-hidden bg-background [&_canvas]:w-full [&_canvas]:h-full [&_canvas]:object-cover min-[810px]:[filter:brightness(0.7)] motion-reduce:transition-none",
  postCopy:
    "postCopy [&_h3]:font-[1000] [&_h3]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] flex flex-col items-start gap-[14px] [padding:24px] [&_h3]:max-w-[400px] [&_h3]:m-0 [&_h3]:[font-size:1.4rem] [&_h3]:tracking-[-0.01em] [&_h3]:leading-[1.3] max-[809.98px]:[padding:24px_34px_31.8px] min-[810px]:min-h-[239px] min-[810px]:[padding:36px_34px_34px]",
  tag: "tag font-[1000] inline-flex items-center h-[24px] [padding:0_6px] rounded-nav bg-secondary text-foreground [font-size:12px] [font-variation-settings:\"opsz\"_14,_\"wght\"_500] tracking-normal leading-[1.6] motion-reduce:transition-none",
  date: "date font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] text-muted-foreground [font-size:12px] tracking-normal leading-[1.6]",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
