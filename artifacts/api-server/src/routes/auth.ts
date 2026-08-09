import { Router, type Response } from "express";
import { db, usersTable, accountsTable, paymentsTable, applicationFeesTable, DEPOSIT_COMMISSION_RATE, type User } from "@workspace/db";
import { eq, or, ilike } from "drizzle-orm";
import { hashPassword, verifyPassword, signToken, verifyToken } from "../lib/crypto";
import { authenticate, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

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
    const { email, password, username, companyName, telegramHandle, phoneNumber, country } = req.body;

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

    // Check if it's the very first user (auto-escalate to SUPER_ADMIN for setup convenience)
    const allUsers = await db.select({ id: usersTable.id }).from(usersTable).limit(1);
    const role = allUsers.length === 0 ? "SUPER_ADMIN" : "CLIENT";

    const hashedPassword = hashPassword(password);

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
        role,
        status: "ACTIVE",
      })
      .returning();

    // Create session token
    const token = signToken({ id: newUser.id, role: newUser.role });

    res.cookie("token", token, COOKIE_OPTIONS);
    
    // Return profile
    const { password: _, ...profile } = newUser;
    return res.status(201).json(profile);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Registration failed" });
  }
};

router.post("/auth/register", handleRegister);
router.post("/register", handleRegister);

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
    platform: a.platform,
    status: a.status as "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED",
    spendLimit: a.spendLimit || "Starter",
    balance: 0,
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

  const balance = Math.round(
    deposits
      .filter((d) => d.status === "COMPLETED")
      .reduce((sum, d) => sum + d.amount, 0) *
      (1 - DEPOSIT_COMMISSION_RATE) *
      100
  ) / 100;

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

  const netBalance = Math.round((balance - applicationFees.reduce((sum, f) => sum + f.amount, 0)) * 100) / 100;

  const { password, ...profile } = user;
  return { ...profile, balance: netBalance, adAccounts, deposits, applicationFees };
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

    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: "Invalid email address/username or password." });
    }

    // Auto-migrate legacy plain text password to hashed format if needed
    if (!user.password.includes(":")) {
      const hashedPassword = hashPassword(password);
      await db
        .update(usersTable)
        .set({ password: hashedPassword, updatedAt: new Date() })
        .where(eq(usersTable.id, user.id));
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

router.post("/auth/login", handleLogin);
router.post("/login", handleLogin);

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
 * Change password
 */
router.post("/auth/change-password", authenticate, async (req: AuthenticatedRequest, res, next) => {
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

    // Update with new password
    const hashedPassword = hashPassword(newPassword);
    await db
      .update(usersTable)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(usersTable.id, user.id));

    return res.json({ message: "Password updated successfully." });
  } catch (err) {
    return next(err);
  }
});

/**
 * Mock Forgot Password Request
 */
router.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });

  // In production, we generate reset token and mail it. Here, we simulate mail logging
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase().trim()))
    .limit(1);

  // Return success message regardless of existence (standard security practice)
  return res.json({
    message: "If the email exists in our system, a password reset link has been dispatched.",
    debugToken: user ? signToken({ id: user.id, reset: true }) : null, // for testing convenience
  });
});

/**
 * Mock Reset Password Validation
 */
router.post("/auth/reset-password", async (req, res, next) => {
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
