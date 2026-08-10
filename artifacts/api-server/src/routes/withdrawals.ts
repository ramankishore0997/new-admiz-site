import { Router, Response, NextFunction } from "express";
import { db, pool, withdrawalsTable, usersTable, MIN_WITHDRAWAL_USD } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthenticatedRequest } from "../middlewares/auth";
import { logger } from "../lib/logger";
import * as telegramNotify from "../lib/telegram/service";

const router = Router();

// USDT payout address validation: TRON (T + 33 base58 chars) or EVM (0x + 40 hex)
const TRON_ADDR_REGEX = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
const EVM_ADDR_REGEX = /^0x[a-fA-F0-9]{40}$/;

function isValidUsdtAddress(addr: string): boolean {
  return TRON_ADDR_REGEX.test(addr) || EVM_ADDR_REGEX.test(addr);
}

/**
 * POST /api/withdrawals/request
 * Client requests a USDT withdrawal to their own address. Minimum $200.
 * The amount is frozen (excluded from available balance) as soon as the
 * request is created; it is released back if the admin rejects it.
 */
router.post("/withdrawals/request", authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    const { amount, usdtAddress } = req.body || {};

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 1000000) {
      return res.status(400).json({ error: "Please enter a valid withdrawal amount." });
    }

    const cleanAddress = String(usdtAddress || "").trim();
    if (!cleanAddress) {
      return res.status(400).json({ error: "Your USDT payout address is required." });
    }
    if (!isValidUsdtAddress(cleanAddress)) {
      return res.status(400).json({
        error: "Invalid USDT address. Use a TRON (T...) or EVM (0x...) address.",
      });
    }

    if (numericAmount < MIN_WITHDRAWAL_USD) {
      return res.status(400).json({
        error: `Minimum withdrawal amount is $${MIN_WITHDRAWAL_USD}. You can add more funds, then apply for a refund.`,
      });
    }

    // Available balance = verified deposits minus fees, loads and non-rejected withdrawals.
    const { rows } = await pool.query(
      `SELECT
         COALESCE((SELECT SUM(amount::numeric) FROM payments WHERE user_id=$1 AND status='PAID'),0) AS deposits,
         COALESCE((SELECT SUM(amount::numeric) FROM application_fees WHERE user_id=$1),0) AS fees,
         COALESCE((SELECT SUM(total::numeric) FROM account_loads WHERE user_id=$1),0) AS loads,
         COALESCE((SELECT SUM(amount::numeric) FROM withdrawals WHERE user_id=$1 AND status <> 'REJECTED'),0) AS frozen
       `,
      [userId],
    );
    const r = rows[0];
    const available = Math.round((Number(r.deposits) - Number(r.fees) - Number(r.loads) - Number(r.frozen)) * 100) / 100;

    if (numericAmount > available) {
      return res.status(400).json({
        error: `Insufficient available balance. Your available balance is $${available.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`,
      });
    }

    const requestId = `WDR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const [withdrawal] = await db
      .insert(withdrawalsTable)
      .values({
        requestId,
        userId,
        amount: String(numericAmount),
        usdtAddress: cleanAddress,
        status: "PENDING",
      })
      .returning();

    logger.info(`Withdrawal request created: ${requestId} by user ${userId} for $${numericAmount}`);

    // Telegram admin notification (fail-soft)
    const email = await telegramNotify.userEmail(userId);
    void telegramNotify.sendTelegramMessage(
      `🔸 New Withdrawal Request\nRequest: ${requestId}\nAmount: $${numericAmount} USDT\nUser: ${email}\nAddress: ${cleanAddress}\nStatus: PENDING`,
    );

    return res.status(201).json({
      message: `Withdrawal request submitted. You'll receive $${numericAmount} USDT at your address once approved by an administrator.`,
      requestId: withdrawal.requestId,
      status: withdrawal.status,
      createdAt: withdrawal.createdAt,
    });
  } catch (err: any) {
    logger.error(`Error creating withdrawal request: ${err?.message || err}`);
    return next(err);
  }
});

/**
 * GET /api/withdrawals/my
 * List the authenticated client's withdrawal requests
 */
router.get("/withdrawals/my", authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    const list = await db
      .select()
      .from(withdrawalsTable)
      .where(eq(withdrawalsTable.userId, userId))
      .orderBy(desc(withdrawalsTable.createdAt));

    return res.json(list);
  } catch (err: any) {
    logger.error(`Error fetching user withdrawals: ${err?.message || err}`);
    return next(err);
  }
});

/**
 * GET /api/admin/withdrawals
 * Admin list all withdrawal requests
 */
router.get("/admin/withdrawals", authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const list = await db
      .select({
        id: withdrawalsTable.id,
        requestId: withdrawalsTable.requestId,
        userId: withdrawalsTable.userId,
        userEmail: usersTable.email,
        companyName: usersTable.companyName,
        amount: withdrawalsTable.amount,
        usdtAddress: withdrawalsTable.usdtAddress,
        status: withdrawalsTable.status,
        rejectionReason: withdrawalsTable.rejectionReason,
        processedAt: withdrawalsTable.processedAt,
        createdAt: withdrawalsTable.createdAt,
      })
      .from(withdrawalsTable)
      .innerJoin(usersTable, eq(withdrawalsTable.userId, usersTable.id))
      .orderBy(desc(withdrawalsTable.createdAt));

    return res.json(list);
  } catch (err: any) {
    logger.error(`Error fetching admin withdrawals: ${err?.message || err}`);
    return next(err);
  }
});

/**
 * PATCH /api/admin/withdrawals/:id
 * Admin approves or rejects a withdrawal request
 */
router.patch("/admin/withdrawals/:id", authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const withdrawalId = Number(req.params.id);
    const status = req.body?.status;
    const rejectionReason = req.body?.rejectionReason;
    const adminId = req.userId;

    if (Number.isNaN(withdrawalId) || !adminId) {
      return res.status(400).json({ error: "Invalid withdrawal ID" });
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Action must be either APPROVED or REJECTED" });
    }

    const [withdrawal] = await db
      .select()
      .from(withdrawalsTable)
      .where(eq(withdrawalsTable.id, withdrawalId))
      .limit(1);

    if (!withdrawal) {
      return res.status(404).json({ error: "Withdrawal request not found." });
    }

    if (withdrawal.status !== "PENDING") {
      return res.status(400).json({ error: "This withdrawal request has already been processed." });
    }

    const [updated] = await db
      .update(withdrawalsTable)
      .set({
        status,
        rejectionReason: status === "REJECTED" ? (rejectionReason || "Rejected by administrator.") : null,
        processedBy: adminId,
        processedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(withdrawalsTable.id, withdrawalId))
      .returning();

    logger.info(`Withdrawal ID ${withdrawalId} status updated to ${status} by admin ${adminId}`);

    // Telegram client notification (fail-soft)
    const email = await telegramNotify.userEmail(withdrawal.userId);
    if (status === "APPROVED") {
      void telegramNotify.sendTelegramMessage(
        `✅ Withdrawal Approved\nRequest: ${withdrawal.requestId}\nAmount: $${withdrawal.amount} USDT\nAddress: ${withdrawal.usdtAddress}`,
      );
    } else {
      void telegramNotify.sendTelegramMessage(
        `❌ Withdrawal Rejected\nRequest: ${withdrawal.requestId}\nAmount: $${withdrawal.amount} USDT\nReason: ${updated.rejectionReason}`,
      );
    }

    return res.json(updated);
  } catch (err: any) {
    logger.error(`Error updating withdrawal: ${err?.message || err}`);
    return next(err);
  }
});

export default router;
