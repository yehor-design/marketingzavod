"use client";

import { useState } from "react";
import { RollingText } from "@/components/motion";
import { GrayRing } from "@/components/motion/gray-ring";

/**
 * One consent choice. Every choice button looks the same, as the consent spec
 * requires (L3): the header's secondary nav button, with its rolling label and
 * dashed hover ring.
 */
export function ConsentButton({ text, onClick }: { text: string; onClick: () => void }) {
  const [rolling, setRolling] = useState(false);
  return (
    <button
      type="button"
      className="nav-button nav-button-secondary gray-pill consent-button"
      onClick={onClick}
      onPointerEnter={() => setRolling(true)}
      onPointerLeave={() => setRolling(false)}
      onFocus={() => setRolling(true)}
      onBlur={() => setRolling(false)}
    >
      <RollingText text={text} rolling={rolling} fontSize={12} lineHeightPx={21.6} />
      <GrayRing />
    </button>
  );
}
