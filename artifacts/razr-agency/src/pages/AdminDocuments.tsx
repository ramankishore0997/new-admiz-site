import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { FileText, Loader2, Download, Calendar, ExternalLink, Sparkles } from "lucide-react";

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((res) => (res.ok ? res.json() : []))
      .then(async (apps) => {
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
      <div className="space-y-8 max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="pb-6 border-b border-zinc-800 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Compliance Vault
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            Client Document Directory
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Review uploaded compliance passports, incorporation certs, and tax declarations</p>
        </div>

        <div className="relative z-10">
          <div className="rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl shadow-2xl p-6 md:p-8">
            <h2 className="text-sm font-black uppercase tracking-tight text-white mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" /> Compliance File Directory
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              </div>
            ) : documents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-black text-zinc-400 uppercase tracking-wider text-[10px] font-black">
                      <th className="py-3 px-4">Client Company</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Filename</th>
                      <th className="py-3 px-4">Uploaded Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-bold text-white block">{doc.companyName}</span>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">{doc.userEmail}</span>
                        </td>
                        <td className="py-4 px-4 text-white font-bold">{doc.category}</td>
                        <td className="py-4 px-4 text-zinc-300 font-mono truncate max-w-[200px]" title={doc.fileName}>{doc.fileName}</td>
                        <td className="py-4 px-4 text-zinc-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                            doc.status === "APPROVED"
                              ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                              : doc.status === "REPLACEMENT_REQUIRED"
                              ? "text-red-400 border-red-500/20 bg-red-500/10"
                              : "text-amber-400 border-amber-500/20 bg-amber-500/10"
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <a
                            href={`/api/documents/${doc.id}/download`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-wider text-white transition-colors cursor-pointer hover:border-cyan-500/50"
                          >
                            <Download className="w-3.5 h-3.5 text-cyan-400" /> Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-10 text-zinc-500 text-xs font-bold uppercase tracking-wider">No client compliance document files uploaded.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
