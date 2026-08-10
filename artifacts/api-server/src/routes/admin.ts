import { Router } from "express";
import {
  db,
  applicationsTable,
  usersTable,
  applicationTimelineTable,
  applicationMessagesTable,
  documentsTable,
  accountsTable,
  notificationsTable,
  auditLogsTable,
  MIN_LOAD_USD,
  type NewTimelineEvent,
  type NewNotification,
  type NewAuditLog
} from "@workspace/db";
import { eq, and, sql, desc } from "drizzle-orm";
import { authenticate, requireAdmin, requireSuperAdmin, type AuthenticatedRequest } from "../middlewares/auth";
import { hashPassword } from "../lib/crypto";
import { provisionAdAccount, hasProvisionedAccount } from "../lib/provision";
import * as telegramNotify from "../lib/telegram/service";

const router = Router();

// Mount authenticate and requireAdmin scoped to admin routes only.
// NOTE: must be path-scoped — an unscoped router.use() intercepts and 403s
// every request that reaches this router, breaking client-only routes
// mounted after it (e.g. /api/payments/*).
router.use("/admin", authenticate);
router.use("/admin", requireAdmin);

/**
 * Audit Logger Helper
 */
async function logAudit(actorId: number, action: string, type?: string, id?: number, meta?: object, ip?: string) {
  try {
    await db.insert(auditLogsTable).values({
      actorId,
      action,
      targetType: type,
      targetId: id,
      ipAddress: ip,
      metadata: meta || {},
    });
  } catch (err) {
    console.error("Audit log insertion failed", err);
  }
}

/**
 * List all applications with filtering, search, and pagination
 */
router.get("/admin/applications", async (req: AuthenticatedRequest, res, next) => {
  try {
    const list = await db
      .select({
        id: applicationsTable.id,
        publicId: applicationsTable.publicId,
        status: applicationsTable.status,
        personalInfo: applicationsTable.personalInfo,
        businessInfo: applicationsTable.businessInfo,
        submittedAt: applicationsTable.submittedAt,
        createdAt: applicationsTable.createdAt,
        updatedAt: applicationsTable.updatedAt,
        assignedAdminId: applicationsTable.assignedAdminId,
        userEmail: usersTable.email,
        username: usersTable.username,
        companyName: usersTable.companyName,
      })
      .from(applicationsTable)
      .innerJoin(usersTable, eq(applicationsTable.userId, usersTable.id))
      .orderBy(desc(applicationsTable.submittedAt), desc(applicationsTable.createdAt));

    return res.json(list);
  } catch (err) {
    return next(err);
  }
});

/**
 * Export applications to CSV
 */
