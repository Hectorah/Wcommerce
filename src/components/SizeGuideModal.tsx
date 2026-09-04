import React from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/70 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl z-10 text-slate-900 dark:text-slate-100 animate-scale-up space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-primary/20 text-brand-primary border border-brand-primary/20">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Guía Oficial de Tallas</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Medidas en centímetros (Aproximadas estándar)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-brand-primary dark:text-brand-primary font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-2.5">Talla</th>
                <th className="p-2.5">Pecho</th>
                <th className="p-2.5">Largo</th>
                <th className="p-2.5">Estatura</th>
                <th className="p-2.5">Peso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              <tr className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40">
                <td className="p-2.5 font-bold text-slate-900 dark:text-white">S</td>
                <td className="p-2.5">50 - 52 cm</td>
                <td className="p-2.5">69 - 71 cm</td>
                <td className="p-2.5 text-slate-500">165 - 170 cm</td>
                <td className="p-2.5 text-slate-500">55 - 65 kg</td>
              </tr>
              <tr className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40">
                <td className="p-2.5 font-bold text-slate-900 dark:text-white">M</td>
                <td className="p-2.5">52 - 54 cm</td>
                <td className="p-2.5">71 - 73 cm</td>
                <td className="p-2.5 text-slate-500">170 - 175 cm</td>
                <td className="p-2.5 text-slate-500">65 - 75 kg</td>
              </tr>
              <tr className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40">
                <td className="p-2.5 font-bold text-slate-900 dark:text-white">L</td>
                <td className="p-2.5">54 - 56 cm</td>
                <td className="p-2.5">73 - 75 cm</td>
                <td className="p-2.5 text-slate-500">175 - 180 cm</td>
                <td className="p-2.5 text-slate-500">75 - 85 kg</td>
              </tr>
              <tr className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40">
                <td className="p-2.5 font-bold text-slate-900 dark:text-white">XL</td>
                <td className="p-2.5">56 - 58 cm</td>
                <td className="p-2.5">75 - 77 cm</td>
                <td className="p-2.5 text-slate-500">180 - 188 cm</td>
                <td className="p-2.5 text-slate-500">85 - 95 kg</td>
              </tr>
              <tr className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40">
                <td className="p-2.5 font-bold text-slate-900 dark:text-white">XXL</td>
                <td className="p-2.5">58 - 61 cm</td>
                <td className="p-2.5">77 - 80 cm</td>
                <td className="p-2.5 text-slate-500">185 - 195 cm</td>
                <td className="p-2.5 text-slate-500">95 - 110 kg</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pro Tips */}
        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900 dark:text-white">Versión Fan:</strong> Corte clásico regular, tela cómoda para uso diario. Pide tu talla regular.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900 dark:text-white">Versión Jugador Pro:</strong> Corte atlético ceñido (Slim Fit). Si prefieres ajuste holgado, elige una talla superior.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs cursor-pointer transition-colors"
        >
          Cerrar Guía
        </button>

      </div>
    </div>
  );
};
