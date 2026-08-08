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
  Key
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
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">User Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Audit platform credentials, escalate roles, revoke control accesses</p>
        </div>

        {isSuperAdmin && !showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" /> Create Reviewer / Admin
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {showCreateForm ? (
          <div className="lg:col-span-12 max-w-lg mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-600" />
              
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">New Admin Account</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Contact / Name</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Jane Reviewer"
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="reviewer@razr.marketing"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Security Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Role Authority</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="REVIEWER">REVIEWER (Compliance reviewer)</option>
                    <option value="ADMIN">ADMIN (Operations panel admin)</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Full control keys)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest transition-colors cursor-pointer shadow-lg shadow-emerald-600/25"
                >
                  {isSubmitting ? "Creating User..." : "Provision Credentials"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-12">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6">
              <h2 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-6">User Matrix</h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                </div>
              ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[9px] font-black">
                        <th className="pb-3">Username</th>
                        <th className="pb-3">Email Address</th>
                        <th className="pb-3">Role Privilege</th>
                        <th className="pb-3">Registration Date</th>
                        <th className="pb-3">Status</th>
                        {isSuperAdmin && <th className="pb-3 text-right">Escalation Controls</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {users.map((item) => {
                        const isSelf = item.id === currentUser?.id;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="py-4 font-bold text-slate-900 flex items-center gap-2">
                              {item.username} {isSelf && <span className="text-[8px] bg-emerald-50 border border-emerald-200 text-emerald-600 px-1 py-0.5 rounded">You</span>}
                            </td>
                            <td className="py-4 text-slate-600">{item.email}</td>
                            <td className="py-4 text-emerald-600 font-bold uppercase tracking-wider text-[10px]">{item.role}</td>
                            <td className="py-4 text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td className="py-4">
                              <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                                item.status === "ACTIVE"
                                  ? "text-emerald-700 border-emerald-200 bg-emerald-50"
                                  : "text-red-600 border-red-200 bg-red-50"
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            {isSuperAdmin && (
                              <td className="py-4 text-right space-x-1.5">
                                {!isSelf && (
                                  <>
                                    <button
                                      onClick={() => handleToggleStatus(item.id, item.status)}
                                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[9px] font-black uppercase tracking-wider cursor-pointer"
                                    >
                                      {item.status === "ACTIVE" ? "Block" : "Activate"}
                                    </button>
                                    <button
                                      onClick={() => handlePromoteRole(item.id, item.role === "SUPER_ADMIN" ? "REVIEWER" : "SUPER_ADMIN")}
                                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase tracking-wider cursor-pointer"
                                    >
                                      {item.role === "SUPER_ADMIN" ? "Demote" : "Promote SA"}
                                    </button>
                                  </>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-6 text-slate-400 text-xs">No users cataloged.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
