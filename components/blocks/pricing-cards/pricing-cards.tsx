"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cx } from "@/components/blocks/pricing-cards/pricing-cards-styles";

export type PricingPeriod = "monthly" | "yearly";
export type BuiltinPlanMark = "starter" | "pro" | "agency";

export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  popular?: boolean;
  badgeLabel?: string;
  freeLabel?: string;
  currency?: string;
  currencySuffix?: string;
  pricePrefix?: string;
  monthly: string;
  yearly?: string;
  monthlySuffix?: string;
  yearlySuffix?: string;
  features: readonly string[];
  cta: string;
  href: string;
  tone: "primary" | "secondary";
  ctaLocation?: string;
  icon?: BuiltinPlanMark | ReactNode;
};

export type BillingToggleConfig = {
  enabled: boolean;
  defaultPeriod?: PricingPeriod;
  ariaLabel?: string;
  monthlyLabel?: string;
  yearlyLabel?: string;
  discountBadge?: string;
};

export type PricingCardsProps = {
  plans: readonly PricingPlan[];
  billingToggle?: BillingToggleConfig;
  titleId?: string;
  ariaLabel?: string;
  className?: string;
};

export function PlanMark({
  icon,
  size,
  accent,
}: {
  icon?: BuiltinPlanMark | ReactNode;
  size: number;
  accent?: boolean;
}) {
  if (!icon) {
    return null;
  }
  if (icon !== "starter" && icon !== "pro" && icon !== "agency") {
    return <>{icon}</>;
  }
  const isAccent = accent ?? icon === "pro";
  return (
    <svg
      viewBox="0 0 44 44"
      width={size}
      height={size}
      aria-hidden="true"
      className={cx(isAccent ? "markAccent" : "mark")}
    >
      {icon === "starter" ? (
        <path
          d="M15 0H21M15 36H21M8 4H28M8 32H28M3 8H33M3 28H33M1 12H35M0 16H36M0 20H36M1 24H35"
          transform="translate(4 4)"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      ) : null}
      {icon === "pro" ? (
        <>
          <path d="M0 0H6" transform="translate(19 4)" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0 0H8" transform="translate(17 8)" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0 0H10" transform="translate(15 12)" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0 0H26" transform="translate(12 16)" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0 0H26" transform="translate(10 20)" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0 0H26" transform="translate(8 24)" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0 0H26" transform="translate(6 28)" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0 0H10" transform="translate(19 32)" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0 0H8" transform="translate(19 36)" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0 0H6" transform="translate(19 40)" fill="none" stroke="currentColor" strokeWidth="2" />
        </>
      ) : null}
      {icon === "agency" ? (
        <path
          d="M11 0H29M7 4H33M3 8H37M0 12H40M2 16H38M6 20H34M11 24H29M14 28H26M18 32H22"
          transform="translate(2 6)"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      ) : null}
    </svg>
  );
}

function CardCta({ text, tone }: { text: string; tone: "primary" | "secondary" }) {
  return (
    <Button variant={tone} nativeButton={false} render={<span />} className="max-[809.98px]:mt-[34px]">
      {text}
    </Button>
  );
}

