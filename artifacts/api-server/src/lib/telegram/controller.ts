import {
  db,
  pool,
  usersTable,
  applicationsTable,
  applicationTimelineTable,
  documentsTable,
  paymentsTable,
  accountsTable,
  notificationsTable,
  auditLogsTable,
  telegramAdminActionsTable,
  telegramNotificationEventsTable,
  type Application,
  type Payment,
} from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { tgClient, type TelegramUpdate, type ReplyMarkup, logTelegramError } from "./client";
import { explorerLink, truncateMiddle, truncate, formatDate, statusEmoji } from "./format";
import { sendTelegramPhoto, notifyPaymentApproved, notifyPaymentRejected, notifyRequestStatusChange } from "./service";
import { logger } from "../logger";

const PAGE_SIZE = 8;
const REASON_MAX = 500;

type Btn = { text: string; callback_data: string };
const btn = (text: string, data: string): Btn => ({ text, callback_data: data });
const kb = (rows: Btn[][]): ReplyMarkup => ({ inline_keyboard: rows });
const mainRow = (): Btn[] => [btn("🏠 Main Menu", "menu")];
const backRow = (data: string): Btn[] => [btn("⬅️ Back", data), btn("🏠 Main Menu", "menu")];

/** Numeric Telegram chat ID authorization — the only admin credential. */
function isAdminChat(chatId: number): boolean {
  return process.env.TELEGRAM_ADMIN_CHAT_ID === String(chatId);
}

interface FlowState {
  flow: "pay_rej" | "req_rej" | "req_info" | "req_docs";
  entityId: number;
  reason?: string;
}
const flows = new Map<number, FlowState>();

// ---------------------------------------------------------------------------
// Audit helpers
// ---------------------------------------------------------------------------

async function logAdminAction(chatId: number, action: string, entityType: string, entityId: number, result: string, reason?: string) {
  try {
    await db.insert(telegramAdminActionsTable).values({ chatId: String(chatId), action, entityType, entityId, result, reason: reason || null });
    await db.insert(auditLogsTable).values({
      actorId: null,
      action,
      targetType: entityType,
      targetId: entityId,
      metadata: { source: "telegram", chatId: String(chatId), reason: reason || null },
    });
  } catch (err: any) {
    logger.warn({ err: err?.message }, "Telegram admin action audit insert failed");
  }
}

async function notifySiteUser(userId: number, title: string, message: string) {
  try {
    await db.insert(notificationsTable).values({ userId, title, message });
  } catch (err: any) {
    logger.warn({ err: err?.message }, "Site notification insert failed (telegram flow)");
  }
}

// ---------------------------------------------------------------------------
// Data fetchers
// ---------------------------------------------------------------------------

async function getPaymentDetail(id: number) {
  const [row] = await db
    .select({ p: paymentsTable, email: usersTable.email })
    .from(paymentsTable)
    .innerJoin(usersTable, eq(paymentsTable.userId, usersTable.id))
    .where(eq(paymentsTable.id, id))
    .limit(1);
  return row;
}

async function getAppDetail(id: number) {
  const [row] = await db
    .select({ a: applicationsTable, email: usersTable.email })
    .from(applicationsTable)
    .innerJoin(usersTable, eq(applicationsTable.userId, usersTable.id))
    .where(eq(applicationsTable.id, id))
    .limit(1);
  return row;
}

async function getAccountDetail(id: number) {
  const [row] = await db
    .select({ a: accountsTable, email: usersTable.email })
    .from(accountsTable)
    .innerJoin(usersTable, eq(accountsTable.userId, usersTable.id))
    .where(eq(accountsTable.id, id))
    .limit(1);
  return row;
}

async function getUserDetail(id: number) {
  const [row] = await db
    .select({ u: usersTable })
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  return row;
}

