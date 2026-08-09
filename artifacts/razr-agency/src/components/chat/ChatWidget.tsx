import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, X, Send, LogIn } from "lucide-react";
import {
  fetchConversation,
  sendUserMessage,
  markRead,
  trackPage,
  type ChatMessage,
} from "@/lib/liveChat";

interface StreamEvent {
  type: "message" | "agent_online" | "presence" | "__ping__";
  conversationId?: number;
  senderType?: "USER" | "OPERATOR";
  messageId?: number;
  message?: string;
  createdAt?: string;
  online?: boolean;
}

export default function ChatWidget() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [agentOnline, setAgentOnline] = useState(false);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const esRef = useRef<EventSource | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const seenIds = useRef<Set<number>>(new Set());
  const openRef = useRef(false);
  openRef.current = open;

  const appendMessages = useCallback((incoming: ChatMessage[]) => {
    setMessages((prev) => {
      let changed = false;
      const next = [...prev];
      for (const m of incoming) {
        if (seenIds.current.has(m.id)) continue;
        seenIds.current.add(m.id);
        next.push(m);
        changed = true;
      }
      return changed ? next.sort((a, b) => a.id - b.id) : prev;
    });
  }, []);

  const loadConversation = useCallback(async () => {
    try {
      setLoading(true);
      const state = await fetchConversation();
      setAgentOnline(state.agentOnline);
      setUnread(state.conversation?.unreadUser ?? 0);
      appendMessages(state.messages);
    } catch {
      // not logged in / server issue — ignore
    } finally {
      setLoading(false);
    }
  }, [appendMessages]);

  useEffect(() => {
    if (!user || isLoading) return;
    loadConversation();
    trackPage(window.location.pathname);

    const es = new EventSource("/api/chat/stream?page=" + encodeURIComponent(window.location.pathname));
    esRef.current = es;
    es.onopen = () => setStreamActive(true);
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as StreamEvent;
        if (data.type === "__ping__") return;
        if (data.type === "agent_online") {
          setAgentOnline(Boolean(data.online));
          return;
        }
        if (data.type === "message" && data.senderType && data.message) {
          const msg: ChatMessage = {
            id: data.messageId!,
            senderType: data.senderType,
            message: data.message,
            readAt: null,
            createdAt: data.createdAt || new Date().toISOString(),
          };
          appendMessages([msg]);
          if (data.senderType === "OPERATOR" && !openRef.current) {
            setUnread((u) => u + 1);
          }
          if (openRef.current && data.senderType === "OPERATOR") {
            markRead();
          }
        }
      } catch {
        // malformed frame — ignore
      }
    };
    es.onerror = () => setStreamActive(false);

    return () => {
      es.close();
      esRef.current = null;
      setStreamActive(false);
    };
  }, [user, isLoading, loadConversation, appendMessages]);

  // Fallback polling when SSE is not connected.
  useEffect(() => {
    if (!user || streamActive) return;
    const iv = setInterval(loadConversation, 10_000);
    return () => clearInterval(iv);
  }, [user, streamActive, loadConversation]);

  // Presence heartbeat — keeps last_seen fresh even if SSE drops; cheap,
  // throttled client-side (max one POST per 30s per page).
  useEffect(() => {
    if (!user) return;
    const iv = setInterval(() => trackPage(window.location.pathname), 60_000);
    return () => clearInterval(iv);
  }, [user]);

  // Scroll to bottom when messages change.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setUnread(0);
      markRead();
      trackPage(window.location.pathname);
      loadConversation();
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const msg = await sendUserMessage(text);
      appendMessages([msg]);
      setInput("");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Send Failed",
        description: err?.message || "Could not send message. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  // Show launcher once auth state is known; guests get a sign-in prompt.
  if (isLoading) return null;

  return (
    <>
      {/* Launcher */}
      <button
        onClick={handleToggle}
        aria-label={open ? "Close live chat" : "Open live chat"}
        className="fixed bottom-24 right-4 md:bottom-28 md:right-6 z-[70] w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.35)] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-500 border-2 border-white text-[9px] font-black flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-[8.5rem] right-4 md:right-6 z-[70] w-[calc(100vw-2rem)] max-w-sm h-[30rem] max-h-[calc(100vh-10rem)] rounded-3xl border border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                  <MessageCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-sm font-black uppercase tracking-tight">Live Chat</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${agentOnline ? "bg-emerald-300 animate-pulse" : "bg-slate-300"}`} />
                    <span className="text-[10px] font-bold text-white/90">{agentOnline ? "Agent Online" : "Agent Offline — we'll reply soon"}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!user ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <MessageCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sign in to chat with our team in real time.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </Link>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {loading && (
                  <div className="text-center text-[10px] text-slate-400 py-6">Loading conversation...</div>
                )}
                {!loading && messages.length === 0 && (
                  <div className="text-center text-[11px] text-slate-500 py-8 leading-relaxed">
                    Hi {user.username}! 👋
                    <br />
                    Ask us anything — payments, ad accounts, applications.
                  </div>
                )}
                {messages.map((m) => (
                  m.senderType === "OPERATOR" ? (
                    <div key={m.id} className="flex flex-col">
                      <div className="text-xs leading-relaxed text-slate-800 whitespace-pre-wrap break-words">{m.message}</div>
                      <div className="text-[8px] text-slate-400 mt-1">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  ) : (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed break-words bg-emerald-600 text-white rounded-br-md">
                        {m.message}
                        <div className="text-[8px] mt-1 text-emerald-200">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white shrink-0 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  maxLength={2000}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500/60 transition-colors"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="w-10 h-10 shrink-0 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
