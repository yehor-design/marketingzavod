"use client";

import { cx } from "@/components/chrome-styles";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import {
  RollingText,
  TextGlitch,
  TextShimmer,
  nestedDither,
  orderedDither,
  randomDither,
} from "@/components/motion";
import { CornerMarks } from "@/components/motion/corner-marks";
import { RollLink } from "@/components/careers/roll-link";
import { DitherImage } from "@/components/home/dither-image";
import { Halftone } from "@/components/home/halftone";
import { PhosphorIcon } from "@/components/home/phosphor-icon";
import home from "@/components/home/home-styles";
import contact from "@/components/contact/contact-styles";
import styles from "./styleguide-styles";

const NBSP = " ";

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
  { value: 6, use: "Nav buttons, tags" },
  { value: 8, use: "Inputs, filter chips" },
  { value: 10, use: "Toggle buttons, tabs" },
  { value: 14, use: "Toggle track" },
  { value: 20, use: "Buttons" },
  { value: 100, use: "Pills, round icons" },
] as const;

const spacing = [4, 6, 8, 10, 12, 16, 18, 20, 24, 28, 34, 44, 50, 100] as const;

const motion = [
  ["RollingText", "Pill buttons", "hover / focus", "spring 0.4s, bounce 0; letter delay 0.4 / n × i × 0.25"],
  ["GrayRing", "Secondary buttons", "hover / focus", "400ms pill spring; dash 8/6 (6/4 at 30px), 1s linear"],
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
      {badge ? <span className={cx("count-badge")}>{badge}</span> : null}
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
          <RollLink href="/dev/styleguide" text={`Join${NBSP}waitlist`} className={home.buttonPrimary} />
          <RollLink
            href="/dev/styleguide"
            text="Learn more"
            className={`${home.buttonSecondary} gray-pill`}
          />
          <Link className={cx("nav-button", "nav-button-secondary")} href="/dev/styleguide">
            <RollingText text="Contact" fontSize={12} lineHeightPx={21.6} />
          </Link>
          <Link className={cx("nav-button", "nav-button-primary")} href="/dev/styleguide">
            <RollingText text={`Join${NBSP}waitlist`} fontSize={12} lineHeightPx={14.4} />
          </Link>
        </div>
        <p className={styles.caption}>
          40px, radius 20px, padding 0 18px. Header buttons are 30px with radius 6px. The label
          rolls; the button itself does not move.
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
        <div className={styles.form}>
          <label className={contact.field}>
            <span>Full name</span>
            <input name="name" placeholder="Jane Smith" />
          </label>
          <label className={contact.field}>
            <span>Email</span>
            <input name="email" defaultValue="orin@" aria-invalid="true" />
            <span className={contact.fieldError}>Enter a valid email address.</span>
          </label>
        </div>
        <p className={styles.caption}>
          Field #171717, radius 8px, padding 12px, Google Sans 14px. Invalid: 1px #db2c2c outline with a
          message. Focus everywhere: 1px white outline, 3px offset.
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
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Effect</th>
                <th>Where</th>
                <th>Trigger</th>
                <th>Timing</th>
              </tr>
            </thead>
            <tbody>
              {motion.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
