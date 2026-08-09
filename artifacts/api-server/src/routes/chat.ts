import { Router } from "express";
import { db, conversationsTable, chatMessagesTable, usersTable, notificationsTable, type User } from "@workspace/db";
import { eq, and, desc, asc, isNull, sql } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthenticatedRequest } from "../middlewares/auth";
import * as telegramNotify from "../lib/telegram/service";
import {
  subscribeUser,
  subscribeAdmin,
  publishToUser,
  publishToAdmin,
  markAgentActive,
  isAgentOnline,
  markOnline,
  updatePage,
  getPresence,
  getOnlineUsers,
  isUserOnline,
  startPresencePersister,
  type ChatEvent,
} from "../lib/chat/hub";

const router = Router();

startPresencePersister();

const SENDER_USER = "USER";
const SENDER_OPERATOR = "OPERATOR";

function sseHeaders(res: import("express").Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();
  res.write(": connected\n\n");
}

function adminRoles(): string[] {
  return ["SUPER_ADMIN", "ADMIN", "REVIEWER", "SUPPORT"];
}

async function findOrCreateConversation(user: User) {
  const [existing] = await db.select().from(conversationsTable).where(eq(conversationsTable.userId, user.id)).limit(1);
  if (existing) return existing;
  const [created] = await db
    .insert(conversationsTable)
    .values({
      userId: user.id,
      status: "OPEN",
      currentPage: null,
      telegramHandle: user.telegramHandle || null,
      telegramId: user.telegramId || null,
      unreadOperator: 0,
      unreadUser: 0,
    })
    .onConflictDoNothing({ target: conversationsTable.userId })
    .returning();
  if (created) return created;
  const [row] = await db.select().from(conversationsTable).where(eq(conversationsTable.userId, user.id)).limit(1);
  return row!;
}

function emitChatEvent(userId: number, conversationId: number, senderType: "USER" | "OPERATOR", messageId: number, message: string, createdAt: string) {
  const event: ChatEvent = { type: "message", conversationId, senderType, messageId, message, createdAt };
  publishToUser(userId, event);
  publishToAdmin(event);
}

/* ============================ USER ENDPOINTS ============================ */

/** My conversation + message history + agent status. */
router.get("/chat/conversation", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    const conv = await findOrCreateConversation(user);
    const messages = await db
      .select()
      .from(chatMessagesTable)
      .where(eq(chatMessagesTable.conversationId, conv.id))
      .orderBy(asc(chatMessagesTable.id));

    const presence = getPresence(user.id);

    return res.json({
      conversation: {
        id: conv.id,
        status: conv.status,
        currentPage: conv.currentPage,
        unreadUser: conv.unreadUser,
      },
      messages: messages.map((m) => ({
        id: m.id,
        senderType: m.senderType,
        message: m.message,
        readAt: m.readAt,
        createdAt: m.createdAt,
      })),
      agentOnline: isAgentOnline(),
      online: presence.online,
    });
  } catch (err) {
    return next(err);
  }
});

/** User sends a chat message. */
router.post("/chat/messages", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    const message = String(req.body?.message || "").trim().slice(0, 2000);
    if (!message) return res.status(400).json({ error: "Message cannot be empty." });

    const conv = await findOrCreateConversation(user);
    const [prior] = await db
      .select({ id: chatMessagesTable.id })
      .from(chatMessagesTable)
      .where(eq(chatMessagesTable.conversationId, conv.id))
      .limit(1);
    const isFirst = !prior;

    const [msg] = await db
      .insert(chatMessagesTable)
      .values({ conversationId: conv.id, senderType: SENDER_USER, message })
      .returning();

    await db
      .update(conversationsTable)
      .set({
        status: "OPEN",
        unreadOperator: sql`${conversationsTable.unreadOperator} + 1`,
        lastMessageAt: new Date(),
        updatedAt: new Date(),
        telegramHandle: user.telegramHandle || conv.telegramHandle,
        telegramId: user.telegramId || conv.telegramId,
      })
      .where(eq(conversationsTable.id, conv.id));

    const conversation = { ...conv, unreadOperator: conv.unreadOperator + 1 };

    // Realtime: operator list + (echo back to user's other tabs)
    emitChatEvent(user.id, conv.id, SENDER_USER, msg.id, msg.message, msg.createdAt.toISOString());

    // Telegram notification (fail-soft) — identity from the DB record only.
    void telegramNotify.notifyNewChatMessage(conversation, user, msg.message, isFirst);

    return res.status(201).json({ id: msg.id, senderType: SENDER_USER, message: msg.message, createdAt: msg.createdAt, unreadUser: conversation.unreadUser });
  } catch (err) {
    return next(err);
  }
});

