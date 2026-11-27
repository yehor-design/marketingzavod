import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BG_SITE_METADATA } from "@/content/bg/metadata";
import { OG_TOKEN_CSS_VARS, OG_TOKENS } from "@/lib/og-tokens";

const GLOBALS_CSS = fs.readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");

describe("lib/og-tokens.ts parity with app/globals.css and BG OG card assets (DS-25, CR-21)", () => {
  it("matches every OG token color value to its CSS custom property in app/globals.css", () => {
    for (const [key, cssVar] of Object.entries(OG_TOKEN_CSS_VARS) as Array<
      [keyof typeof OG_TOKENS, string]
    >) {
      const escaped = cssVar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const match = GLOBALS_CSS.match(new RegExp(`${escaped}:\\s*([^;]+);`));
      expect(match, `CSS variable ${cssVar} not found in app/globals.css`).not.toBeNull();
      expect(match![1].trim(), `OG_TOKENS.${key} diverged from ${cssVar}`).toBe(OG_TOKENS[key]);
    }
  });

  it("bundles valid TrueType Cyrillic+Latin Google Sans font files for ImageResponse", () => {
    for (const file of ["google-sans-400.ttf", "google-sans-700.ttf"]) {
      const fullPath = path.join(process.cwd(), "lib", "fonts", "assets", file);
      expect(fs.existsSync(fullPath), `${file} missing`).toBe(true);
      const buf = fs.readFileSync(fullPath);
      expect(buf.length).toBeGreaterThan(10_000);
      // TrueType sfnt magic: 0x00010000
      expect(buf.subarray(0, 4).toString("hex")).toBe("00010000");
    }
  });

  it("contains exactly three verbatim OG card lines and alt without Jet or price mentions", () => {
    expect(BG_SITE_METADATA.ogImage.lines).toHaveLength(3);
    for (const line of BG_SITE_METADATA.ogImage.lines) {
      expect(line).not.toMatch(/\bJet\b/i);
      expect(line).not.toContain("€");
    }
    expect(BG_SITE_METADATA.ogImage.alt).not.toMatch(/\bJet\b/i);
  });
});