function PriceDigits({ value }: { value: string }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);
  const [scrambled, setScrambled] = useState<boolean[]>([]);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      setScrambled([]);
      return;
    }
    const start = performance.now();
    let timer = 0;
    let frame = 0;
    const tick = (now: number) => {
      if (now - start >= 500) {
        setShown(value);
        setScrambled([]);
        return;
      }
      let next = "";
      const flags: boolean[] = [];
      for (const char of value) {
        const keep = char === " " || Math.random() * 100 > 50;
        if (keep) {
          next += char;
          flags.push(false);
        } else {
          next += "1234567890"[Math.floor(Math.random() * 10)];
          flags.push(true);
        }
      }
      setShown(next);
      setScrambled(flags);
      timer = window.setTimeout(() => {
        frame = requestAnimationFrame(tick);
      }, 40);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [reduced, value]);

  return (
    <span className={cx("digits")} aria-label={value}>
      <span aria-hidden="true">
        {shown.split("").map((char, index) => (
          <span key={`${value}-${index}`} className={scrambled[index] ? cx("digitScramble") : undefined}>
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}

function Check({ tone }: { tone: "accent" | "muted" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      className={cx(tone === "accent" ? "markAccent" : "markMuted")}
    >
      <path
        d="M3.2 8.3 6.3 11.4 12.8 4.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingCards({
  plans,
  billingToggle,
  titleId,
  ariaLabel,
  className,
}: PricingCardsProps) {
  const showToggle = Boolean(billingToggle?.enabled);
  const [period, setPeriod] = useState<PricingPeriod>(billingToggle?.defaultPeriod ?? "monthly");

  return (
    <section
      className={cx("plans", className)}
      aria-labelledby={titleId}
      aria-label={!titleId ? (ariaLabel ?? "Plans") : undefined}
      data-block="pricing-cards"
    >
      {showToggle ? (
        <ToggleGroup
          value={[period]}
          onValueChange={(next) => {
            if (next[0] === "monthly" || next[0] === "yearly") {
              setPeriod(next[0]);
            }
          }}
          spacing={1}
          aria-label={billingToggle?.ariaLabel ?? "Billing period"}
          className={cx("toggle")}
        >
          <span
            className={cx("togglePill")}
            aria-hidden="true"
            style={{
              width: period === "monthly" ? 74 : 107,
              transform: period === "monthly" ? "translateX(0)" : "translateX(78px)",
            }}
          />
          <ToggleGroupItem
            value="monthly"
            className={`${cx(period === "monthly" ? "toggleOn" : "toggleOff")} hover:bg-transparent aria-pressed:bg-transparent`}
            data-track="view_pricing"
            data-track-if="unpressed"
            data-track-billing-period="monthly"
          >
            {billingToggle?.monthlyLabel ?? "Monthly"}
          </ToggleGroupItem>
          <ToggleGroupItem
            value="yearly"
            className={`${cx(period === "yearly" ? "toggleOn" : "toggleOff")} hover:bg-transparent aria-pressed:bg-transparent`}
            data-track="view_pricing"
            data-track-if="unpressed"
            data-track-billing-period="yearly"
          >
            {billingToggle?.yearlyLabel ?? "Yearly"}
            {billingToggle?.discountBadge ? (
              <span className={cx("discount")}>{billingToggle.discountBadge}</span>
            ) : null}
          </ToggleGroupItem>
        </ToggleGroup>
      ) : null}

      <div className={cx("cards")}>
        {plans.map((plan) => {
          const price =
            showToggle && period === "yearly" && plan.yearly !== undefined ? plan.yearly : plan.monthly;
          const suffix =
            showToggle && period === "yearly" ? plan.yearlySuffix : plan.monthlySuffix;
          return (
            <Link
              key={plan.id}
              href={plan.href}
              className={cx(plan.popular ? "cardPopular" : "card")}
              data-track="cta_click"
              data-track-cta-text={plan.cta.replace(/\u00a0/g, " ")}
              data-track-cta-location={plan.ctaLocation ?? `pricing_card_${plan.id}`}
            >
              <span className={cx("wash")} aria-hidden="true" />
              <span className={cx("corner", "nw")} aria-hidden="true" />
              <span className={cx("corner", "ne")} aria-hidden="true" />
              <span className={cx("corner", "sw")} aria-hidden="true" />
              <span className={cx("corner", "se")} aria-hidden="true" />
              <span className={cx("cardBody")}>
                <span className={cx("nameRow")}>
                  <span className={cx("planTitle")}>
                    <PlanMark icon={plan.icon} size={28} accent={plan.popular} />
                    <span className={cx("planName")}>{plan.name}</span>
                  </span>
                  {plan.popular && plan.badgeLabel ? (
                    <Badge className={cx("badge")}>{plan.badgeLabel}</Badge>
                  ) : null}
                </span>
                <span className={cx("description")}>{plan.description}</span>
                {plan.freeLabel ? (
                  <span className={cx("free")}>{plan.freeLabel}</span>
                ) : (
                  <span className={cx("price")}>
                    <span className={cx("amount")}>
                      {plan.pricePrefix ? <span>{plan.pricePrefix}</span> : null}
                      {plan.currency ? <span className={cx("currency")}>{plan.currency}</span> : null}
                      <PriceDigits value={String(price)} />
                      {plan.currencySuffix ? <span>{plan.currencySuffix}</span> : null}
                    </span>
                    {suffix ? <span className={cx("suffix")}>{suffix}</span> : null}
                  </span>
                )}
                <Separator className={cx(plan.popular ? "dividerAccent" : "divider")} />
                <ul className={cx("features")}>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check tone={plan.popular ? "accent" : "muted"} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <span className={cx("push")} />
                <CardCta text={plan.cta} tone={plan.tone} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
