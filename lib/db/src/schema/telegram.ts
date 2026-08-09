import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

// Telegram admin action audit log — every important action executed via the
// Telegram bot is recorded here (admin chat ID, action, entity, result).
export const telegramAdminActionsTable = pgTable("telegram_admin_actions", {
  id: serial("id").primaryKey(),
  chatId: text("chat_id").notNull(), // numeric Telegram chat ID of the admin
  action: text("action").notNull(), // PAYMENT_APPROVED, PAYMENT_REJECTED, REQUEST_APPROVED, REQUEST_REJECTED, REQUEST_UNDER_REVIEW, REQUEST_INFO, REQUEST_DOCS, REQUEST_CANCELLED, SERVICE_STATUS_CHANGED
  entityType: text("entity_type"), // user, application, payment, account, document
  entityId: integer("entity_id"),
  result: text("result").notNull().default("SUCCESS"), // SUCCESS, ALREADY_PROCESSED, FAILED
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Telegram notification delivery log — which important events were pushed to
// the admin chat and whether Telegram accepted them (for debugging/fail-soft).
export const telegramNotificationEventsTable = pgTable("telegram_notification_events", {
  id: serial("id").primaryKey(),
  event: text("event").notNull(), // NEW_USER, NEW_REQUEST, PAYMENT_PROOF, PAYMENT_APPROVED, PAYMENT_REJECTED, REQUEST_STATUS_CHANGE, SYSTEM_ERROR
  payload: jsonb("payload"),
  success: boolean("success").default(true).notNull(),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TelegramAdminAction = typeof telegramAdminActionsTable.$inferSelect;
export type NewTelegramAdminAction = typeof telegramAdminActionsTable.$inferInsert;

export type TelegramNotificationEvent = typeof telegramNotificationEventsTable.$inferSelect;
export type NewTelegramNotificationEvent = typeof telegramNotificationEventsTable.$inferInsert;
