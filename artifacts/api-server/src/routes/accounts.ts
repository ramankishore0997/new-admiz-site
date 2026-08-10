import { Router } from "express";
import { db, pool, accountsTable, accountLoadsTable, notificationsTable, MIN_LOAD_USD, loadCommissionRate } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { authenticate, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

/** Main wallet = full paid deposits − application fees − previous loads − frozen withdrawals. */
async function getLedgerBalance(userId: number): Promise<number> {
  const { rows } = await pool.query<{ paid: string; fees: string; loads: string; withdrawals: string }>(
    `SELECT
      (SELECT COALESCE(SUM(amount::numeric), 0) FROM payments WHERE user_id=$1 AND status='PAID')::numeric AS paid,
      (SELECT COALESCE(SUM(amount::numeric), 0) FROM application_fees WHERE user_id=$1)::numeric AS fees,
      (SELECT COALESCE(SUM(total::numeric), 0) FROM account_loads WHERE user_id=$1)::numeric AS loads,
      (SELECT COALESCE(SUM(amount::numeric), 0) FROM withdrawals WHERE user_id=$1 AND status <> 'REJECTED')::numeric AS withdrawals`,
    [userId],
  );
  const r = rows[0] || { paid: "0", fees: "0", loads: "0", withdrawals: "0" };
  return Math.round((Number(r.paid) - Number(r.fees) - Number(r.loads) - Number(r.withdrawals)) * 100) / 100;
}

/**
 * GET /api/accounts/:id — client's own ad account detail
 */
router.get("/accounts/:id", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const accId = Number(req.params.id);
    if (Number.isNaN(accId)) return res.status(400).json({ error: "Invalid account ID." });

    const [acc] = await db
      .select()
      .from(accountsTable)
      .where(and(eq(accountsTable.id, accId), eq(accountsTable.userId, req.userId || 0)))
      .limit(1);

    if (!acc) return res.status(404).json({ error: "Account not found." });

    return res.json({
      id: acc.id,
      accountId: acc.accountId,
      platform: acc.platform,
      name: acc.name,
      status: acc.status,
      spendLimit: acc.spendLimit,
      balance: Number(acc.balance) || 0,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /api/accounts/:id/load — load funds from the main wallet into an ad
 * account wallet. A tiered service fee is added on top (3% under $100,
 * 2% from $100–$1,000, 1.5% above $1,000).
 */
router.post("/accounts/:id/load", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const accId = Number(req.params.id);
    if (Number.isNaN(accId)) return res.status(400).json({ error: "Invalid account ID." });

    const amount = Number(req.body?.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "Enter a valid load amount." });
    }
    if (amount < MIN_LOAD_USD) {
      return res.status(400).json({ error: `Load amount is below the minimum allowed ($${MIN_LOAD_USD}).` });
    }

    const [acc] = await db
      .select()
      .from(accountsTable)
      .where(and(eq(accountsTable.id, accId), eq(accountsTable.userId, userId)))
      .limit(1);

    if (!acc) return res.status(404).json({ error: "Account not found." });
    if (acc.status !== "ACTIVE" && acc.status !== "APPROVED") {
      return res.status(400).json({ error: "This ad account is not active yet." });
    }

    const rate = loadCommissionRate(amount);
    const commission = Math.round(amount * rate * 100) / 100;
    const total = Math.round((amount + commission) * 100) / 100;
    const ratePct = Math.round(rate * 1000) / 10;

    const ledger = await getLedgerBalance(userId);
    if (ledger < total) {
      return res.status(402).json({
        error: `Insufficient main-wallet balance. Load $${amount} needs $${total} (includes $${commission} service fee) — available: $${ledger}.`,
      });
    }

    const newBalance = Math.round((Number(acc.balance || 0) + amount) * 100) / 100;

    await db
      .update(accountsTable)
      .set({ balance: String(newBalance), updatedAt: new Date() })
      .where(eq(accountsTable.id, accId));

    await db.insert(accountLoadsTable).values({
      userId,
      accountId: accId,
      amount: String(amount),
      commission: String(commission),
      total: String(total),
      description: `$${amount} loaded into ${acc.platform} ad account (${acc.name || acc.accountId})`,
      loadedBy: null,
    });

    // Site notification (fail-soft)
    try {
      await db.insert(notificationsTable).values({
        userId,
        title: "Balance Loaded 💰",
        message:
          acc.status === "APPROVED"
            ? `$${amount} loaded into your ${acc.platform} ad account (${acc.name || acc.accountId}). Topup complete — an administrator will now assign your Business Manager access. $${commission} service fee (${ratePct}%) — $${total} deducted from your main wallet.`
            : `$${amount} loaded into your ${acc.platform} ad account (${acc.name || acc.accountId}). $${commission} service fee (${ratePct}%) — $${total} deducted from your main wallet.`,
      });
    } catch (err) {
      console.error("Failed to insert load notification", err);
    }

    return res.json({ success: true, amount, commission, total, accountBalance: newBalance, mainWalletBalance: Math.round((ledger - total) * 100) / 100 });
  } catch (err) {
    return next(err);
  }
});

export default router;
