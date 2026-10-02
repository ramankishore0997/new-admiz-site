import { useState, useEffect } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { Bell, Check, Trash2, Calendar, Loader2, Sparkles } from "lucide-react";

export default function ClientNotifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifError, setNotifError] = useState("");

  const loadNotifs = async () => {
    setIsLoading(true);
    setNotifError("");
    try {
      const data = await apiFetch<any[]>("/api/notifications");
      setNotifications(data || []);
    } catch (e: any) {
      setNotifError(e.message || "Failed to load notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      await loadNotifs();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Update Failed", description: e.message || "Could not mark notification as read." });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiFetch("/api/notifications/read-all", { method: "POST" });
      toast({ title: "All Read", description: "Marked all notifications as read." });
      await loadNotifs();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Update Failed", description: e.message || "Could not update notifications." });
    }
  };

  return (
    <ClientLayout>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-zinc-800 flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            System <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Notifications</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Status changes, review feedback, and budget alerts</p>
        </div>
        
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 border border-zinc-800 hover:border-zinc-700 bg-[#060608] hover:bg-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-wider text-zinc-300 transition-colors cursor-pointer hover:text-white"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-6">
          {notifError ? (
            <div>
              <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4">
                {notifError}
              </div>
              <button
                onClick={loadNotifs}
                className="mt-3 text-[10px] font-black uppercase tracking-wider text-cyan-400 hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all flex gap-4 ${
                    notif.isRead
                      ? "border-zinc-800/80 bg-black/60 opacity-60"
                      : "border-violet-500/30 bg-black hover:border-violet-500/50 shadow-md shadow-violet-500/5"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.isRead ? "bg-[#0c0c10] text-zinc-600" : "bg-gradient-to-r from-violet-600/20 to-cyan-600/20 text-cyan-300 border border-violet-500/30"
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-white">
                        {notif.title}
                      </h4>
                      <span className="text-[8px] text-zinc-500 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{notif.message}</p>
                  </div>

                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-2 border border-zinc-800 hover:border-zinc-700 bg-[#060608] rounded-xl text-zinc-400 hover:text-white transition-colors self-center shrink-0 cursor-pointer"
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
              <Bell className="w-8 h-8 mx-auto text-zinc-700 mb-3 animate-pulse" />
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">No notifications</p>
              <p className="text-[10px] text-zinc-600 mt-1">You are all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
