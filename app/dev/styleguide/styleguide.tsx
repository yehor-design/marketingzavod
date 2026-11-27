"use client";

import { AnnouncementBar } from "@/components/blocks/announcement-bar";
import { ArticleBody } from "@/components/blocks/article-body";
import { Benefits, BenefitsHighlight } from "@/components/blocks/benefits";
import { CardGrid, type CardGridItem } from "@/components/blocks/card-grid";
import {
  ComparisonTable,
  type ComparisonColumn,
  type ComparisonGroup,
} from "@/components/blocks/comparison-table";
import {
  ContactForm,
  contactFormStyles,
  type ContactFieldRow,
} from "@/components/blocks/contact-form";
import { CtaBand } from "@/components/blocks/cta-band";
import { Faq, type FaqItem } from "@/components/blocks/faq";
import { FeatureGrid, type FeatureGridItem } from "@/components/blocks/feature-grid";
import { FeatureSection } from "@/components/blocks/feature-section";
import { FounderCard } from "@/components/blocks/founder-card";
import { Hero } from "@/components/blocks/hero";
import { LegalBody } from "@/components/blocks/legal-body";
import { LinkList } from "@/components/blocks/link-list";
import { MirrorQuestions } from "@/components/blocks/mirror-questions";
import { Mission, MissionHighlight } from "@/components/blocks/mission";
import { OpenRoles } from "@/components/blocks/open-roles";
import { PilotBanner } from "@/components/blocks/pilot-banner";
import { PostCard, type PostCardItem } from "@/components/blocks/post-card";
import { PostList } from "@/components/blocks/post-list";
import { PostsPreview } from "@/components/blocks/posts-preview";
import { PricingCards, type PricingPlan } from "@/components/blocks/pricing-cards";
import { ProcessSteps, type ProcessStepItem } from "@/components/blocks/process-steps";
import { TeamMember } from "@/components/blocks/team-member";
import { BenefitIcon } from "@/components/careers/icons";
import { cx } from "@/components/chrome-styles";
import { FOUNDER_PHOTOS } from "@/content/bg/types";
import { isBg } from "@/lib/edition";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import {
  TextGlitch,
  TextShimmer,
  nestedDither,
  orderedDither,
  randomDither,
} from "@/components/motion";
import { CornerMarks } from "@/components/motion/corner-marks";
import { DitherImage } from "@/components/home/dither-image";
import { Halftone } from "@/components/home/halftone";
import { PhosphorIcon } from "@/components/home/phosphor-icon";
import home from "@/components/home/home-styles";
import { Badge } from "@/components/ui/badge";
import { Button, CtaLink } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import styles from "./styleguide-styles";

const NBSP = " ";

const THEMES = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

const demoFeatureItems: readonly FeatureGridItem[] = [
  {
    title: "Better user experience",
    body: "Load pages in milliseconds.\nKeep visitors coming back.",
    visual: {
      kind: "dither",
      src: "/home/benefit-wand.png",
      color: "#00e6c5",
      label: "Dithered web screen with magic wand",
    },
  },
  {
    title: "Improved SEO",
    body: "Rank higher on Google.\nStand out from competitors.",
    visual: {
      kind: "dither",
      src: "/home/benefit-podium.png",
      color: "#d85ce0",
      label: "Dithered podium with #1 text",
    },
  },
  {
    title: "Increased conversion",
    body: "Turn visitors into customers.\nBoost your bottom line.",
    visual: {
      kind: "dither",
      src: "/home/benefit-lightning.png",
      color: "#29c2ff",
      label: "Dithered lightning icon",
    },
  },
  {
    title: "Cost savings",
    body: "Reduce hosting expenses.\nEliminate performance headaches.",
    visual: {
      kind: "dither",
      src: "/home/benefit-coins.png",
      color: "#e0cd3a",
      label: "Dithered stacked coins",
    },
  },
];

const demoProcessSteps: readonly ProcessStepItem[] = [
  { title: "Enter your URL", body: "Quick setup, ready to optimize", icon: "link" },
  { title: "Start optimization", body: "Analyze and enhance your site", icon: "wand" },
  { title: "Speed takes off", body: "Faster loading, better results", icon: "rocket" },
];

const demoCardTiles: readonly CardGridItem[] = [
  { title: "One-click optimize", body: "Make your site faster instantly", icon: "bolt" },
  { title: "Code cleanup", body: "Remove bloat for better performance", icon: "broom" },
  { title: "24/7 monitoring", body: "Always watching your site's performance", icon: "chart" },
  { title: "Real-time alerts", body: "Know about issues right away", icon: "bell" },
];

const demoFaqItems: readonly FaqItem[] = [
  {
    question: "Do I need coding skills?",
    answer: "Not at all—just enter your website URL and Jet handles the rest automatically.",
  },
  {
    question: "Where can I inspect the plans?",
    answer: (
      <>
        Full tier breakdown is available on the <Link href="/pricing">Pricing page</Link>.
      </>
    ),
  },
  {
    question: "Is it safe to use Jet?",
    answer: "Yes—we never modify your original files and can instantly reverse any changes if needed.",
  },
  {
    question: "How fast will I see results?",
    answer: "Most sites see improvement in seconds, with full optimization within 5 minutes.",
  },
];

const demoPricingPlans: readonly PricingPlan[] = [
  {
    id: "starter",
    icon: "starter",
    name: "Starter",
    description: "Perfect for personal projects—speed up one site for free.",
    freeLabel: "Free forever",
    currency: "$",
    monthly: "29",
    yearly: "24",
    monthlySuffix: "/month",
    yearlySuffix: "/month, billed annually",
    features: ["1 website", "Basic image & code optimization", "Limited analytics"],
    cta: `Try${NBSP}for${NBSP}free`,
    href: "/checkout",
    tone: "secondary",
    ctaLocation: "styleguide",
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
      "Priority support",
    ],
    cta: `Get${NBSP}started`,
    href: "/checkout",
    tone: "primary",
    ctaLocation: "styleguide",
  },
  {
    id: "agency",
    icon: "agency",
    name: "Agency",
    description: "Unlimited sites, team features, and white-label options for agencies.",
    currency: "$",
    monthly: "199",
    yearly: "169",
    monthlySuffix: "/month",
    yearlySuffix: "/month, billed annually",
    features: [
      "All Starter & Pro features +",
      "Unlimited websites",
      "Team collaboration tools",
      "Dedicated account manager",
    ],
    cta: `Get${NBSP}started`,
    href: "/checkout",
    tone: "secondary",
    ctaLocation: "styleguide",
  },
];

const demoCompareColumns3: readonly ComparisonColumn[] = [
  { id: "starter", icon: "starter", name: "Starter" },
  { id: "pro", icon: "pro", name: "Pro", highlight: true },
  { id: "agency", icon: "agency", name: "Agency" },
];

const demoCompareGroups3: readonly ComparisonGroup[] = [
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
        feature: "Global CDN",
        tone: "black",
        cells: [{ mark: "check" }, { mark: "check" }, { mark: "check" }],
      },
      {
        feature: "White-label reporting",
        tone: "grey",
        cells: [{ mark: "x" }, { mark: "x" }, { mark: "check" }],
      },
    ],
  },
];

const demoCompareColumns4: readonly ComparisonColumn[] = [
  { id: "in-house", name: "In-house" },
  { id: "freelancer", name: "Freelancer" },
  { id: "diy-ai", name: "DIY + AI" },
  { id: "agency", name: "Agency", highlight: true },
];