/** Mark operator messages as read (called when the chat widget is open). */
router.post("/chat/read", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    const [conv] = await db.select().from(conversationsTable).where(eq(conversationsTable.userId, user.id)).limit(1);
    if (!conv) return res.json({ ok: true });

    await db
      .update(chatMessagesTable)
      .set({ readAt: new Date() })
      .where(and(eq(chatMessagesTable.conversationId, conv.id), eq(chatMessagesTable.senderType, SENDER_OPERATOR), isNull(chatMessagesTable.readAt)));
    await db.update(conversationsTable).set({ unreadUser: 0, updatedAt: new Date() }).where(eq(conversationsTable.id, conv.id));
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

/** Throttled page tracking (client sends at most every 30s or on page change). */
router.post("/chat/presence", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    const page = String(req.body?.page || "").trim().slice(0, 200) || null;
    updatePage(user.id, page);
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

/** Agent online status (cheap poll, no SSE needed for this). */
router.get("/chat/agent-status", authenticate, async (_req, res) => {
  return res.json({ online: isAgentOnline() });
});

/** SSE stream for the logged-in user. */
router.get("/chat/stream", authenticate, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const page = String(req.query.page || "").toString().slice(0, 200) || null;

  sseHeaders(res);
  markOnline(user.id, page);

  const unsubscribe = subscribeUser(user.id, res);

  res.on("close", () => {
    unsubscribe();
    res.end();
  });

  res.write(`data: ${JSON.stringify({ type: "agent_online", online: isAgentOnline() })}\n\n`);
});

/* ============================ OPERATOR ENDPOINTS ============================ */

/** Users currently online (operator "Online Now" panel). */
router.get("/chat/admin/online-users", authenticate, requireAdmin, async (_req: AuthenticatedRequest, res, next) => {
  try {
    const online = getOnlineUsers();
    if (online.length === 0) return res.json({ users: [] });

    const ids = online.map((u) => u.userId);
    const idIn = sql`${usersTable.id} IN (${sql.join(ids.map((id) => sql`${id}`), sql`, `)})`;
    const userRows = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        telegramHandle: usersTable.telegramHandle,
        telegramId: usersTable.telegramId,
      })
      .from(usersTable)
      .where(idIn);
    const convRows = await db
      .select({ id: conversationsTable.id, userId: conversationsTable.userId })
      .from(conversationsTable)
      .where(sql`${conversationsTable.userId} IN (${sql.join(ids.map((id) => sql`${id}`), sql`, `)})`);
    const convByUser = new Map(convRows.map((c) => [c.userId, c.id]));

    return res.json({
      users: online.map((o) => {
        const row = userRows.find((r) => r.id === o.userId);
        return {
          userId: o.userId,
          username: row?.username || null,
          email: row?.email || null,
          telegramHandle: row?.telegramHandle || null,
          telegramId: row?.telegramId || null,
          currentPage: o.currentPage,
          conversationId: convByUser.get(o.userId) ?? null,
        };
      }),
    });
  } catch (err) {
    return next(err);
  }
});

/** Open (find or create) a conversation for a user so the operator can message them. */
router.post("/chat/admin/open-conversation", authenticate, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = Number(req.body?.userId);
    if (!Number.isInteger(userId)) return res.status(400).json({ error: "Invalid user." });
    const [userRow] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!userRow) return res.status(404).json({ error: "User not found." });
    const conv = await findOrCreateConversation(userRow);
    return res.json({ conversationId: conv.id });
  } catch (err) {
    return next(err);
  }
});

/** Conversation list for the operator UI (identity comes from the DB). */
router.get("/chat/admin/conversations", authenticate, requireAdmin, async (_req: AuthenticatedRequest, res, next) => {
  try {
    const conversations = await db
      .select({
        id: conversationsTable.id,
        userId: conversationsTable.userId,
        status: conversationsTable.status,
        currentPage: conversationsTable.currentPage,
        telegramHandle: conversationsTable.telegramHandle,
        telegramId: conversationsTable.telegramId,
        unreadOperator: conversationsTable.unreadOperator,
        unreadUser: conversationsTable.unreadUser,
        lastMessageAt: conversationsTable.lastMessageAt,
        username: usersTable.username,
        email: usersTable.email,
      })
      .from(conversationsTable)
      .innerJoin(usersTable, eq(conversationsTable.userId, usersTable.id))
      .orderBy(desc(conversationsTable.lastMessageAt));

    if (conversations.length === 0) return res.json({ conversations: [] });

    const ids = conversations.map((c) => c.id);
    const lastMessages = await db
      .select()
      .from(chatMessagesTable)
      .where(sql`${chatMessagesTable.conversationId} IN (${sql.join(ids.map((id) => sql`${id}`), sql`, `)})`)
      .orderBy(desc(chatMessagesTable.id))
      .limit(ids.length * 2);

    const lastByConv = new Map<number, typeof lastMessages[number]>();
    for (const m of lastMessages) {
      if (!lastByConv.has(m.conversationId)) lastByConv.set(m.conversationId, m);
    }

    return res.json({
      conversations: conversations.map((c) => {
        const presence = getPresence(c.userId);
        const last = lastByConv.get(c.id);
        return {
          ...c,
          online: presence.online,
          lastSeenAt: presence.online ? null : presence.lastSeen ? new Date(presence.lastSeen) : null,
          lastMessage: last ? { senderType: last.senderType, message: last.message, createdAt: last.createdAt } : null,
        };
      }),
      agentOnline: true,
    });
  } catch (err) {
    return next(err);
  }
});

