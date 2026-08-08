import AdminLayout from "@/components/layout/AdminLayout";
import { Bell } from "lucide-react";

export default function AdminNotifications() {
  return (
    <AdminLayout>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 relative z-10">
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Operations Center Alerts</h1>
        <p className="text-xs text-slate-500 mt-1">Audit log alarms and system-wide broadcast message alerts</p>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-8 text-center">
          <Bell className="w-10 h-10 text-emerald-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider">Ops Alerts Center</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            All system audit events are securely piped to the Immutable Security Trail. Custom system broadcasts are reserved.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
