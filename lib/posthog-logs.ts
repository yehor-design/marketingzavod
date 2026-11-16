"use client";

import posthog from "posthog-js";

type LogAttributes = Record<string, string | number | boolean>;

const posthogEnabled = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

export const posthogLog = {
  info(body: string, attributes: LogAttributes) {
    if (posthogEnabled) {
      posthog.captureLog({ body, level: "info", attributes });
    }
  },
};
