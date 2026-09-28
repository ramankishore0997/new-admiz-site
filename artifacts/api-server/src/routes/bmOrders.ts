import { Router } from "express";
import {
  db,
  pool,
  bmOrdersTable,
  usersTable,
  notificationsTable,
  paymentsTable,
  applicationFeesTable,
  accountLoadsTable,
  withdrawalsTable,
  type BmOrder
} from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthenticatedRequest } from "../middlewares/auth";
import * as telegramNotify from "../lib/telegram/service";

const router = Router();

export interface BmPackage {
  id: string;
  name: string;
  platform: string;
  price: number;
  category: "meta";
  badge: string;
  description: string;
  features: string[];
  stockReady: number;
}

export const BM_CATALOG: BmPackage[] = [
  {
    id: "meta-bm3-business-manager",
    name: "Meta BM3 Business Manager",
    platform: "Meta Ads (Facebook & IG)",
    price: 3,
    category: "meta",
    badge: "BM3 Special",
    description: "Active BM3 Business Manager configured with 3 ad accounts limit capacity and direct admin invite.",
    features: [
      "3 Ad Account Creation Capacity (BM3)",
      "Direct Admin Role Invitation Link",
      "Pixel, Domain & Asset Sharing Ready",
      "Clean Compliance Trust Rating",
      "Rapid Replacement Protection SLA"
    ],
    stockReady: 25,
  },
  {
    id: "meta-standard-agency-bm",
    name: "Meta Standard Agency BM",
    platform: "Meta Ads (Facebook & IG)",
    price: 7,
    category: "meta",
    badge: "Starter Choice",
    description: "Active agency Business Manager ready for immediate campaign launch and pixel connection.",
    features: [
      "Immediate Campaign & Pixel Binding",
      "Clean Policy Trust Rating",
      "Direct Admin Role Invitation Link",
      "Rapid Replacement Protection SLA",
      "2FA & Security Guard Enabled"
    ],
    stockReady: 18,
  },
  {
    id: "meta-reinstated-active-bm",
    name: "Meta Reinstated Active BM",
    platform: "Meta Ads (Facebook & IG)",
    price: 9,
    category: "meta",
    badge: "Most Popular",
    description: "Reinstated high-trust Business Manager with warm compliance score and multi-account expansion readiness.",
    features: [
      "Multi-Ad Account Spawning (Up to 3-5 Lines)",
      "Reinstated Compliance Status (Zero Friction)",
      "Accelerated Ad Approval Velocity",
      "Direct Admin Role Invitation Link",
      "Immediate Replacement Guarantee"
    ],
    stockReady: 14,
  },
  {
    id: "meta-enterprise-unlimited-bm",
    name: "Meta Enterprise Unlimited BM",
    platform: "Meta Ads (Facebook & IG)",
    price: 12,
    category: "meta",
    badge: "Maximum Scale",
    description: "Enterprise tier Business Manager configured for uncapped daily spend and high-volume media buying.",
    features: [
      "High / Uncapped Daily Spend Limit Capacity",
      "Multi-Ad Account Creation Permissions",
      "Unlimited Pixel, Domain & CAPI Integrations",
      "Dedicated Escalation Route",
      "Instant Admin Role Invitation Link",
      "Full Replacement Protection SLA"
    ],
    stockReady: 9,
  }
];

/**
 * Helper to calculate user's live available balance
 */
async function getUserAvailableBalance(userId: number): Promise<number> {
  const { rows } = await pool.query(
    `SELECT 
      ROUND(
        COALESCE((SELECT SUM(amount::numeric) FROM payments WHERE user_id = $1 AND status = 'PAID'), 0)
        - COALESCE((SELECT SUM(amount::numeric) FROM application_fees WHERE user_id = $1), 0)
        - COALESCE((SELECT SUM(total::numeric) FROM account_loads WHERE user_id = $1), 0)
        - COALESCE((SELECT SUM(amount::numeric) FROM withdrawals WHERE user_id = $1 AND status <> 'REJECTED'), 0)
        - COALESCE((SELECT SUM(price::numeric) FROM bm_orders WHERE user_id = $1 AND status <> 'CANCELLED'), 0)
      , 2)::float AS balance`,
    [userId]
  );
  return Number(rows[0]?.balance || 0);
}