async function getUserCounts(userId: number) {
  const { rows } = await pool.query<{ apps: string; pays: string; tickets: string; unread: string }>(
    `SELECT
      (SELECT COUNT(*) FROM applications WHERE user_id=$1)::int AS apps,
      (SELECT COUNT(*) FROM payments WHERE user_id=$1)::int AS pays,
      (SELECT COUNT(*) FROM support_tickets WHERE user_id=$1)::int AS tickets,
      (SELECT COUNT(*) FROM notifications WHERE user_id=$1 AND is_read=false)::int AS unread`,
    [userId],
  );
  return rows[0] || { apps: "0", pays: "0", tickets: "0", unread: "0" };
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

function formatPayment(p: Payment, email: string): string {
  const lines = [
    `💳 PAYMENT #${p.id}`,
    `Order: ${p.orderId}`,
    `User: ${email}`,
    `Amount: ${p.amount} ${p.currency}`,
    `Network: ${p.network.toUpperCase()}`,
    `TXID: ${truncateMiddle(p.txHash, 22)}`,
    `Status: ${statusEmoji(p.status)} ${p.status}`,
  ];
  if (p.rejectionReason) lines.push(`Reason: ${truncate(p.rejectionReason, 100)}`);
  lines.push(`Submitted: ${formatDate(p.createdAt)}`);
  if (p.verifiedAt) lines.push(`Verified: ${formatDate(p.verifiedAt)}`);
  return lines.join("\n");
}

function formatApp(a: Application, email: string): string {
  const lines = [
    `📋 REQUEST ${a.publicId}`,
    `User: ${email}`,
    `Status: ${statusEmoji(a.status)} ${a.status}`,
    `Platform: ${a.advertisingInfo?.platform || "-"}`,
    `Expected spend: ${a.advertisingInfo?.expectedSpend || "-"}`,
    `Submitted: ${formatDate(a.submittedAt)}`,
    `Created: ${formatDate(a.createdAt)}`,
  ];
  if (a.rejectionReason) lines.push(`Reason: ${truncate(a.rejectionReason, 100)}`);
  return lines.join("\n");
}

async function dashboardStats(): Promise<string> {
  let stats: any = null;
  try {
    const { rows } = await pool.query(`SELECT
      (SELECT COUNT(*) FROM users)::int AS users_total,
      (SELECT COUNT(*) FROM users WHERE created_at::date = CURRENT_DATE)::int AS users_today,
      (SELECT COUNT(*) FROM applications)::int AS apps_total,
      (SELECT COUNT(*) FROM applications WHERE status='SUBMITTED')::int AS apps_submitted,
      (SELECT COUNT(*) FROM applications WHERE status='UNDER_REVIEW')::int AS apps_review,
      (SELECT COUNT(*) FROM applications WHERE status='INFORMATION_REQUIRED')::int AS apps_info,
      (SELECT COUNT(*) FROM applications WHERE status='DOCUMENTS_REQUIRED')::int AS apps_docs,
      (SELECT COUNT(*) FROM applications WHERE status='APPROVED')::int AS apps_approved,
      (SELECT COUNT(*) FROM applications WHERE status='REJECTED')::int AS apps_rejected,
      (SELECT COUNT(*) FROM payments WHERE status='PENDING_VERIFICATION')::int AS pay_pending,
      (SELECT COUNT(*) FROM payments WHERE status='PAID' AND verified_at::date = CURRENT_DATE)::int AS pay_approved_today,
      (SELECT COUNT(*) FROM payments WHERE status='REJECTED' AND verified_at::date = CURRENT_DATE)::int AS pay_rejected_today,
      (SELECT COUNT(*) FROM telegram_notification_events WHERE event='SYSTEM_ERROR' AND created_at::date = CURRENT_DATE)::int AS errors_today`);
    stats = rows[0];
  } catch {
    // telegram_notification_events may not exist yet (old DB) — retry without it
    const { rows } = await pool.query(`SELECT
      (SELECT COUNT(*) FROM users)::int AS users_total,
      (SELECT COUNT(*) FROM users WHERE created_at::date = CURRENT_DATE)::int AS users_today,
      (SELECT COUNT(*) FROM applications)::int AS apps_total,
      (SELECT COUNT(*) FROM applications WHERE status='SUBMITTED')::int AS apps_submitted,
      (SELECT COUNT(*) FROM applications WHERE status='UNDER_REVIEW')::int AS apps_review,
      (SELECT COUNT(*) FROM applications WHERE status='INFORMATION_REQUIRED')::int AS apps_info,
      (SELECT COUNT(*) FROM applications WHERE status='DOCUMENTS_REQUIRED')::int AS apps_docs,
      (SELECT COUNT(*) FROM applications WHERE status='APPROVED')::int AS apps_approved,
      (SELECT COUNT(*) FROM applications WHERE status='REJECTED')::int AS apps_rejected,
      (SELECT COUNT(*) FROM payments WHERE status='PENDING_VERIFICATION')::int AS pay_pending,
      (SELECT COUNT(*) FROM payments WHERE status='PAID' AND verified_at::date = CURRENT_DATE)::int AS pay_approved_today,
      (SELECT COUNT(*) FROM payments WHERE status='REJECTED' AND verified_at::date = CURRENT_DATE)::int AS pay_rejected_today,
      0::int AS errors_today`);
    stats = rows[0];
  }
  return [
    "📊 ADMIZ DASHBOARD",
    "",
    "👤 Users",
    `Today: ${stats.users_today ?? 0}`,
    `Total: ${stats.users_total ?? 0}`,
    "",
    "📋 Requests",
    `Submitted: ${stats.apps_submitted ?? 0}`,
    `Under Review: ${stats.apps_review ?? 0}`,
    `Info Required: ${(stats.apps_info ?? 0) + (stats.apps_docs ?? 0)}`,
    `Approved: ${stats.apps_approved ?? 0}`,
    `Rejected: ${stats.apps_rejected ?? 0}`,
    "",
    "💳 Payments",
    `Pending Verification: ${stats.pay_pending ?? 0}`,
    `Approved Today: ${stats.pay_approved_today ?? 0}`,
    `Rejected Today: ${stats.pay_rejected_today ?? 0}`,
    "",
    "🚨 System",
    `Errors Today: ${stats.errors_today ?? 0}`,
  ].join("\n");
}

async function usersList(page: number): Promise<{ text: string; markup: ReplyMarkup }> {
  const offset = page * PAGE_SIZE;
  const list = await db
    .select({ id: usersTable.id, email: usersTable.email, username: usersTable.username, role: usersTable.role, status: usersTable.status, createdAt: usersTable.createdAt })
    .from(usersTable)
    .orderBy(desc(usersTable.id))
    .limit(PAGE_SIZE)
    .offset(offset);
  const totalRes = await pool.query<{ n: string }>("SELECT COUNT(*)::int AS n FROM users");
  const total = Number(totalRes.rows[0]?.n || 0);
  const lines = [`👤 USERS (total ${total})`, ""];
  for (const u of list) {
    lines.push(`${statusEmoji(u.status)} #${u.id} ${u.email} ${u.role !== "CLIENT" ? `[${u.role}]` : ""}`);
  }
  if (list.length === 0) lines.push("No users found.");
  const nav: Btn[] = [];
  if (page > 0) nav.push(btn("◀️ Prev", `users:${page - 1}`));
  if (offset + list.length < total) nav.push(btn("Next ▶️", `users:${page + 1}`));
  return { text: lines.join("\n"), markup: kb([...nav.length ? [nav] : [], mainRow()]) };
}

async function requestsList(page: number): Promise<{ text: string; markup: ReplyMarkup }> {
  const offset = page * PAGE_SIZE;
  const list = await db
    .select({ a: applicationsTable, email: usersTable.email })
    .from(applicationsTable)
    .innerJoin(usersTable, eq(applicationsTable.userId, usersTable.id))
    .orderBy(desc(applicationsTable.id))
    .limit(PAGE_SIZE)
    .offset(offset);
  const lines = ["📋 REQUESTS", ""];
  for (const { a, email } of list) {
    lines.push(`${statusEmoji(a.status)} ${a.publicId} · ${email}`);
  }
  if (list.length === 0) lines.push("No requests.");
  const nav: Btn[] = [];
  if (page > 0) nav.push(btn("◀️ Prev", `reqs:${page - 1}`));
  const totalRes = await pool.query<{ n: string }>("SELECT COUNT(*)::int AS n FROM applications");
  if (offset + list.length < Number(totalRes.rows[0]?.n || 0)) nav.push(btn("Next ▶️", `reqs:${page + 1}`));
  return { text: lines.join("\n"), markup: kb([...nav.length ? [nav] : [], mainRow()]) };
}

async function paymentsList(page: number, status?: string): Promise<{ text: string; markup: ReplyMarkup }> {
  const offset = page * PAGE_SIZE;
  const base = status ? "PAYMENTS · " + status : "PAYMENTS";
  const cond = status ? eq(paymentsTable.status, status) : undefined;
  const rows = await (cond
    ? db
        .select({ p: paymentsTable, email: usersTable.email })
        .from(paymentsTable)
        .innerJoin(usersTable, eq(paymentsTable.userId, usersTable.id))
        .where(cond)
        .orderBy(desc(paymentsTable.createdAt))
        .limit(PAGE_SIZE)
        .offset(offset)
    : db
        .select({ p: paymentsTable, email: usersTable.email })
        .from(paymentsTable)
        .innerJoin(usersTable, eq(paymentsTable.userId, usersTable.id))
        .orderBy(desc(paymentsTable.createdAt))
        .limit(PAGE_SIZE)
        .offset(offset));
  const lines = [base, ""];
  for (const { p, email } of rows) {
    lines.push(`${statusEmoji(p.status)} ${p.orderId} · ${p.amount} USDT · ${email}`);
  }
  if (rows.length === 0) lines.push("No payments.");
  const nav: Btn[] = [];
  if (page > 0) nav.push(btn("◀️ Prev", status ? `pays_st:${status}:${page - 1}` : `pays:${page - 1}`));
  const totalRes = await pool.query<{ n: string }>(`SELECT COUNT(*)::int AS n FROM payments${status ? ` WHERE status='${status.replace(/'/g, "")}'` : ""}`);
  if (offset + rows.length < Number(totalRes.rows[0]?.n || 0)) nav.push(btn("Next ▶️", status ? `pays_st:${status}:${page + 1}` : `pays:${page + 1}`));
  return { text: lines.join("\n"), markup: kb([...nav.length ? [nav] : [], mainRow()]) };
}

