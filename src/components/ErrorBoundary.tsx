import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0E17] text-white flex flex-col items-center justify-center p-6 text-center" dir="rtl">
          <div className="max-w-md w-full bg-[#14192b] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-xl font-black text-white">
              خطایی در بارگذاری برنامه رخ داد
            </h1>

            <p className="text-xs text-slate-400 leading-relaxed">
              برای برطرف شدن مشکل، دکمه بازنشانی زیر را بزنید تا حافظه موقت پاک شده و صفحه با اطلاعات پیش‌فرض مجدداً بارگذاری شود.
            </p>

            {this.state.error && (
              <div className="w-full p-3 rounded-xl bg-[#090c14] border border-white/5 text-[11px] font-mono text-red-300 text-left overflow-x-auto" dir="ltr">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="mt-2 w-full py-3 px-4 rounded-xl bg-gradient-to-l from-[#6936d7] to-[#a078ff] text-white text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>بازنشانی و شروع مجدد فروشگاه</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