/**
 * GET /api/bm-orders/catalog
 * Public catalog of available Business Managers
 */
router.get("/bm-orders/catalog", (_req, res) => {
  return res.json(BM_CATALOG);
});

/**
 * POST /api/bm-orders/buy
 * Client purchases a Business Manager using available wallet balance
 */
router.post("/bm-orders/buy", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { packageId, quantity: rawQuantity = 1 } = req.body || {};
    if (!packageId) {
      return res.status(400).json({ error: "Package ID is required." });
    }

    const pkg = BM_CATALOG.find((p) => p.id === packageId);
    if (!pkg) {
      return res.status(404).json({ error: "Business Manager package not found." });
    }

    // Validate quantity between 1 and 500
    const parsedQty = parseInt(String(rawQuantity), 10);
    const quantity = Math.max(1, Math.min(500, Number.isNaN(parsedQty) ? 1 : parsedQty));
    const totalPrice = Number((pkg.price * quantity).toFixed(2));

    // Check client balance
    const availableBalance = await getUserAvailableBalance(userId);
    if (availableBalance < totalPrice) {
      return res.status(402).json({
        error: `Insufficient wallet balance. Total (${quantity}x @ $${pkg.price}): $${totalPrice} USDT, Available: $${availableBalance.toFixed(2)} USDT. Please add funds to your wallet to complete purchase.`,
        requiredAmount: totalPrice,
        unitPrice: pkg.price,
        quantity,
        currentBalance: availableBalance,
      });
    }

    // Generate unique BM Order ID
    const stamp = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    const orderId = `BMO-${new Date().getFullYear()}-${stamp}${rand}`;

    const [order] = await db
      .insert(bmOrdersTable)
      .values({
        orderId,
        userId,
        bmPackageId: pkg.id,
        bmPackageName: pkg.name,
        platform: pkg.platform,
        quantity,
        unitPrice: String(pkg.price),
        price: String(totalPrice),
        currency: "USDT",
        status: "PENDING_DELIVERY",
      })
      .returning();

    // In-app notification
    await db.insert(notificationsTable).values({
      userId,
      title: "Business Manager Order Placed 🎯",
      message: `Your order for ${quantity}x ${pkg.name} (#${orderId}) for $${totalPrice} USDT has been placed. Our administration team is generating and whitelisting your invite links.`,
    });

    // Telegram admin alert (fail-soft)
    const [user] = await db
      .select({ email: usersTable.email, username: usersTable.username, telegramHandle: usersTable.telegramHandle })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    const clientEmail = user?.email || `User #${userId}`;
    const tgHandle = user?.telegramHandle ? `@${user.telegramHandle}` : "Not provided";

    void telegramNotify.sendTelegramMessage(
      `🚨 NEW BUSINESS MANAGER ORDER!\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Order ID: ${orderId}\n` +
      `• Package: ${pkg.name}\n` +
      `• Quantity: ${quantity} Line(s)\n` +
      `• Unit Price: $${pkg.price} USDT\n` +
      `• Total Paid: $${totalPrice} USDT\n` +
      `• Platform: ${pkg.platform}\n` +
      `• Client: ${clientEmail} (${user?.username || "Client"})\n` +
      `• Telegram: ${tgHandle}\n` +
      `• Status: ⏳ Pending Admin Invite Link\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👉 Go to Admin Panel -> BM Orders to assign invite link.`
    );

    const newBalance = await getUserAvailableBalance(userId);

    return res.status(201).json({
      success: true,
      order: {
        ...order,
        inviteLink: null, // Hidden until DELIVERED
      },
      newBalance,
      message: `Order for ${quantity}x ${pkg.name} placed successfully! Admin team will dispatch your invite link shortly.`,
    });
  } catch (err) {
    return next(err);
  }
});

