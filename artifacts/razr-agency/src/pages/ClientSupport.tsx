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
  LifeBuoy,
  Headphones
} from "lucide-react";
import { SiTelegram, SiWhatsapp } from "react-icons/si";
import { PAYMENT_CONFIG } from "@/config/payment";
import { apiFetch } from "@/lib/api";

const TELEGRAM_SUPPORT_URL = PAYMENT_CONFIG.telegramSupportUrl;
const WHATSAPP_SUPPORT_URL = PAYMENT_CONFIG.whatsappSupportUrl || "https://wa.me/447473951923?text=Hello%20Razr%20Support,%20I%20need%20assistance";

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
      <div className="space-y-8 relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Header */}
        <div className="pb-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
              <Headphones className="w-3.5 h-3.5 text-cyan-400" /> 24/7 Dedicated Partner Desk
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Support & <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Escalations</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Direct support channel for onboarding, limits, and wallet balance</p>
          </div>

          {!activeTicket && (
            <div className="flex flex-wrap gap-2.5">
              <a
                href={TELEGRAM_SUPPORT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#229ED9] hover:bg-[#1a8bc2] text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-lg transition-all"
              >
                <SiTelegram className="w-4 h-4" /> Telegram VIP
              </a>
              <a
                href={WHATSAPP_SUPPORT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-lg transition-all"
              >
                <SiWhatsapp className="w-4 h-4" /> WhatsApp Support
              </a>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-zinc-800 hover:border-zinc-700 bg-[#060608] hover:bg-zinc-900 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-md"
              >
                <PlusCircle className="w-4 h-4 text-cyan-400" /> Open Ticket
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
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to tickets list
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Chat thread */}
                <div className="lg:col-span-8 rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl overflow-hidden flex flex-col h-[520px]">
                  <div className="bg-black border-b border-zinc-800 p-5 flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-white">Ticket: {activeTicket.subject}</h3>
                      <span className="text-[10px] text-zinc-400 mt-0.5 block">Category: {activeTicket.category}</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      activeTicket.status === "OPEN"
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                        : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
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
                              ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-tr-none shadow-lg shadow-violet-600/20"
                              : "bg-black text-zinc-200 border border-zinc-800 rounded-tl-none"
                          }`}>
                            {msg.message}
                          </div>
                          <span className="text-[9px] text-zinc-500 mt-1 font-mono">
                            {isClient ? "You" : "Support Desk"} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendReply} className="p-4 border-t border-zinc-800 bg-black flex gap-2">
                    <input
                      type="text"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type message response to Support..."
                      className="flex-1 bg-[#060608] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                    />
                    <button
                      type="submit"
                      disabled={isReplying || !replyMessage.trim()}
                      className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 disabled:opacity-30 text-white flex items-center justify-center shrink-0 cursor-pointer shadow transition-all font-black"
                    >
                      {isReplying ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
                    </button>
                  </form>
                </div>

                {/* Sidebar meta details */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-5 text-xs space-y-4">
                    <h3 className="font-black uppercase tracking-wider text-white">Ticket Information</h3>
                    <div className="border-t border-zinc-800/80 pt-3">
                      <span className="text-zinc-400 block">Priority Level</span>
                      <span className="font-bold text-cyan-300 uppercase">{activeTicket.priority}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block">Ticket Opened On</span>
                      <span className="font-bold text-white">{new Date(activeTicket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : showCreateForm ? (
            <div className="lg:col-span-12 max-w-lg mx-auto w-full">
              <div className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400" />
                
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-sm font-black uppercase text-white tracking-wider">
                    Open <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Support Ticket</span>
                  </h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-xs text-zinc-400 hover:text-white font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Subject Title</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Need Meta ad limit raised"
                      required
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors"
                      >
                        <option value="General Support">General Support</option>
                        <option value="Ad Limits & Setup">Ad Limits & Setup</option>
                        <option value="Wallet Credits / Deposits">Wallet Credits / Deposits</option>
                        <option value="Technical / API Issues">Technical / API Issues</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Priority</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Message Description</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Detailed explanation of the issue..."
                      rows={5}
                      required
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors resize-none placeholder:text-zinc-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-[1.02] text-white text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-violet-600/30 font-black"
                  >
                    {isCreating ? "Submitting Request..." : "Submit Ticket"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-12">
              <div className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-6 md:p-8">
                <h2 className="text-sm font-black uppercase tracking-tight text-white mb-6">
                  Open Support <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Requests</span>
                </h2>

                {ticketsError ? (
                  <div>
                    <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4">
                      {ticketsError}
                    </div>
                    <button
                      onClick={loadTickets}
                      className="mt-3 text-[10px] font-black uppercase tracking-wider text-cyan-400 hover:underline cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                  </div>
                ) : tickets.length > 0 ? (
                  <div className="space-y-2.5">
                    {tickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        onClick={() => handleSelectTicket(ticket)}
                        className="w-full flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-black/60 hover:border-zinc-700 hover:bg-black text-left transition-all cursor-pointer shadow-md"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-black uppercase text-white tracking-wider truncate">
                              {ticket.subject}
                            </h4>
                            <span className="text-[10px] text-zinc-400 block mt-0.5">
                              Category: {ticket.category} · Opened: {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            ticket.status === "OPEN"
                              ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                              : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                          }`}>
                            {ticket.status}
                          </span>
                          <ChevronRight className="w-4 h-4 text-zinc-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
                    <LifeBuoy className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">No support tickets found.</p>
                    <p className="text-[10px] text-zinc-600 mt-1">If you have any questions, open a ticket or message Telegram support.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
