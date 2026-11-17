"use client";

import { useState } from "react";
import { cx } from "@/components/chrome-styles";
import { RollingText } from "@/components/motion";
import { GrayRing } from "@/components/motion/gray-ring";

/**
 * Same control as the navbar. Accept all uses Join waitlist (primary):
 * 30px, 12px Google Sans, 6px radius, 14.4px roll, no dashed ring.
 * Every other choice uses Contact (secondary): the same shell, a 21.6px
 * roll, and the gray pill hover. Width stays on the label. Do not stretch it.
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
    <button
      type="button"
      className={
        primary
          ? cx("nav-button", "nav-button-primary", "cursor-pointer")
          : cx("nav-button", "nav-button-secondary", "gray-pill", "cursor-pointer")
      }
      onClick={onClick}
      onPointerEnter={() => setRolling(true)}
      onPointerLeave={() => setRolling(false)}
      onFocus={() => setRolling(true)}
      onBlur={() => setRolling(false)}
    >
      <RollingText
        text={text}
        rolling={rolling}
        fontSize={12}
        lineHeightPx={primary ? 14.4 : 21.6}
      />
      {primary ? null : <GrayRing />}
    </button>
  );
}