async function pendingOverview(): Promise<{ text: string; markup: ReplyMarkup }> {
  const { rows } = await pool.query(`SELECT
    (SELECT COUNT(*) FROM applications WHERE status IN ('SUBMITTED','UNDER_REVIEW','INFORMATION_REQUIRED','DOCUMENTS_REQUIRED'))::int AS apps,
    (SELECT COUNT(*) FROM payments WHERE status='PENDING_VERIFICATION')::int AS pays,
    (SELECT COUNT(*) FROM documents WHERE status='PENDING_REVIEW')::int AS docs`);
  const s = rows[0];
  return {
    text: [
      "⏳ PENDING",
      "",
      `📋 Requests (actionable): ${s.apps}`,
      `💳 Payments (verification): ${s.pays}`,
      `📎 Documents (review): ${s.docs}`,
      "",
      "Open a list to take action.",
    ].join("\n"),
    markup: kb([
      [btn("📋 Requests", "reqs_st:SUBMITTED:0"), btn("💳 Payments", "pays_st:PENDING_VERIFICATION:0")],
      [btn("📎 Documents", "docs_pending:0")],
      mainRow(),
    ]),
  };
}

async function documentsPending(page: number): Promise<{ text: string; markup: ReplyMarkup }> {
  const offset = page * PAGE_SIZE;
  const list = await db
    .select({ id: documentsTable.id, category: documentsTable.category, fileName: documentsTable.fileName, createdAt: documentsTable.createdAt, appId: documentsTable.applicationId })
    .from(documentsTable)
    .where(eq(documentsTable.status, "PENDING_REVIEW"))
    .orderBy(desc(documentsTable.id))
    .limit(PAGE_SIZE)
    .offset(offset);
  const lines = ["📎 DOCUMENTS PENDING REVIEW", ""];
  for (const d of list) {
    lines.push(`#${d.id} ${d.category} · ${truncate(d.fileName, 30)} · app ${d.appId}`);
  }
  if (list.length === 0) lines.push("Nothing pending.");
  const totalRes = await pool.query<{ n: string }>("SELECT COUNT(*)::int AS n FROM documents WHERE status='PENDING_REVIEW'");
  const nav: Btn[] = [];
  if (page > 0) nav.push(btn("◀️ Prev", `docs_pending:${page - 1}`));
  if (offset + list.length < Number(totalRes.rows[0]?.n || 0)) nav.push(btn("Next ▶️", `docs_pending:${page + 1}`));
  return { text: lines.join("\n"), markup: kb([...nav.length ? [nav] : [], mainRow()]) };
}

async function servicesOverview(): Promise<{ text: string; markup: ReplyMarkup }> {
  const { rows } = await pool.query(`SELECT platform, status, COUNT(*)::int AS n FROM accounts GROUP BY platform, status ORDER BY platform, status`);
  const grouped = new Map<string, string[]>();
  for (const r of rows as Array<{ platform: string; status: string; n: number }>) {
    if (!grouped.has(r.platform)) grouped.set(r.platform, []);
    grouped.get(r.platform)!.push(`${r.status}: ${r.n}`);
  }
  const totalRes = await pool.query<{ n: string }>("SELECT COUNT(*)::int AS n FROM accounts");
  const lines = [
    "🛠 SERVICES",
    `Total ad accounts: ${totalRes.rows[0]?.n || 0}`,
    "",
  ];
  if (grouped.size === 0) lines.push("No ad accounts yet.");
  for (const [platform, statuses] of grouped) {
    lines.push(`◆ ${platform}`);
    for (const s of statuses) lines.push(`  ${s}`);
  }
  const recent = await db
    .select({ a: accountsTable, email: usersTable.email })
    .from(accountsTable)
    .innerJoin(usersTable, eq(accountsTable.userId, usersTable.id))
    .orderBy(desc(accountsTable.id))
    .limit(PAGE_SIZE);
  lines.push("", "Latest accounts:");
  for (const { a, email } of recent) {
    lines.push(`#${a.id} ${a.platform} ${a.status} · ${email}`);
  }
  const buttons: Btn[] = [];
  for (const { a } of recent) buttons.push(btn(`#${a.id}`, `acc:${a.id}`));
  const rows2: Btn[][] = [];
  for (let i = 0; i < buttons.length; i += 2) rows2.push(buttons.slice(i, i + 2));
  return { text: lines.join("\n"), markup: kb([...rows2, mainRow()]) };
}

async function activityList(page: number, userId?: number): Promise<{ text: string; markup: ReplyMarkup }> {
  const limit = 20;
  const offset = page * 10;
  const items: Array<{ time: Date; label: string }> = [];
  const appIds = userId ? (await db.select({ id: applicationsTable.id }).from(applicationsTable).where(eq(applicationsTable.userId, userId))).map((r) => r.id) : null;
  const appCond = appIds?.length ? sql`application_id = ANY(${appIds})` : undefined;

  if (userId) {
    if (appIds?.length) {
      const timeline = await db.select().from(applicationTimelineTable).where(appCond as any).orderBy(desc(applicationTimelineTable.id)).limit(limit);
      for (const t of timeline) items.push({ time: t.createdAt, label: `${t.event}: ${truncate(t.description || "", 60)} (app ${t.applicationId})` });
      const pays = await db.select().from(paymentsTable).where(eq(paymentsTable.userId, userId)).orderBy(desc(paymentsTable.createdAt)).limit(limit);
      for (const p of pays) items.push({ time: p.createdAt, label: `Payment submitted ${p.orderId} (${p.status})` });
      if (pays.some((p) => p.verifiedAt)) {
        for (const p of pays.filter((p) => p.verifiedAt)) items.push({ time: p.verifiedAt!, label: `Payment ${p.orderId} → ${p.status}` });
      }
    }
  } else {
    const timeline = await db.select().from(applicationTimelineTable).orderBy(desc(applicationTimelineTable.id)).limit(limit);
    for (const t of timeline) items.push({ time: t.createdAt, label: `${t.event}: ${truncate(t.description || "", 60)} (app ${t.applicationId})` });
    const pays = await db.select().from(paymentsTable).orderBy(desc(paymentsTable.createdAt)).limit(limit);
    for (const p of pays) items.push({ time: p.createdAt, label: `Payment proof submitted ${p.orderId} (${p.status})` });
    const audit = await db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.id)).limit(limit);
    for (const a of audit) items.push({ time: a.createdAt, label: `${a.action} (${a.targetType || "-"} #${a.targetId ?? "-"})` });
  }
  items.sort((x, y) => y.time.getTime() - x.time.getTime());
  const pageItems = items.slice(offset, offset + 10);
  const lines = ["🕒 RECENT ACTIVITY", ""];
  for (const it of pageItems) {
    lines.push(`${it.time.toISOString().slice(11, 16)} — ${it.label}`);
  }
  if (pageItems.length === 0) lines.push("No activity.");
  const nav: Btn[] = [];
  if (page > 0) nav.push(btn("◀️ Prev", userId ? `user_act:${userId}:${page - 1}` : `act:${page - 1}`));
  if (offset + pageItems.length < items.length) nav.push(btn("Next ▶️", userId ? `user_act:${userId}:${page + 1}` : `act:${page + 1}`));
  return { text: lines.join("\n"), markup: kb([...nav.length ? [nav] : [], backRow(userId ? `user:${userId}` : "menu")]) };
}

