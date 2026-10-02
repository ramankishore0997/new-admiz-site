import { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, RefreshCw, MessagesSquare, Sparkles } from "lucide-react";

interface OperatorConversation {
  id: number;
  userId: number;
  status: string;
  currentPage: string | null;
  telegramHandle: string | null;
  telegramId: string | null;
  unreadOperator: number;
  unreadUser: number;
  lastMessageAt: string;
  username: string | null;
  email: string | null;
  online: boolean;
  lastSeenAt: string | null;
  lastMessage: { senderType: string; message: string; createdAt: string } | null;
}

interface OperatorMessage {
  id: number;
  senderType: "USER" | "OPERATOR";
  message: string;
  createdAt: string;
}

interface OnlineUser {
  userId: number;
  username: string | null;
  email: string | null;
  telegramHandle: string | null;
  telegramId: string | null;
  currentPage: string | null;
  conversationId: number | null;
}

interface StreamEvent {
  type: "message" | "conversation_updated" | "__ping__";
  conversationId?: number;
  senderType?: "USER" | "OPERATOR";
  message?: string;
  createdAt?: string;
}

const timeAgo = (iso: string | null): string => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString();
};

export default function AdminLiveChat() {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<OperatorConversation[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<OperatorMessage[]>([]);
  const [convDetail, setConvDetail] = useState<OperatorConversation | null>(null);
  const [online, setOnline] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const esRef = useRef<EventSource | null>(null);

  const loadList = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/admin/conversations", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setConversations(data.conversations ?? []);
    } catch {
      // ignore
    }
  }, []);

  const loadOnline = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/admin/online-users", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setOnlineUsers(data.users ?? []);
    } catch {
      // ignore
    }
  }, []);

  const loadAll = useCallback(async () => {
    await Promise.all([loadList(), loadOnline()]);
  }, [loadList, loadOnline]);

  const loadMessages = useCallback(async (convId: number) => {
    try {
      const res = await fetch(`/api/chat/admin/conversations/${convId}/messages`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages ?? []);
      setConvDetail(data.conversation ?? null);
      setOnline(Boolean(data.online));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadAll();

    const es = new EventSource("/api/chat/admin/stream");
    esRef.current = es;
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as StreamEvent;
        if (data.type === "__ping__") return;
        loadAll();
        if (data.type === "message" && data.conversationId && data.senderType === "USER") {
          if (selectedIdRef.current === data.conversationId) {
            loadMessages(data.conversationId);
          }
        }
      } catch {
        // ignore
      }
    };
    es.onerror = () => {};

    const iv = setInterval(loadAll, 5000);
    return () => {
      es.close();
      esRef.current = null;
      clearInterval(iv);
    };
  }, [loadAll, loadMessages]);

  const selectedIdRef = useRef<number | null>(null);
  selectedIdRef.current = selectedId;

  useEffect(() => {
    if (selectedId !== null) {
      loadMessages(selectedId);
      setLoading(false);
    }
  }, [selectedId, loadMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, selectedId]);

  const handleSelect = (convId: number) => {
    setSelectedId(convId);
    setLoading(true);
  };

  const handleOpenUser = async (u: OnlineUser) => {
    try {
      let convId = u.conversationId;
      if (!convId) {
        const res = await fetch("/api/chat/admin/open-conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId: u.userId }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Could not open conversation");
        }
        const data = await res.json();
        convId = data.conversationId;
      }
      setSelectedId(convId);
      setLoading(true);
      loadAll();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Could not open conversation.",
      });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/chat/admin/conversations/${selectedId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not send message");
      }
      setInput("");
      await loadMessages(selectedId);
      loadList();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Send Failed",
        description: err?.message || "Could not send message.",
      });
    } finally {
      setSending(false);
    }
  };

  const selected = conversations.find((c) => c.id === selectedId) || convDetail;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Real-time Support
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
              <MessageCircle className="w-7 h-7 text-cyan-400" /> Live Chat Desk
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Realtime customer conversations — replies are sent directly on the website.</p>
          </div>
          <button
            onClick={loadList}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-black uppercase tracking-wider text-white transition-colors cursor-pointer shadow-lg"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Conversation list */}
          <div className="lg:col-span-5 rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-black">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-xs font-black uppercase tracking-tight text-white">ONLINE NOW</div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {onlineUsers.length} online
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto divide-y divide-zinc-800/60 border-b border-zinc-800">
              {onlineUsers.length === 0 && (
                <div className="text-center text-[10px] text-zinc-500 py-4 px-6">No users online right now.</div>
              )}
              {onlineUsers.map((u) => (
                <button
                  key={u.userId}
                  onClick={() => handleOpenUser(u)}
                  className={`w-full text-left px-5 py-3 hover:bg-zinc-900/50 transition-colors cursor-pointer ${
                    selectedId !== null && u.conversationId === selectedId ? "bg-black border-l-4 border-cyan-400" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-sm font-bold text-white truncate">{u.username || u.email || `User #${u.userId}`}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0">ONLINE</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-zinc-400">
                    <span className="font-mono">ID: #{u.userId}</span>
                    {u.telegramId ? (
                      <span className="font-mono">Telegram ID: {u.telegramId}</span>
                    ) : u.telegramHandle ? (
                      <span className="font-mono">Telegram: @{u.telegramHandle.replace(/^@/, "")}</span>
                    ) : null}
                  </div>
                  {u.currentPage && <div className="mt-0.5 text-[10px] text-zinc-500 font-mono truncate">Page: {u.currentPage}</div>}
                </button>
              ))}
            </div>

            {/* Conversation list header */}
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-black">
              <div className="text-xs font-black uppercase tracking-tight text-white">LIVE CHATS</div>
              <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-full">
                {conversations.length} total
              </span>
            </div>

            <div className="max-h-[28rem] overflow-y-auto divide-y divide-zinc-800/60">
              {conversations.length === 0 && (
                <div className="text-center text-xs text-zinc-500 py-12 px-6 leading-relaxed">
                  <MessagesSquare className="w-8 h-8 mx-auto mb-3 text-zinc-600" />
                  No conversations yet.
                  <br />
                  When a user opens the website chatbot and sends a message, it appears here instantly.
                </div>
              )}

              {[...conversations]
                .sort((a, b) => Number(b.online) - Number(a.online) || new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
                .map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  className={`w-full text-left px-5 py-4 hover:bg-zinc-900/50 transition-colors cursor-pointer ${
                    selectedId === c.id ? "bg-black border-l-4 border-cyan-400" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${c.online ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`} />
                      <span className="text-sm font-bold text-white truncate">{c.username || c.email || `User #${c.userId}`}</span>
                      {c.online && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                          ONLINE
                        </span>
                      )}
                      {c.unreadOperator > 0 && (
                        <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shrink-0">
                          {c.unreadOperator}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-zinc-500 shrink-0">{timeAgo(c.lastMessageAt)}</span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-zinc-400">
                    <span className="font-mono">ID: #{c.userId}</span>
                    {c.telegramId ? (
                      <span className="font-mono">Telegram ID: {c.telegramId}</span>
                    ) : c.telegramHandle ? (
                      <span className="font-mono">Telegram: @{c.telegramHandle.replace(/^@/, "")}</span>
                    ) : null}
                    <span className={c.online ? "text-emerald-400 font-bold" : "text-zinc-500"}>
                      {c.online ? "● Online" : c.lastSeenAt ? `Last seen ${timeAgo(c.lastSeenAt)}` : "Offline"}
                    </span>
                  </div>

                  {c.currentPage && (
                    <div className="mt-1 text-[10px] text-zinc-500 truncate font-mono">Page: {c.currentPage}</div>
                  )}

                  <div className="mt-1.5 text-[11px] text-zinc-300 truncate">
                    {c.lastMessage ? (
                      <>
                        <span className="font-bold uppercase tracking-wider text-[9px] text-zinc-400">
                          {c.lastMessage.senderType === "USER" ? `${(c.username || "User").split(" ")[0]}:` : "Operator:"}
                        </span>{" "}
                        {c.lastMessage.message}
                      </>
                    ) : (
                      <span className="text-zinc-500 italic">No messages yet</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Conversation thread */}
          <div className="lg:col-span-7 rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col min-h-[30rem]">
            {!selectedId || !selected ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <p className="text-xs text-zinc-400">Select a conversation to view history and reply.</p>
              </div>
            ) : (
              <>
                {/* Thread header */}
                <div className="px-5 py-4 border-b border-zinc-800 bg-black shrink-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-black uppercase tracking-tight text-white truncate">
                        {selected.username || selected.email || `User #${selected.userId}`}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-zinc-400">
                        <span className="font-mono">User ID: #{selected.userId}</span>
                        {selected.telegramId ? (
                          <span className="font-mono">Telegram ID: {selected.telegramId}</span>
                        ) : selected.telegramHandle ? (
                          <span className="font-mono">Telegram: @{selected.telegramHandle.replace(/^@/, "")}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`w-2 h-2 rounded-full ${online ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${online ? "text-emerald-400" : "text-zinc-500"}`}>
                        {online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                  {selected.currentPage && (
                    <div className="mt-1 text-[10px] text-zinc-500 font-mono">Current page: {selected.currentPage}</div>
                  )}
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/60 min-h-0">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.senderType === "USER" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed break-words ${
                          m.senderType === "USER"
                            ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white rounded-br-md shadow-lg shadow-violet-600/20 font-medium"
                            : "bg-[#0c0c12] border border-zinc-800 text-zinc-200 rounded-bl-md"
                        }`}
                      >
                        {m.message}
                        <div className={`text-[8px] mt-1 ${m.senderType === "USER" ? "text-cyan-200" : "text-zinc-500"}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-3 border-t border-zinc-800 bg-black shrink-0 flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a reply..."
                    maxLength={2000}
                    className="flex-1 bg-[#060608] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-500"
                  />
                  <button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-lg shadow-violet-600/20"
                    aria-label="Send reply"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
