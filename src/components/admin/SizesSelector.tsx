import React from 'react';
import { JerseySize } from '../../types';

const AVAILABLE_SIZES: JerseySize[] = ['S', 'M', 'L', 'XL', 'XXL'];

interface SizesSelectorProps {
  sizes: JerseySize[];
  onToggle: (size: JerseySize) => void;
  error?: string;
}

export function SizesSelector({ sizes, onToggle, error }: SizesSelectorProps) {
  return (
    <div className="col-span-1 md:col-span-2">
      <label className="block text-sm font-medium text-slate-700 mb-2">Tallas Disponibles</label>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_SIZES.map((size) => {
          const isSelected = sizes.includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => onToggle(size)}
              className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${
                isSelected
                  ? 'bg-brand-success text-white border-transparent'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-brand-success'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}