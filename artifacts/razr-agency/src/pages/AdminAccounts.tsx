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
  X,
  UserCheck,
  Copy,
  Sparkles,
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
      <div className="space-y-8 max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="pb-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Ad Inventory Fleet
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Ad Account Provisioning
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Manage active platform allocations, raise spend limits, link business managers</p>
          </div>

          {!showProvisionForm && (
            <button
              onClick={() => setShowProvisionForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-lg shadow-violet-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-white" /> Provision Account
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {showProvisionForm ? (
            <div className="lg:col-span-12 max-w-lg mx-auto w-full">
              <div className="rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400" />
                
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-sm font-black uppercase text-white tracking-wider">Provision Ad Account</h3>
                  <button
                    onClick={() => setShowProvisionForm(false)}
                    className="text-xs text-zinc-400 hover:text-white font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleProvision} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Select Approved Application</label>
                    <select
                      value={selectedAppId}
                      onChange={(e) => setSelectedAppId(e.target.value)}
                      required
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors"
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
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ad Network Platform</label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors"
                      >
                        <option>Meta Ads (Facebook/IG)</option>
                        <option>Google Ads (YouTube/PMax)</option>
                        <option>TikTok Ads</option>
                        <option>Other Network</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Daily spend limit</label>
                      <input
                        type="text"
                        value={spendLimit}
                        onChange={(e) => setSpendLimit(e.target.value)}
                        placeholder="e.g. $5,000 / day"
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ad Account ID</label>
                      <input
                        type="text"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        placeholder="e.g. ACC-4920491"
                        required
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Business Portfolio ID</label>
                      <input
                        type="text"
                        value={businessPortfolioId}
                        onChange={(e) => setBusinessPortfolioId(e.target.value)}
                        placeholder="e.g. Portfolio 9029192"
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Internal Notes / Instructions</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Instructions on pixel mappings or warmup sequences..."
                      rows={3}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors resize-none placeholder:text-zinc-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProvisioning}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-violet-600/30"
                  >
                    {isProvisioning ? "Provisioning..." : "Activate & Link Account"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-12">
              <div className="rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl shadow-2xl p-6 md:p-8">
                <h2 className="text-sm font-black uppercase tracking-tight text-white mb-6 flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" /> Active Ad Account Allocations
                </h2>

                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                  </div>
                ) : accounts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-black text-zinc-400 uppercase tracking-wider text-[10px] font-black">
                          <th className="py-3 px-4">Client / Company</th>
                          <th className="py-3 px-4">Platform</th>
                          <th className="py-3 px-4">Account ID</th>
                          <th className="py-3 px-4">Topup Balance</th>
                          <th className="py-3 px-4">Daily Limit</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                        {accounts.map((acc) => (
                          <tr key={acc.id} className="hover:bg-zinc-900/40">
                            <td className="py-4 px-4">
                              <span className="font-bold text-white block">{acc.companyName}</span>
                              <span className="text-[10px] text-zinc-400 block mt-0.5">{acc.userEmail}</span>
                              {acc.publicApplicationId && (
                                <span className="text-[9px] font-mono text-zinc-500 block mt-0.5">{acc.publicApplicationId}</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-white font-mono">{acc.platform}</td>
                            <td className="py-4 px-4 text-white font-mono">
                              <div className="font-bold">{acc.accountId}</div>
                              {acc.clientSubmittedBmId && (
                                <span className="text-[9px] font-extrabold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full block mt-1 w-fit">
                                  Client BM: {acc.clientSubmittedBmId}
                                </span>
                              )}
                              {acc.businessPortfolioId && (
                                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full block mt-0.5 w-fit">
                                  Assigned: {acc.businessPortfolioId}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                Number(acc.balance || 0) >= 50
                                   ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                                   : "text-zinc-400 border-zinc-800 bg-black"
                              }`}>
                                ${Number(acc.balance || 0).toFixed(2)}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-white">{acc.spendLimit}</td>
                            <td className="py-4 px-4">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                acc.status === "ACTIVE"
                                  ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                                  : acc.status === "APPROVED"
                                  ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                                  : acc.status === "SUSPENDED"
                                  ? "text-red-400 border-red-500/20 bg-red-500/10"
                                  : "text-amber-400 border-amber-500/20 bg-amber-500/10"
                              }`}>
                                {acc.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right space-x-1.5">
                              {acc.status === "APPROVED" ? (
                                Number(acc.balance || 0) >= 50 ? (
                                  <button
                                    onClick={() => {
                                      setAssignBmAccount(acc);
                                      setAssignBmId(acc.businessPortfolioId || acc.clientSubmittedBmId || "");
                                    }}
                                    className="px-3 py-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-violet-600/20"
                                  >
                                    Assign BM Access
                                  </button>
                                ) : (
                                  <span className="text-[9px] text-amber-400 font-black uppercase tracking-wider inline-flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Awaiting topup
                                  </span>
                                )
                              ) : acc.status === "ACTIVE" ? (
                                <button
                                  onClick={() => handleUpdateStatus(acc.id, "SUSPENDED")}
                                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateStatus(acc.id, "ACTIVE")}
                                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
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
                  <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
                    <Server className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">No active accounts provisioned.</p>
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
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-lg bg-[#060608] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl z-10 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-cyan-400" /> Assign BM Access
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {assignBmAccount.accountId} · {assignBmAccount.platform} · <span className="font-bold text-white">{assignBmAccount.companyName}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setAssignBmAccount(null)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Client Submitted Information Box */}
                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-violet-300 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-violet-400" /> Client Application Submission
                    </span>
                    {assignBmAccount.clientSubmittedBmId && (
                      <button
                        type="button"
                        onClick={() => {
                          setAssignBmId(assignBmAccount.clientSubmittedBmId);
                          toast({ title: "Auto-Filled", description: "Client's submitted BM ID copied to input." });
                        }}
                        className="text-[9px] font-black uppercase text-violet-300 bg-violet-500/20 border border-violet-500/30 px-2.5 py-1 rounded-lg hover:bg-violet-500/30 transition-colors cursor-pointer shadow-xs"
                      >
                        Use Client BM ID
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-black p-2.5 rounded-xl border border-zinc-800 space-y-0.5">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase block font-sans">Client's Target BM / ID / Gmail</span>
                      <span className="font-mono font-bold text-cyan-300 break-all select-all">
                        {assignBmAccount.clientSubmittedBmId || "Not provided in form"}
                      </span>
                    </div>
                    <div className="bg-black p-2.5 rounded-xl border border-zinc-800 space-y-0.5">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase block font-sans">Account Name & Risk Hat</span>
                      <span className="font-bold text-white">
                        {assignBmAccount.clientAccountName || "Standard"} ({assignBmAccount.clientHatType || "White"})
                      </span>
                    </div>
                  </div>

                  {(assignBmAccount.clientCountry || assignBmAccount.clientCurrency) && (
                    <div className="text-[10px] text-zinc-400 flex items-center gap-2 pt-1 border-t border-violet-500/20">
                      <span>Country: <strong className="text-white">{assignBmAccount.clientCountry || "US"}</strong></span>
                      <span>·</span>
                      <span>Currency: <strong className="text-white">{assignBmAccount.clientCurrency || "USD"}</strong></span>
                      <span>·</span>
                      <span>App: <strong className="text-white">{assignBmAccount.publicApplicationId}</strong></span>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-[11px] text-emerald-300 font-semibold flex items-center justify-between">
                  <span>Client Topup: <strong className="text-white">${Number(assignBmAccount.balance || 0).toFixed(2)}</strong></span>
                  <span className="text-[9px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-black border border-emerald-500/30">Ready to Activate</span>
                </div>

                <form onSubmit={handleAssignBm} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Assigned Business Manager / Portfolio ID <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={assignBmId}
                      onChange={(e) => setAssignBmId(e.target.value)}
                      placeholder="e.g. Portfolio 9029192 or Paste BM ID"
                      required
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs font-mono font-bold outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setAssignBmAccount(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAssigningBm}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-violet-600/30"
                    >
                      {isAssigningBm ? "Assigning..." : "Assign & Activate Account"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
