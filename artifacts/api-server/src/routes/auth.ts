import { Router, type Response } from "express";
import { db, usersTable, accountsTable, paymentsTable, applicationFeesTable, accountLoadsTable, passwordChangeRequestsTable, type User } from "@workspace/db";
import { eq, or, ilike } from "drizzle-orm";
import { hashPassword, verifyPassword, signToken, verifyToken } from "../lib/crypto";
import { authenticate, type AuthenticatedRequest } from "../middlewares/auth";
import { rateLimit } from "../middlewares/rate-limit";
import * as telegramNotify from "../lib/telegram/service";

const router = Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: "Too many attempts. Please wait a few minutes and try again." });
const registerLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: "Too many registrations from this network. Please try again later." });
const resetLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: "Too many reset requests. Please try again later." });

// Configure cookie properties
const isProd = process.env.NODE_ENV === "production";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Debug users table and database status (admin only — leaks emails otherwise)
 */
router.get("/auth/debug-users", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const role = req.user?.role || "CLIENT";
    if (!["SUPER_ADMIN", "ADMIN", "REVIEWER", "SUPPORT"].includes(role)) {
      return res.status(403).json({ error: "Forbidden: Administrator permissions required" });
    }
    const list = await db.select({ id: usersTable.id, email: usersTable.email, username: usersTable.username }).from(usersTable);
    return res.json({ status: "success", users: list });
  } catch (err: any) {
    return res.status(500).json({ status: "error", message: err.message, stack: err.stack });
  }
});

/**
 * Register a new user
 */
const handleRegister = async (req: any, res: Response, next: any) => {
  try {
    const { email, password, username, companyName, telegramHandle, phoneNumber, country, referCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email address and password are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const finalUsername = (username || email.split("@")[0] || "user").trim();

    // Check duplicate email or username
    const [existing] = await db
      .select()
      .from(usersTable)
      .where(or(eq(usersTable.email, cleanEmail), ilike(usersTable.username, finalUsername)))
      .limit(1);

    if (existing) {
      return res.status(400).json({ error: "An account with this email address or username already exists." });
    }

    const hashedPassword = hashPassword(password);

    // New accounts always start as CLIENT; admin roles are granted by an existing SUPER_ADMIN
    const role = "CLIENT";

    const [newUser] = await db
      .insert(usersTable)
      .values({
        email: cleanEmail,
        password: hashedPassword,
        username: finalUsername,
        companyName: companyName || "",
        telegramHandle: telegramHandle || "",
        phoneNumber: phoneNumber || "",
        country: country || "",
        referCode: referCode ? String(referCode).trim().slice(0, 64) : null,
        role,
        status: "ACTIVE",
      })
      .returning();

    // Create session token
    const token = signToken({ id: newUser.id, role: newUser.role });

    res.cookie("token", token, COOKIE_OPTIONS);
    
    // Telegram admin notification (fail-soft)
    void telegramNotify.notifyNewUser(newUser);
    
    // Return profile
    const { password: _, ...profile } = newUser;
    return res.status(201).json(profile);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Registration failed" });
  }
};

router.post("/auth/register", registerLimiter, handleRegister);
router.post("/register", registerLimiter, handleRegister);

/**
 * Build full client profile: account records, payment deposit history and
 * balance (sum of admin-verified payments).
 */
async function buildProfile(user: User) {
  const adAccs = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.userId, user.id));

  const adAccounts = adAccs.map((a) => ({
    id: a.accountId || String(a.id),
    dbId: a.id,
    accountId: a.accountId,
    name: a.name,
    platform: a.platform,
    status: a.status as "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED",
    spendLimit: a.spendLimit || "Starter",
    balance: Number(a.balance) || 0,
    dateApplied: a.createdAt.toLocaleDateString(),
  }));

  const paymentRows = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.userId, user.id))
    .orderBy(paymentsTable.createdAt);

  const deposits = paymentRows.map((p) => ({
    id: p.orderId,
    amount: Number(p.amount) || 0,
    crypto: p.network?.toUpperCase() || "USDT",
    address: p.receivingAddress,
    txHash: p.txHash,
    note: p.note,
    date: p.createdAt.toISOString(),
    status: p.status === "PAID" ? "COMPLETED" : p.status === "REJECTED" ? "FAILED" : "PENDING",
    rawStatus: p.status,
    rejectionReason: p.rejectionReason,
  }));

  // Main wallet = full admin-verified deposits (no commission on deposits).
  const balance = Math.round(deposits.filter((d) => d.status === "COMPLETED").reduce((sum, d) => sum + d.amount, 0) * 100) / 100;

  // Application fee ledger ($10 per ad account application)
  const feeRows = await db
    .select()
    .from(applicationFeesTable)
    .where(eq(applicationFeesTable.userId, user.id))
    .orderBy(applicationFeesTable.createdAt);

  const applicationFees = feeRows.map((f) => ({
    id: f.id,
    applicationId: f.applicationId,
    amount: Number(f.amount) || 0,
    description: f.description,
    date: f.createdAt.toISOString(),
  }));

  // Balance loads (main wallet → ad account wallet), incl. 2% commission
  const loadRows = await db
    .select()
    .from(accountLoadsTable)
    .where(eq(accountLoadsTable.userId, user.id))
    .orderBy(accountLoadsTable.createdAt);

  const balanceLoads = loadRows.map((l) => ({
    id: l.id,
    accountId: l.accountId,
    amount: Number(l.amount) || 0,
    commission: Number(l.commission) || 0,
    total: Number(l.total) || 0,
    date: l.createdAt.toISOString(),
  }));

  const netBalance = Math.round(
    (balance -
      applicationFees.reduce((sum, f) => sum + f.amount, 0) -
      balanceLoads.reduce((sum, l) => sum + l.total, 0)) *
      100,
  ) / 100;

  const { password, ...profile } = user;
  return { ...profile, balance: netBalance, adAccounts, deposits, applicationFees, balanceLoads };
}

