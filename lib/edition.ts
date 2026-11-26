export type SiteEdition = "jet" | "bg";

const VALID_EDITIONS: readonly SiteEdition[] = ["jet", "bg"];

/**
 * Parses NEXT_PUBLIC_SITE_EDITION. Empty or unset defaults to "jet".
 * Any unknown value throws to halt the build instead of producing a mixed site.
 */
export function parseEdition(raw: string | undefined): SiteEdition {
  if (raw === undefined || raw.trim() === "") {
    return "jet";
  }
  const normalized = raw.trim();
  if ((VALID_EDITIONS as readonly string[]).includes(normalized)) {
    return normalized as SiteEdition;
  }
  throw new Error(
    `Invalid NEXT_PUBLIC_SITE_EDITION="${raw}". Expected one of: ${VALID_EDITIONS.join(", ")}.`,
  );
}

/**
 * Single source of truth for the active site edition (CR-01, CR-02, LN-01).
 * Only this module reads NEXT_PUBLIC_SITE_EDITION so every bundle is locked to
 * one edition at build time.
 */
export const EDITION: SiteEdition = parseEdition(process.env.NEXT_PUBLIC_SITE_EDITION);

export const isBg: boolean = EDITION === "bg";
