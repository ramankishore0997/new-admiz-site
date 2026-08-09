import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Users Table
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // hashed
  username: text("username"),
  companyName: text("company_name"),
  telegramHandle: text("telegram_handle"),
  phoneNumber: text("phone_number"),
  country: text("country"),
  role: text("role").default("CLIENT").notNull(), // CLIENT, SUPER_ADMIN, ADMIN, REVIEWER, SUPPORT
  status: text("status").default("ACTIVE").notNull(), // ACTIVE, SUSPENDED, DELETED
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Applications Table
export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  publicId: text("public_id").notNull().unique(), // e.g., ADM-2026-000001
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  status: text("status").default("DRAFT").notNull(), // DRAFT, SUBMITTED, UNDER_REVIEW, INFORMATION_REQUIRED, DOCUMENTS_REQUIRED, APPROVED, REJECTED, CANCELLED
  personalInfo: jsonb("personal_info").$type<{
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    country?: string;
    state?: string;
    city?: string;
    telegram?: string;
  }>(),
  businessInfo: jsonb("business_info").$type<{
    legalBusinessName?: string;
    tradingName?: string;
    businessWebsite?: string;
    businessEmail?: string;
    businessPhone?: string;
    country?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    businessType?: string;
    industry?: string;
    yearsInBusiness?: string;
    companyRegistrationNumber?: string;
    taxNumber?: string;
  }>(),
  advertisingInfo: jsonb("advertising_info").$type<{
    platform?: string;
    expectedSpend?: string;
    targetCountries?: string;
    landingPageUrl?: string;
    primaryProductDescription?: string;
    previousExperience?: string;
    previousExperienceDescription?: string;
  }>(),
  accountRequirements: jsonb("account_requirements").$type<{
    accountType?: string;
    accountCount?: string;
    currency?: string;
    timezone?: string;
    businessManagerId?: string;
    existingAccountId?: string;
  }>(),
  rejectionReason: text("rejection_reason"),
  assignedAdminId: integer("assigned_admin_id").references(() => usersTable.id),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Application Timeline Table
export const applicationTimelineTable = pgTable("application_timeline", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applicationsTable.id, { onDelete: "cascade" }).notNull(),
  event: text("event").notNull(), // e.g. "Application Submitted"
  description: text("description"),
  actorId: integer("actor_id").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Application Messages Table
export const applicationMessagesTable = pgTable("application_messages", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applicationsTable.id, { onDelete: "cascade" }).notNull(),
  senderId: integer("sender_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  message: text("message").notNull(),
  attachments: jsonb("attachments").$type<Array<{
    name: string;
    key: string;
    url: string;
  }>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. Documents Table
export const documentsTable = pgTable("documents", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applicationsTable.id, { onDelete: "cascade" }).notNull(),
  uploaderId: integer("uploader_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  category: text("category").notNull(), // Business Registration, Tax Document, Government ID, Address Proof, Website Proof, Other
  fileName: text("file_name").notNull(),
  fileKey: text("file_key").notNull(), // random uuid key in storage
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  status: text("status").default("PENDING_REVIEW").notNull(), // PENDING_REVIEW, APPROVED, REJECTED, REPLACEMENT_REQUIRED
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 6. Provisioned Ad Accounts Table
export const accountsTable = pgTable("accounts", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applicationsTable.id).notNull(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  platform: text("platform").notNull(), // Meta, Google, TikTok, Other
  accountId: text("account_id"), // Externally generated ID
  businessPortfolioId: text("business_portfolio_id"),
  spendLimit: text("spend_limit"),
  status: text("status").default("PENDING_PROVISIONING").notNull(), // PENDING_PROVISIONING, PROVISIONING, ACTIVE, SUSPENDED, CLOSED
  balance: text("balance").default("0").notNull(), // Loaded ad-account balance (USD)
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 7. Notifications Table
export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 8. Support Tickets Table
export const supportTicketsTable = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  subject: text("subject").notNull(),
  category: text("category").notNull(), // Application, Documents, Account, Billing, Technical, Other
  priority: text("priority").notNull(), // Low, Medium, High, Urgent
  status: text("status").default("OPEN").notNull(), // OPEN, IN_PROGRESS, WAITING_ON_CLIENT, RESOLVED, CLOSED
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 9. Support Messages Table
export const supportMessagesTable = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => supportTicketsTable.id, { onDelete: "cascade" }).notNull(),
  senderId: integer("sender_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  message: text("message").notNull(),
  attachments: jsonb("attachments").$type<Array<{
    name: string;
    key: string;
    url: string;
  }>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 10. Audit Logs Table
export const auditLogsTable = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actorId: integer("actor_id").references(() => usersTable.id, { onDelete: "set null" }),
  action: text("action").notNull(), // Login, Register, Application Created, Status Changed, Note Added, Document Rejected, etc.
  targetType: text("target_type"), // user, application, document, account, ticket
  targetId: integer("target_id"),
  ipAddress: text("ip_address"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 11. Payments Table (Manual USDT Verification)
export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull().unique(), // e.g., PAY-1723...
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  amount: text("amount").notNull(), // USD / USDT amount
  currency: text("currency").default("USDT").notNull(),
  network: text("network").notNull(), // bsc, eth, polygon, arbitrum, optimism
  receivingAddress: text("receiving_address").default("0x5e094e9Fc46FF77D638682CcB50b6D3b6BFbd2d0").notNull(),
  txHash: text("tx_hash").notNull(), // EVM transaction hash
  screenshotUrl: text("screenshot_url").notNull(), // Base64 or storage URI
  note: text("note"), // Optional payment note
  status: text("status").default("PENDING_VERIFICATION").notNull(), // PAYMENT_PENDING, PENDING_VERIFICATION, PAID, REJECTED, EXPIRED
  rejectionReason: text("rejection_reason"),
  verifiedBy: integer("verified_by").references(() => usersTable.id),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Drizzle Relations Configuration
export const usersRelations = relations(usersTable, ({ many }) => ({
  applications: many(applicationsTable),
  notifications: many(notificationsTable),
  supportTickets: many(supportTicketsTable),
  payments: many(paymentsTable),
}));

export const applicationsRelations = relations(applicationsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [applicationsTable.userId],
    references: [usersTable.id],
  }),
  timeline: many(applicationTimelineTable),
  messages: many(applicationMessagesTable),
  documents: many(documentsTable),
  accounts: many(accountsTable),
}));