router.get("/admin/applications/export", async (req: AuthenticatedRequest, res, next) => {
  try {
    const list = await db
      .select({
        publicId: applicationsTable.publicId,
        status: applicationsTable.status,
        fullName: sql`applications.personal_info->>'fullName'`,
        email: usersTable.email,
        companyName: usersTable.companyName,
        phone: sql`applications.personal_info->>'phoneNumber'`,
        country: sql`applications.personal_info->>'country'`,
        businessWebsite: sql`applications.business_info->>'businessWebsite'`,
        adSpend: sql`applications.advertising_info->>'expectedSpend'`,
        platform: sql`applications.advertising_info->>'platform'`,
        submittedAt: applicationsTable.submittedAt,
      })
      .from(applicationsTable)
      .innerJoin(usersTable, eq(applicationsTable.userId, usersTable.id))
      .orderBy(desc(applicationsTable.submittedAt));

    if (list.length === 0) {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="applications-export.csv"');
      return res.send("No records found");
    }

    const headers = Object.keys(list[0]);
    const csvContent = [
      headers.join(","),
      ...list.map((row: any) =>
        headers
          .map((header) => {
            const val = row[header];
            if (val === null || val === undefined) return '""';
            const cleanStr = String(val).replace(/"/g, '""');
            return `"${cleanStr}"`;
          })
          .join(",")
      )
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="applications-export.csv"');
    return res.send(csvContent);
  } catch (err) {
    return next(err);
  }
});

/**
 * Detailed application view (Includes timeline, messages, documents, and accounts)
 */
router.get("/admin/applications/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const appId = Number(req.params.id);
    if (Number.isNaN(appId)) {
      return res.status(400).json({ error: "Invalid application ID." });
    }

    const [app] = await db
      .select({
        id: applicationsTable.id,
        publicId: applicationsTable.publicId,
        userId: applicationsTable.userId,
        status: applicationsTable.status,
        personalInfo: applicationsTable.personalInfo,
        businessInfo: applicationsTable.businessInfo,
        advertisingInfo: applicationsTable.advertisingInfo,
        accountRequirements: applicationsTable.accountRequirements,
        rejectionReason: applicationsTable.rejectionReason,
        assignedAdminId: applicationsTable.assignedAdminId,
        submittedAt: applicationsTable.submittedAt,
        createdAt: applicationsTable.createdAt,
        updatedAt: applicationsTable.updatedAt,
        userEmail: usersTable.email,
        username: usersTable.username,
        companyName: usersTable.companyName,
        telegramHandle: usersTable.telegramHandle,
        phoneNumber: usersTable.phoneNumber,
      })
      .from(applicationsTable)
      .innerJoin(usersTable, eq(applicationsTable.userId, usersTable.id))
      .where(eq(applicationsTable.id, appId))
      .limit(1);

    if (!app) {
      return res.status(404).json({ error: "Application not found." });
    }

    // Load sub-modules
    const timeline = await db
      .select()
      .from(applicationTimelineTable)
      .where(eq(applicationTimelineTable.applicationId, appId))
      .orderBy(applicationTimelineTable.id);

    const messages = await db
      .select()
      .from(applicationMessagesTable)
      .where(eq(applicationMessagesTable.applicationId, appId))
      .orderBy(applicationMessagesTable.id);

    const documents = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.applicationId, appId))
      .orderBy(documentsTable.id);

    const accounts = await db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.applicationId, appId))
      .orderBy(accountsTable.id);

    return res.json({
      application: app,
      timeline,
      messages,
      documents,
      accounts,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * Assign application reviewer
 */
router.post("/admin/applications/:id/assign", async (req: AuthenticatedRequest, res, next) => {
  try {
    const appId = Number(req.params.id);
    const reviewerId = req.body?.reviewerId;
    const adminId = req.userId || 0;

    if (Number.isNaN(appId) || !reviewerId) {
      return res.status(400).json({ error: "Invalid request parameters." });
    }

    await db
      .update(applicationsTable)
      .set({ assignedAdminId: Number(reviewerId), updatedAt: new Date() })
      .where(eq(applicationsTable.id, appId));

    const [reviewer] = await db
      .select({ username: usersTable.username })
      .from(usersTable)
      .where(eq(usersTable.id, Number(reviewerId)))
      .limit(1);

    const reviewerName = reviewer?.username || `ID ${reviewerId}`;

    await db.insert(applicationTimelineTable).values({
      applicationId: appId,
      event: "Application Assigned",
      description: `Application assigned to reviewer ${reviewerName}`,
      actorId: adminId,
    });

    await logAudit(adminId, "ASSIGN_REVIEWER", "application", appId, { reviewerId });

    return res.json({ message: "Reviewer assigned successfully." });
  } catch (err) {
    return next(err);
  }
});

/**
 * Request more information/documents from the client
 */
router.post("/admin/applications/:id/request-information", async (req: AuthenticatedRequest, res, next) => {
  try {
    const appId = Number(req.params.id);
    const reason = req.body?.reason;
    const docsNeeded = req.body?.docsNeeded;
    const adminId = req.userId || 0;

    if (Number.isNaN(appId) || !reason) {
      return res.status(400).json({ error: "Information request details are required." });
    }

    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.id, appId))
      .limit(1);

    if (!app) {
      return res.status(404).json({ error: "Application not found." });
    }

    const status = docsNeeded ? "DOCUMENTS_REQUIRED" : "INFORMATION_REQUIRED";

    await db
      .update(applicationsTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(applicationsTable.id, appId));

    // Timeline event
    await db.insert(applicationTimelineTable).values({
      applicationId: appId,
      event: "Revision Requested",
      description: reason,
      actorId: adminId,
    });

    // Notify user
    await db.insert(notificationsTable).values({
      userId: app.userId,
      title: "Action Required: Onboarding Revision Request",
      message: `Reviewer notes: "${reason}". Please log in and provide details.`,
    });

    // Send a message inside thread
    await db.insert(applicationMessagesTable).values({
      applicationId: appId,
      senderId: adminId,
      message: `⚠️ ACTION REQUIRED: ${reason}`,
    });

    await logAudit(adminId, "REQUEST_INFO", "application", appId, { reason, status });

    // Telegram admin notification (fail-soft)
    const infoEmail = await telegramNotify.userEmail(app.userId);
    void telegramNotify.notifyRequestStatusChange({ id: app.id, publicId: app.publicId, status }, { id: app.userId, email: infoEmail });

    return res.json({ message: "Information request sent successfully." });
  } catch (err) {
    return next(err);
  }
});

