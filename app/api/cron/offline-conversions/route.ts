import { NextResponse, type NextRequest } from "next/server";
import { syncMetaOfflineConversions } from "@/lib/offline/meta-sync";
import { secretMatches } from "@/lib/offline/signature";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** One run a minute per instance is plenty for a daily job. */
const MIN_INTERVAL_MS = 60_000;
let lastRun = 0;

/**
 * Daily sync of offline conversions to Meta (vercel.json → crons). It reports
 * deals that reached a conversion stage in the last seven days and were not
 * reported yet. It is idempotent: wb_offline_sent on the deal and a
 * deterministic event_id stop any double report, so an extra call does no harm.
 *
 * With CRON_SECRET set in Vercel, Vercel Cron sends it as a bearer token and
 * other callers are refused.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (cronSecret) {
    const header = request.headers.get("authorization") ?? "";
    if (!header.startsWith("Bearer ") || !secretMatches(cronSecret, header.slice(7))) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }
  const token = process.env.HUBSPOT_ACCESS_TOKEN?.trim();
  if (!token) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }
  const now = Date.now();
  if (now - lastRun < MIN_INTERVAL_MS) {
    return NextResponse.json({ ok: false, error: "too_soon" }, { status: 429 });
  }
  lastRun = now;

  try {
    const results = await syncMetaOfflineConversions(token, now);
    const counts = results.reduce<Record<string, number>>((all, { status }) => {
      all[status] = (all[status] ?? 0) + 1;
      return all;
    }, {});
    console.log(JSON.stringify({ type: "offline_conversion_sync", ...counts }));
    return NextResponse.json({ ok: true, counts });
  } catch (error) {
    console.error(
      JSON.stringify({
        type: "offline_conversion_sync_error",
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    return NextResponse.json({ ok: false, error: "sync_failed" }, { status: 502 });
  }
}
