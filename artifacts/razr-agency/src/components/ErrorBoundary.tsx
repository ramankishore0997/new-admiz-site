import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#060608] text-white p-6">
          <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-cyan-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-cyan-400" />
            </div>

            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                Unable to Load View
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                An unexpected interface state occurred. Refreshing the dashboard or returning home will restore session view.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh App
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" /> Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