const RECEIVING_WALLET = "0x5e094e9Fc46FF77D638682CcB50b6D3b6BFbd2d0";
const TRON_WALLET = "TTfpa75gZowYgmvJHeYqzfBBRMV9WP8k9w";
const SUPPORTED_NETWORKS = ["bsc", "eth", "polygon", "arbitrum", "optimism", "tron"];
const EVM_TX_REGEX = /^0x[a-fA-F0-9]{64}$/;
const TRON_TX_REGEX = /^[a-fA-F0-9]{64}$/;

/**
 * POST /api/bm-orders/buy-direct
 * Client purchases a Business Manager by direct crypto payment (no wallet balance deposit needed)
 */
router.post("/bm-orders/buy-direct", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { packageId, quantity: rawQuantity = 1, network, txHash, screenshotUrl, note } = req.body || {};

    if (!packageId) {
      return res.status(400).json({ error: "Package ID is required." });
    }

    const pkg = BM_CATALOG.find((p) => p.id === packageId);
    if (!pkg) {
      return res.status(404).json({ error: "Business Manager package not found." });
    }

    // Validate quantity
    const parsedQty = parseInt(String(rawQuantity), 10);
    const quantity = Math.max(1, Math.min(500, Number.isNaN(parsedQty) ? 1 : parsedQty));
    const totalPrice = Number((pkg.price * quantity).toFixed(2));

    // Validate network
    const cleanNetwork = String(network || "").toLowerCase().trim();
    if (!cleanNetwork || !SUPPORTED_NETWORKS.includes(cleanNetwork)) {
      return res.status(400).json({ error: `Selected network must be one of: ${SUPPORTED_NETWORKS.join(", ")}` });
    }

    // Validate TXID
    const cleanTxHash = String(txHash || "").trim();
    const isTron = cleanNetwork === "tron";
    if (!cleanTxHash || (isTron ? !TRON_TX_REGEX.test(cleanTxHash) : !EVM_TX_REGEX.test(cleanTxHash))) {
      return res.status(400).json({
        error: isTron
          ? "Invalid Tron Transaction Hash. Please provide a valid 64-character hex hash."
          : "Invalid EVM Transaction Hash. Please provide a valid 66-character hex hash starting with 0x.",
      });
    }

    // Validate screenshot
    const cleanScreenshot = String(screenshotUrl || "").trim();
    if (!cleanScreenshot) {
      return res.status(400).json({ error: "Payment confirmation screenshot is required." });
    }
    const screenshotMatch = /^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)$/.exec(cleanScreenshot);
    if (!screenshotMatch) {
      return res.status(400).json({ error: "Payment screenshot must be a valid PNG, JPEG, or WEBP image." });
    }
    const approxBytes = Math.floor((screenshotMatch[2].length * 3) / 4);
    if (approxBytes > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Payment screenshot must not exceed 5 MB." });
    }

    // Check duplicate TXID
    const [existingTx] = await db
      .select({ id: paymentsTable.id })
      .from(paymentsTable)
      .where(eq(paymentsTable.txHash, cleanTxHash))
      .limit(1);

    if (existingTx) {
      return res.status(400).json({ error: "This Transaction Hash (TXID) has already been submitted." });
    }

    // Generate IDs
    const stamp = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    const orderId = `BMO-${new Date().getFullYear()}-${stamp}${rand}`;
    const payOrderId = `PAY-BM-${Date.now()}-${rand}`;

    // Record direct payment in payments ledger (marked PAID to balance the ledger against the BM order)
    await db.insert(paymentsTable).values({
      orderId: payOrderId,
      userId,
      amount: String(totalPrice),
      network: cleanNetwork,
      txHash: cleanTxHash,
      screenshotUrl: cleanScreenshot,
      status: "PAID",
      note: `Direct BM Purchase: ${quantity}x ${pkg.name} (#${orderId})${note ? ` - ${String(note).trim()}` : ""}`,
    });

    // Record BM Order
    const [order] = await db
      .insert(bmOrdersTable)
      .values({
        orderId,
        userId,
        bmPackageId: pkg.id,
        bmPackageName: pkg.name,
        platform: pkg.platform,
        quantity,
        unitPrice: String(pkg.price),
        price: String(totalPrice),
        currency: "USDT",
        status: "PENDING_DELIVERY",
        deliveryNotes: `Direct Crypto Payment via ${cleanNetwork.toUpperCase()} (TXID: ${cleanTxHash})`,
      })
      .returning();

    // In-app notification
    await db.insert(notificationsTable).values({
      userId,
      title: "Direct Business Manager Order Placed 🎯",
      message: `Your direct order for ${quantity}x ${pkg.name} (#${orderId}) for $${totalPrice} USDT has been submitted. Our team is generating and whitelisting your invite links.`,
    });

    // Telegram admin alert
    const [user] = await db
      .select({ email: usersTable.email, username: usersTable.username, telegramHandle: usersTable.telegramHandle })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    const clientEmail = user?.email || `User #${userId}`;
    const tgHandle = user?.telegramHandle ? `@${user.telegramHandle}` : "Not provided";

    void telegramNotify.sendTelegramMessage(
      `🚨 NEW DIRECT CRYPTO BUSINESS MANAGER ORDER!\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Order ID: ${orderId}\n` +
      `• Payment Ref: ${payOrderId}\n` +
      `• Package: ${pkg.name}\n` +
      `• Quantity: ${quantity} Line(s)\n` +
      `• Total Paid: $${totalPrice} USDT\n` +
      `• Payment Method: 💎 Direct USDT (${cleanNetwork.toUpperCase()})\n` +
      `• TXID: ${cleanTxHash}\n` +
      `• Client: ${clientEmail} (${user?.username || "Client"})\n` +
      `• Telegram: ${tgHandle}\n` +
      `• Status: ⏳ Pending Admin Invite Link\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👉 Go to Admin Panel -> BM Orders to assign invite link.`
    );

    const newBalance = await getUserAvailableBalance(userId);

    return res.status(201).json({
      success: true,
      order: {
        ...order,
        inviteLink: null,
      },
      newBalance,
      message: `Direct payment submitted! Order for ${quantity}x ${pkg.name} is placed. Admin will dispatch your invite link shortly.`,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/bm-orders/my
 * List client's BM orders
 */
router.get("/bm-orders/my", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const orders = await db
      .select()
      .from(bmOrdersTable)
      .where(eq(bmOrdersTable.userId, userId))
      .orderBy(desc(bmOrdersTable.id));

    // Sanitize inviteLink: only visible if DELIVERED
    const sanitized = orders.map((o) => ({
      ...o,
      inviteLink: o.status === "DELIVERED" ? o.inviteLink : null,
    }));

    return res.json(sanitized);
  } catch (err) {
    return next(err);
  }
});

