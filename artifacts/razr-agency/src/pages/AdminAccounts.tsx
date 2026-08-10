import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import {
  Server,
  PlusCircle,
  Clock,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  Building,
  User,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminAccounts() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State: Provision Account
  const [showProvisionForm, setShowProvisionForm] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [platform, setPlatform] = useState("Meta Ads (Facebook/IG)");
  const [accountId, setAccountId] = useState("");
  const [businessPortfolioId, setBusinessPortfolioId] = useState("");
  const [spendLimit, setSpendLimit] = useState("$5,000 / day");
  const [notes, setNotes] = useState("");
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Assign BM Access modal
  const [assignBmAccount, setAssignBmAccount] = useState<any | null>(null);
  const [assignBmId, setAssignBmId] = useState("");
  const [isAssigningBm, setIsAssigningBm] = useState(false);

  const loadData = async () => {
    try {
      const accRes = await fetch("/api/admin/accounts");
      const appRes = await fetch("/api/admin/applications");
      if (accRes.ok && appRes.ok) {
        setAccounts(await accRes.json());
        // Only allow provisioning for APPROVED applications
        const apps = await appRes.json();
        setApplications(apps.filter((a: any) => a.status === "APPROVED"));
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !platform) return;

    setIsProvisioning(true);
    try {
      const res = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: Number(selectedAppId),
          platform,
          accountId,
          businessPortfolioId,
          spendLimit,
          notes,
        }),
      });

      if (res.ok) {
        toast({ title: "Account Provisioned", description: "Details and notifications sent to client." });
        setSelectedAppId("");
        setAccountId("");
        setBusinessPortfolioId("");
        setNotes("");
        setShowProvisionForm(false);
        await loadData();
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Could not provision ad account." });
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/accounts/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast({ title: "Status Updated", description: `Account marked: ${status}` });
        await loadData();
      }
    } catch {}
  };

  const handleAssignBm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignBmAccount) return;
    setIsAssigningBm(true);
    try {
      const res = await fetch(`/api/admin/accounts/${assignBmAccount.id}/assign-bm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessPortfolioId: assignBmId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to assign BM access.");
      }
      toast({ title: "BM Access Assigned", description: `Account ${assignBmAccount.accountId} is now ACTIVE.` });
      setAssignBmAccount(null);
      setAssignBmId("");
      await loadData();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Action Failed", description: err.message });
    } finally {
      setIsAssigningBm(false);
    }
  };

  return (
    <AdminLayout>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Ad Account Provisioning</h1>
          <p className="text-xs text-slate-500 mt-1">Manage active platform allocations, raise spend limits, link business managers</p>
        </div>

        {!showProvisionForm && (
          <button
            onClick={() => setShowProvisionForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" /> Provision Account
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {showProvisionForm ? (
          <div className="lg:col-span-12 max-w-lg mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-600" />
              
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">Provision Ad Account</h3>
                <button
                  onClick={() => setShowProvisionForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleProvision} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Select Approved Application</label>
                  <select
                    value={selectedAppId}
                    onChange={(e) => setSelectedAppId(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Select App reference...</option>
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.publicId} — {app.companyName} ({app.username})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Ad Network Platform</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option>Meta Ads (Facebook/IG)</option>
                      <option>Google Ads (YouTube/PMax)</option>
                      <option>TikTok Ads</option>
                      <option>Other Network</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Daily spend limit</label>
                    <input
                      type="text"
                      value={spendLimit}
                      onChange={(e) => setSpendLimit(e.target.value)}
                      placeholder="e.g. $5,000 / day"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Ad Account ID</label>
                    <input
                      type="text"
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      placeholder="e.g. ACC-4920491"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Business Portfolio ID</label>
                    <input
                      type="text"
                      value={businessPortfolioId}
                      onChange={(e) => setBusinessPortfolioId(e.target.value)}
                      placeholder="e.g. Portfolio 9029192"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Internal Notes / Instructions</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Instructions on pixel mappings or warmup sequences..."
                    rows={3}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProvisioning}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest transition-colors cursor-pointer shadow-lg shadow-emerald-600/25"
                >
                  {isProvisioning ? "Provisioning..." : "Activate & Link Account"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-12">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6">
              <h2 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-6">Active Ad Account Allocations</h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                </div>
              ) : accounts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[9px] font-black">
                        <th className="pb-3">Client / Company</th>
                        <th className="pb-3">Platform</th>
                        <th className="pb-3">Account ID</th>
                        <th className="pb-3">Topup Balance</th>
                        <th className="pb-3">Daily Limit</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {accounts.map((acc) => (
                        <tr key={acc.id} className="hover:bg-slate-50">
                          <td className="py-4">
                            <span className="font-bold text-slate-900 block">{acc.companyName}</span>
                            <span className="text-[9px] text-slate-500 block mt-0.5">{acc.userEmail}</span>
                          </td>
                          <td className="py-4 text-slate-900 font-mono">{acc.platform}</td>
                          <td className="py-4 text-slate-900 font-mono">
                            {acc.accountId}
                            {acc.businessPortfolioId && (
                              <span className="text-[8px] font-bold text-blue-600 block mt-0.5">BM: {acc.businessPortfolioId}</span>
                            )}
                          </td>
                          <td className="py-4">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              Number(acc.balance || 0) >= 50
                                ? "text-emerald-700 border-emerald-200 bg-emerald-50"
                                : "text-slate-500 border-slate-200 bg-slate-50"
                            }`}>
                              ${Number(acc.balance || 0).toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 text-slate-900">{acc.spendLimit}</td>
                          <td className="py-4">
                            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              acc.status === "ACTIVE"
                                ? "text-emerald-700 border-emerald-200 bg-emerald-50"
                                : acc.status === "APPROVED"
                                ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                                : acc.status === "SUSPENDED"
                                ? "text-red-600 border-red-200 bg-red-50"
                                : "text-amber-600 border-amber-200 bg-amber-50"
                            }`}>
                              {acc.status}
                            </span>
                          </td>
                          <td className="py-4 text-right space-x-1.5">
                            {acc.status === "APPROVED" ? (
                              Number(acc.balance || 0) >= 50 ? (
                                <button
                                  onClick={() => { setAssignBmAccount(acc); setAssignBmId(acc.businessPortfolioId || ""); }}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  Assign BM Access
                                </button>
                              ) : (
                                <span className="text-[8px] text-amber-600 font-black uppercase tracking-wider inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Awaiting topup
                                </span>
                              )
                            ) : acc.status === "ACTIVE" ? (
                              <button
                                onClick={() => handleUpdateStatus(acc.id, "SUSPENDED")}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateStatus(acc.id, "ACTIVE")}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Activate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
                  <Server className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No active accounts provisioned.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Assign BM Access Modal */}
      <AnimatePresence>
        {assignBmAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAssignBmAccount(null)}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase text-slate-900 flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-blue-600" /> Assign BM Access
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {assignBmAccount.accountId} · {assignBmAccount.platform}
                  </p>
                </div>
                <button
                  onClick={() => setAssignBmAccount(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-[11px] text-emerald-800 font-semibold">
                Client topup: <strong>${Number(assignBmAccount.balance || 0).toFixed(2)}</strong> — minimum topup completed. Assigning access will activate this account for the client.
              </div>

              <form onSubmit={handleAssignBm} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Business Manager / Portfolio ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={assignBmId}
                    onChange={(e) => setAssignBmId(e.target.value)}
                    placeholder="e.g. Portfolio 9029192"
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setAssignBmAccount(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAssigningBm}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-wider hover:bg-blue-500 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isAssigningBm ? "Assigning..." : "Assign & Activate"}
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
