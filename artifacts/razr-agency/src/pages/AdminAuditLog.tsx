import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { History, Loader2, Calendar } from "lucide-react";

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
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 relative z-10">
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">System Audit Trail</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time immutable database log of administrator decisions, approvals, and credential modifications</p>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6">
          <div className="flex items-center gap-2 mb-6 text-slate-600">
            <History className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-black uppercase tracking-wider">Immutable Security Ledger</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
            </div>
          ) : logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[9px] font-black">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Actor Email</th>
                    <th className="pb-3">System Action</th>
                    <th className="pb-3">Target Details</th>
                    <th className="pb-3">Meta Ledger Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[10px]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3 text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-slate-900 block">{log.actorName || "SYSTEM"}</span>
                        <span className="text-[9px] text-slate-400 block">{log.actorEmail}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-emerald-600 font-bold uppercase tracking-wider">{log.action}</span>
                      </td>
                      <td className="py-3 text-slate-600">
                        {log.targetType ? `${log.targetType.toUpperCase()} (ID: ${log.targetId})` : "Global"}
                      </td>
                      <td className="py-3 text-slate-500 max-w-[200px] truncate" title={JSON.stringify(log.metadata)}>
                        {JSON.stringify(log.metadata)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-10">No system audit records found.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
