import { type Response, type NextFunction } from "express";
import { type Request as ExpressRequest } from "express";
import { db, usersTable, type User } from "@workspace/db";
import { eq } from "drizzle-orm";
import { verifyToken } from "../lib/crypto";

export interface AuthenticatedRequest extends ExpressRequest {
  user?: User;
  userId?: number;
}

/**
 * Middleware to check authentication and load user
 */
export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token = "";

    // 1. Check cookies
    if (req.headers.cookie) {
      const cookies = Object.fromEntries(
        req.headers.cookie.split(";").map((c) => c.trim().split("="))
      );
      token = cookies["token"] || "";
    }

    // 2. Check Authorization Header if cookie not found
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }

    // Load user from database
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.id)).limit(1);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({ error: "Forbidden: Account is inactive or suspended" });
    }

    req.user = user;
    req.userId = user.id;
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Middleware to enforce admin status
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "REVIEWER", "SUPPORT"];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden: Administrator permissions required" });
  }

  return next();
}

/**
 * Middleware to enforce super admin status
 */
export function requireSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Forbidden: Super Administrator permissions required" });
  }

  return next();
}
