import { Router, Response, NextFunction } from "express";
import { db, pool, paymentsTable, usersTable, FIRST_DEPOSIT_MIN_USD, MIN_TOPUP_USD } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthenticatedRequest } from "../middlewares/auth";
import { logger } from "../lib/logger";
import * as telegramNotify from "../lib/telegram/service";

const router = Router();
const RECEIVING_WALLET = "0x5e094e9Fc46FF77D638682CcB50b6D3b6BFbd2d0";
const SUPPORTED_NETWORKS = ["bsc", "eth", "polygon", "arbitrum", "optimism"];

// EVM Transaction Hash Regex (0x followed by 64 hex characters)
const EVM_TX_REGEX = /^0x[a-fA-F0-9]{64}$/;

/**
 * POST /api/payments/submit-proof
 * Client submits manual USDT payment verification proof
 */
router.post("/payments/submit-proof", authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { amount, network, txHash, screenshotUrl, note } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthenticated" });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Valid payment amount is required." });
    }

    if (!network || !SUPPORTED_NETWORKS.includes(String(network).toLowerCase())) {
      return res.status(400).json({ error: `Selected network must be one of: ${SUPPORTED_NETWORKS.join(", ")}` });
    }

    const cleanTxHash = String(txHash || "").trim();
    if (!cleanTxHash || !EVM_TX_REGEX.test(cleanTxHash)) {
      return res.status(400).json({ error: "Invalid EVM Transaction Hash. Please provide a valid 66-character hex hash (starting with 0x)." });
    }

    const cleanScreenshot = String(screenshotUrl || "").trim();
    if (!cleanScreenshot) {
      return res.status(400).json({ error: "Payment screenshot proof is required." });
    }

    // Validate screenshot payload: data URL, MIME type (image), and size cap
    const screenshotMatch = /^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)$/.exec(cleanScreenshot);
    if (!screenshotMatch) {
      return res.status(400).json({ error: "Payment screenshot must be a valid PNG, JPEG, or WEBP image." });
    }
    if (screenshotMatch[2].length % 4 !== 0) {
      return res.status(400).json({ error: "Payment screenshot is corrupted or truncated." });
    }
    const approxBytes = Math.floor((screenshotMatch[2].length * 3) / 4);
    if (approxBytes > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Payment screenshot must not exceed 5 MB." });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 1000000) {
      return res.status(400).json({ error: "Payment amount must be a positive number within limits." });
    }
    // First-ever top-up has a $10 minimum (application fee); every later
    // deposit must be at least $100. No commission is charged on deposits —
    // the 2% commission applies when loading main-wallet balance into an ad
    // account (see Telegram admin "Load Balance" action).
    const { rows: priorRows } = await pool.query<{ n: string }>(
      "SELECT COUNT(*)::int AS n FROM payments WHERE user_id=$1 AND status IN ('PENDING_VERIFICATION','PAID')",
      [userId],
    );
    const isFirstDeposit = Number(priorRows[0]?.n || 0) === 0;
    const minTopup = isFirstDeposit ? FIRST_DEPOSIT_MIN_USD : MIN_TOPUP_USD;
    if (numericAmount < minTopup) {
      return res
        .status(400)
        .json({
          error: "Top-up amount is below the minimum allowed. Deposits are commission-free — the full amount is credited to your main wallet.",
        });
    }

    // Check for duplicate TXID
    const [existingTx] = await db
      .select({ id: paymentsTable.id })
      .from(paymentsTable)
      .where(eq(paymentsTable.txHash, cleanTxHash))
      .limit(1);

    if (existingTx) {
      return res.status(400).json({ error: "This Transaction Hash (TXID) has already been submitted for verification." });
    }

    const orderId = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const [payment] = await db
      .insert(paymentsTable)
      .values({
        orderId,
        userId,
        amount: String(numericAmount),
        currency: "USDT",
        network: String(network).toLowerCase(),
        receivingAddress: RECEIVING_WALLET,
        txHash: cleanTxHash,
        screenshotUrl: cleanScreenshot,
        note: note ? String(note).slice(0, 500) : null,
        status: "PENDING_VERIFICATION",
      })
      .returning();

    logger.info(`Payment proof submitted: ${orderId} by user ${userId} with TXID ${cleanTxHash}`);

    // Telegram admin notification (fail-soft)
    const email = await telegramNotify.userEmail(userId);
    void telegramNotify.notifyPaymentProof(payment, { id: userId, email });

    return res.status(201).json({
      message: "Payment proof submitted successfully. Your payment is pending verification.",
      orderId: payment.orderId,
      status: payment.status,
      createdAt: payment.createdAt,
    });
  } catch (err: any) {
    logger.error(`Error submitting payment proof: ${err?.message || err}`);
    return next(err);
  }
});

