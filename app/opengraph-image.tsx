import { ImageResponse } from "next/og";

export const alt = "Jet – Lightning-Fast Website Optimization";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default share image for pages that do not set their own. */
export default function OpenGraphImage() {
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
        <div style={{ display: "flex", fontSize: 44, fontWeight: 500, letterSpacing: -1 }}>Jet</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 500, letterSpacing: -3, lineHeight: 1.05 }}>
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
