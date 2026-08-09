export interface ChatMessage {
  id: number;
  senderType: "USER" | "OPERATOR";
  message: string;
  readAt: string | null;
  createdAt: string;
}

export interface UserConversation {
  id: number;
  status: string;
  currentPage: string | null;
  unreadUser: number;
}

export interface ConversationState {
  conversation: UserConversation | null;
  messages: ChatMessage[];
  agentOnline: boolean;
  online: boolean;
}

export async function fetchConversation(): Promise<ConversationState> {
  const res = await fetch("/api/chat/conversation", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load conversation");
  return res.json();
}

export async function sendUserMessage(message: string): Promise<ChatMessage> {
  const res = await fetch("/api/chat/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Could not send message");
  }
  return res.json();
}

export async function markRead(): Promise<void> {
  await fetch("/api/chat/read", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }).catch(() => {});
}

let lastPageSent = 0;
let lastPageValue: string | null = null;

/** Throttled page tracking — max one POST per 30s unless the page changed. */
export async function trackPage(page: string): Promise<void> {
  const now = Date.now();
  if (page === lastPageValue && now - lastPageSent < 30_000) return;
  lastPageValue = page;
  lastPageSent = now;
  await fetch("/api/chat/presence", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ page }),
  }).catch(() => {});
}