/**
 * Approve Application
 */
router.post("/admin/applications/:id/approve", async (req: AuthenticatedRequest, res, next) => {
  try {
    const appId = Number(req.params.id);
    const note = req.body?.note;
    const adminId = req.userId || 0;

    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.id, appId))
      .limit(1);

    if (!app) {
      return res.status(404).json({ error: "Application not found." });
    }

    await db
      .update(applicationsTable)
      .set({ status: "APPROVED", updatedAt: new Date() })
      .where(eq(applicationsTable.id, appId));

    // Timeline logs
    await db.insert(applicationTimelineTable).values({
      applicationId: appId,
      event: "Application Approved",
      description: note || "Application verified and approved. Pending ad account provisioning.",
      actorId: adminId,
    });

    // Auto-provision the ad account (ACTIVE) with the client-chosen name
    try {
      if (!(await hasProvisionedAccount(appId))) {
        const acc = await provisionAdAccount(app as any);
        await db.insert(applicationTimelineTable).values({
          applicationId: appId,
          event: "Ad Account Provisioned",
          description: `Account ${acc.accountId} activated for ${acc.platform} (${acc.name || "no custom name"}).`,
          actorId: adminId,
        });
        await db.insert(notificationsTable).values({
          userId: app.userId,
          title: "Ad Account Approved 🚀",
          message: `Your ${acc.platform} ad account (${acc.accountId}) is now APPROVED. Top up the minimum amount to get Business Manager access assigned.`,
        });
      }
    } catch (err) {
      console.error("Auto-provision failed for application", appId, err);
    }

    // Client notification
    await db.insert(notificationsTable).values({
      userId: app.userId,
      title: "Application Approved 🎉",
      message: "Congratulations! Your onboarding request is approved. We are provisioning your agency account now.",
    });

    await logAudit(adminId, "APPROVE_APPLICATION", "application", appId, { note });

    // Telegram admin notification (fail-soft)
    const approveEmail = await telegramNotify.userEmail(app.userId);
    void telegramNotify.notifyRequestStatusChange({ id: app.id, publicId: app.publicId, status: "APPROVED" }, { id: app.userId, email: approveEmail });

    return res.json({ message: "Application approved successfully." });
  } catch (err) {
    return next(err);
  }
});

/**
 * Reject Application
 */
router.post("/admin/applications/:id/reject", async (req: AuthenticatedRequest, res, next) => {
  try {
    const appId = Number(req.params.id);
    const reason = req.body?.reason;
    const adminId = req.userId || 0;

    if (!reason) {
      return res.status(400).json({ error: "Rejection reason is required." });
    }

    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.id, appId))
      .limit(1);

    if (!app) {
      return res.status(404).json({ error: "Application not found." });
    }

    await db
      .update(applicationsTable)
      .set({ status: "REJECTED", rejectionReason: reason, updatedAt: new Date() })
      .where(eq(applicationsTable.id, appId));

    // Timeline logs
    await db.insert(applicationTimelineTable).values({
      applicationId: appId,
      event: "Application Declined",
      description: reason,
      actorId: adminId,
    });

    // Client notification
    await db.insert(notificationsTable).values({
      userId: app.userId,
      title: "Application Status Update: Declined",
      message: `Review decision: ${reason}. Please contact support for options.`,
    });

    await logAudit(adminId, "REJECT_APPLICATION", "application", appId, { reason });

    // Telegram admin notification (fail-soft)
    const rejectEmail = await telegramNotify.userEmail(app.userId);
    void telegramNotify.notifyRequestStatusChange({ id: app.id, publicId: app.publicId, status: "REJECTED" }, { id: app.userId, email: rejectEmail });

    return res.json({ message: "Application status updated to rejected." });
  } catch (err) {
    return next(err);
  }
});

