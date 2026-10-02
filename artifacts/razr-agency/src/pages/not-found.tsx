import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl p-8 shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            404 — Page Not Found
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The requested destination or account route does not exist or has been relocated within the operations network.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <a className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Return to Homepage
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
