import React from 'react';
import { SiteSettings } from '../../types';
import { inputClass, labelClass, sectionTitle, cardClass } from './panelStyles';
import { Store } from 'lucide-react';

interface Props {
  draft: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

export function StoreIdentityPanel({ draft, onChange }: Props) {
  return (
    <div className={cardClass + ' space-y-8'}>
      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <Store className="w-5 h-5 text-brand-primary" /> Identidad & Hero
      </h2>

      <section>
        <h3 className={sectionTitle}>Identidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre de la tienda</label>
            <input value={draft.storeName} onChange={e => onChange({ storeName: e.target.value })} placeholder="Flash Sport Shop" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Eslogan (tagline)</label>
            <input value={draft.storeTagline} onChange={e => onChange({ storeTagline: e.target.value })} placeholder="Camisetas de Fútbol" className={inputClass} />
          </div>
        </div>
      </section>

      <section>
        <h3 className={sectionTitle}>Hero (Portada)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Título Hero — Línea 1</label>
            <input value={draft.heroTitleLine1} onChange={e => onChange({ heroTitleLine1: e.target.value })} placeholder="Catálogo Oficial" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Título Hero — Línea 2 (destacada)</label>
            <input value={draft.heroTitleLine2} onChange={e => onChange({ heroTitleLine2: e.target.value })} placeholder="Portal de Compras" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Subtítulo del Hero</label>
            <textarea value={draft.heroSubtitle} onChange={e => onChange({ heroSubtitle: e.target.value })} rows={2} className={inputClass} />
          </div>
        </div>
      </section>

      <section>
        <h3 className={sectionTitle}>Barra de Anuncio (banner superior)</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.announcementEnabled}
              onChange={e => onChange({ announcementEnabled: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-brand-success focus:ring-brand-success"
            />
            Activar barra de anuncio en la parte superior
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Texto del anuncio</label>
              <input
                value={draft.announcementText}
                onChange={e => onChange({ announcementText: e.target.value })}
                placeholder="Descuento Mayorista: 3+ camisetas a $18 USD c/u"
                className={inputClass}
                disabled={!draft.announcementEnabled}
              />
            </div>
            <div>
              <label className={labelClass}>Enlace (opcional)</label>
              <input
                value={draft.announcementLink}
                onChange={e => onChange({ announcementLink: e.target.value })}
                placeholder="https://wa.me/... o página interna"
                className={inputClass}
                disabled={!draft.announcementEnabled}
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className={sectionTitle}>Video en Portada</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            placeholder="URL del video (ej: https://www.tiktok.com/...)"
            value={draft.heroVideoUrl}
            onChange={e => onChange({ heroVideoUrl: e.target.value })}
            className={inputClass}
          />
          {draft.heroVideoUrl && (
            <button
              onClick={() => onChange({ heroVideoUrl: '' })}
              className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Quitar URL
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          En Vercel solo puedes usar URLs públicas de videos. Ej: TikTok, YouTube, Vimeo.
        </p>
      </section>
    </div>
  );
}