/**
 * Send admin message inside thread
 */
router.post("/admin/applications/:id/messages", async (req: AuthenticatedRequest, res, next) => {
  try {
    const appId = Number(req.params.id);
    const message = req.body?.message;
    const adminId = req.userId || 0;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message content cannot be empty." });
    }

    const [app] = await db
      .select({ userId: applicationsTable.userId })
      .from(applicationsTable)
      .where(eq(applicationsTable.id, appId))
      .limit(1);

    if (!app) {
      return res.status(404).json({ error: "Application not found." });
    }

    const [newMsg] = await db
      .insert(applicationMessagesTable)
      .values({
        applicationId: appId,
        senderId: adminId,
        message,
      })
      .returning();

    // Alert client
    await db.insert(notificationsTable).values({
      userId: app.userId,
      title: "New Message from Reviewer",
      message: `Support message: "${message.slice(0, 50)}..."`,
    });

    return res.status(201).json(newMsg);
  } catch (err) {
    return next(err);
  }
});

/**
 * Approve document
 */
router.post("/admin/documents/:id/approve", async (req: AuthenticatedRequest, res, next) => {
  try {
    const docId = Number(req.params.id);
    const adminId = req.userId || 0;

    const [doc] = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.id, docId))
      .limit(1);

    if (!doc) {
      return res.status(404).json({ error: "Document not found." });
    }

    await db
      .update(documentsTable)
      .set({ status: "APPROVED", updatedAt: new Date() })
      .where(eq(documentsTable.id, docId));

    await logAudit(adminId, "APPROVE_DOCUMENT", "document", docId);

    return res.json({ message: "Document marked approved." });
  } catch (err) {
    return next(err);
  }
});

/**
 * Reject document (Request replacement)
 */
router.post("/admin/documents/:id/reject", async (req: AuthenticatedRequest, res, next) => {
  try {
    const docId = Number(req.params.id);
    const { reason } = req.body;
    const adminId = req.userId || 0;

    if (!reason) {
      return res.status(400).json({ error: "Rejection explanation is required." });
    }

    const [doc] = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.id, docId))
      .limit(1);

    if (!doc) {
      return res.status(404).json({ error: "Document not found." });
    }

    await db
      .update(documentsTable)
      .set({ status: "REPLACEMENT_REQUIRED", rejectionReason: reason, updatedAt: new Date() })
      .where(eq(documentsTable.id, docId));

    // Force application state to DOCUMENTS_REQUIRED
    await db
      .update(applicationsTable)
      .set({ status: "DOCUMENTS_REQUIRED", updatedAt: new Date() })
      .where(eq(applicationsTable.id, doc.applicationId));

    // Client timeline
    await db.insert(applicationTimelineTable).values({
      applicationId: doc.applicationId,
      event: "Document Rejected",
      description: `Rejected ${doc.category}: ${reason}`,
      actorId: adminId,
    });

    await logAudit(adminId, "REJECT_DOCUMENT", "document", docId, { reason });

    return res.json({ message: "Document status updated, replacement requested." });
  } catch (err) {
    return next(err);
  }
});

/**
 * Super Admin user manager: List administrators and clients
 */
router.get("/admin/users", async (req: AuthenticatedRequest, res, next) => {
  try {
    const list = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
        role: usersTable.role,
        status: usersTable.status,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.id));

    return res.json(list);
  } catch (err) {
    return next(err);
  }
});

/**
 * Super Admin: Create new admin user
 */
router.post("/admin/users", requireSuperAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { email, password, username, role } = req.body;
    const adminId = req.userId || 0;

    if (!email || !password || !username || !role) {
      return res.status(400).json({ error: "Missing admin user parameters." });
    }

    // Check duplicate
    const [existing] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing) {
      return res.status(400).json({ error: "User already exists." });
    }

    const [newAdmin] = await db
      .insert(usersTable)
      .values({
        email: email.toLowerCase().trim(),
        password: hashPassword(password),
        username,
        role,
        status: "ACTIVE",
      })
      .returning();

    await logAudit(adminId, "CREATE_ADMIN_USER", "user", newAdmin.id, { role });

    const { password: _, ...profile } = newAdmin;
    return res.status(201).json(profile);
  } catch (err) {
    return next(err);
  }
});

