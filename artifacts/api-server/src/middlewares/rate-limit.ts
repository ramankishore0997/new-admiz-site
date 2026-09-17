import type { Request, Response, NextFunction } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Periodically purge stale rate limit buckets to avoid memory leaks
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}, 5 * 60 * 1000).unref?.();

/**
 * Minimal in-memory rate limiter (per client IP).
 */
export function rateLimit(opts: { windowMs: number; max: number; message?: string }) {
  const message = opts.message || "Too many requests. Please try again later.";

  return (req: Request, res: Response, next: NextFunction) => {
    // Extract real client IP (supports Cloudflare, reverse proxies, and direct connections)
    const cfIp = req.headers["cf-connecting-ip"] as string | undefined;
    const realIp = req.headers["x-real-ip"] as string | undefined;
    const forwardedFor = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim();
    const key = cfIp || realIp || forwardedFor || req.ip || req.socket.remoteAddress || "unknown";
    
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + opts.windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;
    if (bucket.count > opts.max) {
      res.setHeader("Retry-After", String(Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))));
      res.status(429).json({ error: message });
      return;
    }

    next();
  };
}