/**
 * GET /api/payments/my-payments
 * List active user's payment verifications
 */
router.get("/payments/my-payments", authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    const list = await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.userId, userId))
      .orderBy(desc(paymentsTable.createdAt));

    return res.json(list);
  } catch (err: any) {
    logger.error(`Error fetching user payments: ${err?.message || err}`);
    return next(err);
  }
});

/**
 * GET /api/admin/payments
 * Admin list all payment verification requests
 */
router.get("/admin/payments", authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const list = await db
      .select({
        id: paymentsTable.id,
        orderId: paymentsTable.orderId,
        userId: paymentsTable.userId,
        userEmail: usersTable.email,
        companyName: usersTable.companyName,
        amount: paymentsTable.amount,
        currency: paymentsTable.currency,
        network: paymentsTable.network,
        receivingAddress: paymentsTable.receivingAddress,
        txHash: paymentsTable.txHash,
        screenshotUrl: paymentsTable.screenshotUrl,
        note: paymentsTable.note,
        status: paymentsTable.status,
        rejectionReason: paymentsTable.rejectionReason,
        verifiedAt: paymentsTable.verifiedAt,
        createdAt: paymentsTable.createdAt,
      })
      .from(paymentsTable)
      .innerJoin(usersTable, eq(paymentsTable.userId, usersTable.id))
      .orderBy(desc(paymentsTable.createdAt));

    return res.json(list);
  } catch (err: any) {
    logger.error(`Error fetching admin payments: ${err?.message || err}`);
    return next(err);
  }
});

/**
 * PATCH /api/admin/payments/:id/verify
 * Admin approve or reject manual payment submission
 */
router.patch("/admin/payments/:id/verify", authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const paymentId = Number(req.params.id);
    const status = req.body?.status;
    const rejectionReason = req.body?.rejectionReason;
    const adminId = req.userId;

    if (Number.isNaN(paymentId) || !adminId) {
      return res.status(400).json({ error: "Invalid payment ID" });
    }

    if (!["PAID", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Action must be either PAID or REJECTED" });
    }

    const [payment] = await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.id, paymentId))
      .limit(1);

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found." });
    }

    const [updated] = await db
      .update(paymentsTable)
      .set({
        status,
        rejectionReason: status === "REJECTED" ? (rejectionReason || "Verification failed.") : null,
        verifiedBy: adminId,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(paymentsTable.id, paymentId))
      .returning();

    logger.info(`Payment ID ${paymentId} status updated to ${status} by admin ${adminId}`);

    // Telegram admin notification (fail-soft) — also covers web-admin changes
    const email = await telegramNotify.userEmail(payment.userId);
    if (status === "PAID") {
      void telegramNotify.notifyPaymentApproved(updated, { id: payment.userId, email });
    } else {
      void telegramNotify.notifyPaymentRejected(updated, { id: payment.userId, email }, rejectionReason || "Verification failed.");
    }

    return res.json(updated);
  } catch (err: any) {
    logger.error(`Error updating payment verification: ${err?.message || err}`);
    return next(err);
  }
});

export default router;