/**
 * Super Admin: Escalate / alter user status
 */
router.patch("/admin/users/:id/role", requireSuperAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const targetUserId = Number(req.params.id);
    const { role, status } = req.body;
    const adminId = req.userId || 0;

    if (Number.isNaN(targetUserId)) {
      return res.status(400).json({ error: "Invalid target ID." });
    }

    // Prevent escalations of self role
    if (targetUserId === adminId) {
      return res.status(400).json({ error: "You cannot change your own authorization credentials." });
    }

    await db
      .update(usersTable)
      .set({
        role: role || sql`role`,
        status: status || sql`status`,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, targetUserId));

    await logAudit(adminId, "MODIFY_USER_PRIVILEGES", "user", targetUserId, { role, status });

    return res.json({ message: "User privileges modified successfully." });
  } catch (err) {
    return next(err);
  }
});

/**
 * List provisioned accounts
 */
router.get("/admin/accounts", async (req: AuthenticatedRequest, res, next) => {
  try {
    const list = await db
      .select({
        id: accountsTable.id,
        platform: accountsTable.platform,
        accountId: accountsTable.accountId,
        businessPortfolioId: accountsTable.businessPortfolioId,
        spendLimit: accountsTable.spendLimit,
        status: accountsTable.status,
        balance: accountsTable.balance,
        notes: accountsTable.notes,
        createdAt: accountsTable.createdAt,
        userEmail: usersTable.email,
        companyName: usersTable.companyName,
        publicApplicationId: applicationsTable.publicId,
      })
      .from(accountsTable)
      .innerJoin(usersTable, eq(accountsTable.userId, usersTable.id))
      .innerJoin(applicationsTable, eq(accountsTable.applicationId, applicationsTable.id))
      .orderBy(desc(accountsTable.id));

    return res.json(list);
  } catch (err) {
    return next(err);
  }
});

/**
 * Provision new ad account
 */
router.post("/admin/accounts", async (req: AuthenticatedRequest, res, next) => {
  try {
    const { applicationId, platform, accountId, businessPortfolioId, spendLimit, notes } = req.body;
    const adminId = req.userId || 0;

    if (!applicationId || !platform) {
      return res.status(400).json({ error: "Application reference and platform selection are required." });
    }

    const [app] = await db
      .select({ userId: applicationsTable.userId })
      .from(applicationsTable)
      .where(eq(applicationsTable.id, Number(applicationId)))
      .limit(1);

    if (!app) {
      return res.status(404).json({ error: "Associated client application not found." });
    }

    const [newAcc] = await db
      .insert(accountsTable)
      .values({
        applicationId: Number(applicationId),
        userId: app.userId,
        platform,
        accountId,
        businessPortfolioId,
        spendLimit,
        notes,
        status: "APPROVED",
      })
      .returning();

    // Notify user
    await db.insert(notificationsTable).values({
      userId: app.userId,
      title: "Ad Account Approved 🚀",
      message: `Your ${platform} ad account (${accountId || "Pending Setup"}) has been approved. Top up the minimum amount to get Business Manager access assigned.`,
    });

    await logAudit(adminId, "PROVISION_AD_ACCOUNT", "account", newAcc.id, { platform, accountId });

    return res.status(201).json(newAcc);
  } catch (err) {
    return next(err);
  }
});

/**
 * Update ad account state
 */
