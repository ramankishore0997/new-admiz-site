import { useState, useEffect } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  UploadCloud,
  FileCheck,
  Download,
  AlertCircle,
  Loader2,
  Lock,
  Calendar,
  ExternalLink
} from "lucide-react";

export default function ClientDocuments() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadCategory, setUploadCategory] = useState("Business Registration");
  const [isUploading, setIsUploading] = useState(false);

  const loadDocs = async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Maximum allowed file size is 10MB.",
      });
      return;
    }

    // Verify if they have an application first to link to
    setIsUploading(true);
    try {
      const appRes = await fetch("/api/applications");
      const appList = await appRes.json();
      if (appList.length === 0) {
        toast({
          variant: "destructive",
          title: "Application Required",
          description: "Please initialize your agency onboarding application before uploading files.",
        });
        setIsUploading(false);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch("/api/documents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              applicationId: appList[0].id,
              category: uploadCategory,
              fileName: file.name,
              mimeType: file.type,
              base64Data,
            }),
          });

          if (res.ok) {
            toast({
              title: "Upload Success",
              description: "Document file added to security vault.",
            });
            await loadDocs();
          } else {
            const err = await res.json();
            toast({ variant: "destructive", title: "Upload Failed", description: err.error });
          }
        } catch {
          toast({ variant: "destructive", title: "Upload Error" });
        } finally {
          setIsUploading(false);
        }
      };
    } catch {
      setIsUploading(false);
    }
  };

  return (
    <ClientLayout>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 relative z-10">
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Document Vault</h1>
        <p className="text-xs text-slate-500 mt-1">Manage compliance documents and verification certificates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Upload panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6">
            <h2 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-4">Secure Upload</h2>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Document Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                >
                  <option>Business Registration</option>
                  <option>Tax ID Document</option>
                  <option>Photo ID / Passport</option>
                  <option>Proof of Address</option>
                  <option>Ledger Deposit Tx Verification</option>
                </select>
              </div>

              <div>
                <label className="w-full h-40 border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Select file to upload</span>
                      <span className="text-[9px] text-slate-400">Max 10MB (PDF, PNG, JPG)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-500 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>
              Documents are stored out of public web roots, protected by strict backend authentication credentials. They are decrypted only on verified compliance reviewer view requests.
            </p>
          </div>
        </div>

        {/* Documents list */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6">
            <h2 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-6">Uploaded Files Vault</h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-primary">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">{doc.category}</h4>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                          {doc.fileName}
                        </div>
                        <div className="text-[8px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(doc.createdAt).toLocaleDateString()}
                          <span>·</span>
                          <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        doc.status === "APPROVED"
                          ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                          : doc.status === "REPLACEMENT_REQUIRED"
                          ? "text-red-600 bg-red-50 border-red-200"
                          : "text-amber-600 bg-amber-50 border-amber-200"
                      }`}>
                        {doc.status}
                      </span>

                      <a
                        href={`/api/documents/${doc.id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 border border-slate-200 hover:border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs text-slate-500">No document files uploaded in your vault.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