const demoCompareGroups4: readonly ComparisonGroup[] = [
  {
    rows: [
      {
        feature: "Strategy",
        tone: "grey",
        cells: [
          { text: "Depends on hire" },
          { text: "Rarely" },
          { text: "Owner" },
          { text: "Dedicated strategist" },
        ],
      },
      {
        feature: "Continuity",
        tone: "black",
        cells: [
          { text: "Single person" },
          { text: "Find replacement" },
          { text: "Self-maintained" },
          { text: "Documented process" },
        ],
      },
    ],
  },
];

const colors = [
  { name: "background", value: "#000", use: "Page, footer, canvases" },
  { name: "surface-panel", value: "#080808", use: "Contact form panel, table cells" },
  { name: "surface-raised", value: "#0c0c0c", use: "Toggle track, grey table rows, quotes, code" },
  { name: "field", value: "#171717", use: "Inputs, secondary buttons, tags, open FAQ row" },
  { name: "rule", value: "#1c1c1c", use: "Dashed frames and rules, step icon circle" },
  { name: "ring", value: "#333", use: "Secondary button hover ring, Free outline" },
  { name: "text", value: "#fff", use: "Headings, primary text, primary button" },
  { name: "muted", value: "rgba(255, 255, 255, 0.5)", use: "Secondary text, labels, resting links" },
  { name: "faint", value: "rgba(255, 255, 255, 0.3)", use: "Copyright, chevrons. Below 4.5:1" },
  { name: "line", value: "rgba(255, 255, 255, 0.1)", use: "Solid 2px divider in plan cards" },
  { name: "wash", value: "rgba(255, 255, 255, 0.03)", use: "Hovered cell veil" },
  { name: "accent", value: "#00e6c5", use: "Mono labels, active tabs, tags, selection" },
  { name: "accent-tint", value: "rgba(0, 230, 197, 0.1)", use: "Announcement and badge fill" },
  { name: "series-magenta", value: "#d85ce0", use: "Second feature series" },
  { name: "series-blue", value: "#29c2ff", use: "Third feature series" },
  { name: "series-yellow", value: "#e0cd3a", use: "Fourth feature series" },
  { name: "danger", value: "#db2c2c", use: "Invalid field outline and message" },
] as const;

const display = (wght: number): CSSProperties => ({
  fontFamily: "var(--font-display)",
  fontWeight: 1000,
  fontVariationSettings: `"opsz" 14, "wght" ${wght}`,
});

const type: { name: string; spec: string; sample: string; style: CSSProperties }[] = [
  {
    name: "h1",
    spec: "3.5rem / 1.1 / -0.04em / wght 550",
    sample: "Lightning fast sites.",
    style: { ...display(550), fontSize: "3.5rem", lineHeight: 1.1, letterSpacing: "-0.04em" },
  },
  {
    name: "title",
    spec: "2.2rem / 1.2 / -0.02em / wght 550",
    sample: "Get in touch with Jet",
    style: { ...display(550), fontSize: "2.2rem", lineHeight: 1.2, letterSpacing: "-0.02em" },
  },
  {
    name: "h2",
    spec: "1.6rem / 1.2 / -0.01em / wght 550",
    sample: "Accelerate your website with Jet.",
    style: { ...display(550), fontSize: "1.6rem", lineHeight: 1.2, letterSpacing: "-0.01em" },
  },
  {
    name: "h3-large",
    spec: "1.4rem / 1.3 / -0.01em / wght 550",
    sample: "Images that load in miliseconds.",
    style: { ...display(550), fontSize: "1.4rem", lineHeight: 1.3, letterSpacing: "-0.01em" },
  },
  {
    name: "h3",
    spec: "1.2rem / 1.4 / -0.01em / wght 550",
    sample: "Better user experience",
    style: { ...display(550), fontSize: "1.2rem", lineHeight: 1.4, letterSpacing: "-0.01em" },
  },
  {
    name: "body",
    spec: "16px / 24px / wght 450 / muted",
    sample: "No code, no hassle. Jet simply keeps your website blazing fast 24/7.",
    style: { ...display(450), fontSize: 16, lineHeight: "24px", color: "var(--muted)" },
  },
  {
    name: "body-strong",
    spec: "16px / 24px / -0.01em / wght 550",
    sample: "Automatic image compression",
    style: { ...display(550), fontSize: 16, lineHeight: "24px", letterSpacing: "-0.01em" },
  },
  {
    name: "small",
    spec: "14px / 21px / wght 450 / muted",
    sample: "Quick setup, ready to optimize",
    style: { ...display(450), fontSize: 14, lineHeight: "21px", color: "var(--muted)" },
  },
  {
    name: "nav",
    spec: "12px / 1.6 / wght 500",
    sample: "Blog  Updates  Pricing  About  Careers",
    style: { ...display(500), fontSize: 12, lineHeight: 1.6, whiteSpace: "pre" },
  },
  {
    name: "label",
    spec: "Google Sans Code 12px / 1.6 / 0.02em / 500 / uppercase",
    sample: "Image Optimization",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: "0.02em",
      textTransform: "uppercase",
      color: "var(--accent)",
    },
  },
  {
    name: "input",
    spec: "Google Sans 14px / 1.2 / 400",
    sample: "orin@framer.com",
    style: { fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 400, lineHeight: 1.2 },
  },
  {
    name: "code",
    spec: "Google Sans Code 14px / 1.5 / 400",
    sample: '<img loading="lazy">',
    style: { fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
  },
];

const radii = [
  { value: 0, use: "Frames, cards, images" },
  { value: 4, use: "Count badge, post tag" },
  { value: 6, use: "Buttons, tags" },
  { value: 8, use: "Inputs, filter chips" },
  { value: 10, use: "Toggle buttons, tabs" },
  { value: 14, use: "Toggle track" },
  { value: 20, use: "Large radius" },
  { value: 100, use: "Pills, round icons" },
] as const;

const spacing = [4, 6, 8, 10, 12, 16, 18, 20, 24, 28, 34, 44, 50, 100] as const;

const motion = [
  ["RollingText", "Pill buttons", "hover / focus", "spring 0.4s, bounce 0; letter delay 0.4 / n × i × 0.25"],
  ["GrayRing", "Secondary and tertiary buttons", "hover / focus", "400ms pill spring; dash 6/4 at 30px, 1s linear"],
  ["TextGlitch", "Header and footer links", "hover / focus", "300ms, redraw every 50ms, 20% of characters"],
  ["Link nudge", "Header / footer links", "hover / focus", "padding +4px, 0.4s cubic-bezier(0.22, 1, 0.36, 1)"],
  ["TextShimmer", "HIRING, announcement", "always", "3s linear, holds until 66.666%"],
  ["Travelling dashes", "Frames and rules", "always", "12 / 6 dash, 18px per 1s, linear"],
  ["CornerMarks", "Benefit and plan cards", "hover, from 810px", "veil 0.3s ease-out-quint, marks instant"],
  ["Benefit reveal", "Home benefit cards", "hover", "height 0 → 42px, 600ms spring curve"],
  ["FAQ", "Home", "click", "spring 0.4s, bounce 0: fill, padding, plus 45°, height"],
  ["Testimonials", "Home", "in view", "opacity, spring 0.6s; 2500 → 100 → 100 → 5000 → 100 → 100 → 2500ms"],
  ["Logo cycler", "Home", "in view", "y ±86, blur 6px, spring 0.6s; 1000 → 100 → 100 → 2000ms"],
  ["Billing toggle", "Pricing", "click", "pill 0.35s ease-out-quint; discount 350ms linear"],
  ["Price digits", "Pricing", "period change", "500ms scramble, 40ms steps, half the digits"],
  ["Flashlight", "Waitlist art", "pointer", "radius 0 ↔ 400px, 300ms, ease-out in / ease-in out"],
  ["LineAnimator", "CTA", "always", "(0.8 + rnd × 1.7) / 0.6 s per line, linear"],
] as const;

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  );
}

