<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## UI components (shadcn/ui)

Use official [shadcn/ui](https://github.com/shadcn-ui/ui) components (`components/ui/*`, configured in `components.json` with `base-nova` on `@base-ui/react`, Tailwind v4, and `lucide-react`) wherever appropriate and fitting instead of building custom UI primitives.

- Follow the installed `.agents/skills/shadcn/SKILL.md` skill (and use the `shadcn` CLI / `shadcn` MCP server to inspect docs and install missing components via `npx shadcn add <component>`).
- Check `components/ui/` first before writing custom markup for buttons, form controls, fields, dialogs, sheets, accordions, tabs, toggle groups, tooltips, badges, alerts, separators, spinners, cards, or tables.
- Respect Base UI conventions (`render` instead of `asChild`, `nativeButton={false}` when rendering a button/trigger as a non-button, `items` on `Select`, `multiple` boolean + array values on `Accordion` / `ToggleGroup`).

Before using ui-sdk, follow the ui-sdk skill if it is installed, and read `node_modules/@ui-sdk/react/docs/llms.txt`. To build a new component, search `node_modules/@ui-sdk/react/docs/core.md` by heading, and read `rendering.md` next to it.
