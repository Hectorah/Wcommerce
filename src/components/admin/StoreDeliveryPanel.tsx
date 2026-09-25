import React, { useState } from 'react';
import { GeoDeliveryZone } from '../../types';
import { inputClass, labelClass, sectionTitle, cardClass } from './panelStyles';
import { Plus, Trash2, Truck, MapPinned, CheckCircle2 } from 'lucide-react';
import { useDelivery } from '../../hooks/DeliveryContext';

export function StoreDeliveryPanel() {
  const { settings, save } = useDelivery();
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);

  const updateZone = (id: string, partial: Partial<GeoDeliveryZone>) => {
    setDraft(prev => ({ ...prev, zones: prev.zones.map(z => (z.id === id ? { ...z, ...partial } : z)) }));
  };

  const addZone = () => {
    setDraft(prev => ({
      ...prev,
      zones: [...prev.zones, { id: `zone-${Date.now()}`, name: '', city: '', cost: 1, center: { lat: 0, lng: 0 }, radiusKm: 10 }],
    }));
  };

  const removeZone = (id: string) => {
    setDraft(prev => ({ ...prev, zones: prev.zones.filter(z => z.id !== id) }));
  };

  const handleSave = () => {
    save(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const deliveryOn = draft.deliveryEnabled;

  return (
    <div className={cardClass + ' space-y-8'}>
      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <Truck className="w-5 h-5 text-brand-primary" /> Delivery & Pickup
      </h2>

      <p className="text-xs text-slate-500 -mt-4">
        Métodos de entrega que se muestran al cliente antes de confirmar el pedido por WhatsApp.
        El delivery suma el costo de la zona al total; el retiro en tienda usa las sedes configuradas.
      </p>

      <section>
        <h3 className={sectionTitle}>Opciones de entrega</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.deliveryEnabled}
              onChange={e => setDraft(prev => ({ ...prev, deliveryEnabled: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-brand-success focus:ring-brand-success"
            />
            Habilitar delivery a domicilio (con costo)
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.pickupEnabled}
              onChange={e => setDraft(prev => ({ ...prev, pickupEnabled: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-brand-success focus:ring-brand-success"
            />
            Habilitar retiro en tienda (pickup, gratis)
          </label>
          <div>
            <label className={labelClass}>Nota de retiro en tienda</label>
            <input
              value={draft.pickupNote}
              onChange={e => setDraft(prev => ({ ...prev, pickupNote: e.target.value }))}
              placeholder="Retiro gratis en tu tienda más cercana..."
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className={sectionTitle}>Zonas de delivery ({draft.zones.length})</h3>
        {!deliveryOn && (
          <p className="text-xs text-amber-600 mb-3">El delivery está desactivado, pero puedes dejar las zonas listas.</p>
        )}
        {draft.zones.length === 0 && (
          <p className="text-xs text-slate-400 mb-3">No hay zonas configuradas. Agrega al menos una para ofrecer delivery.</p>
        )}
        {draft.zones.map(zone => (
          <div key={zone.id} className="mb-3 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2">
              <MapPinned className="w-4 h-4 text-brand-primary flex-shrink-0" />
              <span className="text-sm font-bold text-slate-800 flex-1 truncate">{zone.name || 'Zona sin nombre'}</span>
              <span className="text-[11px] font-mono font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                ${zone.cost} USD
              </span>
              <button
                onClick={() => removeZone(zone.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                title="Eliminar zona"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={zone.name}
                onChange={e => updateZone(zone.id, { name: e.target.value })}
                placeholder="Nombre (ej: Valencia)"
                className={inputClass}
              />
              <input
                value={zone.city}
                onChange={e => updateZone(zone.id, { city: e.target.value })}
                placeholder="Ciudad (ej: Valencia, Carabobo)"
                className={inputClass}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 whitespace-nowrap">Costo USD:</span>
                <input
                  type="number"
                  min={0}
                  step="0.5"
                  value={zone.cost}
                  onChange={e => updateZone(zone.id, { cost: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 whitespace-nowrap">Radio km:</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={zone.radiusKm}
                  onChange={e => updateZone(zone.id, { radiusKm: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Latitud (centro)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={zone.center.lat}
                  onChange={e => updateZone(zone.id, { center: { ...zone.center, lat: Number(e.target.value) } })}
                  placeholder="10.1767"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Longitud (centro)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={zone.center.lng}
                  onChange={e => updateZone(zone.id, { center: { ...zone.center, lng: Number(e.target.value) } })}
                  placeholder="-67.9972"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button
            onClick={addZone}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Agregar Zona
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty}
            className="px-4 py-2 bg-brand-success hover:bg-brand-success text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> {saved ? '¡Guardado!' : 'Guardar Delivery'}
          </button>
        </div>
      </section>
    </div>
  );
}