async function notificationsList(page: number): Promise<{ text: string; markup: ReplyMarkup }> {
  const offset = page * 10;
  const unreadRes = await pool.query<{ n: string }>("SELECT COUNT(*)::int AS n FROM notifications WHERE is_read=false");
  const list = await db
    .select({ n: notificationsTable, email: usersTable.email })
    .from(notificationsTable)
    .innerJoin(usersTable, eq(notificationsTable.userId, usersTable.id))
    .orderBy(desc(notificationsTable.id))
    .limit(10)
    .offset(offset);
  const lines = [`🔔 NOTIFICATIONS (${unreadRes.rows[0]?.n || 0} unread)`, ""];
  for (const { n, email } of list) {
    lines.push(`${n.isRead ? "✅" : "🔵"} ${n.title} — ${email}`);
  }
  if (list.length === 0) lines.push("No notifications.");
  const nav: Btn[] = [];
  if (page > 0) nav.push(btn("◀️ Prev", `notif:${page - 1}`));
  const totalRes = await pool.query<{ n: string }>("SELECT COUNT(*)::int AS n FROM notifications");
  if (offset + list.length < Number(totalRes.rows[0]?.n || 0)) nav.push(btn("Next ▶️", `notif:${page + 1}`));
  return { text: lines.join("\n"), markup: kb([...nav.length ? [nav] : [], mainRow()]) };
}

async function systemStatus(): Promise<{ text: string; markup: ReplyMarkup }> {
  let dbOk = true;
  try {
    await pool.query("SELECT 1");
  } catch {
    dbOk = false;
  }
  let telegramOk = false;
  try {
    await tgClient.getMe();
    telegramOk = true;
  } catch {
    telegramOk = false;
  }
  let errors: Array<{ error: string; createdAt: Date }> = [];
  try {
    errors = (
      await db
        .select({ error: telegramNotificationEventsTable.error, createdAt: telegramNotificationEventsTable.createdAt })
        .from(telegramNotificationEventsTable)
        .where(eq(telegramNotificationEventsTable.event, "SYSTEM_ERROR"))
        .orderBy(desc(telegramNotificationEventsTable.id))
        .limit(5)
    ).map((r) => ({ error: r.error || "unknown", createdAt: r.createdAt }));
  } catch {
    // table missing — ignore
  }
  const lines = [
    "⚙️ SYSTEM",
    "",
    `🟢 Backend: ${dbOk ? "Online" : "Degraded"}`,
    `🟢 Database: ${dbOk ? "Connected" : "DISCONNECTED"}`,
    `🟢 Telegram: ${telegramOk ? "Connected" : "Disconnected"}`,
    `Uptime: ${Math.floor(process.uptime() / 60)}m`,
    "",
  ];
  if (errors.length) {
    lines.push("Recent critical errors:");
    for (const e of errors) lines.push(`• ${formatDate(e.createdAt)} — ${truncate(e.error || "unknown", 80)}`);
  } else {
    lines.push("No recent critical errors.");
  }
  return { text: lines.join("\n"), markup: kb([mainRow()]) };
}

async function userProfile(chatId: number, userId: number) {
  const row = await getUserDetail(userId);
  if (!row) {
    await tgClient.sendMessage(chatId, "❌ User not found.");
    return;
  }
  const u = row.u;
  const c = await getUserCounts(userId);
  await tgClient.sendMessage(
    chatId,
    [
      "👤 USER",
      `ID: #${u.id}`,
      `Email: ${u.email}`,
      `Status: ${statusEmoji(u.status)} ${u.status}`,
      `Registered: ${formatDate(u.createdAt)}`,
      `Requests: ${c.apps}`,
      `Payments: ${c.pays}`,
      `Support tickets: ${c.tickets}`,
      `Unread notifications: ${c.unread}`,
    ].join("\n"),
    kb([
      [btn("📋 Requests", `user_reqs:${userId}:0`), btn("💳 Payments", `user_pays:${userId}:0`)],
      [btn("🔔 Activity", `user_act:${userId}:0`)],
      mainRow(),
    ]),
  );
}

// ---------------------------------------------------------------------------
// Actions (idempotent, state re-verified server-side)
// ---------------------------------------------------------------------------

async function approvePayment(chatId: number, paymentId: number): Promise<string> {
  const row = await getPaymentDetail(paymentId);
  if (!row) return "❌ Payment not found.";
  const { p, email } = row;
  if (p.status !== "PENDING_VERIFICATION") {
    return p.status === "PAID" ? "Payment has already been approved." : `Payment has already been processed (${p.status}).`;
  }
  await db
    .update(paymentsTable)
    .set({ status: "PAID", rejectionReason: null, verifiedAt: new Date(), updatedAt: new Date() })
    .where(eq(paymentsTable.id, paymentId));
  await notifySiteUser(p.userId, "Payment Approved 💳", `Your payment ${p.orderId} of ${p.amount} USDT has been approved and credited.`);
  await logAdminAction(chatId, "PAYMENT_APPROVED", "payment", paymentId, "SUCCESS");
  void notifyPaymentApproved(p, { id: p.userId, email } as any);
  return `✅ Payment ${p.orderId} approved (${p.amount} USDT). User notified.`;
}

async function rejectPayment(chatId: number, paymentId: number, reason: string): Promise<string> {
  const row = await getPaymentDetail(paymentId);
  if (!row) return "❌ Payment not found.";
  const { p, email } = row;
  if (p.status !== "PENDING_VERIFICATION") {
    return p.status === "REJECTED" ? "Payment has already been rejected." : `Payment has already been processed (${p.status}).`;
  }
  await db
    .update(paymentsTable)
    .set({ status: "REJECTED", rejectionReason: reason, verifiedAt: new Date(), updatedAt: new Date() })
    .where(eq(paymentsTable.id, paymentId));
  await notifySiteUser(p.userId, "Payment Rejected ❌", `Your payment ${p.orderId} was not verified. Reason: ${truncate(reason, 150)}`);
  await logAdminAction(chatId, "PAYMENT_REJECTED", "payment", paymentId, "SUCCESS", reason);
  void notifyPaymentRejected(p, { id: p.userId, email } as any, reason);
  return `❌ Payment ${p.orderId} rejected. User notified.`;
}

