import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  FileImage,
  AlertCircle,
  X,
  ArrowDownToLine,
  Pencil,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPayments() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"DEPOSITS" | "WITHDRAWALS">("DEPOSITS");
  const [payments, setPayments] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingWithdrawals, setIsLoadingWithdrawals] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [withdrawFilterStatus, setWithdrawFilterStatus] = useState("ALL");

  // Modal states
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [approvingPayment, setApprovingPayment] = useState<any | null>(null);
  const [editedAmount, setEditedAmount] = useState<string>("");
  const [rejectingPaymentId, setRejectingPaymentId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Withdrawal modal states
  const [rejectingWithdrawalId, setRejectingWithdrawalId] = useState<number | null>(null);
  const [withdrawalRejectionReason, setWithdrawalRejectionReason] = useState("");
  const [isSubmittingWithdrawalAction, setIsSubmittingWithdrawalAction] = useState(false);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/payments");
      if (res.ok) {
        setPayments(await res.json());
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to load payment requests." });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    setIsLoadingWithdrawals(true);
    try {
      const res = await fetch("/api/admin/withdrawals");
      if (res.ok) {
        setWithdrawals(await res.json());
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to load withdrawal requests." });
    } finally {
      setIsLoadingWithdrawals(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchWithdrawals();
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const handleOpenApproveModal = (p: any) => {
    setApprovingPayment(p);
    setEditedAmount(String(p.amount ?? ""));
  };

  const handleConfirmApprove = async () => {
    if (!approvingPayment) return;
    const num = Number(editedAmount);
    if (Number.isNaN(num) || num <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a valid positive amount." });
      return;
    }

    setIsSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/payments/${approvingPayment.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID", amount: num }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to approve payment.");
      }
      toast({ title: "Approved!", description: `Payment approved and credited: $${num} USDT.` });
      setApprovingPayment(null);
      setEditedAmount("");
      fetchPayments();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Action Failed", description: err.message });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleQuickApprove = async (id: number, currentAmount: number) => {
    setIsSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/payments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID", amount: currentAmount }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to approve payment.");
      }
      toast({ title: "Approved!", description: `Payment approved and credited: $${currentAmount} USDT.` });
      fetchPayments();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Action Failed", description: err.message });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleReject = async () => {
    if (!rejectingPaymentId) return;
    setIsSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/payments/${rejectingPaymentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED", rejectionReason }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to reject payment.");
      }
      toast({ title: "Rejected", description: "Payment status set to REJECTED." });
      setRejectingPaymentId(null);
      setRejectionReason("");
      fetchPayments();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Action Failed", description: err.message });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleApproveWithdrawal = async (id: number) => {
    setIsSubmittingWithdrawalAction(true);
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to approve withdrawal.");
      }
      toast({ title: "Approved!", description: "Withdrawal marked as approved and processed." });
      fetchWithdrawals();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Action Failed", description: err.message });
    } finally {
      setIsSubmittingWithdrawalAction(false);
    }
  };

  const handleRejectWithdrawal = async () => {
    if (!rejectingWithdrawalId) return;
    setIsSubmittingWithdrawalAction(true);
    try {
      const res = await fetch(`/api/admin/withdrawals/${rejectingWithdrawalId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason: withdrawalRejectionReason }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to reject withdrawal.");
      }
      toast({ title: "Rejected", description: "Withdrawal rejected and balance refunded." });
      setRejectingWithdrawalId(null);
      setWithdrawalRejectionReason("");
      fetchWithdrawals();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Action Failed", description: err.message });
    } finally {
      setIsSubmittingWithdrawalAction(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (filterStatus === "ALL") return true;
    return p.status === filterStatus;
  });

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (withdrawFilterStatus === "ALL") return true;
    return w.status === withdrawFilterStatus;
  });

  const getExplorerUrl = (txHash: string, network: string) => {
    const net = (network || "").toLowerCase();
    if (net.includes("tron") || net.includes("trc20")) return `https://tronscan.org/#/transaction/${txHash}`;
    if (net.includes("bsc") || net.includes("bep20")) return `https://bscscan.com/tx/${txHash}`;
    if (net.includes("polygon")) return `https://polygonscan.com/tx/${txHash}`;
    if (net.includes("arbitrum")) return `https://arbiscan.io/tx/${txHash}`;
    if (net.includes("optimism")) return `https://optimistic.etherscan.io/tx/${txHash}`;
    return `https://etherscan.io/tx/${txHash}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Treasury & Liquidity
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-emerald-400" /> Payments & Withdrawals Desk
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Review client USDT deposits, credit balances, and process client withdrawal requests.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-[#060608] p-1.5 rounded-2xl border border-zinc-800 text-xs font-bold">
            {(["DEPOSITS", "WITHDRAWALS"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl uppercase tracking-wider text-[10px] font-black transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-violet-600/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {tab === "DEPOSITS" ? "Deposits" : "Withdrawals"}
              </button>
            ))}
          </div>
        </div>

        {/* Filter pills — Deposits */}
        {activeTab === "DEPOSITS" && (
          <div className="flex items-center gap-1.5 bg-[#060608] p-1.5 rounded-2xl border border-zinc-800 text-xs font-bold w-fit">
            {["ALL", "PENDING_APPROVAL", "PAID", "REJECTED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl uppercase tracking-wider text-[10px] font-black transition-all cursor-pointer ${
                  filterStatus === st
                    ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-violet-600/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {st === "PENDING_APPROVAL" ? "Pending" : st}
              </button>
            ))}
          </div>
        )}

        {/* Filter pills — Withdrawals */}
        {activeTab === "WITHDRAWALS" && (
          <div className="flex items-center gap-1.5 bg-[#060608] p-1.5 rounded-2xl border border-zinc-800 text-xs font-bold w-fit">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
              <button
                key={st}
                onClick={() => setWithdrawFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl uppercase tracking-wider text-[10px] font-black transition-all cursor-pointer ${
                  withdrawFilterStatus === st
                    ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-violet-600/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}

        {/* Content Table — Deposits */}
        {activeTab === "DEPOSITS" && (
        <div className="rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-20 px-4">
              <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-zinc-400">No payment approval requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-black text-[10px] uppercase tracking-widest text-zinc-400 font-black">
                    <th className="py-4 px-6">Order ID & Date</th>
                    <th className="py-4 px-6">Client / User</th>
                    <th className="py-4 px-6">Amount & Network</th>
                    <th className="py-4 px-6">TXID & Proof</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-xs text-zinc-300">
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-4 px-6">
                        <div className="font-mono font-bold text-white">{p.orderId}</div>
                        <div className="text-[10px] text-zinc-500 mt-1">
                          {new Date(p.createdAt).toLocaleString()}
                        </div>
                      </td>

                      {/* User details */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">{p.userEmail || p.user?.email}</div>
                        {(p.companyName || p.user?.username) && (
                          <div className="text-[10px] text-cyan-400 mt-0.5">{p.companyName || p.user?.username}</div>
                        )}
                      </td>

                      {/* Amount & Network */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">${p.amount} USDT</span>
                          <button
                            onClick={() => handleOpenApproveModal(p)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 text-[10px] font-bold border border-zinc-700 transition-colors cursor-pointer"
                            title="Edit Amount"
                          >
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                        </div>
                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black border border-zinc-800 text-zinc-400">
                          {p.network}
                        </span>
                      </td>

                      {/* TXID & Proof */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 max-w-[220px]">
                          <span className="font-mono text-[11px] truncate text-cyan-400 selection:bg-cyan-500/20">
                            {p.txHash}
                          </span>
                          <button
                            onClick={() => handleCopy(p.txHash, "TXID")}
                            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                            title="Copy TXID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={getExplorerUrl(p.txHash, p.network)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                            title="View on Explorer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        {p.screenshotUrl && (
                          <button
                            onClick={() => setSelectedScreenshot(p.screenshotUrl)}
                            className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-violet-400 hover:text-violet-300 font-bold uppercase tracking-wider cursor-pointer"
                          >
                            <FileImage className="w-3.5 h-3.5" /> View Proof Screenshot
                          </button>
                        )}
                        {p.note && (
                          <div className="text-[10px] text-zinc-500 italic mt-1 max-w-[200px] truncate">
                            Note: {p.note}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            p.status === "PAID"
                              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                              : p.status === "REJECTED"
                              ? "text-red-400 bg-red-500/10 border-red-500/20"
                              : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                          }`}
                        >
                          {p.status === "PAID" ? (
                            <><CheckCircle className="w-3 h-3" /> PAID</>
                          ) : p.status === "REJECTED" ? (
                            <><XCircle className="w-3 h-3" /> REJECTED</>
                          ) : (
                            <><Clock className="w-3 h-3" /> PENDING</>
                          )}
                        </span>
                        {p.rejectionReason && (
                          <div className="text-[10px] text-red-400 mt-1">{p.rejectionReason}</div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        {p.status === "PENDING_APPROVAL" || p.status === "PAYMENT_PENDING" || p.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenApproveModal(p)}
                              disabled={isSubmittingAction}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-violet-600/20"
                              title="Edit amount & Approve"
                            >
                              <Pencil className="w-3 h-3" /> Edit & Approve
                            </button>
                            <button
                              onClick={() => handleQuickApprove(p.id, Number(p.amount))}
                              disabled={isSubmittingAction}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                              title="Approve directly"
                            >
                              <CheckCircle className="w-3 h-3" /> Quick Approve
                            </button>
                            <button
                              onClick={() => setRejectingPaymentId(p.id)}
                              disabled={isSubmittingAction}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-[10px] text-emerald-400 font-bold uppercase">Approved</span>
                            <button
                              onClick={() => handleOpenApproveModal(p)}
                              disabled={isSubmittingAction}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[9px] font-bold uppercase cursor-pointer transition-colors border border-zinc-800"
                              title="Edit credited amount"
                            >
                              <Pencil className="w-3 h-3" /> Edit Amount
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {/* Content Table — Withdrawals */}
        {activeTab === "WITHDRAWALS" && (
        <div className="rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl overflow-hidden shadow-2xl">
          {isLoadingWithdrawals ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : filteredWithdrawals.length === 0 ? (
            <div className="text-center py-20 px-4">
              <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-zinc-400">No withdrawal requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-black text-[10px] uppercase tracking-widest text-zinc-400 font-black">
                    <th className="py-4 px-6">Request ID & Date</th>
                    <th className="py-4 px-6">Client / User</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">USDT Address</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-xs text-zinc-300">
                  {filteredWithdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-mono font-bold text-white">{w.requestId || `WDR-${w.id}`}</div>
                        <div className="text-[10px] text-zinc-500 mt-1">
                          {new Date(w.createdAt).toLocaleString()}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-bold text-white">{w.userEmail || w.user?.email}</div>
                        {(w.companyName || w.user?.username) && (
                          <div className="text-[10px] text-cyan-400 mt-0.5">{w.companyName || w.user?.username}</div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-sm font-black bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">${w.amount} USDT</div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 max-w-[240px]">
                          <span className="font-mono text-[11px] truncate text-cyan-400 selection:bg-cyan-500/20">
                            {w.usdtAddress}
                          </span>
                          <button
                            onClick={() => handleCopy(w.usdtAddress, "USDT Address")}
                            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                            title="Copy USDT Address"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            w.status === "APPROVED"
                              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                              : w.status === "REJECTED"
                              ? "text-red-400 bg-red-500/10 border-red-500/20"
                              : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                          }`}
                        >
                          {w.status === "APPROVED" ? (
                            <><CheckCircle className="w-3 h-3" /> APPROVED</>
                          ) : w.status === "REJECTED" ? (
                            <><XCircle className="w-3 h-3" /> REJECTED</>
                          ) : (
                            <><Clock className="w-3 h-3" /> PENDING</>
                          )}
                        </span>
                        {w.rejectionReason && (
                          <div className="text-[10px] text-red-400 mt-1">{w.rejectionReason}</div>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {w.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApproveWithdrawal(w.id)}
                              disabled={isSubmittingWithdrawalAction}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-violet-600/20"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => { setRejectingWithdrawalId(w.id); setWithdrawalRejectionReason(""); }}
                              disabled={isSubmittingWithdrawalAction}
                              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-500 font-bold uppercase">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}
      </div>

      {/* Screenshot Preview Modal */}
      <AnimatePresence>
        {selectedScreenshot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScreenshot(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl max-h-[85vh] bg-[#060608] border border-zinc-800 rounded-3xl p-4 overflow-hidden shadow-2xl z-10"
            >
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedScreenshot}
                alt="Payment Proof Screenshot"
                className="max-h-[75vh] w-auto mx-auto rounded-xl object-contain"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit & Approve Deposit Modal */}
      <AnimatePresence>
        {approvingPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApprovingPayment(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#060608] border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase text-white tracking-wide">Approve & Credit Deposit</h3>
                    <p className="text-[11px] text-zinc-400">Order: <span className="font-mono font-bold text-white">{approvingPayment.orderId}</span></p>
                  </div>
                </div>
                <button
                  onClick={() => setApprovingPayment(null)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Client & Payment Info Details */}
              <div className="bg-black border border-zinc-800 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Client:</span>
                  <span className="font-bold text-white">{approvingPayment.userEmail || approvingPayment.user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Network:</span>
                  <span className="font-bold uppercase text-cyan-400">{approvingPayment.network}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Submitted Amount:</span>
                  <span className="font-black text-white">${approvingPayment.amount} USDT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">TXID:</span>
                  <span className="font-mono text-[10px] text-cyan-400 truncate max-w-[240px]">{approvingPayment.txHash}</span>
                </div>
              </div>

              {/* Editable Amount Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Credited Amount ($ USDT) *</span>
                  <span className="text-[9px] font-normal text-zinc-500">Edit if received amount differs</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500">$</span>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    value={editedAmount}
                    onChange={(e) => setEditedAmount(e.target.value)}
                    placeholder="Enter amount to credit"
                    className="w-full bg-black border-2 border-emerald-500/30 rounded-xl pl-8 pr-4 py-2.5 text-base font-black text-white outline-none focus:border-emerald-500 transition-all shadow-xs"
                    autoFocus
                  />
                </div>
                <p className="text-[10px] text-zinc-500">
                  This exact amount will be credited to the client's available wallet balance immediately upon approval.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setApprovingPayment(null)}
                  disabled={isSubmittingAction}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApprove}
                  disabled={isSubmittingAction || !editedAmount || Number(editedAmount) <= 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-violet-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingAction ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve & Credit (${editedAmount || approvingPayment.amount} USDT)
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rejection Reason Modal */}
      <AnimatePresence>
        {rejectingPaymentId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectingPaymentId(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#060608] border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <h3 className="text-lg font-black uppercase text-white">Reject Payment Request</h3>
              <p className="text-xs text-zinc-400">
                Provide a reason for rejecting this payment submission (visible to client).
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Transaction hash not found on blockchain / Amount mismatch..."
                rows={3}
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-red-500 placeholder:text-zinc-600"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setRejectingPaymentId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isSubmittingAction}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider hover:bg-red-500 transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-red-600/20"
                >
                  {isSubmittingAction ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rejection Reason Modal — Withdrawals */}
      <AnimatePresence>
        {rejectingWithdrawalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectingWithdrawalId(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#060608] border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                <ArrowDownToLine className="w-5 h-5 text-red-500" /> Reject Withdrawal Request
              </h3>
              <p className="text-xs text-zinc-400">
                Provide a reason for rejecting this withdrawal request. The amount will be released back to the client's available balance.
              </p>

              <textarea
                value={withdrawalRejectionReason}
                onChange={(e) => setWithdrawalRejectionReason(e.target.value)}
                placeholder="e.g., Invalid USDT address / Amount mismatch..."
                rows={3}
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-red-500 placeholder:text-zinc-600"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setRejectingWithdrawalId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectWithdrawal}
                  disabled={isSubmittingWithdrawalAction}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider hover:bg-red-500 transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-red-600/20"
                >
                  {isSubmittingWithdrawalAction ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
