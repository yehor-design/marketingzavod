"use client";

import { useEffect, useRef } from "react";
import { track, type TrackEventName, type TrackEvents } from "@/lib/tracking";

/**
 * Reports an event when a page is shown, such as begin_checkout or
 * view_pricing. Renders nothing. Fires once per mount.
 */
export function TrackView<E extends TrackEventName>({
  event,
  params,
}: {
  event: E;
  params: TrackEvents[E];
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) {
      return;
    }
    fired.current = true;
    track(event, params);
    // Reported once for the mounted page. Later prop changes are not new views.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
