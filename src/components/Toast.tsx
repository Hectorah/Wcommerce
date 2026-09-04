import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onOpenCart: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onOpenCart }) => {
  if (!message) return null;

  return (
    <aside aria-label="Notificaciones" className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] sm:w-auto">
      <div className="bg-slate-950/95 dark:bg-slate-900/95 border border-brand-primary/20 shadow-xl backdrop-blur-md text-white rounded-2xl p-3 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 animate-fade-in">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-brand-primary text-slate-950 flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-xs font-semibold text-slate-100 truncate">
            {message}
          </span>
        </div>

        <button
          onClick={onOpenCart}
          className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-blue-200 whitespace-nowrap pl-2 border-l border-slate-800 cursor-pointer"
        >
          <span>Ver Pedido</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