/**
 * POST /api/auth/login and /api/login
 */
const handleLogin = async (req: any, res: Response, next: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const inputClean = (email || "").toLowerCase().trim();
    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        or(
          eq(usersTable.email, inputClean),
          ilike(usersTable.username, inputClean),
          eq(usersTable.email, (email || "").trim())
        )
      )
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: "Invalid email address/username or password." });
    }

    // Migrate legacy plain-text passwords to PBKDF2 hashes on first login.
    // verifyPassword strictly rejects plain-text storage, so this must run first.
    if (!user.password.includes(":")) {
      if (password !== user.password) {
        return res.status(401).json({ error: "Invalid email address/username or password." });
      }
      const hashedPassword = hashPassword(password);
      await db
        .update(usersTable)
        .set({ password: hashedPassword, updatedAt: new Date() })
        .where(eq(usersTable.id, user.id));
      user.password = hashedPassword;
    }

    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({ error: "Invalid email address/username or password." });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({ error: "Your account is currently suspended or inactive." });
    }

    // Create session token
    const token = signToken({ id: user.id, role: user.role });

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.json(await buildProfile(user));
  } catch (err) {
    return next(err);
  }
};

router.post("/auth/login", authLimiter, handleLogin);
router.post("/login", authLimiter, handleLogin);

/**
 * Fetch current user profile
 */
router.get("/me", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthenticated" });

    return res.json(await buildProfile(user));
  } catch (err) {
    return next(err);
  }
});

/**
 * Logout
 */
router.post("/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
  });
  return res.json({ message: "Logged out successfully" });
});

/**
 * Change password (profile settings) — the new password is only applied
 * after an admin approves the request from Telegram.
 */
router.post("/auth/change-password", authLimiter, authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthenticated" });

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required." });
    }

    // Verify current password
    if (!verifyPassword(currentPassword, user.password)) {
      return res.status(400).json({ error: "The current password you entered is incorrect." });
    }

    // Create approval request instead of changing immediately
    const [request] = await db
      .insert(passwordChangeRequestsTable)
      .values({
        userId: user.id,
        newPasswordHash: hashPassword(newPassword),
        source: "PROFILE",
      })
      .returning();

    // Telegram admin notification (fail-soft)
    void telegramNotify.notifyPasswordChangeRequest({ id: request.id, source: "PROFILE" }, { id: user.id, email: user.email });

    return res.json({
      message: "Password change request sent for admin approval. Your password will be updated once approved.",
      requestId: request.id,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * Forgot Password Request (login page) — the user submits their email plus
 * the new password they want. An admin approves from Telegram before the
 * password is applied.
 */
router.post("/auth/forgot-password", resetLimiter, async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email address and new password are required." });
    }

    const inputClean = String(email).toLowerCase().trim();
    const [user] = await db
      .select({ id: usersTable.id, email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.email, inputClean))
      .limit(1);

    // Never reveal whether the account exists.
    if (!user) {
      return res.json({
        message: "If the account exists, your password reset request has been sent for admin approval.",
      });
    }

    const [request] = await db
      .insert(passwordChangeRequestsTable)
      .values({
        userId: user.id,
        newPasswordHash: hashPassword(newPassword),
        source: "RESET",
      })
      .returning();

    void telegramNotify.notifyPasswordChangeRequest({ id: request.id, source: "RESET" }, { id: user.id, email: user.email });

    return res.json({
      message: "Password reset request submitted. An admin will review it — your new password becomes active after approval.",
      requestId: request.id,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * Update profile fields (contact name, company name, telegram handle)
 */
router.patch("/auth/profile", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthenticated" });

    const { username, companyName, telegramHandle } = req.body || {};

    const [updated] = await db
      .update(usersTable)
      .set({
        username: typeof username === "string" && username.trim() ? username.trim() : user.username,
        companyName: typeof companyName === "string" ? companyName.trim() : user.companyName,
        telegramHandle: typeof telegramHandle === "string" ? telegramHandle.replace(/^@/, "").trim() : user.telegramHandle,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, user.id))
      .returning();

    const { password: _pw, ...profile } = updated;
    return res.json(profile);
  } catch (err) {
    return next(err);
  }
});

/**
 * Reset Password Validation
 */
router.post("/auth/reset-password", resetLimiter, async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required." });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id || !payload.reset) {
      return res.status(400).json({ error: "The password reset token is invalid or has expired." });
    }

    const hashedPassword = hashPassword(newPassword);
    await db
      .update(usersTable)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(usersTable.id, payload.id));

    return res.json({ message: "Password has been reset successfully. Please log in." });
  } catch (err) {
    return next(err);
  }
});

export default router;
