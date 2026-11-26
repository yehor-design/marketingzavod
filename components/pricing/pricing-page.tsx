"use client";

import {
  ComparisonTable,
  type ComparisonColumn,
  type ComparisonGroup,
} from "@/components/blocks/comparison-table";
import { PricingCards, type PricingPeriod, type PricingPlan } from "@/components/blocks/pricing-cards";
import { PulseGradient } from "@/components/motion";
import { SiteCta } from "@/components/site-cta";
import { TrackView } from "@/components/tracking/track-view";
import styles from "@/components/pricing/pricing-styles";

const NBSP = "\u00A0";

/**
 * Plan purchase buttons on https://jet.framer.website/pricing open
 * https://buy.polar.sh/polar_cl_3qRsLy9BO9WTHskviNZBl54gdf3Uxk9oVwUek1zDfJa
 * The local route for that checkout is /checkout. The closing CTA is /waitlist.
 */
/** Shown when the page opens. Reported with the first view_pricing. */
const DEFAULT_PERIOD: PricingPeriod = "yearly";
const CHECKOUT_HREF = "/checkout";

const plans: readonly PricingPlan[] = [
  {
    id: "starter",
    icon: "starter",
    name: "Starter",
    description: "Perfect for personal projects—speed up one site for free.",
    popular: false,
    freeLabel: "Free forever",
    currency: "$",
    monthly: "29",
    yearly: "24",
    monthlySuffix: "/month",
    yearlySuffix: "/month, billed annually",
    features: ["1 website", "Basic image & code optimization", "Limited analytics"],
    cta: `Try${NBSP}for${NBSP}free`,
    href: CHECKOUT_HREF,
    tone: "secondary",
  },
  {
    id: "pro",
    icon: "pro",
    name: "Pro",
    description: "Boost up to 10 sites with advanced tools and analytics.",
    popular: true,
    badgeLabel: "Most popular",
    currency: "$",
    monthly: "29",
    yearly: "24",
    monthlySuffix: "/month",
    yearlySuffix: "/month, billed annually",
    features: [
      "All Starter features +",
      "Up to 10 websites",
      "Advanced optimization",
      "Advanced Enhanced analytics & monitoring",
      "Priority support",
    ],
    cta: `Get${NBSP}started`,
    href: CHECKOUT_HREF,
    tone: "primary",
  },
  {
    id: "agency",
    icon: "agency",
    name: "Agency",
    description: "Unlimited sites, team features, and white-label options for agencies.",
    popular: false,
    currency: "$",
    monthly: "199",
    yearly: "169",
    monthlySuffix: "/month",
    yearlySuffix: "/month, billed annually",
    features: [
      "All Starter & Pro features +",
      "Unlimited websites",
      "Team collaboration tools",
      "White-label reporting",
      "Dedicated account manager",
    ],
    cta: `Get${NBSP}started`,
    href: CHECKOUT_HREF,
    tone: "secondary",
  },
];

const compareColumns: readonly ComparisonColumn[] = plans.map((plan) => ({
  id: plan.id,
  name: plan.name,
  icon: plan.icon,
  cta: {
    text: plan.cta,
    href: CHECKOUT_HREF,
    tone: plan.tone,
    location: `pricing_compare_${plan.id}`,
  },
}));