export const applicationTimelineRelations = relations(applicationTimelineTable, ({ one }) => ({
  application: one(applicationsTable, {
    fields: [applicationTimelineTable.applicationId],
    references: [applicationsTable.id],
  }),
  actor: one(usersTable, {
    fields: [applicationTimelineTable.actorId],
    references: [usersTable.id],
  }),
}));

export const applicationMessagesRelations = relations(applicationMessagesTable, ({ one }) => ({
  application: one(applicationsTable, {
    fields: [applicationMessagesTable.applicationId],
    references: [applicationsTable.id],
  }),
  sender: one(usersTable, {
    fields: [applicationMessagesTable.senderId],
    references: [usersTable.id],
  }),
}));

export const documentsRelations = relations(documentsTable, ({ one }) => ({
  application: one(applicationsTable, {
    fields: [documentsTable.applicationId],
    references: [applicationsTable.id],
  }),
  uploader: one(usersTable, {
    fields: [documentsTable.uploaderId],
    references: [usersTable.id],
  }),
}));

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  application: one(applicationsTable, {
    fields: [accountsTable.applicationId],
    references: [applicationsTable.id],
  }),
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

export const supportTicketsRelations = relations(supportTicketsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [supportTicketsTable.userId],
    references: [usersTable.id],
  }),
  messages: many(supportMessagesTable),
}));

export const supportMessagesRelations = relations(supportMessagesTable, ({ one }) => ({
  ticket: one(supportTicketsTable, {
    fields: [supportMessagesTable.ticketId],
    references: [supportTicketsTable.id],
  }),
  sender: one(usersTable, {
    fields: [supportMessagesTable.senderId],
    references: [usersTable.id],
  }),
}));

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [paymentsTable.userId],
    references: [usersTable.id],
  }),
}));

// 12. Application Fee Ledger (Per-account application fee deductions)
export const applicationFeesTable = pgTable("application_fees", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  applicationId: integer("application_id").references(() => applicationsTable.id, { onDelete: "cascade" }).notNull(),
  amount: text("amount").notNull(), // e.g., "10"
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 13. Ad Account Balance Loads (Main wallet → ad account wallet)
// Commission is charged on the LOAD, not on the deposit: loading $100
// deducts $102 from the user's main wallet (2% on top of the loaded amount).
export const accountLoadsTable = pgTable("account_loads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  accountId: integer("account_id").references(() => accountsTable.id, { onDelete: "cascade" }).notNull(),
  amount: text("amount").notNull(), // amount loaded into the ad account wallet, e.g. "100"
  commission: text("commission").notNull(), // e.g. "2" (2% of amount)
  total: text("total").notNull(), // amount + commission deducted from main wallet, e.g. "102"
  description: text("description"),
  loadedBy: integer("loaded_by").references(() => usersTable.id, { onDelete: "set null" }), // admin who performed the load (null = system/bot)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Business Rules
export const AD_ACCOUNT_APPLICATION_FEE_USD = 10; // per ad account, includes unlimited replacement
export const FIRST_DEPOSIT_MIN_USD = 10; // first-ever top-up (application fee), credited in full
export const MIN_TOPUP_USD = 100; // minimum deposit / top-up after the first one
export const MIN_LOAD_USD = 100; // minimum amount loaded from main wallet into an ad account
export const DEPOSIT_COMMISSION_RATE = 0.02; // 2% commission charged when loading main-wallet balance into an ad account (NOT on deposits)

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Application = typeof applicationsTable.$inferSelect;
export type NewApplication = typeof applicationsTable.$inferInsert;

export type TimelineEvent = typeof applicationTimelineTable.$inferSelect;
export type NewTimelineEvent = typeof applicationTimelineTable.$inferInsert;

export type ApplicationMessage = typeof applicationMessagesTable.$inferSelect;
export type NewApplicationMessage = typeof applicationMessagesTable.$inferInsert;

export type Document = typeof documentsTable.$inferSelect;
export type NewDocument = typeof documentsTable.$inferInsert;

export type Account = typeof accountsTable.$inferSelect;
export type NewAccount = typeof accountsTable.$inferInsert;

export type Notification = typeof notificationsTable.$inferSelect;
export type NewNotification = typeof notificationsTable.$inferInsert;

export type SupportTicket = typeof supportTicketsTable.$inferSelect;
export type NewSupportTicket = typeof supportTicketsTable.$inferInsert;

export type SupportMessage = typeof supportMessagesTable.$inferSelect;
export type NewSupportMessage = typeof supportMessagesTable.$inferInsert;

export type AuditLog = typeof auditLogsTable.$inferSelect;
export type NewAuditLog = typeof auditLogsTable.$inferInsert;

export type Payment = typeof paymentsTable.$inferSelect;
export type NewPayment = typeof paymentsTable.$inferInsert;

export type ApplicationFee = typeof applicationFeesTable.$inferSelect;
export type NewApplicationFee = typeof applicationFeesTable.$inferInsert;

export type AccountLoad = typeof accountLoadsTable.$inferSelect;
export type NewAccountLoad = typeof accountLoadsTable.$inferInsert;

export * from "./telegram";