async function setRequestStatus(chatId: number, appId: number, next: string, reason?: string): Promise<string> {
  const row = await getAppDetail(appId);
  if (!row) return "❌ Request not found.";
  const { a, email } = row;
  if (a.status === next) return `Request is already ${next}.`;
  if (["APPROVED", "REJECTED", "CANCELLED"].includes(a.status) && !["INFORMATION_REQUIRED", "DOCUMENTS_REQUIRED"].includes(a.status)) {
    return `Request is already in a final state (${a.status}).`;
  }
  await db
    .update(applicationsTable)
    .set({ status: next, rejectionReason: next === "REJECTED" ? reason : null, updatedAt: new Date() })
    .where(eq(applicationsTable.id, appId));
  await db.insert(applicationTimelineTable).values({
    applicationId: appId,
    event: next === "APPROVED" ? "Application Approved" : next === "REJECTED" ? "Application Declined" : next === "UNDER_REVIEW" ? "Application Under Review" : next === "CANCELLED" ? "Application Cancelled" : "Revision Requested",
    description: reason || `Status changed to ${next} via Telegram admin.`,
    actorId: null,
  });
  const title =
    next === "APPROVED"
      ? "Application Approved 🎉"
      : next === "REJECTED"
        ? "Application Status Update: Declined"
        : next === "UNDER_REVIEW"
          ? "Application Under Review"
          : next === "CANCELLED"
            ? "Application Cancelled"
            : "Action Required: Onboarding Revision";
  await notifySiteUser(a.userId, title, next === "REJECTED" ? `Review decision: ${reason || "Rejected"}. Please contact support for options.` : `Your request ${a.publicId} status is now: ${next}.`);
  const actionMap: Record<string, string> = { APPROVED: "REQUEST_APPROVED", REJECTED: "REQUEST_REJECTED", UNDER_REVIEW: "REQUEST_UNDER_REVIEW", INFORMATION_REQUIRED: "REQUEST_INFO", DOCUMENTS_REQUIRED: "REQUEST_DOCS", CANCELLED: "REQUEST_CANCELLED" };
  await logAdminAction(chatId, actionMap[next] || "REQUEST_STATUS_CHANGE", "application", appId, "SUCCESS", reason);
  void notifyRequestStatusChange({ ...a, status: next }, { id: a.userId, email } as any);
  return `🔄 ${a.publicId} → ${next}${reason ? ` (${truncate(reason, 80)})` : ""}. User notified.`;
}

async function setAccountStatus(chatId: number, accId: number, next: string): Promise<string> {
  const row = await getAccountDetail(accId);
  if (!row) return "❌ Account not found.";
  const { a, email } = row;
  if (a.status === next) return `Account is already ${next}.`;
  await db
    .update(accountsTable)
    .set({ status: next, updatedAt: new Date() })
    .where(eq(accountsTable.id, accId));
  await notifySiteUser(a.userId, `Ad Account Status Update: ${next}`, `Your ${a.platform} ad account (${a.accountId || "Pending"}) status was changed to: ${next}.`);
  await logAdminAction(chatId, "SERVICE_STATUS_CHANGED", "account", accId, "SUCCESS", `status → ${next}`);
  return `✅ Account #${accId} (${a.platform}) → ${next}.`;
}

// ---------------------------------------------------------------------------
// Payment / request views with action keyboards
// ---------------------------------------------------------------------------

function paymentMarkup(p: Payment): ReplyMarkup {
  const rows: Btn[][] = [];
  rows.push([btn("📸 View Screenshot", `pay_ss:${p.id}`), btn("🔗 View Transaction", `pay_tx:${p.id}`)]);
  if (p.status === "PENDING_VERIFICATION") {
    rows.push([btn("✅ Approve", `pay_app:${p.id}`), btn("❌ Reject", `pay_rej:${p.id}`)]);
  }
  rows.push(mainRow());
  return kb(rows);
}

function requestMarkup(a: Application): ReplyMarkup {
  const rows: Btn[][] = [];
  if (!["APPROVED", "REJECTED", "CANCELLED"].includes(a.status)) {
    rows.push([btn("🔄 Under Review", `req_act:${a.id}:UNDER_REVIEW`)]);
    rows.push([btn("✅ Approve", `req_act:${a.id}:APPROVED`), btn("❌ Reject", `req_act:${a.id}:REJECTED`)]);
    rows.push([btn("📝 Request Info", `req_act:${a.id}:INFORMATION_REQUIRED`), btn("📎 Request Docs", `req_act:${a.id}:DOCUMENTS_REQUIRED`)]);
    rows.push([btn("🚫 Cancel", `req_act:${a.id}:CANCELLED`)]);
  }
  rows.push([btn("🕒 Timeline", `req_tl:${a.id}`)]);
  rows.push(mainRow());
  return kb(rows);
}

async function showPayment(chatId: number, paymentId: number, editMessageId?: number) {
  const row = await getPaymentDetail(paymentId);
  if (!row) {
    await tgClient.sendMessage(chatId, "❌ Payment not found.");
    return;
  }
  const text = formatPayment(row.p, row.email);
  const markup = paymentMarkup(row.p);
  if (editMessageId) await tgClient.editMessageText(chatId, editMessageId, text, markup);
  else await tgClient.sendMessage(chatId, text, markup);
}

async function showRequest(chatId: number, appId: number, editMessageId?: number) {
  const row = await getAppDetail(appId);
  if (!row) {
    await tgClient.sendMessage(chatId, "❌ Request not found.");
    return;
  }
  const text = formatApp(row.a, row.email);
  const markup = requestMarkup(row.a);
  if (editMessageId) await tgClient.editMessageText(chatId, editMessageId, text, markup);
  else await tgClient.sendMessage(chatId, text, markup);
}

async function showAccount(chatId: number, accId: number, editMessageId?: number) {
  const row = await getAccountDetail(accId);
  if (!row) {
    await tgClient.sendMessage(chatId, "❌ Account not found.");
    return;
  }
  const a = row.a;
  const text = [
    `🛠 ACCOUNT #${a.id}`,
    `Platform: ${a.platform}`,
    `Account ID: ${a.accountId || "-"}`,
    `BM ID: ${a.businessPortfolioId || "-"}`,
    `Spend limit: ${a.spendLimit || "-"}`,
    `Status: ${statusEmoji(a.status)} ${a.status}`,
    `User: ${row.email}`,
    `Created: ${formatDate(a.createdAt)}`,
  ].join("\n");
  const rows: Btn[][] = [];
  if (a.status !== "ACTIVE") rows.push([btn("✅ Enable", `acc_set:${accId}:onc`)]);
  if (a.status !== "SUSPENDED") rows.push([btn("❌ Disable", `acc_set:${accId}:offc`)]);
  rows.push(mainRow());
  const markup = kb(rows);
  if (editMessageId) await tgClient.editMessageText(chatId, editMessageId, text, markup);
  else await tgClient.sendMessage(chatId, text, markup);
}

// ---------------------------------------------------------------------------
// Update dispatch
// ---------------------------------------------------------------------------

