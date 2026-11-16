/**
 * Writes server log lines to PostHog Logs through the logger that
 * instrumentation.ts registers. Without that logger every call is a no-op.
 *
 * Attributes must stay free of personal data: IDs and bounded values only.
 */
import { SeverityNumber } from "@opentelemetry/api-logs";

type Attributes = Record<string, string | number | boolean>;

type Emitter = {
  emit(record: {
    severityNumber: SeverityNumber;
    severityText: string;
    body: string;
    attributes?: Attributes;
  }): void;
};

type Scope = typeof globalThis & {
  __posthogLogger?: Emitter;
  __posthogLoggerProvider?: { forceFlush(): Promise<void> };
};

function emit(severityNumber: SeverityNumber, severityText: string, body: string, attributes?: Attributes) {
  (globalThis as Scope).__posthogLogger?.emit({ severityNumber, severityText, body, attributes });
}

export const serverLog = {
  info: (body: string, attributes?: Attributes) => emit(SeverityNumber.INFO, "INFO", body, attributes),
  warn: (body: string, attributes?: Attributes) => emit(SeverityNumber.WARN, "WARN", body, attributes),
  error: (body: string, attributes?: Attributes) => emit(SeverityNumber.ERROR, "ERROR", body, attributes),
};

/** Serverless functions freeze after the response. Call this inside after() so logs get out. */
export async function flushServerLogs(): Promise<void> {
  try {
    await (globalThis as Scope).__posthogLoggerProvider?.forceFlush();
  } catch {
    // A failed export must never affect a request.
  }
}
