import {
  db,
  telegramNotificationEventsTable,
  usersTable,
  type User,
} from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { tgClient, isBotConfigured, logTelegramError } from "./client";
import { truncate, truncateMiddle } from "./format";

export type TgUserRef = { id: number; email: string };
export type TgAppRef = { id: number; publicId: string; status?: string; advertisingInfo?: { platform?: string } | null };
export type TgPaymentRef = { id: number; orderId: string; amount: string; currency: string; network: string; txHash: string };

export async function userEmail(userId: number): Promise<string> {
  try {
    const [u] = await db.select({ email: usersTable.email }).from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    return u?.email || `#${userId}`;
  } catch {
    return `#${userId}`;
  }
}

/**
 * Centralized Telegram notification service.
 *
 * - Every function is fail-soft: it NEVER throws into the caller, so the
 *   website keeps working even if the Telegram API is down.
 * - Each delivery attempt is recorded in telegram_notification_events.
 * - No sensitive data (passwords, tokens, credentials, full stack traces) is
 *   ever included in messages.
 */

const ADMIN_CHAT = () => process.env.TELEGRAM_ADMIN_CHAT_ID;

async function recordEvent(event: string, success: boolean, payload: unknown, error?: string) {
  try {
    await db.insert(telegramNotificationEventsTable).values({
      event,
      success,
      payload: payload as any,
      error: error ? truncate(error, 300) : null,
    });
  } catch {
    // table missing or DB down — never break the request flow
  }
}

export async function sendTelegramMessage(text: string): Promise<boolean> {
  const chatId = ADMIN_CHAT();
  if (!isBotConfigured() || !chatId) return false;
  try {
    await tgClient.sendMessage(chatId, text);
    return true;
  } catch (err: any) {
    logTelegramError("sendTelegramMessage", err);
    return false;
  }
}

export async function sendTelegramPhoto(photo: Buffer, caption: string): Promise<boolean> {
  const chatId = ADMIN_CHAT();
  if (!isBotConfigured() || !chatId) return false;
  try {
    await tgClient.sendPhoto(chatId, photo, truncate(caption, 900));
    return true;
  } catch (err: any) {
    logTelegramError("sendTelegramPhoto", err);
    return false;
  }
}

export async function notifyNewUser(user: User): Promise<void> {
  const ok = await sendTelegramMessage(
    `🆕 NEW USER\n\nID: #${user.id}\nEmail: ${user.email}\nCompany: ${user.companyName || "-"}\nRegistered: ${user.createdAt?.toISOString?.()?.slice(0, 16).replace("T", " ") || "-"}`,
  );
  await recordEvent("NEW_USER", ok, { userId: user.id, email: user.email });
}

export async function notifyNewRequest(app: TgAppRef, user: TgUserRef): Promise<void> {
  const ok = await sendTelegramMessage(
    `📋 NEW REQUEST\n\nID: ${app.publicId}\nUser: ${user.email}\nPlatform: ${app.advertisingInfo?.platform || "-"}\nStatus: SUBMITTED`,
  );
  await recordEvent("NEW_REQUEST", ok, { applicationId: app.id, publicId: app.publicId, userId: user.id });
}

export async function notifyPaymentProof(payment: TgPaymentRef, user: TgUserRef): Promise<void> {
  const ok = await sendTelegramMessage(
    `💳 PAYMENT PROOF\n\nOrder: ${payment.orderId}\nUser: ${user.email}\nAmount: ${payment.amount} ${payment.currency}\nNetwork: ${payment.network.toUpperCase()}\nTXID: ${truncateMiddle(payment.txHash)}\nStatus: PENDING VERIFICATION`,
  );
  await recordEvent("PAYMENT_PROOF", ok, { paymentId: payment.id, orderId: payment.orderId, userId: user.id });
}

export async function notifyPaymentApproved(payment: TgPaymentRef, user: TgUserRef): Promise<void> {
  const ok = await sendTelegramMessage(
    `✅ PAYMENT APPROVED\n\nOrder: ${payment.orderId}\nUser: ${user.email}\nAmount: ${payment.amount} ${payment.currency}\nApproved: now`,
  );
  await recordEvent("PAYMENT_APPROVED", ok, { paymentId: payment.id, orderId: payment.orderId, userId: user.id });
}

export async function notifyPaymentRejected(payment: TgPaymentRef, user: TgUserRef, reason: string): Promise<void> {
  const ok = await sendTelegramMessage(
    `❌ PAYMENT REJECTED\n\nOrder: ${payment.orderId}\nUser: ${user.email}\nAmount: ${payment.amount} ${payment.currency}\nReason: ${truncate(reason, 150)}`,
  );
  await recordEvent("PAYMENT_REJECTED", ok, { paymentId: payment.id, orderId: payment.orderId, userId: user.id, reason });
}

export async function notifyRequestStatusChange(app: TgAppRef, user: TgUserRef): Promise<void> {
  const ok = await sendTelegramMessage(
    `🔄 REQUEST UPDATED\n\nID: ${app.publicId}\nUser: ${user.email}\nStatus: ${app.status || "-"}`,
  );
  await recordEvent("REQUEST_STATUS_CHANGE", ok, { applicationId: app.id, publicId: app.publicId, userId: user.id, status: app.status || null });
}

/**
 * Report a critical backend error to the admin chat. Never includes secrets or
 * full stack traces — only service/endpoint/error message/timestamp.
 */
export async function notifySystemError(ctx: { service: string; endpoint?: string; error: string }): Promise<void> {
  const ok = await sendTelegramMessage(
    `🚨 SYSTEM ERROR\n\nService: ${ctx.service}\nEndpoint: ${ctx.endpoint || "-"}\nError: ${truncate(ctx.error, 300)}\nTime: ${new Date().toISOString()}`,
  );
  await recordEvent("SYSTEM_ERROR", ok, { service: ctx.service, endpoint: ctx.endpoint || null, error: truncate(ctx.error, 300) });
}

/** Optional one-shot retry of a pending/failed important notification. */
export async function retryFailedNotification(): Promise<void> {
  try {
    const [last] = await db
      .select()
      .from(telegramNotificationEventsTable)
      .where(eq(telegramNotificationEventsTable.success, false))
      .orderBy(desc(telegramNotificationEventsTable.id))
      .limit(1);
    if (!last) return;
    const ok = await sendTelegramMessage(`🔁 RETRY (${last.event}): ${truncate(JSON.stringify(last.payload || {}), 200)}`);
    if (ok) {
      await db
        .update(telegramNotificationEventsTable)
        .set({ success: true, error: null })
        .where(eq(telegramNotificationEventsTable.id, last.id));
    }
  } catch {
    // fail-soft
  }
}