export async function handleTelegramUpdate(update: TelegramUpdate): Promise<void> {
  try {
    if (update.message?.text) await handleMessage(update.message);
    if (update.callback_query) await handleCallback(update.callback_query);
  } catch (err: any) {
    logTelegramError("handleTelegramUpdate", err);
  }
}

async function handleMessage(msg: NonNullable<TelegramUpdate["message"]>) {
  const chatId = msg.chat.id;
  if (!isAdminChat(chatId)) {
    await tgClient.sendMessage(chatId, "Unauthorized.");
    return;
  }
  const text = (msg.text || "").trim();

  // Multi-step flow: capture reason/note text
  const flow = flows.get(chatId);
  if (flow && text && !text.startsWith("/")) {
    const reason = truncate(text, REASON_MAX);
    flow.reason = reason;
    if (flow.flow === "pay_rej") {
      await tgClient.sendMessage(
        chatId,
        `❌ REJECT PAYMENT #${flow.entityId}\n\nReason:\n"${reason}"\n\nAre you sure?`,
        kb([
          [btn("✅ Confirm Rejection", `pay_rejc:${flow.entityId}`)],
          [btn("❌ Cancel", "cancel")],
        ]),
      );
    } else {
      const actionLabel = flow.flow === "req_info" ? "REQUEST INFO" : flow.flow === "req_docs" ? "REQUEST DOCS" : "REJECT REQUEST";
      await tgClient.sendMessage(
        chatId,
        `${flow.flow === "req_rej" ? "❌" : "📝"} ${actionLabel} #${flow.entityId}\n\nReason:\n"${reason}"\n\nAre you sure?`,
        kb([
          [btn("✅ Confirm", `req_rejc:${flow.entityId}`)],
          [btn("❌ Cancel", "cancel")],
        ]),
      );
    }
    return;
  }

  const parts = text.split(/\s+/);
  const cmd = (parts[0] || "").toLowerCase().replace(/^\/+/, "");
  const arg = parts.slice(1).join(" ").trim();

  switch (cmd) {
    case "start":
    case "admin":
      await tgClient.sendMessage(
        chatId,
        "ADMIZ ADMIN BOT\n\n🟢 System Online\n\nSelect an option below:",
        mainMenu(),
      );
      break;
    case "help":
      await tgClient.sendMessage(
        chatId,
        [
          "📖 COMMANDS",
          "/start — main menu",
          "/stats — dashboard",
          "/users — list users",
          "/user <id> — user profile",
          "/requests — list requests",
          "/request <id> — request detail",
          "/pending — pending overview",
          "/payments — list payments",
          "/payment <id> — payment detail",
          "/approve <id> — approve payment",
          "/reject <id> — reject payment",
          "/services — ad account services",
          "/notifications — site notifications",
          "/activity — recent activity",
          "/system — system status",
        ].join("\n"),
        kb([mainRow()]),
      );
      break;
    case "stats":
    case "dashboard":
      await tgClient.sendMessage(chatId, await dashboardStats(), kb([mainRow()]));
      break;
    case "users":
      await sendListResult(chatId, await usersList(0));
      break;
    case "user": {
      const id = Number(arg);
      if (!Number.isInteger(id) || id <= 0) {
        await tgClient.sendMessage(chatId, "Usage: /user <id>");
        break;
      }
      await userProfile(chatId, id);
      break;
    }
    case "requests":
      await sendListResult(chatId, await requestsList(0));
      break;
    case "request": {
      const id = Number(arg);
      if (!Number.isInteger(id) || id <= 0) {
        await tgClient.sendMessage(chatId, "Usage: /request <id>");
        break;
      }
      await showRequest(chatId, id);
      break;
    }
    case "pending":
      await sendListResult(chatId, await pendingOverview());
      break;
    case "payments":
      await sendListResult(chatId, await paymentsList(0));
      break;
    case "payment": {
      const id = Number(arg);
      if (!Number.isInteger(id) || id <= 0) {
        await tgClient.sendMessage(chatId, "Usage: /payment <id>");
        break;
      }
      await showPayment(chatId, id);
      break;
    }
    case "approve": {
      const id = Number(arg);
      if (!Number.isInteger(id) || id <= 0) {
        await tgClient.sendMessage(chatId, "Usage: /approve <payment id>");
        break;
      }
      const row = await getPaymentDetail(id);
      if (!row) {
        await tgClient.sendMessage(chatId, "❌ Payment not found.");
        break;
      }
      await tgClient.sendMessage(
        chatId,
        `⚠️ CONFIRM PAYMENT\n\n${formatPayment(row.p, row.email)}\n\nAre you sure?`,
        kb([[btn("✅ Confirm Approval", `pay_appc:${id}`)], [btn("❌ Cancel", "cancel")]]),
      );
      break;
    }
    case "reject": {
      const id = Number(arg);
      if (!Number.isInteger(id) || id <= 0) {
        await tgClient.sendMessage(chatId, "Usage: /reject <payment id>");
        break;
      }
      flows.set(chatId, { flow: "pay_rej", entityId: id });
      await tgClient.sendMessage(chatId, `❌ REJECT PAYMENT #${id}\n\nReason:\n[Enter reason]`);
      break;
    }
    case "services":
      await sendListResult(chatId, await servicesOverview());
      break;
    case "notifications":
      await sendListResult(chatId, await notificationsList(0));
      break;
    case "activity":
      await sendListResult(chatId, await activityList(0));
      break;
    case "system":
      await sendListResult(chatId, await systemStatus());
      break;
    default:
      await tgClient.sendMessage(chatId, "Unknown command. Use /help", kb([mainRow()]));
  }
}

function mainMenu(): ReplyMarkup {
  return kb([
    [btn("📊 Dashboard", "stats"), btn("👤 Users", "users:0")],
    [btn("📋 Requests", "reqs:0"), btn("💳 Payments", "pays:0")],
    [btn("⏳ Pending", "pending"), btn("🛠 Services", "svc")],
    [btn("🔔 Activity", "act:0"), btn("⚙️ System", "sys")],
  ]);
}

async function sendListResult(chatId: number, r: { text: string; markup: ReplyMarkup }) {
  await tgClient.sendMessage(chatId, r.text, r.markup);
}

