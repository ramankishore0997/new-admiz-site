import { useState, useEffect } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  PlusCircle,
  Clock,
  AlertCircle,
  Loader2,
  ChevronRight,
  Send,
  User,
  ArrowLeft,
  LifeBuoy
} from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { PAYMENT_CONFIG } from "@/config/payment";
import { apiFetch } from "@/lib/api";

const TELEGRAM_SUPPORT_URL = PAYMENT_CONFIG.telegramSupportUrl;

export default function ClientSupport() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState("");

  // Form State: New Ticket
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General Support");
  const [priority, setPriority] = useState("MEDIUM");
  const [message, setMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Form State: Reply Message
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const loadTickets = async () => {
    setIsLoading(true);
    setTicketsError("");
    try {
      const data = await apiFetch<any[]>("/api/support/tickets");
      setTickets(data || []);
    } catch (e: any) {
      setTicketsError(e.message || "Failed to load support tickets.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTicketMessages = async (ticketId: number) => {
    try {
      const data = await apiFetch<any[]>(`/api/support/tickets/${ticketId}/messages`);
      setTicketMessages(data || []);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Load Failed", description: e.message || "Could not load ticket messages." });
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSelectTicket = async (ticket: any) => {
    setActiveTicket(ticket);
    await loadTicketMessages(ticket.id);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsCreating(true);
    try {
      await apiFetch("/api/support/tickets", {
        method: "POST",
        body: JSON.stringify({ subject, category, priority, message }),
      });

      toast({ title: "Ticket Opened", description: "Your support request was logged successfully." });
      setSubject("");
      setMessage("");
      setShowCreateForm(false);
      await loadTickets();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message || "Failed to open support ticket." });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicket) return;

    setIsReplying(true);
    try {
      await apiFetch(`/api/support/tickets/${activeTicket.id}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: replyMessage }),
      });

      setReplyMessage("");
      await loadTicketMessages(activeTicket.id);
      await loadTickets(); // reload ticket statuses
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message || "Failed to send message." });
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <ClientLayout>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Support Center</h1>
          <p className="text-xs text-slate-500 mt-1">Get assistance with onboarding, limits, and wallet credits</p>
        </div>

        {!activeTicket && (
          <div className="flex gap-2">
            <a
              href={TELEGRAM_SUPPORT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#229ED9] hover:bg-[#1a8bc2] text-white text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer"
            >
              <SiTelegram className="w-3.5 h-3.5" /> Telegram VIP Chat
            </a>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-primary" /> Open Ticket
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Ticket chat detail viewport */}
        {activeTicket ? (
          <div className="lg:col-span-12 space-y-6">
            <button
              onClick={() => setActiveTicket(null)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to tickets list
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Chat thread */}
              <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 overflow-hidden flex flex-col h-[520px]">
                <div className="bg-slate-50 border-b border-slate-200 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Ticket: {activeTicket.subject}</h3>
                    <span className="text-[9px] text-slate-500 mt-1 block">Category: {activeTicket.category}</span>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                    activeTicket.status === "OPEN"
                      ? "text-amber-600 bg-amber-50 border-amber-200"
                      : "text-emerald-600 bg-emerald-50 border-emerald-200"
                  }`}>
                    {activeTicket.status}
                  </span>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {ticketMessages.map((msg) => {
                    const isClient = msg.senderId === activeTicket.userId;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isClient ? "items-end" : "items-start"}`}>
                        <div className={`rounded-2xl px-4 py-2.5 text-xs max-w-[80%] leading-relaxed ${
                          isClient
                            ? "bg-emerald-600 text-white rounded-tr-none shadow-[0_4px_15px_rgba(5,150,105,0.25)]"
                            : "bg-slate-100 text-slate-700 border border-slate-200 rounded-tl-none"
                        }`}>
                          {msg.message}
                        </div>
                        <span className="text-[8px] text-slate-400 mt-1 font-mono">
                          {isClient ? "You" : "Support Officer"} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type message response to Support..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none focus:border-primary/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isReplying || !replyMessage.trim()}
                    className="w-10 h-10 rounded-xl bg-emerald-600 disabled:opacity-30 text-white flex items-center justify-center shrink-0 cursor-pointer shadow"
                  >
                    {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>
              </div>

              {/* Sidebar meta details */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-5 text-xs space-y-4">
                  <h3 className="font-black uppercase tracking-wider text-slate-900">Ticket Information</h3>
                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-slate-500 block">Priority Level</span>
                    <span className="font-bold text-slate-900 uppercase">{activeTicket.priority}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Ticket Opened On</span>
                    <span className="font-bold text-slate-900">{new Date(activeTicket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : showCreateForm ? (
          <div className="lg:col-span-12 max-w-lg mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500" />
              
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">Open Support Ticket</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Subject Title</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Need Meta ad limit raised"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                    >
                      <option>General Support</option>
                      <option>Ad Limits & Setup</option>
                      <option>Wallet Credits / Deposits</option>
                      <option>Technical / API Issues</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Message Description</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Detailed explanation of the issue..."
                    rows={5}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                >
                  {isCreating ? "Submitting Request..." : "Submit Ticket"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-12">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6">
              <h2 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-6">Open Support Requests</h2>

              {ticketsError ? (
                <div>
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                    {ticketsError}
                  </div>
                  <button
                    onClick={loadTickets}
                    className="mt-2 text-[10px] font-black uppercase tracking-wider text-primary hover:underline cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : tickets.length > 0 ? (
                <div className="space-y-2.5">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => handleSelectTicket(ticket)}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-primary shrink-0">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider truncate">
                            {ticket.subject}
                          </h4>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            Category: {ticket.category} · Opened: {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                          ticket.status === "OPEN"
                            ? "text-amber-600 bg-amber-50 border-amber-200"
                            : "text-emerald-600 bg-emerald-50 border-emerald-200"
                        }`}>
                          {ticket.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
                  <LifeBuoy className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No support tickets found.</p>
                  <p className="text-[10px] text-slate-400 mt-1">If you have any questions, open a ticket or message Telegram support.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
