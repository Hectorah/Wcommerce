import React, { useState, useEffect, useRef } from 'react';
import { JerseyProduct, JerseySize, JerseyVersion } from '../../types';
import { X, Upload, Plus, Trash2, Video, Play } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: JerseyProduct) => void;
  initialData?: JerseyProduct | null;
}

const AVAILABLE_SIZES: JerseySize[] = ['S', 'M', 'L', 'XL', 'XXL'];

export function ProductFormModal({ isOpen, onClose, onSave, initialData }: ProductFormModalProps) {
  const [formData, setFormData] = useState<Partial<JerseyProduct>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: 'error' | 'info';
    title: string;
    message: string;
  }>({ isOpen: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: `prod-${Date.now()}`,
        name: '',
        team: '',
        league: '',
        season: '2024/2025',
        category: 'clubes-europa',
        version: 'Versión Fan',
        retailPrice: 25,
        wholesalePrice: 18,
        image: '',
        images: [],
        badges: [],
        description: '',
        sizes: ['S', 'M', 'L', 'XL'],
        inStock: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSizeToggle = (size: JerseySize) => {
    setFormData((prev) => {
      const currentSizes = prev.sizes || [];
      if (currentSizes.includes(size)) {
        return { ...prev, sizes: currentSizes.filter((s) => s !== size) };
      } else {
        return { ...prev, sizes: [...currentSizes, size] };
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, data: base64data }),
        });
        
        if (!response.ok) throw new Error('Upload failed');
        
        const { url } = await response.json();
        
        // If main image is empty, set it there, else add to images array
        if (!formData.image) {
          setFormData(prev => ({ ...prev, image: url }));
        } else {
          setFormData(prev => ({ ...prev, images: [...(prev.images || []), url] }));
        }
      };
    } catch (err) {
      console.error(err);
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Error de Subida',
        message: 'Ocurrió un problema al subir la imagen.'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Video upload handler (máx 15 segundos)
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar duración antes de subir
    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';
    videoEl.src = URL.createObjectURL(file);
    await new Promise<void>(resolve => {
      videoEl.onloadedmetadata = () => resolve();
    });

    if (videoEl.duration > 15) {
      URL.revokeObjectURL(videoEl.src);
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Video muy largo',
        message: `El video tiene ${Math.round(videoEl.duration)}s. El máximo permitido es 15 segundos.`
      });
      if (videoInputRef.current) videoInputRef.current.value = '';
      return;
    }
    URL.revokeObjectURL(videoEl.src);

    setUploadingVideo(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, data: reader.result }),
        });
        if (!response.ok) throw new Error('Upload failed');
        const { url } = await response.json();

        // Eliminar video anterior si existe
        if (formData.video?.startsWith('/uploads/')) {
          await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ url: formData.video }) });
        }
        setFormData(prev => ({ ...prev, video: url }));
      };
    } catch (err) {
      console.error(err);
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Error de Subida',
        message: 'Ocurrió un problema al subir el video.'
      });
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = async () => {
    if (formData.video?.startsWith('/uploads/')) {
      await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ url: formData.video }) });
    }
    setFormData(prev => ({ ...prev, video: undefined }));
  };

  const handleRemoveMainImage = async () => {
    if (formData.image?.startsWith('/uploads/')) {
      await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ url: formData.image }) });
    }
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl) return;
    if (!formData.image) {
      setFormData(prev => ({ ...prev, image: newImageUrl }));
    } else {
      setFormData(prev => ({ ...prev, images: [...(prev.images || []), newImageUrl] }));
    }
    setNewImageUrl('');
  };

  const handleRemoveImage = async (index: number) => {
    const imgToRemove = formData.images?.[index];
    if (imgToRemove && imgToRemove.startsWith('/uploads/')) {
      await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ url: imgToRemove }) });
    }
    setFormData(prev => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.retailPrice || !formData.image) return;
    onSave(formData as JerseyProduct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? 'Editar' : 'Agregar'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 text-slate-900">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Camiseta *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Equipo / Selección *</label>
                <input
                  type="text"
                  name="team"
                  value={formData.team || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Liga / Torneo</label>
                <input
                  type="text"
                  name="league"
                  value={formData.league || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                <select
                  name="category"
                  value={formData.category || 'clubes-europa'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success"
                >
                  <option value="clubes-europa">Clubes Europa</option>
                  <option value="selecciones">Selecciones</option>
                  <option value="retro">Retro / Clásicas</option>
                  <option value="version-jugador">Versión Jugador (Especial)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Versión</label>
                <select
                  name="version"
                  value={formData.version || 'Versión Fan'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success"
                >
                  <option value="Versión Fan">Versión Fan</option>
                  <option value="Versión Jugador">Versión Jugador</option>
                  <option value="Edición Especial Retro">Edición Especial Retro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio Detal ($) *</label>
                <input
                  type="number"
                  name="retailPrice"
                  value={formData.retailPrice || 0}
                  onChange={handleChange}
                  required
                  min={0}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio Mayorista ($) *</label>
                <input
                  type="number"
                  name="wholesalePrice"
                  value={formData.wholesalePrice || 0}
                  onChange={handleChange}
                  required
                  min={0}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success"
                />
              </div>

              {/* IMÁGENES */}
              <div className="col-span-1 md:col-span-2 border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  Imágenes del Artículo
                </h3>
                
                {/* Upload or Add URL */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      placeholder="URL de imagen (ej: https://...)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Agregar
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>o</span>
                    <label className="cursor-pointer px-4 py-2 bg-green-200 text-emerald-700 hover:bg-green-200 rounded-lg font-medium flex items-center gap-2 transition-colors">
                      <Upload className="w-4 h-4" />
                      {uploading ? 'Subiendo...' : 'Subir Archivo'}
                      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>

                {/* Previews */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                  {/* Main Image */}
                  {formData.image && (
                    <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm aspect-square">
                      <img src={formData.image} alt="Main" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                        <span className="text-white text-[10px] font-bold bg-brand-success px-2 py-1 rounded">PRINCIPAL</span>
                        <button type="button" onClick={handleRemoveMainImage} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Extra Images */}
                  {formData.images?.map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm aspect-square">
                      <img src={imgUrl} alt={`Extra ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                        <button type="button" onClick={() => handleRemoveImage(idx)} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {(!formData.image && (!formData.images || formData.images.length === 0)) && (
                  <p className="text-xs text-red-500 font-medium">Debe agregar al menos una imagen (la primera será la principal).</p>
                )}
              </div>

              {/* VIDEO DEL ARTÍCULO */}
              <div className="col-span-1 md:col-span-2 border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Video className="w-4 h-4 text-brand-primary" />
                  Video del Artículo (máx. 15 segundos)
                </h3>

                {formData.video ? (
                  <div className="flex items-start gap-3">
                    <video
                      src={formData.video}
                      className="w-28 h-28 rounded-lg object-cover border border-slate-200 bg-black"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                    <div className="flex flex-col gap-2 justify-center">
                      <span className="text-xs font-medium text-brand-success flex items-center gap-1">
                        <Play className="w-3.5 h-3.5" /> Video cargado
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Quitar video
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-4 py-2.5 bg-blue-200 text-amber-800 hover:bg-blue-200 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
                      <Upload className="w-4 h-4" />
                      {uploadingVideo ? 'Subiendo...' : 'Subir Video (MP4 ≤ 15s)'}
                      <input
                        type="file"
                        accept="video/mp4,video/*"
                        className="hidden"
                        ref={videoInputRef}
                        onChange={handleVideoUpload}
                        disabled={uploadingVideo}
                      />
                    </label>
                    <p className="text-xs text-slate-500">El video aparecerá en la galería del producto en la tienda.</p>
                  </div>
                )}
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Tallas Disponibles</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map((size) => {
                    const isSelected = formData.sizes?.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
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
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción corta</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success"
                />
              </div>

            </div>
          </form>
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 safe-area-bottom">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-4 py-3 text-base font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors touch-feedback"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="productForm"
            className="flex-1 sm:flex-none px-4 py-3 text-base font-medium text-white bg-brand-success rounded-lg hover:bg-emerald-700 transition-colors touch-feedback"
          >
            Guardar
          </button>
        </div>
      </div>

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
