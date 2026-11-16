/**
 * A small fixed-window limiter kept in memory. It lives per serverless
 * instance, so it slows down a burst from one address without a database.
 * It is not a hard guarantee across instances.
 */
type Bucket = { count: number; resetAt: number };

export function createRateLimiter(limit: number, windowMs: number, maxKeys = 5000) {
  const buckets = new Map<string, Bucket>();

  return function allow(key: string, now: number = Date.now()): boolean {
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      if (buckets.size >= maxKeys) {
        for (const [name, value] of buckets) {
          if (value.resetAt <= now) {
            buckets.delete(name);
          }
        }
        if (buckets.size >= maxKeys) {
          buckets.clear();
        }
      }
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    bucket.count += 1;
    return bucket.count <= limit;
  };
}
