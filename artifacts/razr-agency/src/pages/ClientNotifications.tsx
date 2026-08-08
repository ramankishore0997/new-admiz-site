import { useState, useEffect } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { useToast } from "@/hooks/use-toast";
import { Bell, Check, Trash2, Calendar, Loader2 } from "lucide-react";

export default function ClientNotifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifs = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      });
      if (res.ok) {
        await loadNotifs();
      }
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
      });
      if (res.ok) {
        toast({ title: "All Read", description: "Marked all notifications as read." });
        await loadNotifs();
      }
    } catch {}
  };

  return (
    <ClientLayout>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500 mt-1">Status changes, review feedback, and budget alerts</p>
        </div>
        
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-700 transition-colors cursor-pointer"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border transition-colors flex gap-4 ${
                    notif.isRead
                      ? "border-slate-200 bg-slate-50 opacity-60"
                      : "border-primary/20 bg-primary/[0.01] hover:border-primary/30"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    notif.isRead ? "bg-slate-100 text-slate-400" : "bg-primary/10 text-primary border border-primary/20"
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        {notif.title}
                      </h4>
                      <span className="text-[8px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  </div>

                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-2 border border-slate-200 hover:border-slate-300 bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors self-center shrink-0 cursor-pointer"
                      title="Mark as Read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-8 h-8 mx-auto text-slate-300 mb-3 animate-pulse" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No notifications</p>
              <p className="text-[10px] text-slate-400 mt-1">You are all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
