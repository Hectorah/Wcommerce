import React from 'react';
import { AlertTriangle, X, Info } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  type: 'confirm' | 'error' | 'info';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-up">
        
        <div className="p-6 text-center">
          <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 ${
            type === 'error' ? 'bg-red-100 text-red-600' : 
            type === 'confirm' ? 'bg-blue-200 text-brand-primary' : 'bg-blue-100 text-blue-600'
          }`}>
            {type === 'error' ? <X className="w-6 h-6" /> : 
             type === 'confirm' ? <AlertTriangle className="w-6 h-6" /> : 
             <Info className="w-6 h-6" />}
          </div>
          
          <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-600 mb-6">{message}</p>
          
          <div className="flex gap-3 justify-center">
            {type === 'confirm' && (
              <button
                onClick={onCancel}
                className="flex-1 py-2 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                else onCancel();
              }}
              className={`flex-1 py-2 px-4 rounded-xl font-semibold text-white transition-colors ${
                type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                type === 'confirm' ? 'bg-brand-primary hover:bg-brand-primary' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {type === 'confirm' ? confirmText : 'Entendido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
