/**
 * Removes what a withdrawn category stored on the device: first-party cookies
 * on this host and on the site's parent domain, and matching localStorage and
 * sessionStorage keys. Browser only. IndexedDB is cleared separately, by
 * clearIndexedDbByName().
 */
export function clearStoredByPrefix(prefixes: readonly string[]): string[] {
  if (prefixes.length === 0 || typeof document === "undefined") {
    return [];
  }
  const matches = (name: string) => prefixes.some((prefix) => name.startsWith(prefix));
  const removed: string[] = [];

  const host = window.location.hostname;
  const parent = host.split(".").slice(-2).join(".");
  const domains = ["", `; Domain=${host}`, `; Domain=.${parent}`];
  for (const row of document.cookie.split(";")) {
    const name = row.split("=")[0]?.trim();
    if (!name || !matches(name)) {
      continue;
    }
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain}`;
    }
    removed.push(name);
  }

  for (const storage of [window.localStorage, window.sessionStorage]) {
    try {
      for (const key of Object.keys(storage)) {
        if (matches(key)) {
          storage.removeItem(key);
          removed.push(key);
        }
      }
    } catch {
      // Storage can be unavailable. Nothing to remove then.
    }
  }
  return removed;
}

/**
 * Deletes IndexedDB databases whose name contains one of the parts. A database
 * that is still open is deleted once its page closes. Browsers without
 * indexedDB.databases() keep them.
 */
export async function clearIndexedDbByName(parts: readonly string[]): Promise<string[]> {
  if (parts.length === 0 || typeof indexedDB === "undefined" || typeof indexedDB.databases !== "function") {
    return [];
  }
  try {
    const names = (await indexedDB.databases())
      .map((database) => database.name ?? "")
      .filter((name) => name !== "" && parts.some((part) => name.includes(part)));
    for (const name of names) {
      indexedDB.deleteDatabase(name);
    }
    return names;
  } catch {
    // IndexedDB can be unavailable. Nothing to remove then.
    return [];
  }
}
