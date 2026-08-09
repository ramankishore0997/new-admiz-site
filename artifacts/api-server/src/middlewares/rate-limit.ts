import type { Request, Response, NextFunction } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Minimal in-memory rate limiter (per IP).
 * Sufficient for auth endpoints on a single-function deployment.
 */
export function rateLimit(opts: { windowMs: number; max: number; message?: string }) {
  const message = opts.message || "Too many requests. Please try again later.";

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
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