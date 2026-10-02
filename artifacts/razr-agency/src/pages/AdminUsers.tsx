import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Users,
  PlusCircle,
  Shield,
  Loader2,
  CheckCircle,
  XCircle,
  UserCheck,
  Building,
  Key,
  Wallet,
  DollarSign,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  X,
} from "lucide-react";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form: Create new Administrator
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("REVIEWER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal: Balance Adjustment
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [balanceMode, setBalanceMode] = useState<"SET" | "ADD">("SET");
  const [balanceAmount, setBalanceAmount] = useState<string>("");
  const [balanceNote, setBalanceNote] = useState<string>("");
  const [isAdjustingBalance, setIsAdjustingBalance] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        setUsers(await res.json());
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openBalanceModalForUser = (user?: any) => {
    if (user) {
      setSelectedUserId(String(user.id));
    } else if (users.length > 0 && !selectedUserId) {
      setSelectedUserId(String(users[0].id));
    }
    setBalanceMode("SET");
    setBalanceAmount("");
    setBalanceNote("");
    setShowBalanceModal(true);
  };

  const selectedUser = users.find((u) => String(u.id) === String(selectedUserId));
  const currentSelectedBalance = Number(selectedUser?.balance || 0);

  const calculatePreviewBalance = () => {
    const val = parseFloat(balanceAmount);
    if (isNaN(val)) return currentSelectedBalance;
    if (balanceMode === "SET") {
      return val >= 0 ? val : currentSelectedBalance;
    } else {
      return currentSelectedBalance + val;
    }
  };

  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || balanceAmount === "" || isNaN(Number(balanceAmount))) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid amount." });
      return;
    }

    setIsAdjustingBalance(true);
    try {
      const res = await fetch("/api/admin/users/adjust-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(selectedUserId),
          mode: balanceMode,
          amount: Number(balanceAmount),
          note: balanceNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Balance Updated",
          description: data.message || `Balance updated successfully.`,
        });
        setShowBalanceModal(false);
        setBalanceAmount("");
        setBalanceNote("");
        await loadUsers();
      } else {
        toast({
          variant: "destructive",
          title: "Adjustment Failed",
          description: data.error || "Could not adjust balance.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to server.",
      });
    } finally {
      setIsAdjustingBalance(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username || !password || !role) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, role }),
      });

      if (res.ok) {
        toast({ title: "User Created", description: `New administrator user ${username} created.` });
        setEmail("");
        setUsername("");
        setPassword("");
        setShowCreateForm(false);
        await loadUsers();
      } else {
        const err = await res.json();
        toast({ variant: "destructive", title: "Failed", description: err.error });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Could not create user." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        toast({ title: "User Status Changed", description: `Account marked: ${nextStatus}` });
        await loadUsers();
      }
    } catch {}
  };

  const handlePromoteRole = async (id: number, targetRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });
      if (res.ok) {
        toast({ title: "Privileges Modified", description: `Role updated to ${targetRole}` });
        await loadUsers();
      }
    } catch {}
  };

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="pb-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Identity & Permissions
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              User Directory
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit platform credentials, balance management & role privileges</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openBalanceModalForUser()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-black text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-lg shadow-emerald-500/20"
            >
              <Wallet className="w-3.5 h-3.5 text-black" />
              Adjust User Balance
            </button>

            {isSuperAdmin && !showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-lg shadow-violet-600/30"
              >
                <PlusCircle className="w-3.5 h-3.5 text-white" /> Create Admin
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {showCreateForm ? (
            <div className="lg:col-span-12 max-w-lg mx-auto w-full">
              <div className="rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400" />
                
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-sm font-black uppercase text-white tracking-wider">New Admin Account</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-xs text-zinc-400 hover:text-white font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Contact / Name</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Jane Reviewer"
                      required
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="reviewer@razr.marketing"
                        required
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Security Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Role Authority</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="REVIEWER">REVIEWER (Compliance reviewer)</option>
                      <option value="ADMIN">ADMIN (Operations panel admin)</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN (Full control keys)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-violet-600/30"
                  >
                    {isSubmitting ? "Creating User..." : "Provision Credentials"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-12">
              <div className="rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl shadow-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" /> User Matrix
                  </h2>
                  <span className="text-[11px] font-bold text-zinc-400">
                    {users.length} registered {users.length === 1 ? "user" : "users"}
                  </span>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                  </div>
                ) : users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-black text-zinc-400 uppercase tracking-wider text-[10px] font-black">
                          <th className="py-3 px-4">User</th>
                          <th className="py-3 px-4">Email Address</th>
                          <th className="py-3 px-4">Wallet Balance</th>
                          <th className="py-3 px-4">Role Privilege</th>
                          <th className="py-3 px-4">Registration</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                        {users.map((item) => {
                          const isSelf = item.id === currentUser?.id;
                          const userBal = Number(item.balance || 0);
                          return (
                            <tr key={item.id} className="hover:bg-zinc-900/40">
                              <td className="py-4 px-4 font-bold text-white">
                                <div className="flex items-center gap-1.5">
                                  <span>{item.username || "—"}</span>
                                  {item.companyName && (
                                    <span className="text-[10px] text-zinc-500 font-normal">({item.companyName})</span>
                                  )}
                                  {isSelf && (
                                    <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">You</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-zinc-300 font-mono text-[11px]">{item.email}</td>
                              <td className="py-4 px-4">
                                <span className={`font-mono font-bold text-xs ${userBal > 0 ? "text-emerald-400" : "text-zinc-400"}`}>
                                  ${userBal.toFixed(2)} <span className="text-[9px] text-zinc-500 font-normal">USDT</span>
                                </span>
                              </td>
                              <td className="py-4 px-4 text-cyan-400 font-bold uppercase tracking-wider text-[10px]">{item.role}</td>
                              <td className="py-4 px-4 text-zinc-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                              <td className="py-4 px-4">
                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                  item.status === "ACTIVE"
                                    ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                                    : "text-red-400 border-red-500/20 bg-red-500/10"
                                }`}>
                                  {item.status || "ACTIVE"}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => openBalanceModalForUser(item)}
                                  className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-zinc-700 hover:border-cyan-500/50 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer inline-flex items-center gap-1 transition-colors"
                                  title="Adjust or set balance"
                                >
                                  <DollarSign className="w-2.5 h-2.5" />
                                  Edit Balance
                                </button>

                                {isSuperAdmin && !isSelf && (
                                  <>
                                    <button
                                      onClick={() => handleToggleStatus(item.id, item.status || "ACTIVE")}
                                      className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer transition-colors"
                                    >
                                      {item.status === "ACTIVE" ? "Block" : "Activate"}
                                    </button>
                                    <button
                                      onClick={() => handlePromoteRole(item.id, item.role === "SUPER_ADMIN" ? "REVIEWER" : "SUPER_ADMIN")}
                                      className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer transition-colors"
                                    >
                                      {item.role === "SUPER_ADMIN" ? "Demote" : "Promote SA"}
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-6 text-zinc-500 text-xs font-bold uppercase tracking-wider">No users cataloged.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Adjust User Balance Modal */}
        {showBalanceModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#060608] border border-zinc-800 rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 relative overflow-hidden animate-in fade-in zoom-in duration-150 space-y-5">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-white">Adjust User Balance</h3>
                    <p className="text-[11px] text-zinc-400">Update or credit USDT wallet balance directly</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBalanceModal(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAdjustBalance} className="space-y-4">
                {/* Select User Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Select User (Email / ID)</span>
                    <span className="text-cyan-400 lowercase font-normal">{users.length} available</span>
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white font-medium outline-none focus:border-cyan-500 transition-all cursor-pointer"
                  >
                    <option value="" disabled>-- Select a user --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.email} ({u.username || "No Name"}) — Current: ${Number(u.balance || 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current Balance Display Card */}
                {selectedUser && (
                  <div className="bg-black border border-zinc-800 rounded-2xl p-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Current Wallet Balance</div>
                      <div className="text-lg font-black text-white font-mono mt-0.5">
                        ${currentSelectedBalance.toFixed(2)}{" "}
                        <span className="text-xs text-zinc-500 font-normal">USDT</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">User ID</div>
                      <div className="text-xs font-mono text-cyan-400 font-bold">#{selectedUser.id}</div>
                    </div>
                  </div>
                )}

                {/* Adjustment Mode Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Adjustment Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBalanceMode("SET")}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                        balanceMode === "SET"
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm"
                          : "border-zinc-800 bg-black text-zinc-400 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      🎯 Set Exact Balance
                    </button>
                    <button
                      type="button"
                      onClick={() => setBalanceMode("ADD")}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                        balanceMode === "ADD"
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm"
                          : "border-zinc-800 bg-black text-zinc-400 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      ➕ Add / Deduct
                    </button>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                    {balanceMode === "SET" ? "New Total Balance ($ USDT)" : "Amount to Add / Deduct ($ USDT)"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min={balanceMode === "SET" ? "0" : undefined}
                      value={balanceAmount}
                      onChange={(e) => setBalanceAmount(e.target.value)}
                      placeholder={balanceMode === "SET" ? "e.g. 100.00" : "e.g. 50 (or -20 to deduct)"}
                      required
                      className="w-full bg-black border border-zinc-800 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm font-bold outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                    />
                  </div>
                  {balanceMode === "ADD" && (
                    <p className="text-[10px] text-zinc-500">
                      Use positive numbers (e.g. <span className="font-mono text-emerald-400 font-bold">50</span>) to add balance, or negative (e.g. <span className="font-mono text-red-400 font-bold">-25</span>) to deduct.
                    </p>
                  )}
                </div>

                {/* Live Preview */}
                {selectedUser && balanceAmount !== "" && !isNaN(Number(balanceAmount)) && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">New Balance Preview:</span>
                    </div>
                    <div className="text-sm font-black font-mono text-emerald-400">
                      ${calculatePreviewBalance().toFixed(2)} USDT
                    </div>
                  </div>
                )}

                {/* Optional Reason / Note */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Reason / Audit Note (Optional)</label>
                  <input
                    type="text"
                    value={balanceNote}
                    onChange={(e) => setBalanceNote(e.target.value)}
                    placeholder="e.g. Bonus credit, manual bank transfer deposit, etc."
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowBalanceModal(false)}
                    disabled={isAdjustingBalance}
                    className="flex-1 py-2.5 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAdjustingBalance || !selectedUserId || balanceAmount === ""}
                    className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-violet-600/30 cursor-pointer disabled:opacity-50 transition-all hover:opacity-90"
                  >
                    {isAdjustingBalance ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> Saving...
                      </span>
                    ) : (
                      "Save & Update"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
