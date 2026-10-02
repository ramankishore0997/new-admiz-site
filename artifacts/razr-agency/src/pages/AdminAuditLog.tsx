import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { History, Loader2, Calendar, Sparkles } from "lucide-react";

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/audit-log")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setLogs(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="pb-6 border-b border-zinc-800 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Immutable Security Ledger
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            System Audit Trail
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Real-time immutable database log of administrator decisions, approvals, and credential modifications</p>
        </div>

        <div className="relative z-10">
          <div className="rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl shadow-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-cyan-400">
              <History className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">Immutable Security Ledger</span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              </div>
            ) : logs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-black text-zinc-400 uppercase tracking-wider text-[10px] font-black">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor Email</th>
                      <th className="py-3 px-4">System Action</th>
                      <th className="py-3 px-4">Target Details</th>
                      <th className="py-3 px-4">Meta Ledger Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 font-mono text-[10px] text-zinc-300">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3.5 px-4 text-zinc-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{log.actorName || "SYSTEM"}</span>
                          <span className="text-[9px] text-zinc-500 block">{log.actorEmail}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-cyan-400 font-bold uppercase tracking-wider">{log.action}</span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400">
                          {log.targetType ? `${log.targetType.toUpperCase()} (ID: ${log.targetId})` : "Global"}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-500 max-w-[200px] truncate" title={JSON.stringify(log.metadata)}>
                          {JSON.stringify(log.metadata)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider text-center py-10">No system audit records found.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