/** Full history for one conversation (operator). */
router.get("/chat/admin/conversations/:id/messages", authenticate, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const convId = Number(req.params.id);
    if (!Number.isInteger(convId)) return res.status(400).json({ error: "Invalid conversation." });

    const [conv] = await db.select().from(conversationsTable).where(eq(conversationsTable.id, convId)).limit(1);
    if (!conv) return res.status(404).json({ error: "Conversation not found." });

    const messages = await db
      .select()
      .from(chatMessagesTable)
      .where(eq(chatMessagesTable.conversationId, convId))
      .orderBy(asc(chatMessagesTable.id));

    // Mark user messages read + clear operator unread counter.
    await db
      .update(chatMessagesTable)
      .set({ readAt: new Date() })
      .where(and(eq(chatMessagesTable.conversationId, convId), eq(chatMessagesTable.senderType, SENDER_USER), isNull(chatMessagesTable.readAt)));
    await db.update(conversationsTable).set({ unreadOperator: 0, updatedAt: new Date() }).where(eq(conversationsTable.id, convId));

    const [userRow] = await db.select().from(usersTable).where(eq(usersTable.id, conv.userId)).limit(1);
    const presence = getPresence(conv.userId);

    return res.json({
      conversation: {
        id: conv.id,
        userId: conv.userId,
        status: conv.status,
        currentPage: presence.currentPage || conv.currentPage,
        telegramHandle: conv.telegramHandle || userRow?.telegramHandle || null,
        telegramId: conv.telegramId || userRow?.telegramId || null,
        username: userRow?.username || null,
        email: userRow?.email || null,
        unreadUser: conv.unreadUser,
      },
      messages: messages.map((m) => ({ id: m.id, senderType: m.senderType, message: m.message, createdAt: m.createdAt })),
      online: presence.online,
      lastSeenAt: presence.online ? null : presence.lastSeen ? new Date(presence.lastSeen) : null,
    });
  } catch (err) {
    return next(err);
  }
});

/** Operator sends a reply — pushed to the user's website chatbot in realtime. */
router.post("/chat/admin/conversations/:id/messages", authenticate, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const operator = req.user!;
    const convId = Number(req.params.id);
    if (!Number.isInteger(convId)) return res.status(400).json({ error: "Invalid conversation." });

    const message = String(req.body?.message || "").trim().slice(0, 2000);
    if (!message) return res.status(400).json({ error: "Message cannot be empty." });

    const [conv] = await db.select().from(conversationsTable).where(eq(conversationsTable.id, convId)).limit(1);
    if (!conv) return res.status(404).json({ error: "Conversation not found." });

    const [msg] = await db
      .insert(chatMessagesTable)
      .values({ conversationId: convId, senderType: SENDER_OPERATOR, message })
      .returning();

    await db
      .update(conversationsTable)
      .set({
        unreadUser: sql`${conversationsTable.unreadUser} + 1`,
        lastMessageAt: new Date(),
        updatedAt: new Date(),
        currentPage: sql`${conversationsTable.currentPage}`,
      })
      .where(eq(conversationsTable.id, convId));

    markAgentActive();

    // Realtime to the user's chat widget.
    emitChatEvent(conv.userId, convId, SENDER_OPERATOR, msg.id, msg.message, msg.createdAt.toISOString());

    // In-app notification (unread badge on the website).
    try {
      await db.insert(notificationsTable).values({
        userId: conv.userId,
        title: "New Reply from Agent",
        message: message.slice(0, 300),
      });
    } catch {
      // fail-soft
    }

    return res.status(201).json({ id: msg.id, senderType: SENDER_OPERATOR, message: msg.message, createdAt: msg.createdAt, operatorId: operator.id });
  } catch (err) {
    return next(err);
  }
});

/** Operator clears unread counters / marks conversation as seen. */
router.post("/chat/admin/read", authenticate, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const convId = Number(req.body?.conversationId);
    if (!Number.isInteger(convId)) return res.status(400).json({ error: "Invalid conversation." });
    await db.update(conversationsTable).set({ unreadOperator: 0, updatedAt: new Date() }).where(eq(conversationsTable.id, convId));
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

/** SSE stream for the operator interface (live list + incoming messages). */
router.get("/chat/admin/stream", authenticate, requireAdmin, async (_req: AuthenticatedRequest, res) => {
  sseHeaders(res);
  markAgentActive();

  const unsubscribe = subscribeAdmin(res);
  const alive = setInterval(() => markAgentActive(), 30_000);

  res.on("close", () => {
    clearInterval(alive);
    unsubscribe();
    res.end();
  });

  res.write(`data: ${JSON.stringify({ type: "agent_online", online: true })}\n\n`);
});

export default router;
