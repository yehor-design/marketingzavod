"use client";

import NextError from "next/error";
import { useEffect } from "react";
import { posthogCaptureException } from "@/lib/tracking/posthog";

export default function GlobalError({
  error,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  // Reaches PostHog only when it is running, which needs statistics consent.
  useEffect(() => {
    posthogCaptureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
