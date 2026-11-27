import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BG_SITE_METADATA } from "@/content/bg/metadata";
import { isBg } from "@/lib/edition";
import { OG_TOKENS } from "@/lib/og-tokens";

export const alt = isBg
  ? BG_SITE_METADATA.ogImage.alt
  : "Jet – Lightning-Fast Website Optimization";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadBgOgFonts() {
  const fontsDir = join(process.cwd(), "lib", "fonts", "assets");
  const [regular, bold] = await Promise.all([
    readFile(join(fontsDir, "google-sans-400.ttf")),
    readFile(join(fontsDir, "google-sans-700.ttf")),
  ]);
  return [
    { name: "Google Sans", data: regular, style: "normal" as const, weight: 400 as const },
    { name: "Google Sans", data: bold, style: "normal" as const, weight: 700 as const },
  ];
}

/** Default share image for pages that do not set their own. */
export default async function OpenGraphImage() {
  if (!isBg) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 80,
            background: "#080808",
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", fontSize: 44, fontWeight: 500, letterSpacing: -1 }}>
            Jet
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                display: "flex",
                fontSize: 76,
                fontWeight: 500,
                letterSpacing: -3,
                lineHeight: 1.05,
              }}
            >
              Lightning-fast website optimization
            </div>
            <div style={{ display: "flex", fontSize: 30, color: "#9a9a9a" }}>
              Optimize images, code and speed. No code required.
            </div>
          </div>
        </div>
      ),
      size,
    );
  }

  const [headline, subtitle, domain] = BG_SITE_METADATA.ogImage.lines;
  const fonts = await loadBgOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 48,
          background: OG_TOKENS.background,
          color: OG_TOKENS.foreground,
          fontFamily: "Google Sans",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 64,
            border: `1px dashed ${OG_TOKENS.rule}`,
            background: OG_TOKENS.background,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -3,
              left: -3,
              width: 6,
              height: 6,
              background: OG_TOKENS.foreground,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -3,
              right: -3,
              width: 6,
              height: 6,
              background: OG_TOKENS.foreground,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -3,
              left: -3,
              width: 6,
              height: 6,
              background: OG_TOKENS.foreground,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -3,
              right: -3,
              width: 6,
              height: 6,
              background: OG_TOKENS.foreground,
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 960 }}>
            <div
              style={{
                display: "flex",
                fontSize: 74,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                color: OG_TOKENS.foreground,
              }}
            >
              {headline}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 32,
                fontWeight: 400,
                lineHeight: 1.35,
                color: OG_TOKENS.mutedForeground,
              }}
            >
              {subtitle}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: "0.02em",
              color: OG_TOKENS.foreground,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: OG_TOKENS.brand,
              }}
            />
            <span>{domain}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    },
  );
}
