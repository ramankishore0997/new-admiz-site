import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  ExternalLink,
  Loader2,
  Search,
  Filter,
  RefreshCw,
  Send,
  X,
  AlertCircle,
  ShieldAlert,
  Building2,
  User,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";

interface AdminBmOrder {
  id: number;
  orderId: string;
  userId: number;
  bmPackageId: string;
  bmPackageName: string;
  platform: string;
  quantity?: number;
  unitPrice?: string | null;
  price: string;
  currency: string;
  status: "PENDING_DELIVERY" | "DELIVERED" | "CANCELLED";
  inviteLink?: string | null;
  deliveryNotes?: string | null;
  deliveredBy?: number | null;
  deliveredAt?: string | null;
  createdAt: string;
  updatedAt: string;
  userEmail?: string;
  username?: string;
  companyName?: string;
  telegramHandle?: string;
}

export default function AdminBmOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<AdminBmOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING_DELIVERY" | "DELIVERED" | "CANCELLED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Deliver Modal
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<AdminBmOrder | null>(null);
  const [inviteLink, setInviteLink] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isSubmittingDelivery, setIsSubmittingDelivery] = useState(false);

  // Cancel Modal
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<AdminBmOrder | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<AdminBmOrder[]>("/api/admin/bm-orders");
      setOrders(data || []);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error Loading Orders",
        description: err.message || "Failed to fetch Business Manager orders.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const handleOpenDeliverModal = (order: AdminBmOrder) => {
    setSelectedOrderForDelivery(order);
    setInviteLink(order.inviteLink || "");
    setDeliveryNotes(order.deliveryNotes || "");
  };

  const handleDeliverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDelivery) return;

    if (!inviteLink.trim()) {
      toast({
        variant: "destructive",
        title: "Invite Link Required",
        description: "Please enter a valid Business Manager invitation URL.",
      });
      return;
    }

    setIsSubmittingDelivery(true);
    try {
      await apiFetch(`/api/admin/bm-orders/${selectedOrderForDelivery.id}/deliver`, {
        method: "POST",
        body: JSON.stringify({
          inviteLink: inviteLink.trim(),
          deliveryNotes: deliveryNotes.trim(),
        }),
      });

      toast({
        title: "Invite Link Delivered! 🚀",
        description: `Order #${selectedOrderForDelivery.orderId} updated. Invite link unlocked on client portal.`,
      });

      setSelectedOrderForDelivery(null);
      setInviteLink("");
      setDeliveryNotes("");
      fetchOrders();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Delivery Failed",
        description: err.message || "Failed to save invite link.",
      });
    } finally {
      setIsSubmittingDelivery(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForCancel) return;

    setIsSubmittingCancel(true);
    try {
      await apiFetch(`/api/admin/bm-orders/${selectedOrderForCancel.id}/cancel`, {
        method: "POST",
        body: JSON.stringify({
          reason: cancelReason.trim(),
        }),
      });

      toast({
        title: "Order Cancelled & Refunded",
        description: `Order #${selectedOrderForCancel.orderId} cancelled. Client balance restored.`,
      });

      setSelectedOrderForCancel(null);
      setCancelReason("");
      fetchOrders();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: err.message || "Failed to cancel order.",
      });
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.orderId.toLowerCase().includes(q) ||
      o.bmPackageName.toLowerCase().includes(q) ||
      (o.userEmail && o.userEmail.toLowerCase().includes(q)) ||
      (o.username && o.username.toLowerCase().includes(q)) ||
      (o.telegramHandle && o.telegramHandle.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const pendingCount = orders.filter((o) => o.status === "PENDING_DELIVERY").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const totalVolume = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((acc, curr) => acc + Number(curr.price || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Header */}
        <div className="pb-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" /> Direct Fulfillment Hub
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Business Manager <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Orders</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Fulfill purchased Business Manager lines by assigning dedicated admin invitation links.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#060608] hover:bg-zinc-900 border border-zinc-800 text-xs font-bold text-white shadow-lg cursor-pointer transition-all"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" /> Refresh Orders
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-[#060608] border border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Awaiting Invite</span>
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono mt-2">{pendingCount}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Pending admin assignment</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#060608] border border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Delivered Lines</span>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-2">{deliveredCount}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Successfully dispatched</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#060608] border border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Store Revenue</span>
              <span className="p-2 rounded-xl bg-black text-white border border-zinc-800">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
              </span>
            </div>
            <div className="text-2xl font-black text-white font-mono mt-2">
              ${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-sans text-zinc-400">USDT</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Active fulfillment volume</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#060608] p-4 rounded-3xl border border-zinc-800 shadow-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by Order ID, Client Email, Telegram..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <Filter className="w-4 h-4 text-zinc-500 shrink-0" />
            {[
              { id: "ALL", label: "All Orders" },
              { id: "PENDING_DELIVERY", label: `Pending (${pendingCount})` },
              { id: "DELIVERED", label: "Delivered" },
              { id: "CANCELLED", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={"px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer " +
                  (statusFilter === tab.id
                    ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-black shadow-md shadow-violet-500/20"
                    : "bg-black text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800")}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table / List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 bg-[#060608] rounded-3xl border border-zinc-800">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isDelivered = order.status === "DELIVERED";
              const isPending = order.status === "PENDING_DELIVERY";

              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-zinc-800 bg-[#060608] p-6 shadow-2xl space-y-4 hover:border-violet-500/40 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-black uppercase text-white tracking-wider">
                          {order.orderId}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isDelivered
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : order.status === "CANCELLED"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {isDelivered ? "DELIVERED" : order.status === "CANCELLED" ? "CANCELLED" : "PENDING INVITE"}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-zinc-300 border border-zinc-800">
                          {order.quantity || 1} {(order.quantity || 1) === 1 ? "Line" : "Lines"}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-white mt-1 uppercase">
                        {order.bmPackageName}
                      </h3>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        {order.platform} · Total Paid: <strong className="text-cyan-300 font-mono">${order.price} USDT</strong> {(order.quantity || 1) > 1 && `($${order.unitPrice || (Number(order.price) / (order.quantity || 1)).toFixed(0)}/line)`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleOpenDeliverModal(order)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-600/30 cursor-pointer transition-all"
                          >
                            <Send className="w-3.5 h-3.5" /> Deliver Invite Link
                          </button>
                          <button
                            onClick={() => setSelectedOrderForCancel(order)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                          >
                            Cancel & Refund
                          </button>
                        </>
                      ) : isDelivered ? (
                        <>
                          <button
                            onClick={() => handleOpenDeliverModal(order)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-black hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                          >
                            Update Invite Link
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {/* Client Details & Fulfillment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
                    <div className="p-3.5 rounded-2xl bg-black border border-zinc-800 space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-cyan-400" /> Client Information
                      </div>
                      <div className="font-bold text-white">{order.userEmail}</div>
                      <div className="text-zinc-400">{order.username || "Client"} {order.companyName ? `(${order.companyName})` : ""}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-black border border-zinc-800 space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-[#229ED9]" /> Telegram Contact
                      </div>
                      <div className="font-mono font-bold text-white">
                        {order.telegramHandle ? (
                          <a
                            href={`https://t.me/${order.telegramHandle.replace(/^@/, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#229ED9] hover:underline flex items-center gap-1"
                          >
                            @{order.telegramHandle.replace(/^@/, "")} <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-zinc-500 font-sans">Not Provided</span>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-black border border-zinc-800 space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" /> Delivery Status
                      </div>
                      <div className="font-bold text-white">
                        {isDelivered
                          ? `Delivered on ${order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : "Active"}`
                          : order.status === "CANCELLED"
                          ? "Order Cancelled"
                          : "Awaiting Admin Action"}
                      </div>
                    </div>
                  </div>

                  {/* Delivered Link Box */}
                  {isDelivered && order.inviteLink && (
                    <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                          Active Business Manager Invite Link
                        </span>
                        <button
                          onClick={() => handleCopy(order.inviteLink || "", "BM Invite Link")}
                          className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" /> Copy Link
                        </button>
                      </div>
                      <div className="bg-black border border-zinc-800 rounded-xl p-2.5 font-mono text-cyan-300 break-all select-all">
                        {order.inviteLink}
                      </div>
                      {order.deliveryNotes && (
                        <div className="text-[11px] text-zinc-300 bg-black/80 p-2.5 rounded-xl border border-zinc-800">
                          <strong className="text-cyan-300">Admin Setup Notes:</strong> {order.deliveryNotes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#060608] rounded-3xl border border-zinc-800 space-y-2 shadow-xl">
            <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400">No Orders Found</h3>
            <p className="text-xs text-zinc-500">There are no Business Manager orders matching your filter criteria.</p>
          </div>
        )}
      </div>

      {/* DELIVER INVITE LINK MODAL */}
      <AnimatePresence>
        {selectedOrderForDelivery && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderForDelivery(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-[#060608] p-6 md:p-8 overflow-hidden shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Send className="w-3.5 h-3.5 text-cyan-400" /> Order Fulfillment
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    Deliver Business Manager Invite{selectedOrderForDelivery.quantity && selectedOrderForDelivery.quantity > 1 ? "s" : ""}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Order #{selectedOrderForDelivery.orderId} · {selectedOrderForDelivery.quantity || 1} Line(s) · {selectedOrderForDelivery.userEmail}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrderForDelivery(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleDeliverSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    BM Invite Link(s) / Admin URL(s) ({selectedOrderForDelivery.quantity || 1} Line{selectedOrderForDelivery.quantity && selectedOrderForDelivery.quantity > 1 ? "s" : ""}) <span className="text-cyan-400">*</span>
                  </label>
                  {(selectedOrderForDelivery.quantity || 1) > 1 ? (
                    <textarea
                      required
                      rows={Math.min(8, Math.max(4, (selectedOrderForDelivery.quantity || 1) + 1))}
                      placeholder="https://business.facebook.com/invitation?id=... (Enter each invite link on a new line)"
                      value={inviteLink}
                      onChange={(e) => setInviteLink(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 resize-y placeholder:text-zinc-600"
                    />
                  ) : (
                    <input
                      type="url"
                      required
                      placeholder="https://business.facebook.com/invitation?id=..."
                      value={inviteLink}
                      onChange={(e) => setInviteLink(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 placeholder:text-zinc-600"
                    />
                  )}
                  <p className="text-[10px] text-zinc-500">
                    {(selectedOrderForDelivery.quantity || 1) > 1
                      ? `Client ordered ${selectedOrderForDelivery.quantity} lines. Paste each invite link on a separate line.`
                      : "Paste the exact admin invite link generated for the client."}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Setup Notes & Instructions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Please accept from your clean browser profile. Replacement guarantee active for 72 hours."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none placeholder:text-zinc-600"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForDelivery(null)}
                    className="w-1/2 px-4 py-3 rounded-xl border border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingDelivery}
                    className="w-1/2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-600/30 transition-all cursor-pointer disabled:opacity-50 font-black"
                  >
                    {isSubmittingDelivery ? (
                      <><Loader2 className="w-4 h-4 animate-spin text-white" /> Saving...</>
                    ) : (
                      "Deliver & Unlock Link"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CANCEL & REFUND MODAL */}
      <AnimatePresence>
        {selectedOrderForCancel && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderForCancel(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-[#060608] p-6 md:p-8 overflow-hidden shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Order Cancellation
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    Cancel Order & Refund Client
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Order #{selectedOrderForCancel.orderId} (${selectedOrderForCancel.price} USDT)
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrderForCancel(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                <div className="font-bold">Refund Notice:</div>
                <p>
                  Cancelling this order will immediately credit <strong>${selectedOrderForCancel.price} USDT</strong> back to {selectedOrderForCancel.userEmail}'s wallet balance.
                </p>
              </div>

              <form onSubmit={handleCancelSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Cancellation Reason (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stock temporarily out of inventory"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForCancel(null)}
                    className="w-1/2 px-4 py-3 rounded-xl border border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingCancel}
                    className="w-1/2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingCancel ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Cancelling...</>
                    ) : (
                      "Confirm Cancel & Refund"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
