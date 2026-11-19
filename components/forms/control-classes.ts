/** Tailwind styling for the unstyled select popup. Matches the shadcn input metrics. */
export const textControlClass =
  "flex h-8 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 text-base font-normal text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm";

export const selectPopupClass =
  "z-50 min-w-(--anchor-width) rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md";

export const selectOptionClass =
  "flex cursor-default items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm font-normal outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground";
