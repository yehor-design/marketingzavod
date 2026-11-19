"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import Link from "next/link";
import { useState } from "react";
import { cx } from "@/components/chrome-styles";
import { RollingText } from "@/components/motion";
import { GrayRing } from "@/components/motion/gray-ring";

const buttonVariants = cva(
  "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: cx("nav-button", "nav-button-primary", "cursor-pointer"),
        secondary: cx("nav-button", "nav-button-secondary", "gray-pill", "cursor-pointer"),
        tertiary: cx("nav-button", "gray-pill", "bg-transparent", "text-foreground", "cursor-pointer"),
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

function rollLineHeight(variant: ButtonVariant) {
  switch (variant) {
    case "primary":
      return 14.4;
    case "secondary":
    case "tertiary":
      return 21.6;
    default: {
      const exhaustive: never = variant;
      return exhaustive;
    }
  }
}

function Button({
  className,
  variant = "primary",
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const [rolling, setRolling] = useState(false);
  const resolved = variant ?? "primary";
  const label = typeof children === "string" ? children : null;

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant: resolved }), className)}
      onPointerEnter={(event) => {
        setRolling(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setRolling(false);
        onPointerLeave?.(event);
      }}
      onFocus={(event) => {
        setRolling(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setRolling(false);
        onBlur?.(event);
      }}
      {...props}
    >
      {label === null ? (
        children
      ) : (
        <RollingText
          text={label}
          rolling={rolling}
          fontSize={12}
          lineHeightPx={rollLineHeight(resolved)}
        />
      )}
      {resolved === "primary" ? null : <GrayRing />}
    </ButtonPrimitive>
  );
}

function CtaLink({
  href,
  text,
  variant = "primary",
  location,
  className,
  onClick,
}: {
  href: string;
  text: string;
  variant?: ButtonVariant;
  location: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      variant={variant}
      className={className}
      nativeButton={false}
      onClick={onClick}
      render={
        <Link
          href={href}
          data-track="cta_click"
          data-track-cta-text={text.replace(/\u00a0/g, " ")}
          data-track-cta-location={location}
        />
      }
    >
      {text}
    </Button>
  );
}

export { Button, CtaLink, buttonVariants };