function GlitchLink({ label, badge }: { label: string; badge?: string }) {
  const [hot, setHot] = useState(false);
  return (
    <Link
      href="/dev/styleguide"
      className={styles.navLink}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
    >
      <TextGlitch active={hot}>{label}</TextGlitch>
      {badge ? (
        <Badge variant="secondary" className={cx("count-badge")}>
          {badge}
        </Badge>
      ) : null}
    </Link>
  );
}

export function StyleGuide() {
  return (
    <div className={styles.guide}>
      <header>
        <h1>Style guide</h1>
        <p className={styles.note}>
          Tokens, components and motion as they are implemented on this site. Everything below
          renders the real components and class names. The WebGL backgrounds live in the{" "}
          <Link href="/dev/motion">motion lab</Link>.
        </p>
      </header>

      <Section id="color" title="COLOR">
        <ul className={styles.swatches}>
          {colors.map((color) => (
            <li key={color.name}>
              <span className={styles.chip} style={{ background: color.value }} />
              <span className={styles.tokenName}>{color.name}</span>
              <span className={styles.tokenValue}>{color.value}</span>
              <span className={styles.tokenUse}>{color.use}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="type" title="TYPE">
        <p className={styles.note}>
          Google Sans is the face for text and headings. Google Sans Code is the mono face.
          Sizes in rem follow the root: 20px from 1200px, 18px from 810px, 14px below.
        </p>
        <dl className={styles.typeList}>
          {type.map((row) => (
            <div key={row.name}>
              <dt>
                <span className={styles.tokenName}>{row.name}</span>
                <span className={styles.tokenValue}>{row.spec}</span>
              </dt>
              <dd style={row.style}>{row.sample}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="shape" title="RADIUS AND SPACING">
        <ul className={styles.radii}>
          {radii.map((radius) => (
            <li key={radius.value}>
              <span className={styles.radiusBox} style={{ borderRadius: radius.value }} />
              <span className={styles.tokenName}>{radius.value}px</span>
              <span className={styles.tokenUse}>{radius.use}</span>
            </li>
          ))}
        </ul>
        <ul className={styles.spacing}>
          {spacing.map((step) => (
            <li key={step}>
              <span className={styles.spaceBar} style={{ width: step }} />
              <span className={styles.tokenValue}>{step}</span>
            </li>
          ))}
        </ul>
        <p className={styles.caption}>
          Frame: min(1200px, 100% - 32px). Section gap 100px. Cell padding 34px (24px on phones).
          Header 64px.
        </p>
      </Section>

      <Section id="buttons" title="BUTTONS">
        <div className={styles.row}>
          <CtaLink href="/dev/styleguide" text={`Join${NBSP}waitlist`} location="styleguide" />
          <CtaLink href="/dev/styleguide" text="Contact" variant="secondary" location="styleguide" />
          <Button type="button" variant="tertiary">
            Necessary only
          </Button>
        </div>
        <p className={styles.caption}>
          30px, radius 6px, padding 0 12px, 12px type. Primary is the white header button. Secondary
          is the gray header button. Tertiary is the same shell with a transparent rest state. The
          label rolls; the button itself does not move.
        </p>
      </Section>

      <Section id="links" title="LINKS AND LABELS">
        <div className={styles.row}>
          <GlitchLink label="Blog" />
          <GlitchLink label="Pricing" />
          <GlitchLink label="Careers" badge="8" />
          <TextShimmer>HIRING</TextShimmer>
          <Link className={cx("announcement")} href="/updates/june-jetstream-update">
            <span className={cx("shimmer-text")}>
              NEW: 2025 JUNE UPDATE
              <span className={cx("shimmer-text-glow")} aria-hidden="true">
                NEW: 2025 JUNE UPDATE
              </span>
            </span>
            <span className={cx("announcement-icon")}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <g
                  transform="translate(8 8)"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M0 8 L7.784 0" />
                  <path d="M1.773 0 H8 V6.4" />
                </g>
              </svg>
            </span>
          </Link>
        </div>
      </Section>

      <Section id="forms" title="FORM FIELDS">
        <FieldGroup className={styles.form}>
          <Field className="min-w-0">
            <FieldLabel htmlFor="styleguide-name" className="text-sm text-muted-foreground">
              Full name
            </FieldLabel>
            <Input id="styleguide-name" name="name" placeholder="Jane Smith" />
          </Field>
          <Field className="min-w-0" data-invalid="true">
            <FieldLabel htmlFor="styleguide-email" className="text-sm text-muted-foreground">
              Email
            </FieldLabel>
            <Input id="styleguide-email" name="email" defaultValue="orin@" aria-invalid="true" />
            <FieldError>Enter a valid email address.</FieldError>
          </Field>
          <Field className="min-w-0">
            <FieldLabel htmlFor="styleguide-message" className="text-sm text-muted-foreground">
              Message
            </FieldLabel>
            <Textarea
              id="styleguide-message"
              name="message"
              placeholder="Tell us what you need help with…"
            />
          </Field>
          <Field className="min-w-0">
            <FieldLabel htmlFor="styleguide-theme" className="text-sm text-muted-foreground">
              Theme
            </FieldLabel>
            <Select items={THEMES}>
              <SelectTrigger id="styleguide-theme" className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {THEMES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <p className={styles.caption}>
          shadcn Input: 32px, padding 4px 10px, radius 10px, 16px type, 14px from 768px, weight 400.
          Textarea uses the same type, a 64px minimum, and does not resize. shadcn Select: 32px,
          padding 8px 8px 8px 10px, radius 10px, 14px type, weight 400.
        </p>
      </Section>

      <Section id="frames" title="DASHED FRAME AND CORNER MARKS">
        <div className={styles.frame}>
          {(["link", "wand", "rocket"] as const).map((icon) => (
            <div className={`${styles.cell} corner-host`} key={icon} tabIndex={0}>
              <CornerMarks />
              <span className={home.stepIcon}>
                <PhosphorIcon name={icon} />
              </span>
            </div>
          ))}
        </div>
        <p className={styles.caption}>
          Write border: 1px dashed #1c1c1c. TravelingDashes redraws every dashed border as a 12 / 6
          stroke that moves 18px per second. Hover a cell for the corner marks (from 810px).
        </p>
      </Section>

      <Section id="imagery" title="IMAGERY">
        <div className={styles.images}>
          <figure>
            <DitherImage
              src="/home/feature-rocket.png"
              label="Ordered dither"
              preset={{ ...orderedDither, animation: false }}
            />
            <figcaption className={styles.caption}>Dither, ordered, 4px</figcaption>
          </figure>
          <figure>
            <DitherImage
              src="/home/benefit-wand.png"
              label="Random dither"
              preset={{ ...randomDither, dot: "#00e6c5" }}
            />
            <figcaption className={styles.caption}>Dither, random, 2px, accent dot</figcaption>
          </figure>
          <figure>
            <DitherImage src="/home/benefit-wand.png" label="Nested dither" preset={nestedDither} />
            <figcaption className={styles.caption}>Dither, nested, 3px</figcaption>
          </figure>
          <figure>
            <div className={styles.portrait}>
              <Halftone src="/home/tom.jpg" label="Halftone portrait" />
            </div>
            <figcaption className={styles.caption}>Halftone, 6px dots at 45°</figcaption>
          </figure>
        </div>
      </Section>

      <Section id="motion" title="MOTION">
        <p className={styles.note}>
          At rest only the background moves. Everything interactive answers with one spring, 0.4s
          with no bounce. Reduced motion turns all of it off.
        </p>
        <div className={styles.tableWrap}>
          <Table className={styles.table}>
            <TableHeader>
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead>Effect</TableHead>
                <TableHead>Where</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Timing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {motion.map((row) => (
                <TableRow key={row[0]} className="border-0 hover:bg-transparent">
                  {row.map((cell) => (
                    <TableCell key={cell} className="whitespace-normal">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section id="block-hero" title="BLOCK: HERO">
        <div className="flex flex-col gap-[32px]">
          <Hero
            variant="animated"
            headingAs="h2"
            titleId="sg-hero-animated"
            title="Lightning fast sites. In a single click."
            description="No code, no hassle. Jet simply keeps your website blazing fast 24/7."
            actions={[
              { href: "/waitlist", text: `Join${NBSP}waitlist`, location: "styleguide" },
              { href: "/#benefits", text: "Learn more", variant: "secondary", location: "styleguide" },
            ]}
            className="pt-0!"
          />
          <Hero
            variant="static"
            headingAs="h2"
            titleId="sg-hero-static"
            eyebrow="Static page hero"
            title="Static heading variant."
            description="Reusable heading block without the animated homepage backdrop, with optional eyebrow and actions."
            actions={[{ href: "/contact", text: "Contact", location: "styleguide" }]}
          />
        </div>
      </Section>

      <Section id="block-feature-grid" title="BLOCK: FEATURE GRID">
        <FeatureGrid
          titleId="sg-feature-grid"
          title="Accelerate your website with Jet."
          items={demoFeatureItems}
          className="pt-0!"
        />
      </Section>

      <Section id="block-process-steps" title="BLOCK: PROCESS STEPS">
        <div className="flex flex-col gap-[32px]">
          <ProcessSteps
            titleId="sg-process-steps"
            title="Get started in 3 simple steps."
            steps={demoProcessSteps}
            className="pt-0!"
          />
          <ProcessSteps
            titleId="sg-process-steps-4"
            title="Как работи."
            autoHeight
            steps={[
              {
                title: "Препоръка",
                body: "Изпращате ни контакта или клиентът ни пише с вашия код. Записваме препоръката с дата.",
              },
              {
                title: "Съгласие на клиента",
                body: "Клиентът знае за възнаграждението ви и се съгласява писмено.",
              },
              {
                title: "Плащане",
                body: "Плащаме ви всеки месец — след като клиентът е платил своята фактура.",
              },
              {
                title: "Договор",
                body: "Всичко е по писмен партньорски договор, преди първата препоръка.",
              },
            ]}
            className="pt-0!"
          />
          <ProcessSteps
            titleId="sg-process-steps-5"
            title="Как работим."
            autoHeight
            steps={[
              {
                title: "Разговор",
                body: "30 минути за бизнеса и продажбите ви.",
              },
              {
                title: "Одит и базова линия",
                body: "Какво работи, какво не и от кои цифри започваме.",
              },
              {
                title: "Пилот 30 дни",
                body: "Одит и първи кампании — от 690 € общо. Ясен обхват и отчет „преди / след“. След него решавате.",
              },
              {
                title: "Месечна работа",
                body: "Ако продължим — минимум 3 месеца: кампании, криейтиви, CRM и отчет всеки месец.",
              },
              {
                title: "Тримесечен преглед",
                body: "На 3, 6, 9 и 12 месец — резултати и нови идеи.",
              },
            ]}
            note="След пилота решавате. Ако продължим — минимум 3 месеца с плащане месечно предварително. Ако не — спираме, а акаунтите и данните остават ваши."
            className="pt-0!"
          />
        </div>
      </Section>

      <Section id="block-card-grid" title="BLOCK: CARD GRID">
        <div className="flex flex-col gap-[32px]">
          <CardGrid
            titleId="sg-card-grid"
            title="Core capabilities."
            items={demoCardTiles}
            className="pt-0!"
          />
          <CardGrid
            titleId="sg-card-grid-5"
            title="За кого работим."
            autoHeight
            items={[
              {
                title: "Смяна на агенция",
                body: "Месеци плащате, а продажбите стоят? Сменяме изпълнителя поетапно: проверка на акаунтите и базова линия от първия ден.",
                href: "/smyana-na-agentsiya",
                ctaLabel: "Как сменяме агенция →",
              },
              {
                title: "Онлайн магазини",
                body: "Продажбата от реклама поскъпва? Нови криейтиви всеки месец и отчет по платени, не по направени поръчки.",
                href: "/onlayn-magazini",
                ctaLabel: "Решения за онлайн магазини →",
              },
              {
                title: "Услуги и B2B",
                body: "Правите маркетинг, но цифрите не мърдат? Маркетинг отдел на абонамент: план, реклама, CRM и отчет за продажбите.",
                href: "/uslugi-i-b2b",
                ctaLabel: "Маркетинг отдел на абонамент →",
              },
              {
                title: "Хотели",
                body: "Сезон 2027 се продава сега. Повече директни резервации — с кампании на езиците на гостите ви.",
                href: "/hoteli",
                ctaLabel: "Решения за хотели →",
              },
              {
                title: "Недвижими имоти",
                body: "Пазарът забави? Запитвания за конкретния проект и цена на оглед във всеки отчет.",
                href: "/nedvizhimi-imoti",
                ctaLabel: "Решения за строители →",
              },
            ]}
            className="pt-0!"
          />
        </div>
      </Section>

      <Section id="block-feature-section" title="BLOCK: FEATURE SECTION">
        <div className="flex flex-col gap-[32px]">
          <FeatureSection
            eyebrow="Image Optimization"
            title="Images that load in milliseconds."
            body="Automatic optimization for every visual asset on your site."
            points={[
              "Automatic image compression",
              "Next-gen format conversion (WebP, AVIF)",
              "Lazy loading implementation",
              "Responsive image sizing",
            ]}
            visual={{
              kind: "dither",
              src: "/home/feature-settings.png",
              label: "Dithered optimized settings illustration",
            }}
            className="pt-0!"
          />
          <FeatureSection
            eyebrow="Text-only variant"
            title="No visual, zero empty space."
            body="When no visual prop is passed, FeatureSection collapses cleanly to a single column."
            points={[
              "No default Jet dither fallback",
              "Optional anchor id with scroll offset",
              "Supports rich links inside points",
            ]}
            className="pt-0!"
          />
        </div>
      </Section>

      <Section id="block-faq" title="BLOCK: FAQ">
        <Faq
          titleId="sg-faq"
          title="Frequently asked questions."
          items={demoFaqItems}
          className="pt-0!"
        />
      </Section>

      <Section id="block-cta-band" title="BLOCK: CTA BAND">
        <CtaBand
          titleId="sg-cta-band"
          title="Boost your site speed today."
          description="Try Jet now—one click, instant performance. No risk, cancel anytime."
          actions={[
            { href: "/waitlist", text: `Join${NBSP}waitlist`, location: "styleguide" },
            { href: "/pricing", text: "View pricing", variant: "secondary", location: "styleguide" },
          ]}
          className="pt-0!"
        />
      </Section>

      <Section id="block-pricing-cards" title="BLOCK: PRICING CARDS">
        <PricingCards
          plans={demoPricingPlans}
          billingToggle={{
            enabled: true,
            defaultPeriod: "yearly",
            monthlyLabel: "Monthly",
            yearlyLabel: "Yearly",
            discountBadge: "-15%",
          }}
          ariaLabel="Pricing cards demo"
          className="w-full! pt-0!"
        />
      </Section>

      <Section id="block-comparison-table" title="BLOCK: COMPARISON TABLE">
        <div className="flex flex-col gap-[32px]">
          <ComparisonTable
            columns={demoCompareColumns3}
            groups={demoCompareGroups3}
            ariaLabel="3-column comparison demo"
            className="w-full!"
          />
          <ComparisonTable
            columns={demoCompareColumns4}
            groups={demoCompareGroups4}
            ariaLabel="4-column comparison demo"
            compactRows={false}
            className="w-full!"
          />
        </div>
      </Section>

      <Section id="block-mission" title="BLOCK: MISSION">
        <Mission
          titleId="sg-mission"
          title="Our mission."
          paragraphs={[
            <>
              At Jet, speed isn&apos;t just a technical detail—
              <MissionHighlight>it&apos;s a competitive advantage</MissionHighlight>.
            </>,
            <>
              Our platform <MissionHighlight>handles everything behind the scenes</MissionHighlight>{" "}
              so teams stay focused on shipping.
            </>,
          ]}
          className="pt-0!"
        />
      </Section>

      <Section id="block-team-member" title="BLOCK: TEAM MEMBER">
        <TeamMember
          mode="single"
          titleId="sg-team-member"
          person={{
            eyebrow: "Single portrait (4:5)",
            title: "Grace Lee — SEO Strategist",
            photo: {
              jpg: "/about/grace.png",
              alt: "Portrait of Grace Lee",
              aspect: "4/5",
            },
            bio: (
              <p>
                Single-person portrait layout supporting 4:5 and 1:1 responsive photos via{" "}
                <code>&lt;picture&gt;</code> with WebP and JPEG fallback.
              </p>
            ),
            actions: [
              { href: "/contact", text: "Contact", location: "styleguide" },
              { href: "/about", text: "About", variant: "secondary", location: "styleguide" },
            ],
          }}
          className="pt-0!"
        />
      </Section>

      <Section id="block-posts-preview" title="BLOCK: POSTS PREVIEW">
        <PostsPreview
          titleId="sg-posts-preview"
          title="Read our posts"
          viewAll={{ href: "/blog", label: "View all" }}
          posts={[
            {
              href: "/blog/why-website-speed-matters-more-than-ever-in-2025",
              tag: "Performance",
              title: "Why Website Speed Matters More Than Ever in 2025",
              date: "Jun 7, 2025",
              visual: { kind: "dither", src: "/about/post-speed.png" },
            },
            {
              href: "/blog/image-optimization-the-secret-to-lightning-fast-sites",
              tag: "Optimization",
              title: "Image Optimization: The Secret to Lightning-Fast Sites",
              date: "May 26, 2025",
              visual: { kind: "dither", src: "/about/post-images.png" },
            },
          ]}
          className="pt-0!"
        />
      </Section>

      <Section id="block-benefits" title="BLOCK: BENEFITS">
        <Benefits
          id="sg-benefits-section"
          titleId="sg-benefits"
          title="What drives us."
          description={
            <>
              <BenefitsHighlight>We move fast and optimize relentlessly.</BenefitsHighlight> Shared
              6-card benefit grid with corner marks and hover reveal.
            </>
          }
          items={[
            {
              title: "Remote-first",
              body: "Work from anywhere with async-friendly workflows.",
              icon: <BenefitIcon name="remote" />,
            },
            {
              title: "Flexible time off",
              body: "Take the rest you need to do great work.",
              icon: <BenefitIcon name="time" />,
            },
            {
              title: "Learning budget",
              body: "Annual stipend for books, courses, and conferences.",
              icon: <BenefitIcon name="learning" />,
            },
          ]}
        />
      </Section>

      <Section id="block-open-roles" title="BLOCK: OPEN ROLES">
        <OpenRoles
          id="sg-open-roles-section"
          titleId="sg-open-roles"
          title="Open roles & partner profiles."
          description="Supports both linked role rows and static rows with category tags."
          items={[
            {
              id: "fe",
              title: "Frontend Developer",
              subtitle: "Engineering",
              meta: "Remote",
              href: "/careers/frontend-developer",
            },
            {
              id: "partners-studios",
              title: "Web & software studios",
              tags: ["White-label", "Co-selling"],
            },
            {
              id: "partners-accounting",
              title: "Accounting firms",
              tags: ["Referrals", "Nationwide"],
            },
          ]}
        />
      </Section>

      <Section id="block-post-card" title="BLOCK: POST CARD">
        <div className="grid grid-cols-1 gap-[16px] min-[810px]:grid-cols-2">
          <div className="[border:1px_dashed_var(--color-rule)]">
            <PostCard
              variant="small"
              item={{
                href: "/blog/why-website-speed-matters-more-than-ever-in-2025",
                category: "Performance",
                title: "Why Website Speed Matters More Than Ever in 2025",
                date: "Jun 7, 2025",
                dateTime: "2025-06-07",
                cover: {
                  kind: "dither",
                  src: "/about/post-speed.png",
                  label: "Performance cover illustration",
                },
              }}
            />
          </div>
          <div className="[border:1px_dashed_var(--color-rule)]">
            <PostCard
              variant="small"
              item={{
                href: "/blog/image-optimization-the-secret-to-lightning-fast-sites",
                category: "Optimization",
                title: "Custom SVG cover slot (illos.dev/library ready)",
                date: "May 26, 2025",
                dateTime: "2025-05-26",
                cover: {
                  kind: "custom",
                  render: () => (
                    <svg viewBox="0 0 320 180" role="img" aria-label="Grid signal illustration">
                      <rect width="320" height="180" fill="var(--color-card)" />
                      <circle
                        cx="160"
                        cy="90"
                        r="48"
                        fill="none"
                        stroke="var(--color-brand)"
                        strokeWidth="1.5"
                        strokeDasharray="6 4"
                      />
                      <circle cx="160" cy="90" r="10" fill="var(--color-brand)" />
                    </svg>
                  ),
                },
              }}
            />
          </div>
        </div>
      </Section>

      <Section id="block-post-list" title="BLOCK: POST LIST">
        <PostList
          heading="Recent articles"
          headingId="sg-post-list-heading"
          columnClassName="w-full!"
          showFilters
          categories={["All", "Performance", "Optimization"]}
          allCategory="All"
          filtersAriaLabel="Demo post categories"
          pageSize={2}
          items={
            [
              {
                href: "/blog/why-website-speed-matters-more-than-ever-in-2025",
                category: "Performance",
                title: "Why Website Speed Matters More Than Ever in 2025",
                date: "Jun 7, 2025",
                dateTime: "2025-06-07",
                cover: {
                  kind: "dither",
                  src: "/about/post-speed.png",
                  label: "Performance cover",
                },
              },
              {
                href: "/blog/image-optimization-the-secret-to-lightning-fast-sites",
                category: "Optimization",
                title: "Image Optimization: The Secret to Lightning-Fast Sites",
                date: "May 26, 2025",
                dateTime: "2025-05-26",
                cover: {
                  kind: "dither",
                  src: "/about/post-images.png",
                  label: "Image optimization cover",
                },
              },
            ] satisfies readonly PostCardItem[]
          }
        />
      </Section>

      <Section id="block-article-body" title="BLOCK: ARTICLE BODY">
        <div className="max-w-[650px]">
          <ArticleBody
            blocks={[
              {
                kind: "lead",
                text: [
                  { text: "Start with a clean " },
                  { text: "measurement baseline", strong: true },
                  { text: " before changing templates, third-party scripts, or images." },
                ],
              },
              {
                kind: "h2",
                text: "Measuring what actually slows pages down",
                id: "sg-article-measure",
              },
              {
                kind: "p",
                text: [
                  { text: "Compare route budgets on the " },
                  { text: "pricing overview", href: "/pricing" },
                  { text: " and review the " },
                  { text: "Core Web Vitals thresholds", href: "https://web.dev/articles/vitals" },
                  { text: " with " },
                  { text: "real field data", strong: true },
                  { text: "." },
                ],
              },
              {
                kind: "quote",
                text: "Every extra second of latency cuts conversions long before users finish reading.",
              },
              { kind: "h3", text: "Core checkpoints", id: "sg-article-checkpoints" },
              {
                kind: "list",
                items: [
                  [
                    { text: "Largest Contentful Paint: ", strong: true },
                    { text: "measure on throttled mobile connections before shipping" },
                  ],
                  "Trim unused JavaScript bundles per route",
                ],
              },
              {
                kind: "ol",
                items: [
                  [
                    { text: "Capture baseline", strong: true },
                    { text: " — record LCP, INP, and CLS across the top landing pages." },
                  ],
                  [
                    { text: "Ship one change at a time", strong: true },
                    { text: " — verify the delta before moving to the next bottleneck." },
                  ],
                ],
              },
              {
                kind: "table",
                caption: "Core Web Vitals targets for production templates.",
                headers: ["Metric", "Target", "Notes"],
                rows: [
                  ["LCP", "≤ 2.5s", "75th percentile mobile loads"],
                  ["CLS", "≤ 0.1", "Zero layout shift after font swap"],
                ],
              },
              { kind: "code", text: "npm run test:visual" },
              {
                kind: "cta",
                text: "Want to verify these checkpoints on your own site? Review plans or book a short technical walkthrough.",
                actions: [
                  { text: "View pricing", href: "/pricing", variant: "primary" },
                  { text: "Contact us", href: "/contact", variant: "secondary" },
                ],
              },
              {
                kind: "methodology",
                title: "Methodology",
                text: "Thresholds reflect 75th-percentile field measurements across mobile and desktop sessions collected over a rolling 28-day window.",
              },
              {
                kind: "sources",
                title: "Sources",
                items: [
                  [
                    { text: "web.dev — " },
                    { text: "Web Vitals documentation", href: "https://web.dev/articles/vitals" },
                  ],
                  "Internal route audit baselines recorded on Chromium desktop and mobile profiles.",
                ],
              },
            ]}
          />
        </div>
      </Section>

      <Section id="block-legal-body" title="BLOCK: LEGAL BODY">
        <LegalBody
          blocks={[
            {
              kind: "lead",
              content: [
                { text: "This demo shows " },
                { text: "structured legal prose", strong: true },
                { text: ", tables, numbered lists, callouts, and inline references." },
              ],
            },
            {
              kind: "p",
              content: [
                { text: "Review how we handle personal data in the " },
                { text: "Privacy Policy", href: "/legal/privacy-policy" },
                { text: " or inspect the " },
                { text: "EDPB guidelines", href: "https://www.edpb.europa.eu/" },
                { text: "." },
              ],
            },
            { kind: "h2", text: "1. Data handling", id: "sg-legal-data" },
            { kind: "h3", text: "1.1 Consent categories", id: "sg-legal-categories" },
            {
              kind: "list",
              items: [
                [
                  { text: "Analytics: ", strong: true },
                  { text: "stay off until the visitor gives explicit consent." },
                ],
                "Form submissions transmit only the fields entered by the visitor.",
              ],
            },
            {
              kind: "ol",
              items: [
                "Essential cookies load immediately so core navigation and consent state work.",
                "Optional measurement scripts activate only after opt-in.",
              ],
            },
            {
              kind: "table",
              caption: "Cookie categories and consent requirements.",
              headers: ["Category", "Purpose", "Consent required"],
              rows: [
                ["Necessary", "Site security and storing your consent choice", "No"],
                ["Statistics", "Aggregated page performance and reading metrics", "Yes"],
                ["Marketing", "Campaign attribution and remarketing measurement", "Yes"],
              ],
            },
            {
              kind: "cta",
              text: "Questions about how we process personal data or cookie preferences?",
              actions: [
                { text: "Contact support", href: "/contact", variant: "primary" },
                { text: "Privacy Policy", href: "/legal/privacy-policy", variant: "secondary" },
              ],
            },
            {
              kind: "methodology",
              title: "Review scope",
              text: "Applies to public marketing pages and lead capture forms hosted on this domain.",
            },
            {
              kind: "sources",
              title: "References",
              items: [
                "Regulation (EU) 2016/679 (General Data Protection Regulation).",
                [
                  { text: "Internal policy: " },
                  { text: "Terms of Service", href: "/legal/terms-of-service" },
                ],
              ],
            },
          ]}
        />
      </Section>

      <Section id="block-link-list" title="BLOCK: LINK LIST">
        <div className="flex flex-col gap-[40px]">
          <div className="grid grid-cols-1 gap-[32px] min-[810px]:grid-cols-2">
            <LinkList
              embedded
              variant="list"
              headingAs="h3"
              title="Може би търсите"
              items={[
                {
                  label: "Безплатен чеклист: кой притежава рекламните ви акаунти →",
                  href: "/proverka-na-akaunti",
                },
                {
                  label: "Цени на пакетите →",
                  href: "/tseni",
                },
              ]}
            />
            <LinkList
              embedded
              variant="list"
              headingAs="h3"
              title="Решения"
              items={[
                { label: "Смяна на агенция", href: "/smyana-na-agentsiya" },
                { label: "Онлайн магазини", href: "/onlayn-magazini" },
                { label: "Услуги и B2B", href: "/uslugi-i-b2b" },
                { label: "Недвижими имоти", href: "/nedvizhimi-imoti" },
              ]}
            />
          </div>

          <LinkList
            embedded
            variant="cards"
            headingAs="h3"
            title="Докато чакате"
            items={[
              {
                label: "Проверете кой притежава рекламните ви акаунти →",
                description:
                  "Проверете дали Google Ads, Meta, пикселът, профилът в Google и анализите са на името на фирмата — преди да смените агенция.",
                href: "/proverka-na-akaunti",
              },
              {
                label: "Вижте пакетите и цените →",
                description:
                  "Пакети от 290 € на месец, крайни цени. Първите 30 дни — одит и пилот — от 690 € общо. После решавате; акаунтите са на ваше име.",
                href: "/tseni",
              },
            ]}
          />
        </div>
      </Section>

      <Section id="block-announcement-bar" title="BLOCK: ANNOUNCEMENT BAR">
        <div className="flex flex-col items-center gap-[16px] [border:1px_dashed_var(--color-rule)] [padding:24px]">
          <AnnouncementBar
            variant="global"
            persistDismiss={false}
            text="Рекламните акаунти на фирмата ви на ваше име ли са? Проверете с безплатния ни чеклист →"
            href="/proverka-na-akaunti"
            closeAria="Затваряне на съобщението"
            location="announcement"
          />
        </div>
      </Section>

      <Section id="block-mirror-questions" title="BLOCK: MIRROR QUESTIONS">
        <div className="flex flex-col gap-[32px]">
          <MirrorQuestions
            titleId="sg-mirror-questions-3"
            headingAs="h3"
            title="Звучи ли ви познато?"
            questions={[
              "Знаете, че маркетингът не работи както трябва, но не знаете откъде да започнете?",
              "Не можете да намерите човек, който да го подреди?",
              "Плащате за реклама, а цифрите не мърдат?",
            ]}
            cta={{
              label: "Започнете с безплатен разговор →",
              href: "/kontakt",
              location: "styleguide",
            }}
            className="pt-0!"
          />
          <MirrorQuestions
            titleId="sg-mirror-questions-5"
            headingAs="h3"
            title="Разпознавате ли се?"
            questions={[
              "Искате маркетинг, на който да имате доверие?",
              "Плащате от 3–6 месеца, а продажбите стоят?",
              "Цената на клиент расте, а отчетът показва кликове?",
              "Страх ви е да не сгрешите отново с избора?",
              "Агенцията държи акаунтите ви?",
            ]}
            className="pt-0!"
          />
        </div>
      </Section>

      <Section id="block-founder-card" title="BLOCK: FOUNDER CARD">
        <FounderCard
          titleId="sg-founder-card"
          headingAs="h3"
          title="Кой отговаря за резултата."
          bio="Егор Гончаренко, основател на Маркетинг Завод. Над 8 години в продуктов дизайн и проучвания: започвам от данните, записвам базовата линия и меря всяка промяна. Отговарям лично за всеки пилот."
          photo={{
            webp: FOUNDER_PHOTOS.square.webp,
            jpg: FOUNDER_PHOTOS.square.jpg,
            alt: FOUNDER_PHOTOS.square.alt,
            aspect: "1/1",
            loading: "eager",
          }}
          actions={[
            {
              label: "Пишете ми на имейл",
              href: "mailto:zavodzamarketing@gmail.com",
              variant: "primary",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/yehor-honcharenko",
              variant: "secondary",
              external: true,
            },
          ]}
          className="pt-0!"
        />
      </Section>

      <Section id="block-pilot-banner" title="BLOCK: PILOT BANNER">
        <PilotBanner
          text="Първите ни кейси се пишат сега. Пилот 30 дни: одит, първи кампании и отчет „преди / след“ — от 690 € общо. Приемаме 3 фирми до февруари 2027."
          ctaLabel="Вижте пилота →"
          href="/keysi"
          location="home_pilot_banner"
          className="pt-0!"
        />
      </Section>

      <Section id="block-contact-form" title="BLOCK: CONTACT FORM">
        {(() => {
          const demoFields: readonly ContactFieldRow[] = [
            [
              {
                kind: "text",
                key: "name",
                name: "Full name",
                label: "Full name",
                placeholder: "Jane Smith",
                required: true,
              },
              {
                kind: "email",
                key: "email",
                name: "Email",
                label: "Email",
                placeholder: "jane@example.com",
                required: true,
              },
            ],
            {
              kind: "select",
              key: "reason",
              name: "Inquiry type",
              label: "Reason for contact",
              placeholder: "Select…",
              options: [
                { value: "general", label: "General" },
                { value: "sales", label: "Sales" },
              ],
              required: true,
            },
            {
              kind: "textarea",
              key: "message",
              name: "Message",
              label: "How can we help?",
              placeholder: "Tell us what you need help with…",
              required: true,
            },
          ];

          return (
            <div className="grid grid-cols-1 gap-[24px] min-[1200px]:grid-cols-2">
              <div className={`${contactFormStyles.panel} w-full! flex-auto! [border:1px_dashed_var(--color-rule)]!`}>
                <ContactForm
                  heading="Normal state"
                  subheading="Default idle form."
                  fields={demoFields}
                  submitLabel="Get in touch"
                  successMessage="We'll get back to you soon!"
                  honeypotId="sg-contact-normal-url"
                  previewState="normal"
                />
              </div>
              <div className={`${contactFormStyles.panel} w-full! flex-auto! [border:1px_dashed_var(--color-rule)]!`}>
                <ContactForm
                  heading="Error state"
                  subheading="Validation and server alerts."
                  fields={demoFields}
                  submitLabel="Get in touch"
                  successMessage="We'll get back to you soon!"
                  honeypotId="sg-contact-error-url"
                  previewState="error"
                  previewErrors={{
                    email: "Enter a valid email.",
                    reason: "Select a reason for contact.",
                    form: "Something went wrong on our side. Please try again.",
                  }}
                />
              </div>
              <div className={`${contactFormStyles.panel} w-full! flex-auto! [border:1px_dashed_var(--color-rule)]!`}>
                <ContactForm
                  heading="Submitting state"
                  subheading="Disabled inputs with spinner."
                  fields={demoFields}
                  submitLabel="Get in touch"
                  successMessage="We'll get back to you soon!"
                  honeypotId="sg-contact-submitting-url"
                  previewState="submitting"
                />
              </div>
            </div>
          );
        })()}
      </Section>

      <Section id="primitive-navigation-menu" title="PRIMITIVE: NAVIGATION MENU">
        <div className="flex flex-col gap-[24px] [border:1px_dashed_var(--color-rule)] [padding:24px]">
          <NavigationMenu aria-label="Primitive navigation menu demo">
            <NavigationMenuList className="flex-wrap justify-start gap-[8px]">
              <NavigationMenuItem>
                <NavigationMenuTrigger data-ds-a6="nav-item">Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="m-0 flex w-[240px] list-none flex-col gap-[4px] p-[4px]">
                    <li>
                      <NavigationMenuLink render={<Link href="/pricing" />}>
                        Pricing
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink render={<Link href="/about" />}>
                        About
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink render={<Link href="/contact" />}>
                        Contact
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href="/pricing" />}
                >
                  Normal
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} bg-muted`}
                  render={<Link href="/about" />}
                >
                  Hover
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} ring-3 ring-ring/50 outline-1`}
                  render={<Link href="/blog" />}
                >
                  Focus
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger disabled>Disabled</NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  aria-invalid="true"
                  className={`${navigationMenuTriggerStyle()} border border-destructive text-destructive`}
                  render={<Link href="/contact" />}
                >
                  Error
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </Section>

      <Section id="primitive-collapsible" title="PRIMITIVE: COLLAPSIBLE">
        <div className="grid grid-cols-1 gap-[16px] [border:1px_dashed_var(--color-rule)] [padding:24px] min-[810px]:grid-cols-2">
          <Collapsible defaultOpen className="flex flex-col gap-[8px] rounded-field border border-border p-[12px]">
            <CollapsibleTrigger className="flex w-full items-center justify-between text-left text-sm text-foreground">
              <span>Normal (open)</span>
              <span className="font-mono text-[12px] text-muted-foreground">toggle</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="text-sm text-muted-foreground">
              Expandable content panel used for mobile dropdown groups and checklist guides.
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="flex flex-col gap-[8px] rounded-field border border-border bg-muted/50 p-[12px]">
            <CollapsibleTrigger className="flex w-full items-center justify-between text-left text-sm text-foreground">
              <span>Hover state</span>
              <span className="font-mono text-[12px] text-muted-foreground">toggle</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="text-sm text-muted-foreground">
              Hidden until expanded.
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="flex flex-col gap-[8px] rounded-field border border-ring p-[12px] ring-3 ring-ring/50">
            <CollapsibleTrigger className="flex w-full items-center justify-between text-left text-sm text-foreground">
              <span>Focus state</span>
              <span className="font-mono text-[12px] text-muted-foreground">toggle</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="text-sm text-muted-foreground">
              Focused trigger appearance.
            </CollapsibleContent>
          </Collapsible>

          <Collapsible disabled className="flex flex-col gap-[8px] rounded-field border border-border p-[12px] opacity-50">
            <CollapsibleTrigger className="flex w-full items-center justify-between text-left text-sm text-foreground">
              <span>Disabled state</span>
              <span className="font-mono text-[12px] text-muted-foreground">locked</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="text-sm text-muted-foreground">
              Cannot be toggled.
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen className="flex flex-col gap-[8px] rounded-field border border-destructive p-[12px] min-[810px]:col-span-2">
            <CollapsibleTrigger
              aria-invalid="true"
              className="flex w-full items-center justify-between text-left text-sm text-foreground"
            >
              <span>Error state</span>
              <span className="font-mono text-[12px] text-destructive">invalid</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="text-sm text-destructive">
              Complete the required item inside this group.
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Section>

      <Section id="primitive-checkbox" title="PRIMITIVE: CHECKBOX">
        <div className="flex flex-col gap-[16px] [border:1px_dashed_var(--color-rule)] [padding:24px]">
          <div className="flex items-center gap-[12px]">
            <Checkbox
              id="sg-cb-normal"
              aria-labelledby="sg-cb-normal-label"
              data-ds-a6="checkbox"
              defaultChecked
            />
            <label
              id="sg-cb-normal-label"
              htmlFor="sg-cb-normal"
              className="text-[14px] leading-[20px] text-foreground"
            >
              Normal (checked)
            </label>
          </div>
          <div className="flex items-center gap-[12px]">
            <Checkbox
              id="sg-cb-hover"
              aria-labelledby="sg-cb-hover-label"
              className="border-foreground/50"
            />
            <label
              id="sg-cb-hover-label"
              htmlFor="sg-cb-hover"
              className="text-[14px] leading-[20px] text-foreground"
            >
              Hover (unchecked)
            </label>
          </div>
          <div className="flex items-center gap-[12px]">
            <Checkbox
              id="sg-cb-focus"
              aria-labelledby="sg-cb-focus-label"
              className="border-ring ring-3 ring-ring/50"
            />
            <label
              id="sg-cb-focus-label"
              htmlFor="sg-cb-focus"
              className="text-[14px] leading-[20px] text-foreground"
            >
              Focus state
            </label>
          </div>
          <div className="flex items-center gap-[12px]">
            <Checkbox id="sg-cb-disabled" aria-labelledby="sg-cb-disabled-label" disabled />
            <label
              id="sg-cb-disabled-label"
              htmlFor="sg-cb-disabled"
              className="text-[14px] leading-[20px] text-muted-foreground"
            >
              Disabled state
            </label>
          </div>
          <div className="flex items-center gap-[12px]">
            <Checkbox
              id="sg-cb-error"
              aria-labelledby="sg-cb-error-label"
              aria-invalid="true"
            />
            <label
              id="sg-cb-error-label"
              htmlFor="sg-cb-error"
              className="text-[14px] leading-[20px] text-destructive"
            >
              Error state — consent is required to continue.
            </label>
          </div>
        </div>
      </Section>

      <Section id="primitive-table" title="PRIMITIVE: TABLE">
        <div className="[border:1px_dashed_var(--color-rule)] [padding:24px]">
          <Table data-ds-a6="table">
            <TableHeader>
              <TableRow>
                <TableHead scope="col">State</TableHead>
                <TableHead scope="col">Component</TableHead>
                <TableHead scope="col">Token behavior</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow data-ds-a6="table-row">
                <TableCell>Normal</TableCell>
                <TableCell>TableRow</TableCell>
                <TableCell>Fixed px spacing across 390 / 1024 / 1440</TableCell>
              </TableRow>
              <TableRow className="bg-muted/50">
                <TableCell>Hover</TableCell>
                <TableCell>TableRow</TableCell>
                <TableCell>Muted surface highlight</TableCell>
              </TableRow>
              <TableRow tabIndex={0} className="ring-1 ring-ring/50 outline-none">
                <TableCell>Focus</TableCell>
                <TableCell>TableRow</TableCell>
                <TableCell>Visible keyboard focus ring</TableCell>
              </TableRow>
              <TableRow aria-disabled="true" className="opacity-50">
                <TableCell>Disabled</TableCell>
                <TableCell>TableRow</TableCell>
                <TableCell>Reduced opacity inactive row</TableCell>
              </TableRow>
              <TableRow aria-invalid="true" className="border-destructive text-destructive">
                <TableCell>Error</TableCell>
                <TableCell>TableRow</TableCell>
                <TableCell>Destructive semantic token</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Section>

      {isBg ? (
        <Section id="bg-typography-specimen" title="CYRILLIC TYPE SCALE (DS-06 / DS-07)">
          <div className="flex flex-col gap-[24px] [border:1px_dashed_var(--color-rule)] [padding:24px]">
            <p className={home.eyebrow} data-bg-eyebrow="">
              Варна — срещи по уговорка
            </p>
            <p className="m-0 font-display text-h1">Агенция от Варна за цяла България.</p>
            <p className="m-0 font-display text-title">
              Рекламните акаунти на фирмата ви на ваше име ли са? Проверете с безплатния ни чеклист →
            </p>
            <p className="m-0 font-display text-h2">
              Пилот 30 дни: одит, първи кампании и отчет „преди / след“ — от 690 € общо.
            </p>
            <p className="m-0 font-display text-h3-lg">
              Използваме бисквитки за анализ и реклама — някои от тях са на наши партньори.
            </p>
            <p className="m-0 font-display text-h3">
              Маркетинг Завод — търговско наименование на Егор Гончаренко · Варна, България · zavodzamarketing@gmail.com · Не сме регистрирани по ДДС.
            </p>
            <p className="m-0 font-display text-[14px] leading-[1.6] text-muted-foreground">
              © 2026 Маркетинг Завод. Всички права запазени.
            </p>
          </div>
        </Section>
      ) : null}
    </div>
  );
}
