/**
 * Builds the file Google Ads reads on a schedule (Goals → Conversions →
 * Uploads → Schedules, source HTTPS). One row per conversion. A row is
 * identified by its click ID or, without one, by the hashed email (Enhanced
 * Conversions for Leads). Google drops a repeated row for the same click,
 * conversion name and time, so serving the same row again is harmless.
 */
import { hashEmail } from "@/lib/meta/capi";

export type GoogleAdsRow = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  email?: string;
  conversionName: string;
  /** ISO 8601. */
  conversionTime: string;
  value: number;
  currency: string;
};

export const GOOGLE_ADS_HEADER = [
  "Google Click ID",
  "GBRAID",
  "WBRAID",
  "Email",
  "Conversion Name",
  "Conversion Time",
  "Conversion Value",
  "Conversion Currency",
  "Ad User Data",
  "Ad Personalization",
];

/** Google Ads accepts "yyyy-MM-dd HH:mm:ss" when the file declares its time zone. */
export function formatConversionTime(iso: string): string {
  return new Date(iso).toISOString().slice(0, 19).replace("T", " ");
}

function cell(value: string | number | undefined): string {
  const text = value === undefined ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function buildGoogleAdsCsv(rows: GoogleAdsRow[]): string {
  const lines = ["Parameters:TimeZone=+0000", GOOGLE_ADS_HEADER.join(",")];
  for (const row of rows) {
    const hasClickId = Boolean(row.gclid || row.gbraid || row.wbraid);
    lines.push(
      [
        row.gclid,
        row.gbraid,
        row.wbraid,
        // The address is used only when there is no click ID, and only hashed.
        hasClickId ? "" : hashEmail(row.email),
        row.conversionName,
        formatConversionTime(row.conversionTime),
        row.value,
        row.currency,
        // Every row belongs to a lead who agreed to marketing. Others are never exported.
        "Granted",
        "Granted",
      ]
        .map(cell)
        .join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}
