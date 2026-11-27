/** Tailwind utility map for the AnnouncementBar block (DS-21, DS-23, GL-01..GL-04). */
const styles = {
  globalWrap:
    "announcement-wrap flex justify-center [padding:16px_12px_0] min-[810px]:[padding:16px_16px_0]",
  globalWrapHome:
    "announcement-wrap flex justify-center [padding:calc(var(--header-height)+16px)_12px_0] min-[810px]:[padding:calc(var(--header-height)+16px)_16px_0]",
  bar:
    "announcement inline-flex items-center gap-[8px] max-w-full [padding:6px_6px_6px_12px] rounded-button bg-accent-tint text-brand font-mono [font-size:11px] font-medium leading-[1.45] tracking-normal [backdrop-filter:blur(4px)] [transition:color_300ms_linear] min-[810px]:gap-[12px] min-[810px]:[padding:6px_6px_6px_14px] min-[810px]:rounded-pill min-[810px]:[font-size:12px] min-[810px]:leading-[1.6] min-[810px]:tracking-[0.02em] motion-reduce:transition-none",
  link:
    "min-w-0 text-left text-brand [transition:color_200ms_ease] hover:text-foreground focus-visible:text-foreground motion-reduce:transition-none",
  closeButton:
    "inline-flex flex-none items-center justify-center w-[24px] h-[24px] -my-[2px] -mr-[2px] p-0 border-0 rounded-pill bg-transparent cursor-pointer focus-visible:outline-[1px_solid_var(--foreground)] focus-visible:outline-offset-[2px]",
  closeBadge:
    "inline-flex items-center justify-center w-[16px] h-[16px] rounded-pill bg-brand text-background [transition:opacity_200ms_ease] hover:opacity-85 motion-reduce:transition-none",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
