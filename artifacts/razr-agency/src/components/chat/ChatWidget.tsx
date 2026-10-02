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
  const [incomingPreview, setIncomingPreview] = useState<{ message: string; createdAt: string } | null>(null);
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
      const lastOperator = [...state.messages].reverse().find((m) => m.senderType === "OPERATOR");
      if ((state.conversation?.unreadUser ?? 0) > 0 && lastOperator && !openRef.current) {
        setIncomingPreview({ message: lastOperator.message, createdAt: lastOperator.createdAt });
      }
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
            setIncomingPreview({ message: data.message, createdAt: data.createdAt || new Date().toISOString() });
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

  // Presence heartbeat
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
    setIncomingPreview(null);
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

  if (isLoading) return null;

  return (
    <>
      {/* Incoming message preview */}
      {!open && incomingPreview && (
        <div className="fixed bottom-44 right-4 md:right-6 z-[70] w-[calc(100vw-2rem)] max-w-sm rounded-3xl border border-zinc-800 bg-[#060608]/95 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-black border-b border-zinc-800 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Support Desk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-400">
                {new Date(incomingPreview.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <button onClick={() => setIncomingPreview(null)} className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer" aria-label="Dismiss message">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="p-4 bg-[#060608] flex-1 min-h-0">
            <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
              {incomingPreview.message}
            </p>
          </div>
          <button
            onClick={handleToggle}
            className="w-full px-4 py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-[11px] font-black uppercase tracking-widest hover:opacity-95 transition-all cursor-pointer shrink-0"
          >
            Reply Now
          </button>
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={handleToggle}
        aria-label={open ? "Close live chat" : "Open live chat"}
        className="fixed bottom-24 right-4 md:bottom-28 md:right-6 z-[70] w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.35)] flex items-center justify-center hover:scale-105 transition-all cursor-pointer border border-violet-400/40 font-bold"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-rose-500 border-2 border-black text-[9px] font-black text-white flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-[8.5rem] right-4 md:right-6 z-[70] w-[calc(100vw-2rem)] max-w-sm h-[30rem] max-h-[calc(100vh-10rem)] rounded-3xl border border-zinc-800 bg-[#060608]/95 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 bg-black border-b border-zinc-800 text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/30 flex items-center justify-center text-cyan-300">
                  <MessageCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-sm font-black uppercase tracking-tight text-white">
                    Live <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Support</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${agentOnline ? "bg-cyan-400 animate-pulse" : "bg-zinc-500"}`} />
                    <span className="text-[10px] font-bold text-zinc-400">{agentOnline ? "Agent Online" : "Desk Active — instant reply"}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!user ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center bg-black">
              <div className="w-12 h-12 rounded-2xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-cyan-300">
                <MessageCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sign in to chat with our operations desk in real time.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest hover:opacity-95 transition-all shadow-lg shadow-violet-600/20"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </Link>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/60">
                {loading && (
                  <div className="text-center text-[10px] text-zinc-500 py-6">Loading conversation...</div>
                )}
                {!loading && messages.length === 0 && (
                  <div className="text-center text-[11px] text-zinc-400 py-8 leading-relaxed">
                    Hi {user.username}! 👋
                    <br />
                    Ask us anything — top-ups, account lines, scaling rules.
                  </div>
                )}
                {messages.map((m) => (
                  m.senderType === "OPERATOR" ? (
                    <div key={m.id} className="flex flex-col">
                      <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed break-words bg-[#0c0c10] text-zinc-200 border border-zinc-800 rounded-bl-md">
                        {m.message}
                        <div className="text-[8px] text-zinc-400 mt-1">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed break-words bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-br-md shadow-lg shadow-violet-600/10">
                        {m.message}
                        <div className="text-[8px] mt-1 text-cyan-200 font-bold">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-3 border-t border-zinc-800 bg-black shrink-0 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  maxLength={2000}
                  className="flex-1 bg-[#060608] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center hover:opacity-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-black"
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
