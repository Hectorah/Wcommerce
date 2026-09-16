import React, { useState } from 'react';
import { SiteSettings } from '../../types';
import { inputClass, labelClass, sectionTitle, cardClass } from './panelStyles';
import { Phone, Plus, Trash2, Share2 } from 'lucide-react';

interface Props {
  draft: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

export function StoreContactPanel({ draft, onChange }: Props) {
  const [newWhatsappNumber, setNewWhatsappNumber] = useState('');

  const addWhatsAppNumber = () => {
    const clean = newWhatsappNumber.replace(/\D/g, '');
    if (!clean || clean.length < 8 || draft.whatsappNumbers.length >= 4) return;
    onChange({ whatsappNumbers: [...draft.whatsappNumbers, clean] });
    setNewWhatsappNumber('');
  };

  return (
    <div className={cardClass + ' space-y-8'}>
      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-brand-primary" /> Contacto & WhatsApp
      </h2>

      {/* Redes y canal */}
      <section>
        <h3 className={sectionTitle}>Redes Sociales & Canal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Enlace al canal de WhatsApp</label>
            <input value={draft.whatsappChannelUrl} onChange={e => onChange({ whatsappChannelUrl: e.target.value })} placeholder="https://whatsapp.com/channel/..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>
              <span className="inline-flex items-center gap-1"><Share2 className="w-3 h-3" /> Instagram</span>
            </label>
            <input value={draft.instagramUrl} onChange={e => onChange({ instagramUrl: e.target.value })} placeholder="https://instagram.com/..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>TikTok</label>
            <input value={draft.tiktokUrl} onChange={e => onChange({ tiktokUrl: e.target.value })} placeholder="https://tiktok.com/..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Facebook</label>
            <input value={draft.facebookUrl} onChange={e => onChange({ facebookUrl: e.target.value })} placeholder="https://facebook.com/..." className={inputClass} />
          </div>
        </div>
      </section>

      {/* Números de WhatsApp */}
      <section>
        <h3 className={sectionTitle}>Números de WhatsApp para Pedidos (máx. 4)</h3>
        <p className="text-xs text-slate-500 mb-3">
          Los pedidos se rotarán automáticamente entre estos números. Formato internacional sin símbolos (ej: <span className="font-mono">584141234567</span>).
        </p>
        <div className="space-y-2 mb-3">
          {draft.whatsappNumbers.map((num, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <Phone className="w-4 h-4 text-brand-success flex-shrink-0" />
              <span className="flex-1 font-mono text-sm text-slate-800">+{num}</span>
              <span className="text-[10px] font-bold bg-green-200 text-emerald-700 px-1.5 py-0.5 rounded">#{idx + 1}</span>
              <button
                onClick={() => onChange({ whatsappNumbers: draft.whatsappNumbers.filter((_, i) => i !== idx) })}
                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {draft.whatsappNumbers.length === 0 && (
            <p className="text-xs text-brand-primary bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
              ⚠️ No hay números configurados. Los pedidos no se podrán enviar.
            </p>
          )}
        </div>
        {draft.whatsappNumbers.length < 4 && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">+</span>
              <input
                type="tel"
                placeholder="584141234567"
                value={newWhatsappNumber}
                onChange={e => setNewWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                className={`${inputClass} pl-6 font-mono`}
              />
            </div>
            <button
              onClick={addWhatsAppNumber}
              className="px-4 py-2 bg-brand-success hover:bg-brand-success text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Agregar
            </button>
          </div>
        )}
      </section>
    </div>
  );
}