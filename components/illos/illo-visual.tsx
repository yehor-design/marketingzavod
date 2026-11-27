"use client";

import Image from "next/image";

/**
 * Animated SVG reproductions adapted from free https://illos.dev/library illustrations
 * (Illos free license, DS-27 / PG-07 / ZAV-65). Every asset in public/illos/ uses only
 * dark-theme palette values from app/globals.css (DS-01) and pauses animation on
 * prefers-reduced-motion: reduce (DS-16).
 */
export const ILLOS_CATALOG = {
  "hud-monitoring": {
    src: "/illos/hud-monitoring.svg",
    sourceUrl: "https://illos.dev/library/hud/monitoring",
    width: 720,
    height: 460,
  },
  "hud-cost-meter": {
    src: "/illos/hud-cost-meter.svg",
    sourceUrl: "https://illos.dev/library/hud/cost-meter",
    width: 720,
    height: 460,
  },
  "hud-audit-log": {
    src: "/illos/hud-audit-log.svg",
    sourceUrl: "https://illos.dev/library/hud/audit-log",
    width: 720,
    height: 460,
  },
  "hud-signals": {
    src: "/illos/hud-signals.svg",
    sourceUrl: "https://illos.dev/library/hud/signals",
    width: 720,
    height: 460,
  },
  "hud-traffic": {
    src: "/illos/hud-traffic.svg",
    sourceUrl: "https://illos.dev/library/hud/traffic",
    width: 720,
    height: 460,
  },
  "hud-search": {
    src: "/illos/hud-search.svg",
    sourceUrl: "https://illos.dev/library/hud/search",
    width: 720,
    height: 460,
  },
  "hud-edge": {
    src: "/illos/hud-edge.svg",
    sourceUrl: "https://illos.dev/library/hud/edge",
    width: 720,
    height: 460,
  },
  "hud-alerts": {
    src: "/illos/hud-alerts.svg",
    sourceUrl: "https://illos.dev/library/hud/alerts",
    width: 720,
    height: 460,
  },
  "hud-billing-stack": {
    src: "/illos/hud-billing-stack.svg",
    sourceUrl: "https://illos.dev/library/hud/billing-stack",
    width: 720,
    height: 460,
  },
  "hud-orbit": {
    src: "/illos/hud-orbit.svg",
    sourceUrl: "https://illos.dev/library/hud/orbit",
    width: 720,
    height: 460,
  },
  "hud-threat-detection": {
    src: "/illos/hud-threat-detection.svg",
    sourceUrl: "https://illos.dev/library/hud/threat-detection",
    width: 720,
    height: 460,
  },
  "hud-latency-heatmap": {
    src: "/illos/hud-latency-heatmap.svg",
    sourceUrl: "https://illos.dev/library/hud/latency-heatmap",
    width: 720,
    height: 460,
  },
  "interface-choose-plan": {
    src: "/illos/interface-choose-plan.svg",
    sourceUrl: "https://illos.dev/library/interface/choose-plan",
    width: 720,
    height: 460,
  },
} as const;

export type IlloName = keyof typeof ILLOS_CATALOG;

export type IlloVisualProps = {
  name: IlloName;
  alt?: string;
  decorative?: boolean;
  loading?: "eager" | "lazy";
  className?: string;
};

export function IlloVisual({
  name,
  alt = "",
  decorative = !alt,
  loading = "lazy",
  className,
}: IlloVisualProps) {
  const entry = ILLOS_CATALOG[name];
  return (
    <Image
      src={entry.src}
      width={entry.width}
      height={entry.height}
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? true : undefined}
      unoptimized
      loading={loading}
      data-illo={name}
      className={className ? `block w-full h-auto ${className}` : "block w-full h-auto"}
    />
  );
}
