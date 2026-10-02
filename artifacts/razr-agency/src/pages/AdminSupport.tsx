import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Clock,
  AlertCircle,
  Loader2,
  ChevronRight,
  Send,
  User,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Building,
  Sparkles,
} from "lucide-react";

export default function AdminSupport() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State: Reply Message
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const loadTickets = async () => {
    try {
      const res = await fetch("/api/support/tickets");
      if (res.ok) {
        setTickets(await res.json());
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const loadTicketMessages = async (ticketId: number) => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`);
      if (res.ok) {
        setTicketMessages(await res.json());
      }
    } catch {}
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSelectTicket = async (ticket: any) => {
    setActiveTicket(ticket);
    await loadTicketMessages(ticket.id);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicket) return;

    setIsReplying(true);
    try {
      const res = await fetch(`/api/support/tickets/${activeTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage }),
      });

      if (res.ok) {
        setReplyMessage("");
        await loadTicketMessages(activeTicket.id);
        await loadTickets();
        toast({ title: "Reply Sent", description: "Your message has been delivered to client." });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to send message." });
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="pb-6 border-b border-zinc-800 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Resolution Desk
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            Client Support Desk
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Resolve help tickets, answer wallet credit queries, assist on limits</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* LEFT: Tickets List */}
          <div className={activeTicket ? "lg:col-span-5 space-y-4" : "lg:col-span-12 space-y-4"}>
            <div className="rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl shadow-2xl overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                </div>
              ) : tickets.length > 0 ? (
                <div className="divide-y divide-zinc-800/80 max-h-[600px] overflow-y-auto">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => handleSelectTicket(ticket)}
                      className={`w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer ${
                        activeTicket?.id === ticket.id ? "bg-black border-l-4 border-cyan-400" : "hover:bg-zinc-900/40"
                      }`}
                    >
                      <div className="min-w-0 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase text-white tracking-wider truncate max-w-[150px]">
                            {ticket.subject}
                          </span>
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            ticket.status === "OPEN"
                              ? "text-amber-400 border-amber-500/20 bg-amber-500/10"
                              : "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-zinc-300 mt-1.5 flex items-center gap-1">
                          <Building className="w-3 h-3 text-cyan-400" />
                          {ticket.companyName}
                        </div>
                        <div className="text-[9px] text-zinc-500 font-mono mt-0.5">{ticket.userEmail}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500 text-xs font-bold uppercase tracking-wider">No client support tickets logged.</div>
              )}
            </div>
          </div>

          {/* RIGHT: Ticket chat thread */}
          {activeTicket && (
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
                <div className="bg-black border-b border-zinc-800 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">Ticket: {activeTicket.subject}</h3>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">Category: {activeTicket.category}</span>
                  </div>
                  <button
                    onClick={() => setActiveTicket(null)}
                    className="text-xs text-zinc-400 hover:text-white font-bold cursor-pointer"
                  >
                    Close chat
                  </button>
                </div>

                {/* Chat messages */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-black/60">
                  {ticketMessages.map((msg) => {
                    const isClient = msg.senderId === activeTicket.userId;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isClient ? "items-start" : "items-end"}`}>
                        <div className={`rounded-2xl px-4 py-2.5 text-xs max-w-[80%] leading-relaxed ${
                          isClient
                            ? "bg-[#0c0c12] text-zinc-200 border border-zinc-800 rounded-tl-none"
                            : "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white rounded-tr-none shadow-lg shadow-violet-600/20 font-medium"
                        }`}>
                          {msg.message}
                        </div>
                        <span className="text-[8px] text-zinc-500 mt-1 font-mono">
                          {isClient ? "Client" : "You (Support)"} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendReply} className="p-4 border-t border-zinc-800 bg-black flex gap-2">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Send reply and mark resolved..."
                    className="flex-1 bg-[#060608] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-500"
                  />
                  <button
                    type="submit"
                    disabled={isReplying || !replyMessage.trim()}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center shrink-0 cursor-pointer shadow-lg shadow-violet-600/20 transition-all"
                  >
                    {isReplying ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
