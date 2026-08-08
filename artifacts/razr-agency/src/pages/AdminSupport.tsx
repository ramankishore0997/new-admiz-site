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
  Building
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
        await loadTickets(); // Refresh ticket status lists
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
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 relative z-10">
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Client Support Desk</h1>
        <p className="text-xs text-slate-500 mt-1">Resolve help tickets, answer wallet credit queries, assist on limits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* LEFT: Tickets List */}
        <div className={activeTicket ? "lg:col-span-5 space-y-4" : "lg:col-span-12 space-y-4"}>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
              </div>
            ) : tickets.length > 0 ? (
              <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
                {tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`w-full flex items-center justify-between p-5 text-left transition-colors ${
                      activeTicket?.id === ticket.id ? "bg-emerald-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-slate-900 tracking-wider truncate max-w-[150px]">
                          {ticket.subject}
                        </span>
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                          ticket.status === "OPEN"
                            ? "text-amber-600 border-amber-200 bg-amber-50"
                            : "text-emerald-700 border-emerald-200 bg-emerald-50"
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-700 mt-1.5 flex items-center gap-1">
                        <Building className="w-3 h-3 text-emerald-600" />
                        {ticket.companyName}
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">{ticket.userEmail}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">No client support tickets logged.</div>
            )}
          </div>
        </div>

        {/* RIGHT: Ticket chat thread */}
        {activeTicket && (
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden flex flex-col h-[520px]">
              <div className="bg-slate-50 border-b border-slate-200 p-5 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Ticket: {activeTicket.subject}</h3>
                  <span className="text-[9px] text-slate-500 mt-1 block">Category: {activeTicket.category}</span>
                </div>
                <button
                  onClick={() => setActiveTicket(null)}
                  className="text-xs text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                >
                  Close chat
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {ticketMessages.map((msg) => {
                  const isClient = msg.senderId === activeTicket.userId;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isClient ? "items-start" : "items-end"}`}>
                      <div className={`rounded-2xl px-4 py-2.5 text-xs max-w-[80%] leading-relaxed ${
                        isClient
                          ? "bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none"
                          : "bg-emerald-600 text-white rounded-tr-none shadow-[0_4px_15px_rgba(5,150,105,0.25)]"
                      }`}>
                        {msg.message}
                      </div>
                      <span className="text-[8px] text-slate-400 mt-1 font-mono">
                        {isClient ? "Client" : "You (Support)"} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 bg-white flex gap-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Send reply and mark resolved..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isReplying || !replyMessage.trim()}
                  className="w-10 h-10 rounded-xl bg-emerald-600 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center shrink-0 cursor-pointer shadow-md shadow-emerald-600/25"
                >
                  {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
