import React from 'react';
import { SiteSettings } from '../../types';
import { cardClass } from './panelStyles';
import { Image as ImageIcon } from 'lucide-react';
import { BannersManager } from './BannersManager';

interface Props {
  draft: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

export function BannersPanel({ draft, onChange }: Props) {
  return (
    <div className={cardClass + ' space-y-8'}>
      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-brand-primary" /> Banners de Portada
      </h2>

      <p className="text-xs text-slate-500 -mt-4">
        Carrusel que se muestra entre el Hero y los filtros. Solo los banners activos con imagen se muestran.
      </p>

      <section>
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Carrusel del Home</h3>
        <BannersManager banners={draft.banners} onChange={banners => onChange({ banners })} />
      </section>
    </div>
  );
}