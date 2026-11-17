"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RollingText } from "@/components/motion";
import { GrayRing } from "@/components/motion/gray-ring";
import { cn } from "@/lib/utils";

/**
 * A consent choice. Accept all is the primary (white) button. Every other
 * choice keeps the secondary button and its rolling label. The dashed hover
 * ring stays on secondary buttons only, so the primary fill stays white.
 */
export function ConsentButton({
  text,
  onClick,
  variant = "secondary",
}: {
  text: string;
  onClick: () => void;
  variant?: "default" | "secondary";
}) {
  const [rolling, setRolling] = useState(false);
  const primary = variant === "default";

  return (
    <Button
      type="button"
      variant={variant}
      className={cn("w-full min-w-0", !primary && "gray-pill")}
      onClick={onClick}
      onPointerEnter={() => setRolling(true)}
      onPointerLeave={() => setRolling(false)}
      onFocus={() => setRolling(true)}
      onBlur={() => setRolling(false)}
    >
      <RollingText text={text} rolling={rolling} fontSize={12} lineHeightPx={21.6} />
      {primary ? null : <GrayRing />}
    </Button>
  );
}
