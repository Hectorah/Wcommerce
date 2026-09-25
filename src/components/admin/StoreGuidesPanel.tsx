import React from 'react';
import { SiteSettings, InfoGuideItem } from '../../types';
import { inputClass, labelClass, sectionTitle, cardClass } from './panelStyles';
import { Plus, Trash2, BookOpen, MoveDown } from 'lucide-react';

interface Props {
  draft: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

export function StoreGuidesPanel({ draft, onChange }: Props) {
  const updateItem = (id: string, partial: Partial<InfoGuideItem>) => {
    onChange({ infoGuideItems: draft.infoGuideItems.map(item => (item.id === id ? { ...item, ...partial } : item)) });
  };

  const addItem = () => {
    onChange({
      infoGuideItems: [...draft.infoGuideItems, { id: `item-${Date.now()}`, title: '', body: '' }],
    });
  };

  const removeItem = (id: string) => {
    onChange({ infoGuideItems: draft.infoGuideItems.filter(item => item.id !== id) });
  };

  return (
    <div className={cardClass + ' space-y-8'}>
      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-brand-primary" /> Guías & Ayuda
      </h2>

      <p className="text-xs text-slate-500 -mt-4">
        Guía de información que se muestra al cliente (puede ser de tallas, cómo comprar, políticas de envío, etc.).
        El enlace aparece en el menú superior, en el detalle de producto y en el footer.
      </p>

      <section>
        <h3 className={sectionTitle}>Visibilidad</h3>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={draft.infoGuideEnabled}
            onChange={e => onChange({ infoGuideEnabled: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-brand-success focus:ring-brand-success"
          />
          Mostrar la guía en la tienda (menú, detalle de producto y footer)
        </label>
      </section>

      <section>
        <h3 className={sectionTitle}>Contenido de la guía</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Título</label>
            <input
              value={draft.infoGuideTitle}
              onChange={e => onChange({ infoGuideTitle: e.target.value })}
              placeholder="Guía Oficial de Tallas"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Subtítulo</label>
            <input
              value={draft.infoGuideSubtitle}
              onChange={e => onChange({ infoGuideSubtitle: e.target.value })}
              placeholder="Medidas en centímetros (Aproximadas estándar)"
              className={inputClass}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer mt-4">
          <input
            type="checkbox"
            checked={draft.infoGuideShowSizes}
            onChange={e => onChange({ infoGuideShowSizes: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-brand-success focus:ring-brand-success"
          />
          Incluir la tabla de tallas (Pecho, Largo, Estatura, Peso)
        </label>
      </section>

      <section>
        <h3 className={sectionTitle}>Secciones de contenido (configurables)</h3>
        {draft.infoGuideItems.length === 0 && (
          <p className="text-xs text-slate-400 mb-3">Aún no hay secciones. Agrega una para mostrarla en la guía.</p>
        )}
        {draft.infoGuideItems.map(item => (
          <div key={item.id} className="mb-3 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2">
              <MoveDown className="w-4 h-4 text-brand-primary flex-shrink-0" />
              <span className="text-sm font-bold text-slate-800 flex-1 truncate">{item.title || 'Sección sin título'}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                title="Eliminar sección"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input
              value={item.title}
              onChange={e => updateItem(item.id, { title: e.target.value })}
              placeholder="Título (ej: Versión Jugador Pro)"
              className={inputClass}
            />
            <textarea
              value={item.body}
              onChange={e => updateItem(item.id, { body: e.target.value })}
              placeholder="Texto o descripción (ej: Corte atlético ceñido...)"
              rows={2}
              className={inputClass}
            />
          </div>
        ))}
        <button
          onClick={addItem}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Agregar Sección
        </button>
      </section>
    </div>
  );
}