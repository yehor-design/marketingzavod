"use client";

import { CtaLink } from "@/components/ui/button";

const NBSP = "\u00A0";

export function JoinButton() {
  return (
    <CtaLink href="/waitlist" text={`Join${NBSP}waitlist`} location="updates" className="mt-[28px]" />
  );
}
