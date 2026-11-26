import { notFound } from "next/navigation";
import { isBg } from "@/lib/edition";

/**
 * Route guard for Bulgarian-only pages inside `app/(bg)/`.
 * Triggers a genuine HTTP 404 when building or serving the `jet` edition.
 */
export function requireBgEdition(): void {
  if (!isBg) {
    notFound();
  }
}

/**
 * Route guard for Jet-only pages (CR-04, CR-31).
 * Triggers a genuine HTTP 404 when building or serving the `bg` edition.
 */
export function requireJetEdition(): void {
  if (isBg) {
    notFound();
  }
}
