import React from 'react';
import { Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

interface ProductThumbProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md';
}

export function ProductThumb({ src, alt, size = 'sm' }: ProductThumbProps) {
  const box = size === 'md' ? 'w-16 h-16' : 'w-12 h-12';
  const icon = size === 'md' ? 'w-8 h-8' : 'w-6 h-6';
  return (
    <div className={`${box} rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <ImageIcon className={`${icon} text-slate-400`} />
      )}
    </div>
  );
}

interface ProductActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductActionButtons({ onEdit, onDelete }: ProductActionButtonsProps) {
  return (
    <>
      <button
        onClick={onEdit}
        className="p-1.5 text-slate-500 hover:text-brand-success bg-slate-100 hover:bg-green-50 rounded transition-colors"
        title="Editar"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        className="p-1.5 text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded transition-colors"
        title="Eliminar"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );
}

interface ProductStockToggleProps {
  inStock: boolean;
  onToggle: () => void;
  layout?: 'row' | 'column';
}

export function ProductStockToggle({ inStock, onToggle, layout = 'row' }: ProductStockToggleProps) {
  const available = inStock;
  return (
    <div className={layout === 'column' ? 'inline-flex flex-col items-center gap-1' : 'flex items-center gap-2'}>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-success focus:ring-offset-2 ${
          available ? 'bg-brand-success' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            available ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={layout === 'column' ? 'text-[10px] text-slate-500' : 'text-xs text-slate-500'}>
        {available ? 'Disponible' : 'Agotado'}
      </span>
    </div>
  );
}