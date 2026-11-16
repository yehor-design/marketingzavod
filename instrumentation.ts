/**
 * Server logs to PostHog over OpenTelemetry (OTLP/HTTP).
 *
 * Next.js calls register() once when the server starts. The instrumentation
 * file is stable since Next 15, so next.config needs no experimental flag.
 *
 * The exporter stays off unless a project token is set, and outside the
 * production deployment unless NEXT_PUBLIC_TRACKING_DEBUG=true. The token is
 * the public project key (phc_…), read from the environment, never hardcoded.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }
  const token = (
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || process.env.NEXT_PUBLIC_POSTHOG_KEY
  )?.trim();
  const allowed =
    process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_TRACKING_DEBUG === "true";
  if (!token || !allowed) {
    return;
  }

  const [{ OTLPLogExporter }, { resourceFromAttributes }, { LoggerProvider, SimpleLogRecordProcessor }] =
    await Promise.all([
      import("@opentelemetry/exporter-logs-otlp-http"),
      import("@opentelemetry/resources"),
      import("@opentelemetry/sdk-logs"),
    ]);

  const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://eu.i.posthog.com").replace(
    /\/+$/,
    "",
  );
  const exporter = new OTLPLogExporter({
    url: `${host}/i/v1/logs`,
    headers: { Authorization: `Bearer ${token}` },
  });
  const provider = new LoggerProvider({
    resource: resourceFromAttributes({
      "service.name": "wowboy-web",
      "deployment.environment": process.env.VERCEL_ENV ?? "development",
    }),
    processors: [new SimpleLogRecordProcessor({ exporter })],
  });

  const scope = globalThis as typeof globalThis & {
    __posthogLogger?: ReturnType<typeof provider.getLogger>;
    __posthogLoggerProvider?: typeof provider;
  };
  scope.__posthogLogger = provider.getLogger("wowboy-web");
  scope.__posthogLoggerProvider = provider;
}