/**
 * ADMIN: GET /api/admin/bm-orders
 * List all BM orders with client details
 */
router.get("/admin/bm-orders", authenticate, requireAdmin, async (_req: AuthenticatedRequest, res, next) => {
  try {
    const list = await db
      .select({
        id: bmOrdersTable.id,
        orderId: bmOrdersTable.orderId,
        userId: bmOrdersTable.userId,
        bmPackageId: bmOrdersTable.bmPackageId,
        bmPackageName: bmOrdersTable.bmPackageName,
        platform: bmOrdersTable.platform,
        quantity: bmOrdersTable.quantity,
        unitPrice: bmOrdersTable.unitPrice,
        price: bmOrdersTable.price,
        currency: bmOrdersTable.currency,
        status: bmOrdersTable.status,
        inviteLink: bmOrdersTable.inviteLink,
        deliveryNotes: bmOrdersTable.deliveryNotes,
        deliveredBy: bmOrdersTable.deliveredBy,
        deliveredAt: bmOrdersTable.deliveredAt,
        createdAt: bmOrdersTable.createdAt,
        updatedAt: bmOrdersTable.updatedAt,
        userEmail: usersTable.email,
        username: usersTable.username,
        companyName: usersTable.companyName,
        telegramHandle: usersTable.telegramHandle,
      })
      .from(bmOrdersTable)
      .innerJoin(usersTable, eq(bmOrdersTable.userId, usersTable.id))
      .orderBy(desc(bmOrdersTable.id));

    return res.json(list);
  } catch (err) {
    return next(err);
  }
});

