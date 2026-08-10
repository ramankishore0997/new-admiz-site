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

  const handleApprove = async (id: number) => {
    setIsSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/payments/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to approve payment.");
      }
      toast({ title: "Approved!", description: "Payment status set to PAID." });
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
      const res = await fetch(`/api/admin/payments/${rejectingPaymentId}/verify`, {
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
      const res = await fetch(`/api/admin/withdrawals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to approve withdrawal.");
      }
      toast({ title: "Approved!", description: "Withdrawal marked as paid out." });
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
      const res = await fetch(`/api/admin/withdrawals/${rejectingWithdrawalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED", rejectionReason: withdrawalRejectionReason }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to reject withdrawal.");
      }
      toast({ title: "Rejected", description: "Withdrawal rejected. Balance released back to client." });
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
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-emerald-600" /> Payments & Withdrawals Desk
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Verify client USDT deposits and process client withdrawal requests.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            {(["DEPOSITS", "WITHDRAWALS"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg uppercase tracking-wider text-[10px] transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {tab === "DEPOSITS" ? "Deposits" : "Withdrawals"}
              </button>
            ))}
          </div>
        </div>

        {/* Filter pills — Deposits */}
        {activeTab === "DEPOSITS" && (
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold w-fit">
            {["ALL", "PENDING_VERIFICATION", "PAID", "REJECTED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider text-[10px] transition-colors cursor-pointer ${
                  filterStatus === st
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {st === "PENDING_VERIFICATION" ? "Pending" : st}
              </button>
            ))}
          </div>
        )}

        {/* Filter pills — Withdrawals */}
        {activeTab === "WITHDRAWALS" && (
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold w-fit">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
              <button
                key={st}
                onClick={() => setWithdrawFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider text-[10px] transition-colors cursor-pointer ${
                  withdrawFilterStatus === st
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}

        {/* Content Table — Deposits */}
        {activeTab === "DEPOSITS" && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-lg shadow-slate-200/60">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-20 px-4">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-600">No payment verification requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 font-black">
                    <th className="py-4 px-6">Order ID & Date</th>
                    <th className="py-4 px-6">Client / User</th>
                    <th className="py-4 px-6">Amount & Network</th>
                    <th className="py-4 px-6">TXID & Proof</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-4 px-6">
                        <div className="font-mono font-bold text-slate-900">{p.orderId}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {new Date(p.createdAt).toLocaleString()}
                        </div>
                      </td>

                      {/* User details */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{p.userEmail}</div>
                        {p.companyName && (
                          <div className="text-[10px] text-emerald-600 mt-0.5">{p.companyName}</div>
                        )}
                      </td>

                      {/* Amount & Network */}
                      <td className="py-4 px-6">
                        <div className="text-sm font-black text-slate-900">${p.amount} USDT</div>
                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                          {p.network}
                        </span>
                      </td>

                      {/* TXID & Proof */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 max-w-[220px]">
                          <span className="font-mono text-[11px] truncate text-emerald-700 selection:bg-emerald-100">
                            {p.txHash}
                          </span>
                          <button
                            onClick={() => handleCopy(p.txHash, "TXID")}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                            title="Copy TXID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={getExplorerUrl(p.txHash, p.network)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                            title="View on Explorer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        {p.screenshotUrl && (
                          <button
                            onClick={() => setSelectedScreenshot(p.screenshotUrl)}
                            className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-emerald-600 hover:text-emerald-700 font-bold uppercase tracking-wider cursor-pointer"
                          >
                            <FileImage className="w-3.5 h-3.5" /> View Proof Screenshot
                          </button>
                        )}
                        {p.note && (
                          <div className="text-[10px] text-slate-500 italic mt-1 max-w-[200px] truncate">
                            Note: {p.note}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            p.status === "PAID"
                              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                              : p.status === "REJECTED"
                              ? "text-red-600 bg-red-50 border-red-200"
                              : "text-amber-600 bg-amber-50 border-amber-200"
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
                          <div className="text-[10px] text-red-600 mt-1">{p.rejectionReason}</div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        {p.status === "PENDING_VERIFICATION" || p.status === "PAYMENT_PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(p.id)}
                              disabled={isSubmittingAction}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectingPaymentId(p.id)}
                              disabled={isSubmittingAction}
                              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[10px] font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Verified</span>
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
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-lg shadow-slate-200/60">
          {isLoadingWithdrawals ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          ) : filteredWithdrawals.length === 0 ? (
            <div className="text-center py-20 px-4">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-600">No withdrawal requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 font-black">
                    <th className="py-4 px-6">Request ID & Date</th>
                    <th className="py-4 px-6">Client / User</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">USDT Address</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                  {filteredWithdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-mono font-bold text-slate-900">{w.requestId}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {new Date(w.createdAt).toLocaleString()}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{w.userEmail}</div>
                        {w.companyName && (
                          <div className="text-[10px] text-emerald-600 mt-0.5">{w.companyName}</div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-sm font-black text-slate-900">${w.amount} USDT</div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 max-w-[240px]">
                          <span className="font-mono text-[11px] truncate text-emerald-700 selection:bg-emerald-100">
                            {w.usdtAddress}
                          </span>
                          <button
                            onClick={() => handleCopy(w.usdtAddress, "USDT Address")}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900"
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
                              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                              : w.status === "REJECTED"
                              ? "text-red-600 bg-red-50 border-red-200"
                              : "text-amber-600 bg-amber-50 border-amber-200"
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
                          <div className="text-[10px] text-red-600 mt-1">{w.rejectionReason}</div>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {w.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApproveWithdrawal(w.id)}
                              disabled={isSubmittingWithdrawalAction}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => { setRejectingWithdrawalId(w.id); setWithdrawalRejectionReason(""); }}
                              disabled={isSubmittingWithdrawalAction}
                              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[10px] font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Processed</span>
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
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl max-h-[85vh] bg-white border border-slate-200 rounded-2xl p-4 overflow-hidden shadow-2xl z-10"
            >
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedScreenshot}
                alt="Payment Proof Screenshot"
                className="max-h-[75vh] w-auto mx-auto rounded-lg object-contain"
              />
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
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl z-10 space-y-4"
            >
              <h3 className="text-lg font-black uppercase text-slate-900">Reject Payment Request</h3>
              <p className="text-xs text-slate-600">
                Provide a reason for rejecting this payment submission (visible to client).
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Transaction hash not found on blockchain / Amount mismatch..."
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-red-500"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setRejectingPaymentId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isSubmittingAction}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider hover:bg-red-500 transition-colors disabled:opacity-50 cursor-pointer"
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
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl z-10 space-y-4"
            >
              <h3 className="text-lg font-black uppercase text-slate-900 flex items-center gap-2">
                <ArrowDownToLine className="w-5 h-5 text-red-500" /> Reject Withdrawal Request
              </h3>
              <p className="text-xs text-slate-600">
                Provide a reason for rejecting this withdrawal request. The amount will be released back to the client's available balance.
              </p>

              <textarea
                value={withdrawalRejectionReason}
                onChange={(e) => setWithdrawalRejectionReason(e.target.value)}
                placeholder="e.g., Invalid USDT address / Amount mismatch..."
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-red-500"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setRejectingWithdrawalId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectWithdrawal}
                  disabled={isSubmittingWithdrawalAction}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider hover:bg-red-500 transition-colors disabled:opacity-50 cursor-pointer"
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
