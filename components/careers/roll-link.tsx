"use client";

import Link from "next/link";
import { useState } from "react";
import { RollingText } from "@/components/motion";
import { GrayRing } from "@/components/motion/gray-ring";

export function RollLink({
  href,
  text,
  className,
}: {
  href: string;
  text: string;
  className: string;
}) {
  const [rolling, setRolling] = useState(false);

  return (
    <Link
      href={href}
      className={className}
      data-track="cta_click"
      data-track-cta-text={text.replace(/\u00a0/g, " ")}
      data-track-cta-location="careers"
      onPointerEnter={() => setRolling(true)}
      onPointerLeave={() => setRolling(false)}
      onFocus={() => setRolling(true)}
      onBlur={() => setRolling(false)}
    >
      <RollingText text={text} rolling={rolling} />
      {className.includes("gray-pill") ? <GrayRing /> : null}
    </Link>
  );
}