const groups: readonly ComparisonGroup[] = [
  {
    title: "General",
    rows: [
      {
        feature: "Number of websites",
        tip: "Manage multiple domains with a single account.",
        tone: "grey",
        cells: [{ text: "1" }, { text: "Up to 10" }, { text: "Unlimited" }],
      },
      {
        feature: "Monthly pageviews",
        tone: "black",
        cells: [{ text: "Up to 10,000" }, { text: "Up to 100,000" }, { text: "Unlimited" }],
      },
      {
        feature: "Support",
        tone: "grey",
        cells: [{ text: "Community" }, { text: "Priority" }, { text: "Dedicated" }],
      },
    ],
  },
  {
    title: "Features",
    rows: [
      {
        feature: "Image optimization",
        tone: "grey",
        cells: [{ mark: "check" }, { mark: "check" }, { mark: "check" }],
      },
      {
        feature: "Code optimization",
        tone: "black",
        cells: [{ mark: "check" }, { mark: "check" }, { mark: "check" }],
      },
      {
        feature: "Global CDN",
        tone: "grey",
        cells: [{ mark: "check" }, { mark: "check" }, { mark: "check" }],
      },
      {
        feature: "Google PageSpeed integration",
        tip: "View your site's Google PageSpeed scores and recommendations directly in your Jet dashboard.",
        tone: "black",
        cells: [{ mark: "x" }, { text: "Included" }, { text: "Included" }],
      },
      {
        feature: "Competitor comparison",
        tone: "grey",
        cells: [{ mark: "x" }, { text: "Up to 3 sites" }, { text: "Unlimited" }],
      },
      {
        feature: "Analytics dashboard",
        tone: "black",
        cells: [{ text: "Basic" }, { text: "Advanced" }, { text: "Advanced" }],
      },
      {
        feature: "Mobile vs Desktop insights",
        tone: "grey",
        cells: [{ mark: "x" }, { mark: "check" }, { mark: "check" }],
      },
    ],
  },
  {
    title: "Team Management",
    rows: [
      {
        feature: "Team members",
        tip: "Add colleagues to manage sites together.",
        tone: "grey",
        cells: [{ mark: "x" }, { text: "1" }, { text: "Unlimited" }],
      },
    ],
  },
  {
    title: "Customization",
    rows: [
      {
        feature: "White-label reporting",
        tip: "Customize reports with your own branding for clients—no Jet logos or references included.",
        tone: "grey",
        cells: [{ mark: "x" }, { mark: "x" }, { mark: "check" }],
      },
      {
        feature: "Dedicated account manager",
        tone: "black",
        cells: [{ mark: "x" }, { mark: "x" }, { mark: "check" }],
      },
    ],
  },
  {
    title: "Alerts & Support",
    rows: [
      {
        feature: "Real-time alerts Copy",
        tone: "black",
        cells: [{ mark: "x" }, { mark: "check" }, { mark: "check" }],
      },
      {
        feature: "Real-time alerts 24/7 monitoring",
        tone: "grey",
        cells: [{ mark: "x" }, { mark: "check" }, { mark: "check" }],
      },
    ],
  },
  {
    title: "Hosting Savings",
    rows: [
      {
        feature: "Hosting cost reduction insights",
        tone: "grey",
        cells: [{ mark: "x" }, { text: "Included" }, { text: "Included" }],
      },
    ],
  },
];

export function PricingPage() {
  return (
    <div className={styles.pricing}>
      <TrackView event="view_pricing" params={{ billing_period: DEFAULT_PERIOD }} />
      <section className={styles.hero} aria-labelledby="pricing-title">
        <div className={styles.band} aria-hidden="true">
          <div className={styles.bandMask}>
            <div className={styles.bandGlow}>
              <PulseGradient variant="dots" />
              <div className={styles.grain} />
            </div>
          </div>
        </div>
        <div className={styles.heroCopy}>
          <h1 id="pricing-title">Choose your Jet plan</h1>
          <p>
            Lightning-fast performance for every website—find the perfect plan for your needs and scale
            with ease.
          </p>
        </div>
        <div className={styles.band} aria-hidden="true">
          <div className={styles.bandMask}>
            <div className={styles.bandGlow}>
              <PulseGradient variant="dots" />
              <div className={styles.grain} />
            </div>
          </div>
        </div>
      </section>

      <div className={styles.spacer} aria-hidden="true" />

      <PricingCards
        titleId="pricing-title"
        plans={plans}
        billingToggle={{
          enabled: true,
          defaultPeriod: DEFAULT_PERIOD,
          ariaLabel: "Billing period",
          monthlyLabel: "Monthly",
          yearlyLabel: "Yearly",
          discountBadge: "-15%",
        }}
      />

      <div className={styles.spacer} aria-hidden="true" />

      <ComparisonTable columns={compareColumns} groups={groups} ariaLabel="Plan comparison" />

      <SiteCta titleId="pricing-cta" />
    </div>
  );
}
