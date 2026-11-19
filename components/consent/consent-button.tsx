"use client";

import { Button } from "@/components/ui/button";

/**
 * Same control as the navbar. Accept all uses Join waitlist (primary).
 * Settings and Save choices use Contact (secondary). Necessary only is
 * tertiary: the secondary shell and hover, with a transparent rest state.
 * Width stays on the label. Do not stretch it.
 */
export function ConsentButton({
  text,
  onClick,
  variant = "secondary",
}: {
  text: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "tertiary";
}) {
  return (
    <Button variant={variant} type="button" onClick={onClick}>
      {text}
    </Button>
  );
}
