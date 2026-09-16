import React from 'react';
import { SiteSettings } from '../../types';
import { inputClass, labelClass, sectionTitle, cardClass } from './panelStyles';
import { Palette } from 'lucide-react';

interface Props {
  draft: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

export function StoreAppearancePanel({ draft, onChange }: Props) {
  return (
    <div className={cardClass + ' space-y-8'}>
      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <Palette className="w-5 h-5 text-brand-primary" /> Apariencia & Colores
      </h2>

      <section>
        <h3 className={sectionTitle}>Colores de Marca (tema del sitio)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Color primario</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draft.brandPrimaryColor || '#2563EB'}
                onChange={e => onChange({ brandPrimaryColor: e.target.value })}
                className="w-12 h-10 rounded-lg border border-slate-300 cursor-pointer bg-white p-1"
              />
              <input
                type="text"
                value={draft.brandPrimaryColor}
                onChange={e => onChange({ brandPrimaryColor: e.target.value })}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Color de éxito / WhatsApp</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draft.brandSuccessColor || '#10B981'}
                onChange={e => onChange({ brandSuccessColor: e.target.value })}
                className="w-12 h-10 rounded-lg border border-slate-300 cursor-pointer bg-white p-1"
              />
              <input
                type="text"
                value={draft.brandSuccessColor}
                onChange={e => onChange({ brandSuccessColor: e.target.value })}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 sm:col-span-2">
            Los colores se aplican en vivo a toda la página (logo, botones, etiquetas) al guardar.
          </p>
        </div>
      </section>
    </div>
  );
}