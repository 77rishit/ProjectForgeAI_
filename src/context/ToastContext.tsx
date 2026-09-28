import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title?: string;
  duration?: number;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

export interface ToastContextType {
  toast: {
    success: (message: string, options?: ToastOptions) => void;
    error: (message: string, options?: ToastOptions) => void;
    warning: (message: string, options?: ToastOptions) => void;
    info: (message: string, options?: ToastOptions) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastType, message: string, options?: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title: options?.title }]);

    const duration = options?.duration || 4500;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toastMethods = {
    success: (msg: string, options?: ToastOptions) => addToast('success', msg, options),
    error: (msg: string, options?: ToastOptions) => addToast('error', msg, options),
    warning: (msg: string, options?: ToastOptions) => addToast('warning', msg, options),
    info: (msg: string, options?: ToastOptions) => addToast('info', msg, options)
  };

  const typeConfig = {
    success: {
      border: 'border-emerald-500/30',
      bg: 'bg-[#062419]/90',
      text: 'text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
    },
    error: {
      border: 'border-rose-500/30',
      bg: 'bg-[#2a0e14]/90',
      text: 'text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
    },
    warning: {
      border: 'border-amber-500/30',
      bg: 'bg-[#291a07]/90',
      text: 'text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
    },
    info: {
      border: 'border-indigo-500/30',
      bg: 'bg-[#10142e]/90',
      text: 'text-indigo-200',
      icon: <Info className="w-5 h-5 text-indigo-400 shrink-0" />
    }
  };

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => {
            const cfg = typeConfig[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl border ${cfg.border} ${cfg.bg} backdrop-blur-xl shadow-2xl text-xs sm:text-sm font-medium ${cfg.text}`}
              >
                <div className="flex items-start gap-3">
                  {cfg.icon}
                  <div className="space-y-0.5 pt-0.5">
                    {t.title && <div className="font-bold text-white tracking-tight">{t.title}</div>}
                    <div className="leading-snug">{t.message}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-white/40 hover:text-white transition-colors p-1 shrink-0 -mr-1 -mt-1 cursor-pointer"
                  aria-label="Dismiss toast"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}
