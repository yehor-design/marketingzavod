/**
 * Structured log lines for the route handlers. They end up in the Vercel
 * runtime logs as one JSON object per line.
 *
 * Attributes must stay free of personal data: IDs and bounded values only.
 */
type Attributes = Record<string, string | number | boolean>;

function write(level: "info" | "warn" | "error", body: string, attributes: Attributes = {}) {
  const line = JSON.stringify({ level, msg: body, ...attributes });
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }
}

export const serverLog = {
  info: (body: string, attributes?: Attributes) => write("info", body, attributes),
  warn: (body: string, attributes?: Attributes) => write("warn", body, attributes),
  error: (body: string, attributes?: Attributes) => write("error", body, attributes),
};
