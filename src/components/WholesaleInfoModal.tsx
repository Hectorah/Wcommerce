import React from 'react';
import { X, Zap, Tag, Package, Shield, MessageCircle, Sparkles, CheckCircle2, CreditCard, Truck } from 'lucide-react';
import { DEFAULT_WHATSAPP_PHONE } from '../data/mockProducts';
import { WhatsAppIcon } from './Icons';

interface WholesaleInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WholesaleInfoModal: React.FC<WholesaleInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/70 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl z-10 text-slate-900 dark:text-slate-100 animate-scale-up space-y-4 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-primary/20 text-brand-primary border border-brand-primary/20">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Tarifas & Beneficios Mayoristas</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Emprende y maximiza tu margen con Flash Sport Shop</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tier Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Venta Detal</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">1 a 5 prendas</span>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">$25 <span className="text-xs font-normal text-slate-500">USD c/u</span></div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Para fanáticos, regalos y colecciones personales.</p>
          </div>

          <div className="bg-brand-primary/20 border border-brand-primary/20 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-primary dark:text-brand-primary flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Mayorista Flash
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-primary text-slate-950">3+ prendas</span>
            </div>
            <div className="text-xl font-black text-brand-primary dark:text-brand-primary font-mono">$18 <span className="text-xs font-normal text-brand-primary/80 dark:text-brand-primary/20">USD c/u</span></div>
            <p className="text-[10px] text-amber-700 dark:text-blue-200">Ahorras $7 USD por camiseta (28% OFF). Puedes combinar modelos y tallas.</p>
          </div>
        </div>

        {/* Wholesale Rules & Perks */}
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">Variedad Total:</strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">No requieres llevar el mismo club; puedes mezclar 3 camisetas diferentes.</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CreditCard className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">Métodos de Pago:</strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Pago Móvil, Zelle, Binance USDT, Transferencias bancarias y Efectivo.</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Truck className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">Envíos Rápidos:</strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Despachos asegurados a nivel nacional.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs cursor-pointer transition-colors"
          >
            Cerrar
          </button>
          
          <a
            href={`https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encodeURIComponent('¡Hola Flash Sport Shop! Me gustaría información para compras al mayor.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl bg-brand-success hover:bg-brand-success text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Hablar por WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
