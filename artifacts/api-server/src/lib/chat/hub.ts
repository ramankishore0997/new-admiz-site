import { Response } from "express";
import { db, visitorSessionsTable, conversationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

/**
 * In-memory realtime hub for the website live-chat system.
 *
 * - Pub/sub: subscribers are SSE responses. A user subscribes on their own
 *   channel; the operator subscribes to the admin channel.
 * - Presence: online status + last seen are kept in memory (no DB writes per
 *   heartbeat). `lastSeen` / current page are periodically persisted by
 *   persistPresence(). Agent (operator) presence is tracked the same way.
 *
 * Single-instance assumption: the API runs as one long-lived process on
 * Render. If multiple instances are ever added, this must move to Redis.
 */

export type ChatEvent =
  | { type: "message"; conversationId: number; senderType: "USER" | "OPERATOR"; messageId: number; message: string; createdAt: string }
  | { type: "presence"; online: boolean }
  | { type: "agent_online"; online: boolean }
  | { type: "conversation_updated"; conversationId: number };

interface Subscriber {
  res: Response;
}

/** userId -> active SSE subscribers (usually 1). */
const userChannels = new Map<number, Set<Subscriber>>();
/** Admin SSE subscribers (operator interface). */
const adminSubscribers = new Set<Subscriber>();

interface PresenceState {
  online: boolean;
  lastSeen: number;
  currentPage: string | null;
  dirty: boolean;
}

/** userId -> presence state (in-memory only). */
const presence = new Map<number, PresenceState>();

/** Last time an admin/operator was seen active (operator UI open). */
let lastAgentActive = 0;

function safeSend(res: Response, payload: unknown) {
  if (res.writableEnded || res.destroyed) return;
  try {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  } catch {
    // socket gone — removed by cleanup
  }
}

function heartbeat(sub: Subscriber) {
  safeSend(sub.res, { type: "__ping__" });
}

export function subscribeUser(userId: number, res: Response): () => void {
  let set = userChannels.get(userId);
  if (!set) {
    set = new Set();
    userChannels.set(userId, set);
  }
  const sub: Subscriber = { res };
  set.add(sub);
  markOnline(userId, null);
  const iv = setInterval(() => heartbeat(sub), 25000);
  return () => {
    clearInterval(iv);
    set!.delete(sub);
    if (set!.size === 0) userChannels.delete(userId);
    markOffline(userId);
  };
}

export function subscribeAdmin(res: Response): () => void {
  const sub: Subscriber = { res };
  adminSubscribers.add(sub);
  lastAgentActive = Date.now();
  const iv = setInterval(() => heartbeat(sub), 25000);
  return () => {
    clearInterval(iv);
    adminSubscribers.delete(sub);
  };
}

export function publishToUser(userId: number, event: ChatEvent) {
  const set = userChannels.get(userId);
  if (!set) return;
  for (const sub of set) safeSend(sub.res, event);
}

export function publishToAdmin(event: ChatEvent) {
  for (const sub of adminSubscribers) safeSend(sub.res, event);
}

export function markAgentActive() {
  lastAgentActive = Date.now();
}

/** Whether an operator is currently looking at the operator interface. */
export function isAgentOnline(): boolean {
  return Date.now() - lastAgentActive < 60_000;
}

export function markOnline(userId: number, currentPage: string | null) {
  let p = presence.get(userId);
  if (!p) {
    p = { online: true, lastSeen: Date.now(), currentPage, dirty: true };
    presence.set(userId, p);
  } else {
    p.online = true;
    p.lastSeen = Date.now();
    if (currentPage && p.currentPage !== currentPage) {
      p.currentPage = currentPage;
      p.dirty = true;
    }
  }
  publishToUser(userId, { type: "presence", online: true });
  publishToAdmin({ type: "conversation_updated", conversationId: 0 });
}

export function markOffline(userId: number) {
  const p = presence.get(userId);
  if (p && p.online) {
    p.online = false;
    p.lastSeen = Date.now();
    p.dirty = true;
  }
  publishToUser(userId, { type: "presence", online: false });
}

export function updatePage(userId: number, page: string | null) {
  const p = presence.get(userId);
  if (p) {
    if (p.currentPage !== page) {
      p.currentPage = page;
      p.dirty = true;
    }
    p.online = true;
    p.lastSeen = Date.now();
  } else {
    presence.set(userId, { online: true, lastSeen: Date.now(), currentPage: page, dirty: true });
  }
}

/** Operator-facing presence lookup (online + lastSeen epoch ms). */
export function getPresence(userId: number): { online: boolean; lastSeen: number; currentPage: string | null } {
  const p = presence.get(userId);
  if (p) return { online: p.online, lastSeen: p.lastSeen, currentPage: p.currentPage };
  return { online: false, lastSeen: 0, currentPage: null };
}

export function isUserOnline(userId: number): boolean {
  const p = presence.get(userId);
  return Boolean(p && p.online);
}

/** All users currently marked online (for the operator "Online Now" panel). */
export function getOnlineUsers(): Array<{ userId: number; currentPage: string | null }> {
  const out: Array<{ userId: number; currentPage: string | null }> = [];
  for (const [userId, p] of presence) {
    if (p.online) out.push({ userId, currentPage: p.currentPage });
  }
  return out;
}

let persistTimer: NodeJS.Timeout | null = null;

/**
 * Periodically persist dirty presence state to Neon. Called from the chat
 * route module at boot; heartbeats are NOT written per second.
 */
export function startPresencePersister(intervalMs = 60_000) {
  if (persistTimer) return;
  persistTimer = setInterval(() => {
    void persistPresence();
  }, intervalMs);
}

export async function persistPresence() {
  for (const [userId, p] of presence) {
    if (!p.dirty) continue;
    try {
      const lastSeen = new Date(p.lastSeen);
      await db
        .insert(visitorSessionsTable)
        .values({ userId, currentPage: p.currentPage, online: p.online, lastSeenAt: lastSeen, updatedAt: lastSeen })
        .onConflictDoUpdate({
          target: visitorSessionsTable.userId,
          set: { currentPage: p.currentPage, online: p.online, lastSeenAt: lastSeen, updatedAt: lastSeen },
        });
      const conv = await db
        .select({ id: conversationsTable.id })
        .from(conversationsTable)
        .where(eq(conversationsTable.userId, userId))
        .limit(1);
      if (conv[0]) {
        await db
          .update(conversationsTable)
          .set({ currentPage: p.currentPage, updatedAt: lastSeen })
          .where(eq(conversationsTable.id, conv[0].id));
      }
      p.dirty = false;
    } catch {
      // DB hiccup — retry on the next tick
    }
  }
}