async function handleCallback(cb: NonNullable<TelegramUpdate["callback_query"]>) {
  const chatId = cb.from.id;
  if (!isAdminChat(chatId)) {
    await tgClient.answerCallbackQuery(cb.id, "Unauthorized.");
    return;
  }
  await tgClient.answerCallbackQuery(cb.id);
  const data = cb.data || "";
  const [tag, ...rest] = data.split(":");
  const msgId = cb.message?.message_id;

  try {
    switch (tag) {
      case "menu":
        await tgClient.editMessageText(chatId, msgId!, "ADMIZ ADMIN BOT\n\n🟢 System Online", mainMenu());
        break;
      case "stats":
        await tgClient.editMessageText(chatId, msgId!, await dashboardStats(), kb([mainRow()]));
        break;
      case "users":
        await editListResult(chatId, msgId!, await usersList(Number(rest[0] || 0)));
        break;
      case "user": {
        const id = Number(rest[0]);
        const row = await getUserDetail(id);
        if (!row) {
          await tgClient.editMessageText(chatId, msgId!, "❌ User not found.", kb([mainRow()]));
          break;
        }
        const u = row.u;
        const c = await getUserCounts(id);
        await tgClient.editMessageText(
          chatId,
          msgId!,
          [
            "👤 USER",
            `ID: #${u.id}`,
            `Email: ${u.email}`,
            `Status: ${statusEmoji(u.status)} ${u.status}`,
            `Registered: ${formatDate(u.createdAt)}`,
            `Requests: ${c.apps}`,
            `Payments: ${c.pays}`,
            `Support tickets: ${c.tickets}`,
            `Unread notifications: ${c.unread}`,
          ].join("\n"),
          kb([
            [btn("📋 Requests", `user_reqs:${id}:0`), btn("💳 Payments", `user_pays:${id}:0`)],
            [btn("🔔 Activity", `user_act:${id}:0`)],
            mainRow(),
          ]),
        );
        break;
      }
      case "user_reqs": {
        const uid = Number(rest[0]);
        const page = Number(rest[1] || 0);
        const list = await db
          .select({ a: applicationsTable })
          .from(applicationsTable)
          .where(eq(applicationsTable.userId, uid))
          .orderBy(desc(applicationsTable.id))
          .limit(PAGE_SIZE)
          .offset(page * PAGE_SIZE);
        const lines = [`📋 USER #${uid} REQUESTS`, ""];
        for (const { a } of list) lines.push(`${statusEmoji(a.status)} ${a.publicId} (${a.status})`);
        if (!list.length) lines.push("No requests.");
        const nav: Btn[] = [];
        if (page > 0) nav.push(btn("◀️ Prev", `user_reqs:${uid}:${page - 1}`));
        if (list.length === PAGE_SIZE) nav.push(btn("Next ▶️", `user_reqs:${uid}:${page + 1}`));
        await tgClient.editMessageText(chatId, msgId!, lines.join("\n"), kb([...nav.length ? [nav] : [], backRow(`user:${uid}`)]));
        break;
      }
      case "user_pays": {
        const uid = Number(rest[0]);
        const page = Number(rest[1] || 0);
        const list = await db
          .select({ p: paymentsTable })
          .from(paymentsTable)
          .where(eq(paymentsTable.userId, uid))
          .orderBy(desc(paymentsTable.createdAt))
          .limit(PAGE_SIZE)
          .offset(page * PAGE_SIZE);
        const lines = [`💳 USER #${uid} PAYMENTS`, ""];
        for (const { p } of list) lines.push(`${statusEmoji(p.status)} ${p.orderId} ${p.amount} USDT (${p.status})`);
        if (!list.length) lines.push("No payments.");
        const nav: Btn[] = [];
        if (page > 0) nav.push(btn("◀️ Prev", `user_pays:${uid}:${page - 1}`));
        if (list.length === PAGE_SIZE) nav.push(btn("Next ▶️", `user_pays:${uid}:${page + 1}`));
        await tgClient.editMessageText(chatId, msgId!, lines.join("\n"), kb([...nav.length ? [nav] : [], backRow(`user:${uid}`)]));
        break;
      }
      case "user_act":
        await editListResult(chatId, msgId!, await activityList(Number(rest[1] || 0), Number(rest[0])));
        break;
      case "reqs":
        await editListResult(chatId, msgId!, await requestsList(Number(rest[0] || 0)));
        break;
      case "reqs_st": {
        const status = rest[0];
        const page = Number(rest[1] || 0);
        const list = await db
          .select({ a: applicationsTable, email: usersTable.email })
          .from(applicationsTable)
          .innerJoin(usersTable, eq(applicationsTable.userId, usersTable.id))
          .where(eq(applicationsTable.status, status))
          .orderBy(desc(applicationsTable.id))
          .limit(PAGE_SIZE)
          .offset(page * PAGE_SIZE);
        const lines = [`📋 REQUESTS · ${status}`, ""];
        for (const { a, email } of list) lines.push(`${a.publicId} · ${email}`);
        if (!list.length) lines.push("None.");
        const nav: Btn[] = [];
        if (page > 0) nav.push(btn("◀️ Prev", `reqs_st:${status}:${page - 1}`));
        if (list.length === PAGE_SIZE) nav.push(btn("Next ▶️", `reqs_st:${status}:${page + 1}`));
        await tgClient.editMessageText(chatId, msgId!, lines.join("\n"), kb([...nav.length ? [nav] : [], backRow("pending")]));
        break;
      }
      case "req": {
        const id = Number(rest[0]);
        const row = await getAppDetail(id);
        if (!row) {
          await tgClient.editMessageText(chatId, msgId!, "❌ Request not found.", kb([mainRow()]));
          break;
        }
        await tgClient.editMessageText(chatId, msgId!, formatApp(row.a, row.email), requestMarkup(row.a));
        break;
      }
      case "req_tl": {
        const id = Number(rest[0]);
        const timeline = await db
          .select()
          .from(applicationTimelineTable)
          .where(eq(applicationTimelineTable.applicationId, id))
          .orderBy(desc(applicationTimelineTable.id))
          .limit(10);
        const lines = [`🕒 TIMELINE · REQUEST #${id}`, ""];
        for (const t of timeline) lines.push(`${t.createdAt.toISOString().slice(11, 16)} — ${t.event}${t.description ? `: ${truncate(t.description, 60)}` : ""}`);
        if (!timeline.length) lines.push("No timeline events.");
        await tgClient.editMessageText(chatId, msgId!, lines.join("\n"), kb([backRow(`req:${id}`)]));
        break;
      }
      case "req_act": {
        const id = Number(rest[0]);
        const action = rest[1];
        if (action === "REJECTED" || action === "INFORMATION_REQUIRED" || action === "DOCUMENTS_REQUIRED") {
          flows.set(chatId, { flow: action === "REJECTED" ? "req_rej" : action === "INFORMATION_REQUIRED" ? "req_info" : "req_docs", entityId: id });
          await tgClient.editMessageText(
            chatId,
            msgId!,
            `${action === "REJECTED" ? "❌" : "📝"} REQUEST #${id}\n\nReason:\n[Enter reason]`,
            kb([[btn("❌ Cancel", "cancel")]]),
          );
          break;
        }
        await tgClient.editMessageText(
          chatId,
          msgId!,
          `⚠️ CONFIRM REQUEST #${id}\n\nAction: ${action}\n\nAre you sure?`,
          kb([
            [btn("✅ Confirm", `req_exec:${id}:${action}`)],
            [btn("❌ Cancel", "cancel")],
          ]),
        );
        break;
      }
      case "req_exec": {
        const id = Number(rest[0]);
        const action = rest[1];
        const result = await setRequestStatus(chatId, id, action);
        await tgClient.editMessageText(chatId, msgId!, result, kb([[btn("👁 View Request", `req:${id}`)], mainRow()]));
        break;
      }
      case "req_rejc": {
        const id = Number(rest[0]);
        const flow = flows.get(chatId);
        if (!flow || flow.entityId !== id) {
          await tgClient.editMessageText(chatId, msgId!, "⏳ Session expired — start again.", kb([mainRow()]));
          break;
        }
        flows.delete(chatId);
        const action = flow.flow === "req_rej" ? "REJECTED" : flow.flow === "req_info" ? "INFORMATION_REQUIRED" : "DOCUMENTS_REQUIRED";
        const result = await setRequestStatus(chatId, id, action, flow.reason || "Requested");
        await tgClient.editMessageText(chatId, msgId!, result, kb([[btn("👁 View Request", `req:${id}`)], mainRow()]));
        break;
      }
      case "pays":
        await editListResult(chatId, msgId!, await paymentsList(Number(rest[0] || 0)));
        break;
      case "pays_st":
        await editListResult(chatId, msgId!, await paymentsList(Number(rest[1] || 0), rest[0]));
        break;
      case "pay": {
        const id = Number(rest[0]);
        const row = await getPaymentDetail(id);
        if (!row) {
          await tgClient.editMessageText(chatId, msgId!, "❌ Payment not found.", kb([mainRow()]));
          break;
        }
        await tgClient.editMessageText(chatId, msgId!, formatPayment(row.p, row.email), paymentMarkup(row.p));
        break;
      }
      case "pay_ss": {
        const id = Number(rest[0]);
        const row = await getPaymentDetail(id);
        if (!row) {
          await tgClient.sendMessage(chatId, "❌ Payment not found.");
          break;
        }
        const m = /^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)$/.exec(row.p.screenshotUrl || "");
        if (!m) {
          await tgClient.sendMessage(chatId, "❌ Screenshot data is missing or corrupted.");
          break;
        }
        const buffer = Buffer.from(m[2], "base64");
        await sendTelegramPhoto(
          buffer,
          `📸 PAYMENT SCREENSHOT\n${row.p.orderId} · ${row.p.amount} ${row.p.currency} · ${row.email}`,
        );
        break;
      }
      case "pay_tx": {
        const id = Number(rest[0]);
        const row = await getPaymentDetail(id);
        if (!row) break;
        const link = explorerLink(row.p.network, row.p.txHash);
        await tgClient.sendMessage(chatId, link ? `🔗 ${row.p.network.toUpperCase()}: ${link}` : "Explorer link unavailable.");
        break;
      }
      case "pay_app": {
        const id = Number(rest[0]);
        const row = await getPaymentDetail(id);
        if (!row) {
          await tgClient.editMessageText(chatId, msgId!, "❌ Payment not found.", kb([mainRow()]));
          break;
        }
        await tgClient.editMessageText(
          chatId,
          msgId!,
          `⚠️ CONFIRM PAYMENT\n\n${formatPayment(row.p, row.email)}\n\nAre you sure?`,
          kb([
            [btn("✅ Confirm Approval", `pay_appc:${id}`)],
            [btn("❌ Cancel", "cancel")],
          ]),
        );
        break;
      }
      case "pay_appc": {
        const id = Number(rest[0]);
        const result = await approvePayment(chatId, id);
        await tgClient.editMessageText(chatId, msgId!, result, kb([mainRow()]));
        break;
      }
      case "pay_rej": {
        const id = Number(rest[0]);
        flows.set(chatId, { flow: "pay_rej", entityId: id });
        await tgClient.editMessageText(
          chatId,
          msgId!,
          `❌ REJECT PAYMENT #${id}\n\nReason:\n[Enter reason]`,
          kb([[btn("❌ Cancel", "cancel")]]),
        );
        break;
      }
      case "pay_rejc": {
        const id = Number(rest[0]);
        const flow = flows.get(chatId);
        if (!flow || flow.entityId !== id || flow.flow !== "pay_rej") {
          await tgClient.editMessageText(chatId, msgId!, "⏳ Session expired — start rejection again.", kb([mainRow()]));
          break;
        }
        flows.delete(chatId);
        const result = await rejectPayment(chatId, id, flow.reason || "Rejected");
        await tgClient.editMessageText(chatId, msgId!, result, kb([mainRow()]));
        break;
      }
      case "svc":
        await editListResult(chatId, msgId!, await servicesOverview());
        break;
      case "acc": {
        const id = Number(rest[0]);
        await showAccount(chatId, id, msgId);
        break;
      }
      case "acc_set": {
        const id = Number(rest[0]);
        const action = rest[1]; // onc | offc
        const row = await getAccountDetail(id);
        if (!row) {
          await tgClient.editMessageText(chatId, msgId!, "❌ Account not found.", kb([mainRow()]));
          break;
        }
        const next = action === "onc" ? "ACTIVE" : "SUSPENDED";
        await tgClient.editMessageText(
          chatId,
          msgId!,
          `⚠️ CONFIRM ACCOUNT #${id}\n\nPlatform: ${row.a.platform}\nAction: ${next === "ACTIVE" ? "Enable" : "Disable"}\n\nAre you sure?`,
          kb([
            [btn("✅ Confirm", `acc_exec:${id}:${action}`)],
            [btn("❌ Cancel", "cancel")],
          ]),
        );
        break;
      }
      case "acc_exec": {
        const id = Number(rest[0]);
        const action = rest[1];
        const result = await setAccountStatus(chatId, id, action === "onc" ? "ACTIVE" : "SUSPENDED");
        await tgClient.editMessageText(chatId, msgId!, result, kb([[btn("👁 View Account", `acc:${id}`)], mainRow()]));
        break;
      }
      case "docs_pending":
        await editListResult(chatId, msgId!, await documentsPending(Number(rest[0] || 0)));
        break;
      case "act":
        await editListResult(chatId, msgId!, await activityList(Number(rest[0] || 0)));
        break;
      case "notif":
        await editListResult(chatId, msgId!, await notificationsList(Number(rest[0] || 0)));
        break;
      case "sys":
        await editListResult(chatId, msgId!, await systemStatus());
        break;
      case "pending":
        await editListResult(chatId, msgId!, await pendingOverview());
        break;
      case "cancel":
        flows.delete(chatId);
        await tgClient.editMessageText(chatId, msgId!, "❌ Cancelled.", kb([mainRow()]));
        break;
      default:
        await tgClient.editMessageText(chatId, msgId!, "Unknown action.", kb([mainRow()]));
    }
  } catch (err: any) {
    logTelegramError(`callback:${tag}`, err);
    try {
      await tgClient.editMessageText(chatId, msgId!, "⚠️ Action failed. Please try again.", kb([mainRow()]));
    } catch {
      // ignore
    }
  }
}

async function editListResult(chatId: number, messageId: number, r: { text: string; markup: ReplyMarkup }) {
  await tgClient.editMessageText(chatId, messageId, r.text, r.markup);
}
