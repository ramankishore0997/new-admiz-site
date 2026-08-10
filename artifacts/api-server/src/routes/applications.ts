import { Router } from "express";
import { db, applicationsTable, applicationTimelineTable, applicationMessagesTable, applicationFeesTable, accountLoadsTable, paymentsTable, AD_ACCOUNT_APPLICATION_FEE_USD, type NewApplication, type NewTimelineEvent } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { authenticate, type AuthenticatedRequest } from "../middlewares/auth";
import * as telegramNotify from "../lib/telegram/service";

const router = Router();

/**
 * Auto-advance SUBMITTED applications to UNDER_REVIEW once enough time has
 * passed since submission — gives the client a live sense of progress while
 * the admin team catches up. Logs a timeline event the client can see.
 */
const REVIEW_START_DELAY_MS = 30 * 60 * 1000;

async function maybeAdvanceReview(app: { id: number; status: string; submittedAt: Date | string | null }) {
  if (app.status !== "SUBMITTED" || !app.submittedAt) return app.status;
  const elapsed = Date.now() - new Date(app.submittedAt).getTime();
  if (elapsed < REVIEW_START_DELAY_MS) return app.status;

  await db
    .update(applicationsTable)
    .set({ status: "UNDER_REVIEW", updatedAt: new Date() })
    .where(eq(applicationsTable.id, app.id));

  await db.insert(applicationTimelineTable).values({
    applicationId: app.id,
    event: "Application Under Review",
    description: "Compliance verification started — our review team is now checking your application details.",
  });

  return "UNDER_REVIEW";
}

/**
 * List active client's applications
 */
router.get("/applications", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const list = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.userId, userId))
      .orderBy(applicationsTable.id);

    const advanced = await Promise.all(
      list.map(async (app) => {
        const status = await maybeAdvanceReview(app);
        return status !== app.status ? { ...app, status } : app;
      }),
    );

    return res.json(advanced);
  } catch (err) {
    return next(err);
  }
});

/**
 * Create a new application draft
 */
router.post("/applications", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Clients may apply for multiple ad accounts from one main wallet,
    // so a new draft is always created (no single-draft limit).

    // Generate unique Application ID
    const year = new Date().getFullYear();
    const stamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    const publicId = `RAZR-${year}-${stamp}${random}`;

    const [newApp] = await db
      .insert(applicationsTable)
      .values({
        userId,
        publicId,
        status: "DRAFT",
        personalInfo: {},
        businessInfo: {},
        advertisingInfo: {},
        accountRequirements: {},
      })
      .returning();

    // Log timeline event
    await db.insert(applicationTimelineTable).values({
      applicationId: newApp.id,
      event: "Application Started",
      description: "Client initialized a new agency ad account application.",
      actorId: userId,
    });

    return res.status(201).json(newApp);
  } catch (err) {
    return next(err);
  }
});

/**
 * Fetch detailed application info
 */
router.get("/applications/:id", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const appId = Number(req.params.id);

    if (Number.isNaN(appId)) {
      return res.status(400).json({ error: "Invalid application ID." });
    }

    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, appId), eq(applicationsTable.userId, userId || 0)))
      .limit(1);

    if (!app) {
      return res.status(404).json({ error: "Application not found or access denied." });
    }

    const status = await maybeAdvanceReview(app);

    return res.json(status !== app.status ? { ...app, status } : app);
  } catch (err) {
    return next(err);
  }
});

/**
 * Patch application details (autosave draft edits)
 */
router.patch("/applications/:id", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const appId = Number(req.params.id);
    const { personalInfo, businessInfo, advertisingInfo, accountRequirements } = req.body;

    if (Number.isNaN(appId)) {
      return res.status(400).json({ error: "Invalid application ID." });
    }

    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, appId), eq(applicationsTable.userId, userId || 0)))
      .limit(1);

    if (!app) {
      return res.status(404).json({ error: "Application not found." });
    }

    // Block changes after submission unless in requested-revision state
    if (app.status !== "DRAFT" && app.status !== "INFORMATION_REQUIRED" && app.status !== "DOCUMENTS_REQUIRED") {
      return res.status(400).json({ error: "Cannot modify a submitted application." });
    }

    // Merge changes safely
    const updated = await db
      .update(applicationsTable)
      .set({
        personalInfo: personalInfo ? { ...app.personalInfo, ...personalInfo } : app.personalInfo,
        businessInfo: businessInfo ? { ...app.businessInfo, ...businessInfo } : app.businessInfo,
        advertisingInfo: advertisingInfo ? { ...app.advertisingInfo, ...advertisingInfo } : app.advertisingInfo,
        accountRequirements: accountRequirements ? { ...app.accountRequirements, ...accountRequirements } : app.accountRequirements,
        updatedAt: new Date(),
      })
      .where(eq(applicationsTable.id, appId))
      .returning();

    return res.json(updated[0]);
  } catch (err) {
    return next(err);
  }
});

/**
 * Submit application
 */
