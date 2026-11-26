import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "playwright-report/**", "playwright-visual-report/**", "test-results/**", ".lighthouseci/**"],
  },
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      // The site uses plain <img> on purpose: its art is dithered on canvas from the source file.
      "@next/next/no-img-element": "off",
      // The animation components predate these two React Compiler rules and read
      // refs during render by design. Rewriting them is outside the tracking work.
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
