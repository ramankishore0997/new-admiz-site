import { Router } from "express";
import { db, supportTicketsTable, supportMessagesTable, usersTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { authenticate, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

/**
 * List support tickets (Client lists own; Admins see all)
 */
router.get("/support/tickets", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const role = req.user?.role || "CLIENT";
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const isAdmin = ["SUPER_ADMIN", "ADMIN", "REVIEWER", "SUPPORT"].includes(role);

    const list = isAdmin
      ? await db
          .select({
            id: supportTicketsTable.id,
            userId: supportTicketsTable.userId,
            subject: supportTicketsTable.subject,
            category: supportTicketsTable.category,
            priority: supportTicketsTable.priority,
            status: supportTicketsTable.status,
            createdAt: supportTicketsTable.createdAt,
            updatedAt: supportTicketsTable.updatedAt,
            userEmail: usersTable.email,
            companyName: usersTable.companyName,
          })
          .from(supportTicketsTable)
          .innerJoin(usersTable, eq(supportTicketsTable.userId, usersTable.id))
          .orderBy(desc(supportTicketsTable.id))
      : await db
          .select()
          .from(supportTicketsTable)
          .where(eq(supportTicketsTable.userId, userId))
          .orderBy(desc(supportTicketsTable.id));

    return res.json(list);
  } catch (err) {
    return next(err);
  }
});

/**
 * Open a new support ticket
 */
router.post("/support/tickets", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const { subject, category, priority, message } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!subject || !category || !priority || !message) {
      return res.status(400).json({ error: "Missing required ticket details." });
    }

    // Insert ticket record
    const [ticket] = await db
      .insert(supportTicketsTable)
      .values({
        userId,
        subject,
        category,
        priority,
        status: "OPEN",
      })
      .returning();

    // Insert initial message
    await db.insert(supportMessagesTable).values({
      ticketId: ticket.id,
      senderId: userId,
      message,
    });

    return res.status(201).json(ticket);
  } catch (err) {
    return next(err);
  }
});

/**
 * Fetch messages inside a support ticket
 */
router.get("/support/tickets/:id/messages", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const userRole = req.user?.role || "CLIENT";
    const ticketId = Number(req.params.id);

    if (Number.isNaN(ticketId) || !userId) {
      return res.status(400).json({ error: "Invalid parameters." });
    }

    const isAdmin = ["SUPER_ADMIN", "ADMIN", "REVIEWER", "SUPPORT"].includes(userRole);

    // Verify ownership or check if admin
    const [ticket] = isAdmin
      ? await db
          .select({ id: supportTicketsTable.id })
          .from(supportTicketsTable)
          .where(eq(supportTicketsTable.id, ticketId))
          .limit(1)
      : await db
          .select({ id: supportTicketsTable.id })
          .from(supportTicketsTable)
          .where(and(eq(supportTicketsTable.id, ticketId), eq(supportTicketsTable.userId, userId)))
          .limit(1);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found or access denied." });
    }

    const msgs = await db
      .select()
      .from(supportMessagesTable)
      .where(eq(supportMessagesTable.ticketId, ticketId))
      .orderBy(supportMessagesTable.id);

    return res.json(msgs);
  } catch (err) {
    return next(err);
  }
});

/**
 * Send a reply message in a support ticket
 */
router.post("/support/tickets/:id/messages", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const userRole = req.user?.role || "CLIENT";
    const ticketId = Number(req.params.id);
    const { message } = req.body;

    if (Number.isNaN(ticketId) || !userId || !message?.trim()) {
      return res.status(400).json({ error: "Message content is required." });
    }

    const isAdmin = ["SUPER_ADMIN", "ADMIN", "REVIEWER", "SUPPORT"].includes(userRole);

    // Verify ownership or check if admin
    const [ticket] = isAdmin
      ? await db
          .select()
          .from(supportTicketsTable)
          .where(eq(supportTicketsTable.id, ticketId))
          .limit(1)
      : await db
          .select()
          .from(supportTicketsTable)
          .where(and(eq(supportTicketsTable.id, ticketId), eq(supportTicketsTable.userId, userId)))
          .limit(1);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    const [newMsg] = await db
      .insert(supportMessagesTable)
      .values({
        ticketId,
        senderId: userId,
        message,
      })
      .returning();

    // Toggle status (or mark resolved/closed if admin closes)
    await db
      .update(supportTicketsTable)
      .set({
        status: isAdmin ? "RESOLVED" : "OPEN",
        updatedAt: new Date(),
      })
      .where(eq(supportTicketsTable.id, ticketId));

    return res.status(201).json(newMsg);
  } catch (err) {
    return next(err);
  }
});

export default router;
