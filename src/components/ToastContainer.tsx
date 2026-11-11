import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border pointer-events-auto transition-all duration-300 text-sm font-medium ${
            toast.type === 'error'
              ? 'bg-[#2a1215]/95 text-red-200 border-red-500/40 shadow-red-500/20'
              : toast.type === 'info'
              ? 'bg-[#122030]/95 text-cyan-200 border-cyan-500/40 shadow-cyan-500/20'
              : 'bg-[#13221b]/95 text-emerald-200 border-emerald-500/40 shadow-emerald-500/20'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-cyan-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="flex-1 leading-relaxed">{toast.text}</span>
        </div>
      ))}
    </div>
  );
};
