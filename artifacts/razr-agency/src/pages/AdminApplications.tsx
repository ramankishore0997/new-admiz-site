import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Search,
  Filter,
  ArrowDownToLine,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  ClipboardList,
  Calendar,
  Building,
  User,
  ExternalLink,
  MessageSquare,
  Send,
  FileCheck,
  FileDown,
  Upload,
  UserPlus
} from "lucide-react";

export default function AdminApplications() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search/Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Selected Detail application state
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [appDetail, setAppDetail] = useState<any | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Review Actions state
  const [reviewNote, setReviewNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Message state
  const [chatMsg, setChatMsg] = useState("");
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Doc review note state
  const [docNotes, setDocNotes] = useState<{ [key: number]: string }>({});

  const loadApps = async () => {
    try {
      const res = await fetch("/api/admin/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const loadDetail = async (id: number) => {
    setIsLoadingDetail(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAppDetail(data);
      }
      setIsLoadingDetail(false);
    } catch {
      setIsLoadingDetail(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleSelectApp = (id: number) => {
    setSelectedAppId(id);
    loadDetail(id);
  };

  const handleApproveApp = async () => {
    if (!selectedAppId) return;
    setIsSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedAppId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: reviewNote }),
      });
      if (res.ok) {
        toast({ title: "Approved", description: "Application approved successfully." });
        setReviewNote("");
        await loadDetail(selectedAppId);
        await loadApps();
      }
    } catch {
      toast({ variant: "destructive", title: "Error" });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleDeclineApp = async () => {
    if (!selectedAppId || !rejectionReason.trim()) {
      toast({ variant: "destructive", title: "Reason Required", description: "Explain why this request is declined." });
      return;
    }
    setIsSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedAppId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      if (res.ok) {
        toast({ title: "Declined", description: "Application marked rejected." });
        setRejectionReason("");
        await loadDetail(selectedAppId);
        await loadApps();
      }
    } catch {
      toast({ variant: "destructive", title: "Error" });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleRequestRevision = async (docsNeeded: boolean) => {
    if (!selectedAppId || !rejectionReason.trim()) {
      toast({ variant: "destructive", title: "Notes Required", description: "Specify instructions for revisions." });
      return;
    }
    setIsSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedAppId}/request-information`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason, docsNeeded }),
      });
      if (res.ok) {
        toast({ title: "Revisions Requested", description: "Notification sent to client." });
        setRejectionReason("");
        await loadDetail(selectedAppId);
        await loadApps();
      }
    } catch {
      toast({ variant: "destructive", title: "Error" });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim() || !selectedAppId) return;

    setIsSendingMsg(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedAppId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatMsg }),
      });
      if (res.ok) {
        setChatMsg("");
        await loadDetail(selectedAppId);
      }
    } catch {
      toast({ variant: "destructive", title: "Error sending message" });
    } finally {
      setIsSendingMsg(false);
    }
  };

  const handleDocApprove = async (docId: number) => {
    if (!selectedAppId) return;
    try {
      const res = await fetch(`/api/admin/documents/${docId}/approve`, { method: "POST" });
      if (res.ok) {
        toast({ title: "Doc Verified" });
        await loadDetail(selectedAppId);
      }
    } catch {}
  };

  const handleDocReject = async (docId: number) => {
    if (!selectedAppId) return;
    const note = docNotes[docId] || "Document details blurry or invalid.";
    try {
      const res = await fetch(`/api/admin/documents/${docId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: note }),
      });
      if (res.ok) {
        toast({ title: "Doc Rejected", description: "Replacement requested." });
        await loadDetail(selectedAppId);
      }
    } catch {}
  };

  // Filter listings
  const filteredApps = applications.filter((app) => {
    const query = search.toLowerCase();
    const matchesSearch =
      app.publicId.toLowerCase().includes(query) ||
      (app.username || "").toLowerCase().includes(query) ||
      (app.companyName || "").toLowerCase().includes(query) ||
      (app.userEmail || "").toLowerCase().includes(query);

    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Ad Account Onboarding Panel</h1>
          <p className="text-xs text-slate-500 mt-1">Review onboarding compliance, request revisions, approve accounts</p>
        </div>

        <div className="flex gap-2">
          <a
            href="/api/admin/applications/export"
            download
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-xl text-slate-700 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-600" /> Export CSV
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* LEFT: Applications grid/list */}
        <div className={selectedAppId ? "lg:col-span-5 space-y-4" : "lg:col-span-12 space-y-4"}>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, email, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 transition-colors shrink-0"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">DRAFT</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="INFORMATION_REQUIRED">INFO REQUIRED</option>
              <option value="DOCUMENTS_REQUIRED">DOCS REQUIRED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
              </div>
            ) : filteredApps.length > 0 ? (
              <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleSelectApp(app.id)}
                    className={`w-full flex items-center justify-between p-5 text-left transition-colors ${
                      selectedAppId === app.id ? "bg-emerald-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-slate-900 tracking-wider">{app.publicId}</span>
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                          app.status === "APPROVED"
                            ? "text-emerald-700 border-emerald-200 bg-emerald-50"
                            : app.status === "REJECTED"
                            ? "text-red-600 border-red-200 bg-red-50"
                            : "text-amber-600 border-amber-200 bg-amber-50"
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 font-bold mt-1.5">{app.companyName || "No Company"}</div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{app.userEmail}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">No matching onboarding applications found.</div>
            )}
          </div>
        </div>

        {/* RIGHT: Selected application review cockpit */}
        {selectedAppId && (
          <div className="lg:col-span-7 space-y-6">
            {isLoadingDetail || !appDetail ? (
              <div className="min-h-[300px] border border-slate-200 rounded-2xl bg-white flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header overview */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">{appDetail.application.publicId} Review</h2>
                      <p className="text-xs text-emerald-600 mt-1">Reviewer Assignment: {appDetail.application.assignedAdminId ? `Assigned ID ${appDetail.application.assignedAdminId}` : "Unassigned"}</p>
                    </div>
                    <button
                      onClick={() => setSelectedAppId(null)}
                      className="text-xs text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                    >
                      Close review
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5 text-xs">
                    <div>
                      <span className="text-slate-500 block">Client Contact</span>
                      <span className="font-bold text-slate-900">{appDetail.application.personalInfo?.fullName || appDetail.application.username}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Telegram</span>
                      <a href={`https://t.me/${appDetail.application.telegramHandle}`} target="_blank" rel="noreferrer" className="font-bold text-emerald-600 hover:underline flex items-center gap-1">
                        @{appDetail.application.telegramHandle} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Niche Vertical</span>
                      <span className="font-bold text-slate-900">{appDetail.application.businessInfo?.vertical || "General"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Daily Budget</span>
                      <span className="font-bold text-slate-900">{appDetail.application.advertisingInfo?.expectedSpend || "Pending"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Platform</span>
                      <span className="font-bold text-slate-900">{appDetail.application.advertisingInfo?.platform || "Pending"}</span>
                    </div>
                  </div>
                </div>

                {/* Documents checklist */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6">
                  <h3 className="text-sm font-black uppercase text-slate-900 mb-4">Compliance Document Review</h3>
                  <div className="space-y-4">
                    {appDetail.documents.length > 0 ? (
                      appDetail.documents.map((doc: any) => (
                        <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                          <div className="flex items-center justify-between gap-4 mb-3">
                            <div>
                              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">{doc.category}</h4>
                              <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5 max-w-[200px]">{doc.fileName}</div>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={`/api/documents/${doc.id}/download`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[9px] font-black uppercase tracking-wider text-slate-700 transition-colors"
                              >
                                <FileDown className="w-3.5 h-3.5" /> View file
                              </a>
                              <button
                                onClick={() => handleDocApprove(doc.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Approve
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-2 border-t border-slate-200 pt-3">
                            <input
                              type="text"
                              placeholder="Rejection note description..."
                              value={docNotes[doc.id] || ""}
                              onChange={(e) => setDocNotes({ ...docNotes, [doc.id]: e.target.value })}
                              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] text-slate-900 outline-none focus:border-emerald-500"
                            />
                            <button
                              onClick={() => handleDocReject(doc.id)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Reject Doc
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-400 text-xs">No compliance documents uploaded.</div>
                    )}
                  </div>
                </div>

                {/* Review operations panel */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6 space-y-4">
                  <h3 className="text-sm font-black uppercase text-slate-900">Reviewer Operations Decisions</h3>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Approval Notes / Revision instructions</label>
                    <textarea
                      placeholder="Add note for approval, or explain what documents/info are missing..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleApproveApp}
                      disabled={isSubmittingAction}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-35 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-emerald-600/25"
                    >
                      Approve Compliance Onboarding
                    </button>
                    <button
                      onClick={() => handleRequestRevision(false)}
                      disabled={isSubmittingAction}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Request Info
                    </button>
                    <button
                      onClick={() => handleRequestRevision(true)}
                      disabled={isSubmittingAction}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Request Documents Replacement
                    </button>
                    <button
                      onClick={handleDeclineApp}
                      disabled={isSubmittingAction}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-35 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Decline Request
                    </button>
                  </div>
                </div>

                {/* Reviewer messaging thread */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden flex flex-col h-[400px]">
                  <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Onboarding Message Log</h3>
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {appDetail.messages.map((msg: any) => {
                      const isClient = msg.senderId === appDetail.application.userId;
                      return (
                        <div key={msg.id} className={`flex flex-col ${isClient ? "items-start" : "items-end"}`}>
                          <div className={`rounded-2xl px-4 py-2.5 text-xs max-w-[80%] leading-relaxed ${
                            isClient
                              ? "bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none"
                              : "bg-emerald-600 text-white rounded-tr-none shadow-[0_4px_15px_rgba(5,150,105,0.25)]"
                          }`}>
                            {msg.message}
                          </div>
                          <span className="text-[8px] text-slate-400 mt-1 font-mono">
                            {isClient ? "Client" : "You (Reviewer)"} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendAdminMessage} className="p-4 border-t border-slate-200 bg-white flex gap-2">
                    <input
                      type="text"
                      value={chatMsg}
                      onChange={(e) => setChatMsg(e.target.value)}
                      placeholder="Send message or feedback to client..."
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isSendingMsg || !chatMsg.trim()}
                      className="w-10 h-10 rounded-xl bg-emerald-600 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center shrink-0 cursor-pointer shadow-md shadow-emerald-600/25"
                    >
                      {isSendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
