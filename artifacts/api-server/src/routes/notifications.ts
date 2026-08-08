import { Router } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { authenticate, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

/**
 * Fetch unread and read notifications
 */
router.get("/notifications", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const list = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.userId, userId))
      .orderBy(notificationsTable.id);

    return res.json(list);
  } catch (err) {
    return next(err);
  }
});

/**
 * Mark a notification as read
 */
router.patch("/notifications/:id/read", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const notifId = Number(req.params.id);

    if (Number.isNaN(notifId) || !userId) {
      return res.status(400).json({ error: "Invalid request parameters." });
    }

    const [updated] = await db
      .update(notificationsTable)
      .set({ isRead: true })
      .where(and(eq(notificationsTable.id, notifId), eq(notificationsTable.userId, userId)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Notification not found." });
    }

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

/**
 * Mark all notifications as read
 */
router.post("/notifications/read-all", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await db
      .update(notificationsTable)
      .set({ isRead: true })
      .where(eq(notificationsTable.userId, userId));

    return res.json({ message: "All notifications marked as read." });
  } catch (err) {
    return next(err);
  }
});

export default router;