router.post("/applications/:id/submit", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const appId = Number(req.params.id);

    if (Number.isNaN(appId)) {
      return res.status(400).json({ error: "Invalid application ID." });
    }

    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, appId), eq(applicationsTable.userId, userId || 0)))
      .limit(1);

    if (!app) {
      return res.status(404).json({ error: "Application not found." });
    }

    if (app.status !== "DRAFT" && app.status !== "INFORMATION_REQUIRED" && app.status !== "DOCUMENTS_REQUIRED") {
      return res.status(400).json({ error: "Application is already submitted." });
    }

    // Charge the per-account application fee once per application submission
    const [existingFee] = await db
      .select()
      .from(applicationFeesTable)
      .where(and(eq(applicationFeesTable.applicationId, appId), eq(applicationFeesTable.userId, userId || 0)))
      .limit(1);

    if (!existingFee) {
      // Main wallet = full paid deposits (no commission on deposits).
      const paidRows = await db
        .select({ amount: paymentsTable.amount })
        .from(paymentsTable)
        .where(and(eq(paymentsTable.userId, userId || 0), eq(paymentsTable.status, "PAID")));

      const credited = paidRows.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      const feeRows = await db
        .select({ amount: applicationFeesTable.amount })
        .from(applicationFeesTable)
        .where(eq(applicationFeesTable.userId, userId || 0));

      const feesPaid = feeRows.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

      // Balance loads (main wallet → ad account wallet) incl. commission
      const loadRows = await db
        .select({ total: accountLoadsTable.total })
        .from(accountLoadsTable)
        .where(eq(accountLoadsTable.userId, userId || 0));

      const loadsPaid = loadRows.reduce((sum, l) => sum + (Number(l.total) || 0), 0);

      if (credited - feesPaid - loadsPaid < AD_ACCOUNT_APPLICATION_FEE_USD) {
        return res.status(402).json({
          error: `Insufficient main-wallet balance. The application fee is $${AD_ACCOUNT_APPLICATION_FEE_USD} per ad account (includes unlimited free replacements). Top up your main wallet — deposits are commission-free and credited in full.`,
        });
      }

      await db.insert(applicationFeesTable).values({
        userId: userId || 0,
        applicationId: appId,
        amount: String(AD_ACCOUNT_APPLICATION_FEE_USD),
        description: "Ad account application fee (includes unlimited replacement)",
      });

      // Log fee deduction in timeline
      await db.insert(applicationTimelineTable).values({
        applicationId: appId,
        event: "Application Fee Deducted",
        description: `$${AD_ACCOUNT_APPLICATION_FEE_USD} application fee deducted from ledger (per ad account, includes unlimited replacement).`,
        actorId: userId,
      });
    }

    const [updated] = await db
      .update(applicationsTable)
      .set({
        status: "SUBMITTED",
        submittedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(applicationsTable.id, appId))
      .returning();

    // Log event in timeline
    await db.insert(applicationTimelineTable).values({
      applicationId: appId,
      event: "Application Submitted",
      description: "Onboarding form submitted to Razr Marketing review panel.",
      actorId: userId,
    });

    // Telegram admin notification (fail-soft)
    const email = await telegramNotify.userEmail(userId || 0);
    void telegramNotify.notifyNewRequest(
      { id: updated.id, publicId: updated.publicId, advertisingInfo: updated.advertisingInfo },
      { id: userId || 0, email },
    );

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

/**
 * Fetch application timeline logs
 */
router.get("/applications/:id/timeline", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const appId = Number(req.params.id);

    if (Number.isNaN(appId)) {
      return res.status(400).json({ error: "Invalid ID." });
    }

    // Verify ownership
    const [app] = await db
      .select({ id: applicationsTable.id, status: applicationsTable.status, submittedAt: applicationsTable.submittedAt })
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, appId), eq(applicationsTable.userId, userId || 0)))
      .limit(1);

    if (!app) {
      return res.status(404).json({ error: "Application not found." });
    }

    await maybeAdvanceReview(app);

    const timeline = await db
      .select()
      .from(applicationTimelineTable)
      .where(eq(applicationTimelineTable.applicationId, appId))
      .orderBy(applicationTimelineTable.id);

    return res.json(timeline);
  } catch (err) {
    return next(err);
  }
});

/**
 * Fetch messages for a specific application
 */
router.get("/applications/:id/messages", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const appId = Number(req.params.id);

    if (Number.isNaN(appId)) {
      return res.status(400).json({ error: "Invalid ID." });
    }

    // Verify ownership
    const [app] = await db
      .select({ id: applicationsTable.id })
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, appId), eq(applicationsTable.userId, userId || 0)))
      .limit(1);

    if (!app) {
      return res.status(404).json({ error: "Application not found." });
    }

    const msgs = await db
      .select()
      .from(applicationMessagesTable)
      .where(eq(applicationMessagesTable.applicationId, appId))
      .orderBy(applicationMessagesTable.id);

    return res.json(msgs);
  } catch (err) {
    return next(err);
  }
});

/**
 * Post a new message for a specific application
 */
router.post("/applications/:id/messages", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const appId = Number(req.params.id);
    const { message, attachments } = req.body;

    if (Number.isNaN(appId)) {
      return res.status(400).json({ error: "Invalid ID." });
    }

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message body cannot be empty." });
    }

    // Verify ownership
    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, appId), eq(applicationsTable.userId, userId || 0)))
      .limit(1);

    if (!app) {
      return res.status(404).json({ error: "Application not found." });
    }

    const [newMsg] = await db
      .insert(applicationMessagesTable)
      .values({
        applicationId: appId,
        senderId: userId || 0,
        message,
        attachments,
      })
      .returning();

    // If client responds while application is in revision state, alert reviewer/system if needed
    if (app.status === "INFORMATION_REQUIRED" || app.status === "DOCUMENTS_REQUIRED") {
      await db
        .update(applicationsTable)
        .set({ status: "UNDER_REVIEW", updatedAt: new Date() })
        .where(eq(applicationsTable.id, appId));

      await db.insert(applicationTimelineTable).values({
        applicationId: appId,
        event: "Information Submitted",
        description: "Client submitted message response/revisions to support.",
        actorId: userId,
      });
    }

    return res.status(201).json(newMsg);
  } catch (err) {
    return next(err);
  }
});

export default router;
