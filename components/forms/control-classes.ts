/** Tailwind styling for unstyled UI SDK parts. Semantic tokens only. */
export const textControlClass =
  "h-10 w-full min-w-0 rounded-lg border border-border bg-input px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive";

export const textAreaClass = `${textControlClass} min-h-40 py-3`;

export const selectPopupClass =
  "z-50 min-w-(--anchor-width) rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md";

export const selectOptionClass =
  "flex cursor-default items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground";
