import React from 'react';
import { SiteSettings, StoreLocation } from '../../types';
import { inputClass, labelClass, sectionTitle, cardClass } from './panelStyles';
import { Plus, Trash2, MapPin, Link2 } from 'lucide-react';

interface Props {
  draft: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

export function StoreLocationsPanel({ draft, onChange }: Props) {
  const updateStore = (id: string, partial: Partial<StoreLocation>) => {
    onChange({ stores: draft.stores.map(s => (s.id === id ? { ...s, ...partial } : s)) });
  };

  const addStore = () => {
    onChange({
      stores: [
        ...draft.stores,
        { id: `store-${Date.now()}`, name: '', address: '', mapsUrl: '', hours: '' },
      ],
    });
  };

  const removeStore = (id: string) => {
    onChange({ stores: draft.stores.filter(s => s.id !== id) });
  };

  return (
    <div className={cardClass + ' space-y-8'}>
      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-brand-primary" /> Sedes Físicas
      </h2>

      <p className="text-xs text-slate-500 -mt-4">
        Ubicaciones que aparecen en el footer del sitio.
      </p>

      <section>
        {draft.stores.map((store) => (
          <div key={store.id} className="mb-3 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0" />
              <span className="text-sm font-bold text-slate-800 flex-1 truncate">{store.name || 'Sede sin nombre'}</span>
              <button
                onClick={() => removeStore(store.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                title="Eliminar sede"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={store.name}
                onChange={e => updateStore(store.id, { name: e.target.value })}
                placeholder="Nombre (ej: CC Cristal — Naguanagua)"
                className={inputClass}
              />
              <input
                value={store.hours}
                onChange={e => updateStore(store.id, { hours: e.target.value })}
                placeholder="Horario (ej: Lun–Sáb: 9am – 7pm)"
                className={inputClass}
              />
              <input
                value={store.address}
                onChange={e => updateStore(store.id, { address: e.target.value })}
                placeholder="Dirección"
                className={`${inputClass} md:col-span-2`}
              />
            </div>
            <div className="flex gap-2 items-center">
              <Link2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                value={store.mapsUrl}
                onChange={e => updateStore(store.id, { mapsUrl: e.target.value })}
                placeholder="https://www.google.com/maps/..."
                className={inputClass}
              />
            </div>
          </div>
        ))}
        <button
          onClick={addStore}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Agregar Sede
        </button>
      </section>
    </div>
  );
}