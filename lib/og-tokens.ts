/**
 * Design-system color constants for `next/og` `ImageResponse` (DS-25).
 * Satori does not resolve CSS custom properties; `tests/unit/og-tokens.test.ts`
 * verifies every value stays identical to its source token in `app/globals.css`.
 */
export const OG_TOKENS = {
  background: "#000",
  card: "#0c0c0c",
  foreground: "#fff",
  mutedForeground: "rgba(255, 255, 255, 0.5)",
  brand: "#00e6c5",
  rule: "#1c1c1c",
} as const;

export const OG_TOKEN_CSS_VARS: Record<keyof typeof OG_TOKENS, string> = {
  background: "--background",
  card: "--card",
  foreground: "--foreground",
  mutedForeground: "--muted-foreground",
  brand: "--accent",
  rule: "--color-rule",
};