router.patch("/admin/accounts/:id/status", async (req: AuthenticatedRequest, res, next) => {
  try {
    const accId = Number(req.params.id);
    const { status } = req.body;
    const adminId = req.userId || 0;

    if (Number.isNaN(accId) || !status) {
      return res.status(400).json({ error: "Status field is required." });
    }

    const [acc] = await db
      .update(accountsTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(accountsTable.id, accId))
      .returning();

    if (!acc) {
      return res.status(404).json({ error: "Account record not found." });
    }

    // Notify user of status update
    await db.insert(notificationsTable).values({
      userId: acc.userId,
      title: `Ad Account Status Update: ${status}`,
      message: `Your ${acc.platform} ad account (${acc.accountId || "Pending"}) status was changed to: ${status}.`,
    });

    await logAudit(adminId, "CHANGE_ACCOUNT_STATUS", "account", accId, { status });

    return res.json(acc);
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /admin/accounts/:id/assign-bm
 * Assign Business Manager access to an approved ad account. Only allowed
 * after the client has topped up the minimum amount (balance >= MIN_LOAD_USD).
 * Sets the account to ACTIVE.
 */
router.post("/admin/accounts/:id/assign-bm", async (req: AuthenticatedRequest, res, next) => {
  try {
    const accId = Number(req.params.id);
    const { businessPortfolioId } = req.body || {};
    const adminId = req.userId || 0;

    if (Number.isNaN(accId)) {
      return res.status(400).json({ error: "Invalid account ID." });
    }

    const cleanBmId = String(businessPortfolioId || "").trim();
    if (!cleanBmId) {
      return res.status(400).json({ error: "Business Manager / Portfolio ID is required." });
    }

    const [acc] = await db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.id, accId))
      .limit(1);

    if (!acc) {
      return res.status(404).json({ error: "Ad account record not found." });
    }

    if (acc.status !== "APPROVED") {
      return res.status(400).json({ error: "This ad account is not in the approved state. Only approved accounts can be linked to a Business Manager." });
    }

    if (Number(acc.balance || 0) < MIN_LOAD_USD) {
      return res.status(400).json({
        error: `Client must top up at least $${MIN_LOAD_USD} before Business Manager access can be assigned. Current account balance: $${Number(acc.balance || 0).toFixed(2)}.`,
      });
    }

    const [updated] = await db
      .update(accountsTable)
      .set({
        businessPortfolioId: cleanBmId,
        status: "ACTIVE",
        updatedAt: new Date(),
      })
      .where(eq(accountsTable.id, accId))
      .returning();

    // Notify user
    await db.insert(notificationsTable).values({
      userId: acc.userId,
      title: "BM Access Assigned 🎯",
      message: `Business Manager access has been assigned to your ${acc.platform} ad account (${acc.accountId}). BM ID: ${cleanBmId}. Your account is now ACTIVE — start spending.`,
    });

    await logAudit(adminId, "ASSIGN_BM_ACCESS", "account", accId, { businessPortfolioId: cleanBmId });

    // Telegram notification (fail-soft)
    const bmEmail = await telegramNotify.userEmail(acc.userId);
    void telegramNotify.sendTelegramMessage(
      `🎯 BM Access Assigned\nAccount: ${acc.accountId} (${acc.platform})\nBM ID: ${cleanBmId}\nClient: ${bmEmail}\nStatus: ACTIVE`,
    );

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

/**
 * Fetch system audit logs (super admin / admin reviewers only)
 */
router.get("/admin/audit-log", async (req: AuthenticatedRequest, res, next) => {
  try {
    const logs = await db
      .select({
        id: auditLogsTable.id,
        action: auditLogsTable.action,
        targetType: auditLogsTable.targetType,
        targetId: auditLogsTable.targetId,
        ipAddress: auditLogsTable.ipAddress,
        metadata: auditLogsTable.metadata,
        createdAt: auditLogsTable.createdAt,
        actorEmail: usersTable.email,
        actorName: usersTable.username,
      })
      .from(auditLogsTable)
      .leftJoin(usersTable, eq(auditLogsTable.actorId, usersTable.id))
      .orderBy(desc(auditLogsTable.id))
      .limit(100);

    return res.json(logs);
  } catch (err) {
    return next(err);
  }
});

/**
 * List all client notifications (admin operations center view)
 */
router.get("/admin/notifications", async (req: AuthenticatedRequest, res, next) => {
  try {
    const list = await db
      .select({
        id: notificationsTable.id,
        userId: notificationsTable.userId,
        title: notificationsTable.title,
        message: notificationsTable.message,
        isRead: notificationsTable.isRead,
        createdAt: notificationsTable.createdAt,
        userEmail: usersTable.email,
        companyName: usersTable.companyName,
      })
      .from(notificationsTable)
      .innerJoin(usersTable, eq(notificationsTable.userId, usersTable.id))
      .orderBy(desc(notificationsTable.id))
      .limit(200);

    return res.json(list);
  } catch (err) {
    return next(err);
  }
});

export default router;
