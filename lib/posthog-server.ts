/**
 * PostHog from route handlers. Used for events the browser cannot vouch for,
 * such as "the lead was saved". Without a key it does nothing.
 */
import { PostHog } from "posthog-node";

export async function capturePosthogServerEvent(
  distinctId: string,
  event: string,
  properties: Record<string, string | number | boolean>,
): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (!key || !distinctId) {
    return;
  }
  const client = new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://eu.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
  try {
    await client.captureImmediate({ distinctId, event, properties });
  } catch (error) {
    console.error(
      JSON.stringify({
        type: "posthog_server_error",
        event,
        message: error instanceof Error ? error.message : String(error),
      }),
    );
  } finally {
    await client.shutdown(2000).catch(() => {});
  }
}
