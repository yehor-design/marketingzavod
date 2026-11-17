/**
 * Removes what a withdrawn category stored on the device: first-party cookies
 * on this host and on the site's parent domain, and matching localStorage and
 * sessionStorage keys. Browser only.
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
