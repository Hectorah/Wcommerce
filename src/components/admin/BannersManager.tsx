import React, { useRef, useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Link2, Upload } from 'lucide-react';
import { HomeBanner } from '../../types';
import { FeedbackModal } from './FeedbackModal';
import { uploadImage } from '../../utils/uploadImage';

interface BannersManagerProps {
  banners: HomeBanner[];
  onChange: (banners: HomeBanner[]) => void;
}

const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success text-sm';
const labelClass = 'block text-xs font-medium text-slate-500 mb-1';

const newBanner = (): HomeBanner => ({
  id: `banner-${Date.now()}`,
  title: '',
  subtitle: '',
  image: '',
  ctaText: 'Ver Oferta',
  link: '',
  active: true,
});

export function BannersManager({ banners, onChange }: BannersManagerProps) {
  const update = (id: string, partial: Partial<HomeBanner>) => {
    onChange(banners.map(b => (b.id === id ? { ...b, ...partial } : b)));
  };

  const remove = (id: string) => {
    onChange(banners.filter(b => b.id !== id));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= banners.length) return;
    const next = [...banners];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  // Subida de imagen (solo funciona en dev; en Vercel solo URLs públicas)
  const [uploadingBannerId, setUploadingBannerId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<string | null>(null);
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: 'error' | 'info';
    title: string;
    message: string;
  }>({ isOpen: false, type: 'info', title: '', message: '' });

  const handleUploadClick = (bannerId: string) => {
    uploadTargetRef.current = bannerId;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const bannerId = uploadTargetRef.current;
    if (!file || !bannerId) return;

    // El servidor de subida solo existe en desarrollo (Vercel no lo tiene)
    if (!import.meta.env.DEV) {
      setFeedback({
        isOpen: true,
        type: 'info',
        title: 'Solo URLs públicas',
        message: 'En Vercel no existe el servidor de subida. Publica la imagen en un hosting (ImgBB, Cloudinary...) y pega su URL.'
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadingBannerId(bannerId);
    try {
      const url = await uploadImage(file);
      update(bannerId, { image: url });
    } catch (err) {
      console.error(err);
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Error de Subida',
        message: 'Ocurrió un problema al subir la imagen.'
      });
    } finally {
      setUploadingBannerId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (bannerId: string, url: string) => {
    if (import.meta.env.DEV && url.startsWith('/uploads/')) {
      fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ url }) }).catch(() => {});
    }
    update(bannerId, { image: '' });
  };

  return (
    <div className="space-y-4">
      {banners.map((banner, idx) => (
        <div key={banner.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            {/* Preview */}
            <div className="w-32 h-20 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center flex-shrink-0">
              {banner.image ? (
                <img src={banner.image} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-slate-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{banner.title || `Banner ${idx + 1}`}</p>
              <p className="text-[10px] text-slate-400">Posición {idx + 1}</p>
            </div>

            {/* Orden y eliminar */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded transition-colors"
                title="Subir"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => move(idx, 1)}
                disabled={idx === banners.length - 1}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded transition-colors"
                title="Bajar"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => remove(banner.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors"
                title="Eliminar banner"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className={labelClass}>URL de la imagen (obligatoria)</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex flex-1 gap-2">
                  <input
                    value={banner.image}
                    onChange={e => update(banner.id, { image: e.target.value })}
                    placeholder="https://..."
                    className={inputClass}
                  />
                  {banner.image && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(banner.id, banner.image)}
                      className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-red-100 hover:text-red-600 transition-colors whitespace-nowrap"
                      title="Quitar imagen"
                    >
                      Quitar
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleUploadClick(banner.id)}
                  disabled={uploadingBannerId === banner.id}
                  className="px-4 py-2 bg-green-200 text-emerald-700 hover:bg-green-200 rounded-lg text-sm font-medium flex items-center gap-1.5 justify-center transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingBannerId === banner.id ? 'Subiendo...' : 'Subir Archivo'}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Título</label>
              <input value={banner.title} onChange={e => update(banner.id, { title: e.target.value })} placeholder="Ej: Nueva Colección 2026" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Subtítulo</label>
              <input value={banner.subtitle} onChange={e => update(banner.id, { subtitle: e.target.value })} placeholder="Ej: Camisetas oficiales a $18" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Texto del botón</label>
              <input value={banner.ctaText} onChange={e => update(banner.id, { ctaText: e.target.value })} placeholder="Ver Oferta" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>
                <span className="inline-flex items-center gap-1"><Link2 className="w-3 h-3" /> Enlace del botón</span>
              </label>
              <input value={banner.link} onChange={e => update(banner.id, { link: e.target.value })} placeholder="https://wa.me/..." className={inputClass} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={banner.active}
              onChange={e => update(banner.id, { active: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-brand-success focus:ring-brand-success"
            />
            Activo (visible en la portada)
          </label>
        </div>
      ))}

      {banners.length === 0 && (
        <p className="text-xs text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-xl px-4 py-6 text-center">
          No hay banners. Agrega el primero para mostrar un carrusel en la portada.
        </p>
      )}

      <button
        onClick={() => onChange([...banners, newBanner()])}
        className="px-4 py-2 bg-brand-success text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5"
      >
        <Plus className="w-4 h-4" /> Agregar Banner
      </button>

      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

      <FeedbackModal
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onCancel={() => setFeedback(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}