/**
 * ADMIN: POST /api/admin/bm-orders/:id/deliver
 * Admin assigns BM invite link and marks order DELIVERED
 */
router.post("/admin/bm-orders/:id/deliver", authenticate, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const adminId = req.userId || 0;
    const { inviteLink, deliveryNotes } = req.body || {};

    if (Number.isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID." });
    }

    const cleanLink = String(inviteLink || "").trim();
    if (!cleanLink) {
      return res.status(400).json({ error: "Business Manager invite link is required." });
    }

    const [order] = await db
      .select()
      .from(bmOrdersTable)
      .where(eq(bmOrdersTable.id, orderId))
      .limit(1);

    if (!order) {
      return res.status(404).json({ error: "BM Order record not found." });
    }

    const [updated] = await db
      .update(bmOrdersTable)
      .set({
        inviteLink: cleanLink,
        deliveryNotes: deliveryNotes ? String(deliveryNotes).trim() : null,
        status: "DELIVERED",
        deliveredBy: adminId,
        deliveredAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bmOrdersTable.id, orderId))
      .returning();

    // Client in-app notification
    await db.insert(notificationsTable).values({
      userId: order.userId,
      title: "Business Manager Invite Delivered 🚀",
      message: `Your Business Manager invite link for ${order.bmPackageName} (#${order.orderId}) is now active. Open the BM Store page to claim your access.`,
    });

    // Telegram notification
    const [client] = await db
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.id, order.userId))
      .limit(1);

    void telegramNotify.sendTelegramMessage(
      `✅ BM ORDER DELIVERED!\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Order ID: ${order.orderId}\n` +
      `• Package: ${order.bmPackageName}\n` +
      `• Client: ${client?.email || "User #" + order.userId}\n` +
      `• Status: DELIVERED\n` +
      `• Invite Link: ${cleanLink}`
    );

    return res.json({
      success: true,
      order: updated,
      message: "Business Manager invite link delivered successfully!",
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * ADMIN: POST /api/admin/bm-orders/:id/cancel
 * Admin cancels order & auto-refunds client wallet balance
 */
router.post("/admin/bm-orders/:id/cancel", authenticate, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const { reason } = req.body || {};

    if (Number.isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID." });
    }

    const [order] = await db
      .select()
      .from(bmOrdersTable)
      .where(eq(bmOrdersTable.id, orderId))
      .limit(1);

    if (!order) {
      return res.status(404).json({ error: "BM Order record not found." });
    }

    const [updated] = await db
      .update(bmOrdersTable)
      .set({
        status: "CANCELLED",
        deliveryNotes: reason ? `Cancelled by admin: ${String(reason).trim()}` : "Cancelled by admin",
        updatedAt: new Date(),
      })
      .where(eq(bmOrdersTable.id, orderId))
      .returning();

    // Client in-app notification
    await db.insert(notificationsTable).values({
      userId: order.userId,
      title: "Business Manager Order Cancelled & Refunded",
      message: `Your BM order #${order.orderId} was cancelled. $${order.price} USDT has been credited back to your available balance.`,
    });

    return res.json({
      success: true,
      order: updated,
      message: "Order cancelled and funds released back to client wallet.",
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
