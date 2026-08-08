import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { FileText, Loader2, Download, Calendar, ExternalLink } from "lucide-react";

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((res) => (res.ok ? res.json() : []))
      .then(async (apps) => {
        // Collect documents from detailed applications or query applications
        const docPromises = apps.map(async (app: any) => {
          const detailRes = await fetch(`/api/admin/applications/${app.id}`);
          if (detailRes.ok) {
            const data = await detailRes.json();
            return (data.documents || []).map((doc: any) => ({
              ...doc,
              companyName: app.companyName,
              userEmail: app.userEmail,
            }));
          }
          return [];
        });
        const docLists = await Promise.all(docPromises);
        setDocuments(docLists.flat());
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 relative z-10">
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Client Document Directory</h1>
        <p className="text-xs text-slate-500 mt-1">Review uploaded compliance passports, incorporation certs, tax declarations</p>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6">
          <h2 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-6">Compliance File Directory</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
            </div>
          ) : documents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[9px] font-black">
                    <th className="pb-3">Client Company</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Filename</th>
                    <th className="pb-3">Uploaded Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50">
                      <td className="py-4">
                        <span className="font-bold text-slate-900 block">{doc.companyName}</span>
                        <span className="text-[9px] text-slate-500 block mt-0.5">{doc.userEmail}</span>
                      </td>
                      <td className="py-4 text-slate-900 font-bold">{doc.category}</td>
                      <td className="py-4 text-slate-600 font-mono truncate max-w-[200px]" title={doc.fileName}>{doc.fileName}</td>
                      <td className="py-4 text-slate-500 flex items-center gap-1.5 mt-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                          doc.status === "APPROVED"
                            ? "text-emerald-700 border-emerald-200 bg-emerald-50"
                            : doc.status === "REPLACEMENT_REQUIRED"
                            ? "text-red-600 border-red-200 bg-red-50"
                            : "text-amber-600 border-amber-200 bg-amber-50"
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <a
                          href={`/api/documents/${doc.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-wider text-slate-700 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-10 text-slate-400 text-xs">No client compliance document files uploaded.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
